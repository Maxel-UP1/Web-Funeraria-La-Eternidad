// src/app/admin/categories/page.tsx
import { getCategoriesAdmin } from '@/lib/admin-api';
import { CategoriesTable } from './CategoriesTable';

export const metadata = { title: 'Categorías | Panel admin', robots: { index: false, follow: false } };

export default async function AdminCategoriesPage() {
  let categories: any[] = [];
  let errorMsg = '';

  try {
    categories = await getCategoriesAdmin();
  } catch (err: any) {
    errorMsg = 'Error al obtener las categorías del servidor.';
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-tinta font-bold">Categorías</h1>
      {errorMsg ? (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 border border-red-200">
          {errorMsg}
        </div>
      ) : (
        <CategoriesTable categories={categories} />
      )}
    </div>
  );
}
