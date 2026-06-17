// src/app/admin/pre-orders/actions.ts
'use server';

import { updatePreOrderStatus, deletePreOrder } from '@/lib/admin-api';
import { revalidatePath } from 'next/cache';
import type { PreOrder } from '@/lib/types';

export async function updatePreOrderStatusAction(id: string, status: PreOrder['status']) {
  const res = await updatePreOrderStatus(id, status);
  revalidatePath('/admin/pre-orders');
  return res;
}

export async function deletePreOrderAction(id: string) {
  const res = await deletePreOrder(id);
  revalidatePath('/admin/pre-orders');
  return res;
}
