// src/app/admin/branches/page.tsx
import { getBranchesAdmin } from '@/lib/admin-api';
import { BranchesTable } from './BranchesTable';

export const metadata = { title: 'Sedes | Panel admin', robots: { index: false, follow: false } };

export default async function AdminBranchesPage() {
  let branches: any[] = [];
  let errorMsg = '';

  try {
    branches = await getBranchesAdmin();
  } catch (err: any) {
    errorMsg = 'Error al obtener las sedes del servidor.';
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-tinta font-bold">Sedes</h1>
      {errorMsg ? (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 border border-red-200">
          {errorMsg}
        </div>
      ) : (
        <BranchesTable branches={branches} />
      )}
    </div>
  );
}
