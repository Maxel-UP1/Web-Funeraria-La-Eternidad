// src/app/admin/login/page.tsx
'use client';

import { useActionState } from 'react';
import { loginAction } from './actions';

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-crema/30 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md border border-gris-claro">
        <h1 className="mb-6 font-display text-2xl text-tinta">Acceso al panel</h1>
        <form action={action} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-tinta">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1 w-full rounded-md border border-gris-claro bg-white px-3 py-2 text-tinta focus:border-oro focus:outline-none focus:ring-2 focus:ring-oro/40"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-tinta">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-md border border-gris-claro bg-white px-3 py-2 text-tinta focus:border-oro focus:outline-none focus:ring-2 focus:ring-oro/40"
            />
          </div>
          {state?.error && (
            <p className="text-sm text-red-700" role="alert">
              {state.error}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md bg-oro px-4 py-2 font-medium text-tinta transition-colors hover:bg-oro-fuerte disabled:opacity-60 cursor-pointer"
          >
            {pending ? 'Validando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
