// src/app/admin/categories/CategoriesTable.tsx
'use client';

import { useTransition, useState } from 'react';
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from './actions';
import type { Category } from '@/lib/types';
import { useRouter } from 'next/navigation';

export function CategoriesTable({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar esta categoría? Esto podría ocultar los productos asociados.')) {
      startTransition(async () => {
        try {
          await deleteCategoryAction(id);
          router.refresh();
        } catch (err: any) {
          alert(err.message || 'Error al eliminar');
        }
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button
          onClick={() => {
            setShowNewForm(true);
            setEditingId(null);
          }}
          className="rounded-md bg-oro px-4 py-2 text-sm font-semibold text-tinta hover:bg-oro-fuerte transition-colors cursor-pointer"
        >
          + Nueva categoría
        </button>
      </div>

      {showNewForm && (
        <div className="rounded-lg border border-gris-claro bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-tinta mb-4">Nueva Categoría</h3>
          <CategoryForm
            onSubmit={async (data: any) => {
              await createCategoryAction(data);
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
              <th className="px-4 py-3 text-left text-sm font-semibold text-tinta">Tipo</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-tinta">Descripción</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-tinta">Estado</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-tinta">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gris-claro">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-gris">
                  No hay categorías registradas.
                </td>
              </tr>
            ) : (
              categories.map((c) => (
                <tr key={c.id} className="hover:bg-crema/10 transition-colors">
                  {editingId === c.id ? (
                    <td colSpan={5} className="px-4 py-4">
                      <h4 className="text-sm font-semibold text-tinta mb-2">Editar Categoría</h4>
                      <CategoryForm
                        initialData={c}
                        onSubmit={async (data: any) => {
                          await updateCategoryAction(c.id, data);
                          setEditingId(null);
                          router.refresh();
                        }}
                        onCancel={() => setEditingId(null)}
                        isPending={isPending}
                      />
                    </td>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-sm font-semibold text-tinta">{c.name}</td>
                      <td className="px-4 py-3 text-sm text-tinta">
                        <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${c.type === 'PRODUCT' ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800'}`}>
                          {c.type === 'PRODUCT' ? 'Producto' : 'Servicio'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gris max-w-xs truncate">{c.description || '—'}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {c.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm space-x-3">
                        <button
                          onClick={() => {
                            setEditingId(c.id);
                            setShowNewForm(false);
                          }}
                          disabled={isPending}
                          className="text-oro font-medium hover:text-oro-fuerte disabled:opacity-50 cursor-pointer"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
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
      </div>
    </div>
  );
}

function CategoryForm({ initialData, onSubmit, onCancel, isPending }: any) {
  const [data, setData] = useState(
    initialData || { name: '', type: 'PRODUCT', description: '', isActive: true }
  );
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
          <label className="block text-xs font-medium text-tinta">Tipo</label>
          <select
            value={data.type}
            onChange={(e) => setData({ ...data, type: e.target.value })}
            className="mt-1 w-full rounded border border-gris-claro bg-white px-3 py-1.5 text-sm focus:border-oro focus:outline-none"
          >
            <option value="PRODUCT">Producto</option>
            <option value="SERVICE">Servicio</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-tinta">Descripción</label>
        <textarea
          value={data.description || ''}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          className="mt-1 w-full rounded border border-gris-claro bg-white px-3 py-1.5 text-sm focus:border-oro focus:outline-none h-20"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={`isActiveCategory-${initialData?.id || 'new'}`}
          checked={data.isActive}
          onChange={(e) => setData({ ...data, isActive: e.target.checked })}
          className="rounded border-gris-claro text-oro focus:ring-oro"
        />
        <label htmlFor={`isActiveCategory-${initialData?.id || 'new'}`} className="text-xs font-medium text-tinta">Activo</label>
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
