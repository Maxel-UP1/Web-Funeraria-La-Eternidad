// src/app/admin/leads/LeadsTable.tsx
'use client';

import { useTransition } from 'react';
import { updateLeadStatusAction, deleteLeadAction } from './actions';
import type { Lead, Paginated } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export function LeadsTable({ leads, meta, currentStatus }: { leads: Lead[]; meta: Paginated<Lead>['meta']; currentStatus?: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleStatusChange = (id: string, newStatus: Lead['status']) => {
    startTransition(async () => {
      await updateLeadStatusAction(id, newStatus);
      router.refresh();
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar el lead de "${name}"? Esta acción no se puede deshacer.`)) return;
    startTransition(async () => {
      await deleteLeadAction(id);
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <a href="?page=1" className={`rounded border px-3 py-1.5 text-sm transition-colors ${!currentStatus ? 'bg-oro text-tinta font-semibold border-oro' : 'bg-white hover:bg-crema border-gris-claro'}`}>Todos</a>
        <a href="?page=1&status=NEW" className={`rounded border px-3 py-1.5 text-sm transition-colors ${currentStatus === 'NEW' ? 'bg-oro text-tinta font-semibold border-oro' : 'bg-white hover:bg-crema border-gris-claro'}`}>Nuevo</a>
        <a href="?page=1&status=CONTACTED" className={`rounded border px-3 py-1.5 text-sm transition-colors ${currentStatus === 'CONTACTED' ? 'bg-oro text-tinta font-semibold border-oro' : 'bg-white hover:bg-crema border-gris-claro'}`}>Contactado</a>
        <a href="?page=1&status=CLOSED" className={`rounded border px-3 py-1.5 text-sm transition-colors ${currentStatus === 'CLOSED' ? 'bg-oro text-tinta font-semibold border-oro' : 'bg-white hover:bg-crema border-gris-claro'}`}>Cerrado</a>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gris-claro bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gris-claro">
          <thead className="bg-crema/20">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-tinta">Nombre</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-tinta">Contacto</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-tinta">Mensaje</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-tinta">Origen</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-tinta">Estado</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-tinta">Fecha</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-tinta">Acciones</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-tinta">Eliminar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gris-claro">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-sm text-gris">
                  No se encontraron leads con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-crema/10 transition-colors">
                  <td className="px-4 py-3 text-sm font-semibold text-tinta">{lead.name}</td>
                  <td className="px-4 py-3 text-sm text-tinta">
                    {lead.phone && <div className="font-mono">📞 {lead.phone}</div>}
                    {lead.email && <div className="text-xs text-gris">{lead.email}</div>}
                  </td>
                  <td className="px-4 py-3 text-sm text-tinta max-w-xs truncate" title={lead.message}>{lead.message}</td>
                  <td className="px-4 py-3 text-sm text-gris">{lead.source || 'No especificado'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold
                      ${lead.status === 'NEW' ? 'bg-blue-100 text-blue-800' : ''}
                      ${lead.status === 'CONTACTED' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${lead.status === 'CLOSED' ? 'bg-green-100 text-green-800' : ''}
                    `}>
                      {lead.status === 'NEW' ? 'Nuevo' : lead.status === 'CONTACTED' ? 'Contactado' : 'Cerrado'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gris">
                    {new Date(lead.createdAt).toLocaleDateString('es-CO', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                      disabled={isPending}
                      className="rounded border border-gris-claro bg-white px-2 py-1 text-sm focus:border-oro focus:outline-none cursor-pointer disabled:opacity-60"
                    >
                      <option value="NEW">Nuevo</option>
                      <option value="CONTACTED">Contactado</option>
                      <option value="CLOSED">Cerrado</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(lead.id, lead.name)}
                      disabled={isPending}
                      className="inline-flex items-center justify-center rounded-md p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors disabled:opacity-40 cursor-pointer"
                      title="Eliminar lead"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {/* Paginación */}
        <div className="flex justify-between items-center px-4 py-3 border-t border-gris-claro bg-crema/5">
          <div className="text-sm text-gris">
            Mostrando {leads.length} de {meta.total} registros
          </div>
          <div className="flex gap-2">
            {meta.page > 1 && (
              <a href={`?page=${meta.page - 1}&status=${currentStatus || ''}`} className="rounded border border-gris-claro bg-white px-3 py-1 text-sm hover:bg-crema transition-colors">Anterior</a>
            )}
            {meta.page < meta.totalPages && (
              <a href={`?page=${meta.page + 1}&status=${currentStatus || ''}`} className="rounded border border-gris-claro bg-white px-3 py-1 text-sm hover:bg-crema transition-colors">Siguiente</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
