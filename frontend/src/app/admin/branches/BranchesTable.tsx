// src/app/admin/branches/BranchesTable.tsx
'use client';

import { useTransition, useState } from 'react';
import { createBranchAction, updateBranchAction, deleteBranchAction } from './actions';
import type { Branch } from '@/lib/types';
import { useRouter } from 'next/navigation';

export function BranchesTable({ branches }: { branches: Branch[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar esta sede?')) {
      startTransition(async () => {
        try {
          await deleteBranchAction(id);
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
          + Nueva sede
        </button>
      </div>

      {showNewForm && (
        <div className="rounded-lg border border-gris-claro bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-tinta mb-4">Nueva Sede</h3>
          <BranchForm
            onSubmit={async (data: any) => {
              await createBranchAction(data);
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
              <th className="px-4 py-3 text-left text-sm font-semibold text-tinta">Dirección / Ciudad</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-tinta">Contacto</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-tinta">Coordenadas</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-tinta">Estado</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-tinta">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gris-claro">
            {branches.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-gris">
                  No hay sedes registradas.
                </td>
              </tr>
            ) : (
              branches.map((b) => (
                <tr key={b.id} className="hover:bg-crema/10 transition-colors">
                  {editingId === b.id ? (
                    <td colSpan={6} className="px-4 py-4">
                      <h4 className="text-sm font-semibold text-tinta mb-2">Editar Sede</h4>
                      <BranchForm
                        initialData={b}
                        onSubmit={async (data: any) => {
                          await updateBranchAction(b.id, data);
                          setEditingId(null);
                          router.refresh();
                        }}
                        onCancel={() => setEditingId(null)}
                        isPending={isPending}
                      />
                    </td>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-sm font-semibold text-tinta">{b.name}</td>
                      <td className="px-4 py-3 text-sm text-tinta">
                        <div>{b.address}</div>
                        <div className="text-xs text-gris">{b.city}, {b.department}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-tinta">
                        <div>📞 {b.contactPhone}</div>
                        {b.contactEmail && <div className="text-xs text-gris">{b.contactEmail}</div>}
                      </td>
                      <td className="px-4 py-3 text-sm text-gris font-mono text-xs">
                        Lat: {Number(b.latitude).toFixed(6)}<br />
                        Lon: {Number(b.longitude).toFixed(6)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${b.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {b.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm space-x-3">
                        <button
                          onClick={() => {
                            setEditingId(b.id);
                            setShowNewForm(false);
                          }}
                          disabled={isPending}
                          className="text-oro font-medium hover:text-oro-fuerte disabled:opacity-50 cursor-pointer"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
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

function BranchForm({ initialData, onSubmit, onCancel, isPending }: any) {
  const [data, setData] = useState({
    name: initialData?.name || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    department: initialData?.department || '',
    latitude: initialData ? Number(initialData.latitude) : 0,
    longitude: initialData ? Number(initialData.longitude) : 0,
    contactPhone: initialData?.contactPhone || '',
    contactEmail: initialData?.contactEmail || '',
    isActive: initialData ? initialData.isActive : true,
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
          <label className="block text-xs font-medium text-tinta">Nombre de la Sede</label>
          <input
            type="text"
            required
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            className="mt-1 w-full rounded border border-gris-claro bg-white px-3 py-1.5 text-sm focus:border-oro focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-tinta">Dirección física</label>
          <input
            type="text"
            required
            value={data.address}
            onChange={(e) => setData({ ...data, address: e.target.value })}
            className="mt-1 w-full rounded border border-gris-claro bg-white px-3 py-1.5 text-sm focus:border-oro focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-tinta">Ciudad</label>
          <input
            type="text"
            required
            value={data.city}
            onChange={(e) => setData({ ...data, city: e.target.value })}
            className="mt-1 w-full rounded border border-gris-claro bg-white px-3 py-1.5 text-sm focus:border-oro focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-tinta">Departamento</label>
          <input
            type="text"
            required
            value={data.department}
            onChange={(e) => setData({ ...data, department: e.target.value })}
            className="mt-1 w-full rounded border border-gris-claro bg-white px-3 py-1.5 text-sm focus:border-oro focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-tinta">Latitud</label>
          <input
            type="number"
            step="any"
            required
            value={data.latitude}
            onChange={(e) => setData({ ...data, latitude: Number(e.target.value) })}
            className="mt-1 w-full rounded border border-gris-claro bg-white px-3 py-1.5 text-sm focus:border-oro focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-tinta">Longitud</label>
          <input
            type="number"
            step="any"
            required
            value={data.longitude}
            onChange={(e) => setData({ ...data, longitude: Number(e.target.value) })}
            className="mt-1 w-full rounded border border-gris-claro bg-white px-3 py-1.5 text-sm focus:border-oro focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-tinta">Teléfono de contacto</label>
          <input
            type="text"
            required
            value={data.contactPhone}
            onChange={(e) => setData({ ...data, contactPhone: e.target.value })}
            className="mt-1 w-full rounded border border-gris-claro bg-white px-3 py-1.5 text-sm focus:border-oro focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-tinta">Email de contacto (Opcional)</label>
          <input
            type="email"
            value={data.contactEmail}
            onChange={(e) => setData({ ...data, contactEmail: e.target.value })}
            className="mt-1 w-full rounded border border-gris-claro bg-white px-3 py-1.5 text-sm focus:border-oro focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={`isActiveBranch-${initialData?.id || 'new'}`}
          checked={data.isActive}
          onChange={(e) => setData({ ...data, isActive: e.target.checked })}
          className="rounded border-gris-claro text-oro focus:ring-oro"
        />
        <label htmlFor={`isActiveBranch-${initialData?.id || 'new'}`} className="text-xs font-medium text-tinta">Activo</label>
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
