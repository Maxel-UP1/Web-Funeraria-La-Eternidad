// src/app/admin/login/actions.ts
'use server';

import { redirect } from 'next/navigation';
import { adminLogin } from '@/lib/admin-api';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const validated = loginSchema.safeParse({ email, password });
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  try {
    await adminLogin(email, password);
  } catch (err: any) {
    return { error: 'Credenciales incorrectas. Inténtalo de nuevo.' };
  }

  redirect('/admin');
}
