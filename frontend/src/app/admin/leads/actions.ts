// src/app/admin/leads/actions.ts
'use server';

import { updateLeadStatus, deleteLead } from '@/lib/admin-api';
import { revalidatePath } from 'next/cache';
import type { Lead } from '@/lib/types';

export async function updateLeadStatusAction(id: string, status: Lead['status']) {
  const res = await updateLeadStatus(id, status);
  revalidatePath('/admin/leads');
  return res;
}

export async function deleteLeadAction(id: string) {
  const res = await deleteLead(id);
  revalidatePath('/admin/leads');
  return res;
}
