// src/app/admin/leads/page.tsx
import { getLeads } from '@/lib/admin-api';
import { LeadsTable } from './LeadsTable';
import type { LeadStatus } from '@/lib/types';

export const metadata = { title: 'Leads | Panel admin', robots: { index: false, follow: false } };

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: LeadStatus; page?: string; limit?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  const limit = params.limit ? parseInt(params.limit) : 20;

  let leads: any[] = [];
  let meta = { total: 0, page: 1, limit: 20, totalPages: 1 };
  let errorMsg = '';

  try {
    const res = await getLeads({ status: params.status, page, limit });
    leads = res.data;
    meta = res.meta;
  } catch (err: any) {
    errorMsg = 'Error al obtener los registros del servidor.';
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-tinta font-bold">Leads / PQRS</h1>
      {errorMsg ? (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 border border-red-200">
          {errorMsg}
        </div>
      ) : (
        <LeadsTable leads={leads} meta={meta} currentStatus={params.status} />
      )}
    </div>
  );
}
