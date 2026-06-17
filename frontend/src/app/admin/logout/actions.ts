// src/app/admin/logout/actions.ts
'use server';

import { clearTokens } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function logoutAction() {
  await clearTokens();
  redirect('/admin/login');
}
