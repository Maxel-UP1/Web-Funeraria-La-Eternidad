// src/app/admin/layout.tsx
import { getAccessToken } from '@/lib/session';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { logoutAction } from './logout/actions';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = await getAccessToken();

  // Sin token → renderizar solo children (la página de login).
  // El middleware ya bloquea el acceso a las demás rutas /admin/* sin token,
  // por lo que este caso solo ocurre cuando se visita /admin/login directamente.
  if (!token) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-crema/20">
      <aside className="w-64 bg-tinta text-white flex flex-col">
        <div className="p-4 border-b border-white/10">
          <h2 className="font-display text-oro text-xl font-semibold">La Eternidad</h2>
          <p className="text-xs text-gris">Panel de administración</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavLink href="/admin">📊 Dashboard</NavLink>
          <NavLink href="/admin/leads">📋 Leads / PQRS</NavLink>
          <NavLink href="/admin/pre-orders">🛒 Pre‑órdenes</NavLink>
          <NavLink href="/admin/products">🏷️ Productos</NavLink>
          <NavLink href="/admin/categories">📁 Categorías</NavLink>
          <NavLink href="/admin/branches">📍 Sedes</NavLink>
          <NavLink href="/admin/users">👥 Usuarios (admins)</NavLink>
        </nav>
        <div className="p-4 border-t border-white/10">
          <form action={logoutAction}>
            <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gris hover:bg-white/10 hover:text-white cursor-pointer">
              <LogOut size={16} /> Cerrar sesión
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto bg-white">{children}</main>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block rounded-md px-3 py-2 text-sm text-gris transition-colors hover:bg-white/10 hover:text-white"
    >
      {children}
    </Link>
  );
}

