// src/app/admin/users/actions.ts
'use server';

import { z } from 'zod';
import { adminFetch } from '@/lib/admin-api';
import { revalidatePath } from 'next/cache';

const schema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  role: z.enum(['ADMIN', 'SUPER_ADMIN']),
});

export async function registerAdminAction(prev: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role = formData.get('role') as string;

  const parsed = schema.safeParse({ email, password, role });
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  try {
    await adminFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(parsed.data),
    });
    revalidatePath('/admin/users');
    return { success: true, message: 'Usuario administrador creado correctamente.' };
  } catch (err: any) {
    if (err.status === 409) {
      return { error: 'El correo ya está registrado.' };
    }
    return { error: err.message || 'Error al crear el usuario.' };
  }
}
