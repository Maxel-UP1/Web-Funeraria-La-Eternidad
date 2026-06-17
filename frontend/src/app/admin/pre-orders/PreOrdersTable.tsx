// src/app/admin/pre-orders/PreOrdersTable.tsx
'use client';

import { useTransition } from 'react';
import { updatePreOrderStatusAction, deletePreOrderAction } from './actions';
import type { PreOrder, Paginated } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export function PreOrdersTable({ preOrders, meta, currentStatus }: { preOrders: any[]; meta: Paginated<PreOrder>['meta']; currentStatus?: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleStatusChange = (id: string, newStatus: PreOrder['status']) => {
    startTransition(async () => {
      await updatePreOrderStatusAction(id, newStatus);
      router.refresh();
    });
  };

  const handleDelete = (id: string, customerName: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar la pre-orden de "${customerName}"? Esta acción no se puede deshacer.`)) return;
    startTransition(async () => {
      await deletePreOrderAction(id);
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <a href="?page=1" className={`rounded border px-3 py-1.5 text-sm transition-colors ${!currentStatus ? 'bg-oro text-tinta font-semibold border-oro' : 'bg-white hover:bg-crema border-gris-claro'}`}>Todos</a>
        <a href="?page=1&status=CREATED" className={`rounded border px-3 py-1.5 text-sm transition-colors ${currentStatus === 'CREATED' ? 'bg-oro text-tinta font-semibold border-oro' : 'bg-white hover:bg-crema border-gris-claro'}`}>Creada</a>
        <a href="?page=1&status=REDIRECTED_TO_WA" className={`rounded border px-3 py-1.5 text-sm transition-colors ${currentStatus === 'REDIRECTED_TO_WA' ? 'bg-oro text-tinta font-semibold border-oro' : 'bg-white hover:bg-crema border-gris-claro'}`}>Redirigido WA</a>
        <a href="?page=1&status=COMPLETED" className={`rounded border px-3 py-1.5 text-sm transition-colors ${currentStatus === 'COMPLETED' ? 'bg-oro text-tinta font-semibold border-oro' : 'bg-white hover:bg-crema border-gris-claro'}`}>Completada</a>
        <a href="?page=1&status=CANCELLED" className={`rounded border px-3 py-1.5 text-sm transition-colors ${currentStatus === 'CANCELLED' ? 'bg-oro text-tinta font-semibold border-oro' : 'bg-white hover:bg-crema border-gris-claro'}`}>Cancelada</a>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gris-claro bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gris-claro">
          <thead className="bg-crema/20">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-tinta">Cliente</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-tinta">Contacto</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-tinta">Producto</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-tinta">Cant.</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-tinta">Enlace WhatsApp</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-tinta">Estado</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-tinta">Fecha</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-tinta">Acciones</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-tinta">Eliminar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gris-claro">
            {preOrders.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-sm text-gris">
                  No se encontraron pre-órdenes con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              preOrders.map((po) => (
                <tr key={po.id} className="hover:bg-crema/10 transition-colors">
                  <td className="px-4 py-3 text-sm font-semibold text-tinta">{po.customerName}</td>
                  <td className="px-4 py-3 text-sm text-tinta">
                    <div className="font-mono">📞 {po.customerPhone}</div>
                    {po.customerEmail && <div className="text-xs text-gris">{po.customerEmail}</div>}
                  </td>
                  <td className="px-4 py-3 text-sm text-tinta font-medium">
                    {po.product?.name || <span className="font-mono text-xs">{po.productId}</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-tinta text-center">{po.quantity}</td>
                  <td className="px-4 py-3 text-sm">
                    {po.waLink ? (
                      <a
                        href={po.waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-md bg-crema/40 px-2 py-1 text-xs text-oro hover:bg-crema/60 transition-colors border border-oro/30 font-medium"
                      >
                        Abrir WhatsApp
                      </a>
                    ) : (
                      <span className="text-xs text-gris">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold
                      ${po.status === 'CREATED' ? 'bg-blue-100 text-blue-800' : ''}
                      ${po.status === 'REDIRECTED_TO_WA' ? 'bg-purple-100 text-purple-800' : ''}
                      ${po.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : ''}
                      ${po.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {po.status === 'CREATED' ? 'Creada' : po.status === 'REDIRECTED_TO_WA' ? 'Redirigido WA' : po.status === 'COMPLETED' ? 'Completada' : 'Cancelada'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gris">
                    {new Date(po.createdAt).toLocaleDateString('es-CO', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <select
                      value={po.status}
                      onChange={(e) => handleStatusChange(po.id, e.target.value as PreOrder['status'])}
                      disabled={isPending}
                      className="rounded border border-gris-claro bg-white px-2 py-1 text-sm focus:border-oro focus:outline-none cursor-pointer disabled:opacity-60"
                    >
                      <option value="CREATED">Creada</option>
                      <option value="REDIRECTED_TO_WA">Redirigido WA</option>
                      <option value="COMPLETED">Completada</option>
                      <option value="CANCELLED">Cancelada</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(po.id, po.customerName)}
                      disabled={isPending}
                      className="inline-flex items-center justify-center rounded-md p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors disabled:opacity-40 cursor-pointer"
                      title="Eliminar pre-orden"
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
            Mostrando {preOrders.length} de {meta.total} registros
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
