// src/app/admin/users/page.tsx
import { RegisterForm } from './RegisterForm';

export const metadata = { title: 'Usuarios | Panel admin', robots: { index: false, follow: false } };

export default async function AdminUsersPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-tinta font-bold">Usuarios administradores</h1>
      <div className="rounded-lg border border-gris-claro bg-white p-6 shadow-sm max-w-md">
        <h2 className="text-lg font-semibold text-tinta mb-4">Registrar Nuevo Administrador</h2>
        <RegisterForm />
      </div>
    </div>
  );
}
