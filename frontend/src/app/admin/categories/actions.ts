// src/app/admin/categories/actions.ts
'use server';

import { createCategory, updateCategory, deleteCategory } from '@/lib/admin-api';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  type: z.enum(['FLOWER', 'SERVICE']),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function createCategoryAction(data: { name: string; type: 'FLOWER' | 'SERVICE'; description?: string }) {
  const validated = categorySchema.safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.errors[0].message);
  }
  
  const res = await createCategory(validated.data);
  revalidatePath('/servicios');
  revalidatePath('/productos');
  revalidatePath('/admin/categories');
  return res;
}

export async function updateCategoryAction(id: string, data: { name?: string; type?: 'FLOWER' | 'SERVICE'; description?: string | null; isActive?: boolean }) {
  const res = await updateCategory(id, data);
  revalidatePath('/servicios');
  revalidatePath('/productos');
  revalidatePath('/admin/categories');
  return res;
}

export async function deleteCategoryAction(id: string) {
  const res = await deleteCategory(id);
  revalidatePath('/servicios');
  revalidatePath('/productos');
  revalidatePath('/admin/categories');
  return res;
}
