// src/app/admin/pre-orders/page.tsx
import { getPreOrders } from '@/lib/admin-api';
import { PreOrdersTable } from './PreOrdersTable';
import type { PreOrderStatus } from '@/lib/types';

export const metadata = { title: 'Pre-órdenes | Panel admin', robots: { index: false, follow: false } };

export default async function AdminPreOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: PreOrderStatus; page?: string; limit?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  const limit = params.limit ? parseInt(params.limit) : 20;

  let preOrders: any[] = [];
  let meta = { total: 0, page: 1, limit: 20, totalPages: 1 };
  let errorMsg = '';

  try {
    const res = await getPreOrders({ status: params.status, page, limit });
    preOrders = res.data;
    meta = res.meta;
  } catch (err: any) {
    errorMsg = 'Error al obtener las pre-órdenes del servidor.';
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-tinta font-bold">Pre-órdenes</h1>
      {errorMsg ? (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 border border-red-200">
          {errorMsg}
        </div>
      ) : (
        <PreOrdersTable preOrders={preOrders} meta={meta} currentStatus={params.status} />
      )}
    </div>
  );
}
