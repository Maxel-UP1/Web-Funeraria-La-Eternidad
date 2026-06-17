// src/app/admin/branches/actions.ts
'use server';

import { createBranch, updateBranch, deleteBranch } from '@/lib/admin-api';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const branchSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  city: z.string().min(2, 'La ciudad debe tener al menos 2 caracteres'),
  department: z.string().min(2, 'El departamento debe tener al menos 2 caracteres'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  contactPhone: z.string().min(5, 'El teléfono debe tener al menos 5 dígitos'),
  contactEmail: z.string().email('Correo inválido').optional().nullable().or(z.literal('')),
  isActive: z.boolean().optional(),
});

export async function createBranchAction(data: any) {
  const cleanData = {
    ...data,
    latitude: Number(data.latitude),
    longitude: Number(data.longitude),
    contactEmail: data.contactEmail || null,
  };
  const validated = branchSchema.safeParse(cleanData);
  if (!validated.success) {
    throw new Error(validated.error.errors[0].message);
  }

  const res = await createBranch({
    ...validated.data,
    latitude: String(validated.data.latitude),
    longitude: String(validated.data.longitude),
  } as any);

  revalidatePath('/sedes');
  revalidatePath('/admin/branches');
  return res;
}

export async function updateBranchAction(id: string, data: any) {
  const cleanData = {
    ...data,
    latitude: data.latitude !== undefined ? Number(data.latitude) : undefined,
    longitude: data.longitude !== undefined ? Number(data.longitude) : undefined,
    contactEmail: data.contactEmail || null,
  };
  const res = await updateBranch(id, {
    ...cleanData,
    latitude: cleanData.latitude !== undefined ? String(cleanData.latitude) : undefined,
    longitude: cleanData.longitude !== undefined ? String(cleanData.longitude) : undefined,
  } as any);

  revalidatePath('/sedes');
  revalidatePath('/admin/branches');
  return res;
}

export async function deleteBranchAction(id: string) {
  const res = await deleteBranch(id);
  revalidatePath('/sedes');
  revalidatePath('/admin/branches');
  return res;
}
