// src/app/admin/products/actions.ts
'use server';

import { createProduct, updateProduct, deleteProduct } from '@/lib/admin-api';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  categoryId: z.string().uuid('Categoría inválida'),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  description: z.string().optional().nullable(),
  imageBase64: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function createProductAction(data: any) {
  const validated = productSchema.safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.errors[0].message);
  }

  const res = await createProduct({
    ...validated.data,
    sortOrder: data.sortOrder || 0,
  } as any);

  revalidatePath('/servicios');
  revalidatePath('/productos');
  revalidatePath('/admin/products');
  return res;
}

export async function updateProductAction(id: string, data: any) {
  const res = await updateProduct(id, data);
  revalidatePath('/servicios');
  revalidatePath('/productos');
  revalidatePath(`/producto/${id}`);
  revalidatePath('/admin/products');
  return res;
}

export async function deleteProductAction(id: string) {
  const res = await deleteProduct(id);
  revalidatePath('/servicios');
  revalidatePath('/productos');
  revalidatePath(`/producto/${id}`);
  revalidatePath('/admin/products');
  return res;
}
