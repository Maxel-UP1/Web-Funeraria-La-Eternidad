// src/app/admin/page.tsx
import Link from 'next/link';
import { getLeads, getPreOrders, getProductsAdmin, getCategoriesAdmin } from '@/lib/admin-api';

export const metadata = { title: 'Dashboard | Panel admin', robots: { index: false, follow: false } };

export default async function AdminDashboardPage() {
  let leadsCount = 0;
  let preOrdersCount = 0;
  let productsCount = 0;
  let categoriesCount = 0;
  let activeProductsCount = 0;
  let apiError = false;

  try {
    const [leads, preOrders, products, categories] = await Promise.all([
      getLeads({ limit: 1 }),
      getPreOrders({ limit: 1 }),
      getProductsAdmin({ limit: 1 }),
      getCategoriesAdmin(),
    ]);
    leadsCount = leads.meta.total;
    preOrdersCount = preOrders.meta.total;
    productsCount = products.meta.total;
    categoriesCount = categories.length;
    activeProductsCount = products.meta.total; // total already filtered active by default
  } catch (err) {
    apiError = true;
  }

  const stats = [
    {
      label: 'Total de Leads / PQRS',
      value: leadsCount,
      href: '/admin/leads',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
      ),
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      iconBg: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Total de Pre‑órdenes',
      value: preOrdersCount,
      href: '/admin/pre-orders',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
        </svg>
      ),
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      iconBg: 'bg-purple-100 text-purple-600',
    },
    {
      label: 'Total de Productos',
      value: productsCount,
      href: '/admin/products',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
        </svg>
      ),
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      iconBg: 'bg-amber-100 text-amber-600',
    },
    {
      label: 'Total de Categorías',
      value: categoriesCount,
      href: '/admin/categories',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
        </svg>
      ),
      color: 'bg-teal-50 text-teal-700 border-teal-200',
      iconBg: 'bg-teal-100 text-teal-600',
    },
  ];

  const quickLinks = [
    { label: 'Gestionar Productos', href: '/admin/products', desc: 'Crear, editar o desactivar productos del catálogo' },
    { label: 'Gestionar Categorías', href: '/admin/categories', desc: 'Organizar servicios y flores por categoría' },
    { label: 'Ver Leads / PQRS', href: '/admin/leads', desc: 'Revisar y actualizar mensajes de contacto' },
    { label: 'Ver Pre‑órdenes', href: '/admin/pre-orders', desc: 'Gestionar solicitudes de compra pendientes' },
  ];

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl text-tinta font-bold">Dashboard</h1>
      <p className="mb-6 text-sm text-gris">Resumen general del panel de administración.</p>

      {apiError && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-800 border border-red-200">
          No se pudieron cargar las estadísticas en este momento. Conexión con el servidor fallida.
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`group flex items-center gap-4 rounded-xl border p-5 shadow-sm hover:shadow-md transition-all ${s.color}`}
          >
            <div className={`flex-shrink-0 rounded-lg p-3 ${s.iconBg}`}>
              {s.icon}
            </div>
            <div>
              <p className="text-xs font-medium opacity-75 leading-tight">{s.label}</p>
              <p className="mt-1 text-3xl font-bold">{apiError ? '—' : s.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <h2 className="mb-3 text-lg font-semibold text-tinta">Acciones rápidas</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {quickLinks.map((q) => (
          <Link
            key={q.label}
            href={q.href}
            className="group flex flex-col gap-1 rounded-xl border border-gris-claro bg-white p-5 shadow-sm hover:shadow-md hover:border-oro transition-all"
          >
            <span className="text-sm font-semibold text-tinta group-hover:text-oro transition-colors">{q.label} →</span>
            <span className="text-xs text-gris">{q.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
