// src/app/admin/products/ProductsTable.tsx
'use client';

import { useTransition, useState } from 'react';
import { createProductAction, updateProductAction, deleteProductAction } from './actions';
import { useRouter } from 'next/navigation';
import type { Product, Category, Paginated } from '@/lib/types';

export function ProductsTable({
  products,
  meta,
  categories,
  currentFilters,
}: {
  products: any[];
  meta: Paginated<Product>['meta'];
  categories: Category[];
  currentFilters: any;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [search, setSearch] = useState(currentFilters.search || '');
  const [categoryId, setCategoryId] = useState(currentFilters.categoryId || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qs = new URLSearchParams();
    qs.set('page', '1');
    if (search) qs.set('search', search);
    if (categoryId) qs.set('categoryId', categoryId);
    router.push(`?${qs.toString()}`);
  };

  const handleCategoryFilterChange = (catId: string) => {
    setCategoryId(catId);
    const qs = new URLSearchParams();
    qs.set('page', '1');
    if (search) qs.set('search', search);
    if (catId) qs.set('categoryId', catId);
    router.push(`?${qs.toString()}`);
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategoryId('');
    router.push('?page=1');
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar este producto?')) {
      startTransition(async () => {
        try {
          await deleteProductAction(id);
          router.refresh();
        } catch (err: any) {
          alert(err.message || 'Error al eliminar');
        }
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Controles de Filtros */}
      <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-4 items-end bg-crema/10 p-4 rounded-lg border border-gris-claro">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-tinta mb-1">Buscar por nombre o descripción</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Escribe para buscar..."
            className="w-full rounded border border-gris-claro bg-white px-3 py-1.5 text-sm focus:border-oro focus:outline-none"
          />
        </div>
        <div className="min-w-[180px]">
          <label className="block text-xs font-medium text-tinta mb-1">Filtrar por Categoría</label>
          <select
            value={categoryId}
            onChange={(e) => handleCategoryFilterChange(e.target.value)}
            className="w-full rounded border border-gris-claro bg-white px-3 py-1.5 text-sm focus:border-oro focus:outline-none cursor-pointer"
          >
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.type === 'FLOWER' ? 'Flores' : 'Servicios'})
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-md bg-oro px-4 py-1.5 text-sm font-semibold text-tinta hover:bg-oro-fuerte transition-colors cursor-pointer"
          >
            Filtrar
          </button>
          <button
            type="button"
            onClick={handleClearFilters}
            className="rounded-md border border-gris-claro bg-white px-4 py-1.5 text-sm text-tinta hover:bg-crema/10 transition-colors cursor-pointer"
          >
            Limpiar
          </button>
        </div>
      </form>

      <div className="flex justify-between items-center">
        <button
          onClick={() => {
            setShowNewForm(true);
            setEditingId(null);
          }}
          className="rounded-md bg-oro px-4 py-2 text-sm font-semibold text-tinta hover:bg-oro-fuerte transition-colors cursor-pointer"
        >
          + Nuevo producto
        </button>
      </div>

      {showNewForm && (
        <div className="rounded-lg border border-gris-claro bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-tinta mb-4">Nuevo Producto</h3>
          <ProductForm
            categories={categories}
            onSubmit={async (data: any) => {
              await createProductAction(data);
              setShowNewForm(false);
              router.refresh();
            }}
            onCancel={() => setShowNewForm(false)}
            isPending={isPending}
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gris-claro bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gris-claro">
          <thead className="bg-crema/20">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-tinta">Nombre</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-tinta">Categoría</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-tinta">Precio</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-tinta">Imagen</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-tinta">Orden</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-tinta">Estado</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-tinta">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gris-claro">
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-gris">
                  No hay productos registrados.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="hover:bg-crema/10 transition-colors">
                  {editingId === p.id ? (
                    <td colSpan={7} className="px-4 py-4">
                      <h4 className="text-sm font-semibold text-tinta mb-2">Editar Producto</h4>
                      <ProductForm
                        initialData={p}
                        categories={categories}
                        onSubmit={async (data: any) => {
                          await updateProductAction(p.id, data);
                          setEditingId(null);
                          router.refresh();
                        }}
                        onCancel={() => setEditingId(null)}
                        isPending={isPending}
                      />
                    </td>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-sm font-semibold text-tinta">{p.name}</td>
                      <td className="px-4 py-3 text-sm text-tinta">
                        {p.category?.name || <span className="text-xs text-gris">—</span>}
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-tinta">
                        {Number(p.price).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
                      </td>
                      <td className="px-4 py-3 text-sm text-gris max-w-xs truncate">
                        {p.imageBase64 ? (
                          <img src={p.imageBase64} alt="preview" className="h-10 w-10 object-cover rounded" />
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-tinta">{p.sortOrder}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${p.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {p.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm space-x-3">
                        <button
                          onClick={() => {
                            setEditingId(p.id);
                            setShowNewForm(false);
                          }}
                          disabled={isPending}
                          className="text-oro font-medium hover:text-oro-fuerte disabled:opacity-50 cursor-pointer"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={isPending}
                          className="text-red-700 font-medium hover:text-red-900 disabled:opacity-50 cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="flex justify-between items-center px-4 py-3 border-t border-gris-claro bg-crema/5">
          <div className="text-sm text-gris">
            Mostrando {products.length} de {meta.total} registros
          </div>
          <div className="flex gap-2">
            {meta.page > 1 && (
              <a href={`?page=${meta.page - 1}&categoryId=${currentFilters.categoryId || ''}&search=${currentFilters.search || ''}`} className="rounded border border-gris-claro bg-white px-3 py-1 text-sm hover:bg-crema transition-colors">Anterior</a>
            )}
            {meta.page < meta.totalPages && (
              <a href={`?page=${meta.page + 1}&categoryId=${currentFilters.categoryId || ''}&search=${currentFilters.search || ''}`} className="rounded border border-gris-claro bg-white px-3 py-1 text-sm hover:bg-crema transition-colors">Siguiente</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductForm({ initialData, categories, onSubmit, onCancel, isPending }: any) {
  const [data, setData] = useState({
    name: initialData?.name || '',
    categoryId: initialData?.categoryId || '',
    price: initialData ? Number(initialData.price) : 0,
    description: initialData?.description || '',
    imageBase64: initialData?.imageBase64 || '',
    isActive: initialData ? initialData.isActive : true,
    sortOrder: initialData ? initialData.sortOrder : 0,
  });
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await onSubmit(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al guardar los datos');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      {errorMsg && (
        <div className="text-xs text-red-700 bg-red-50 p-2 rounded border border-red-200">{errorMsg}</div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-tinta">Nombre</label>
          <input
            type="text"
            required
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            className="mt-1 w-full rounded border border-gris-claro bg-white px-3 py-1.5 text-sm focus:border-oro focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-tinta">Categoría</label>
          <select
            required
            value={data.categoryId}
            onChange={(e) => setData({ ...data, categoryId: e.target.value })}
            className="mt-1 w-full rounded border border-gris-claro bg-white px-3 py-1.5 text-sm focus:border-oro focus:outline-none cursor-pointer"
          >
            <option value="">Selecciona categoría</option>
            {categories.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.type === 'FLOWER' ? 'Flores' : 'Servicios'})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-tinta">Precio (COP)</label>
          <input
            type="number"
            required
            min={0}
            value={data.price}
            onChange={(e) => setData({ ...data, price: Number(e.target.value) })}
            className="mt-1 w-full rounded border border-gris-claro bg-white px-3 py-1.5 text-sm focus:border-oro focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-tinta">Orden de ordenación</label>
          <input
            type="number"
            required
            value={data.sortOrder}
            onChange={(e) => setData({ ...data, sortOrder: Number(e.target.value) })}
            className="mt-1 w-full rounded border border-gris-claro bg-white px-3 py-1.5 text-sm focus:border-oro focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-tinta">Imagen del Producto</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setData({ ...data, imageBase64: reader.result as string });
              };
              reader.readAsDataURL(file);
            }
          }}
          className="mt-1 w-full text-sm file:mr-4 file:rounded file:border-0 file:bg-crema file:px-4 file:py-2 file:text-sm file:font-semibold file:text-tinta hover:file:bg-crema/80"
        />
        {data.imageBase64 && (
          <img src={data.imageBase64} alt="Vista previa" className="mt-2 h-20 w-20 object-cover rounded border border-gris-claro" />
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-tinta">Descripción</label>
        <textarea
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          className="mt-1 w-full rounded border border-gris-claro bg-white px-3 py-1.5 text-sm focus:border-oro focus:outline-none h-20"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={`isActiveProduct-${initialData?.id || 'new'}`}
          checked={data.isActive}
          onChange={(e) => setData({ ...data, isActive: e.target.checked })}
          className="rounded border-gris-claro text-oro focus:ring-oro"
        />
        <label htmlFor={`isActiveProduct-${initialData?.id || 'new'}`} className="text-xs font-medium text-tinta">Activo</label>
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="rounded border border-gris-claro px-3 py-1.5 text-xs hover:bg-crema/10 transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-oro px-4 py-1.5 text-xs font-semibold text-tinta hover:bg-oro-fuerte transition-colors cursor-pointer disabled:opacity-50"
        >
          {isPending ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}
