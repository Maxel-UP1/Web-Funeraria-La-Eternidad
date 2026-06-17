// src/app/admin/users/RegisterForm.tsx
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { registerAdminAction } from './actions';

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAdminAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-tinta">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="ejemplo@funeraria.com"
          className="mt-1 w-full rounded-md border border-gris-claro bg-white px-3 py-2 text-tinta focus:border-oro focus:outline-none focus:ring-2 focus:ring-oro/40"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-tinta">
          Contraseña (mín. 8 caracteres)
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="••••••••"
          className="mt-1 w-full rounded-md border border-gris-claro bg-white px-3 py-2 text-tinta focus:border-oro focus:outline-none focus:ring-2 focus:ring-oro/40"
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-tinta">
          Rol
        </label>
        <select
          id="role"
          name="role"
          defaultValue="ADMIN"
          className="mt-1 w-full rounded-md border border-gris-claro bg-white px-3 py-2 text-tinta focus:border-oro focus:outline-none focus:ring-2 focus:ring-oro/40 cursor-pointer"
        >
          <option value="ADMIN">Administrador</option>
          <option value="SUPER_ADMIN">Super administrador</option>
        </select>
      </div>

      {state?.error && (
        <p className="text-sm text-red-700" role="alert">
          {state.error}
        </p>
      )}

      {state?.success && (
        <p className="text-sm text-green-700" role="alert">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-oro px-4 py-2 font-medium text-tinta transition-colors hover:bg-oro-fuerte disabled:opacity-60 cursor-pointer"
      >
        {pending ? 'Creando...' : 'Crear admin'}
      </button>
    </form>
  );
}
