// src/app/admin/products/page.tsx
import { getProductsAdmin, getCategoriesAdmin } from '@/lib/admin-api';
import { ProductsTable } from './ProductsTable';

export const metadata = { title: 'Productos | Panel admin', robots: { index: false, follow: false } };

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string; categoryId?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 20;

  let products: any[] = [];
  let meta = { total: 0, page: 1, limit: 20, totalPages: 1 };
  let categories: any[] = [];
  let errorMsg = '';

  try {
    const [prodRes, catRes] = await Promise.all([
      getProductsAdmin({ page, limit, categoryId: params.categoryId, search: params.search }),
      getCategoriesAdmin(),
    ]);
    products = prodRes.data;
    meta = prodRes.meta;
    categories = catRes;
  } catch (err: any) {
    errorMsg = 'Error al obtener los datos del servidor.';
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-tinta font-bold">Productos</h1>
      {errorMsg ? (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 border border-red-200">
          {errorMsg}
        </div>
      ) : (
        <ProductsTable products={products} meta={meta} categories={categories} currentFilters={params} />
      )}
    </div>
  );
}
