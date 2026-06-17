import { render, screen } from '@testing-library/react';
import AdminLoginPage from '@/app/admin/login/page';
import { vi, test, expect } from 'vitest';
import React from 'react';

// Mock de react's useActionState para simular diferentes estados de formulario
vi.mock('react', async () => {
  const actual = (await vi.importActual('react')) as any;
  return {
    ...actual,
    useActionState: (action: any, initialState: any) => {
      return [{ error: 'Credenciales incorrectas. Inténtalo de nuevo.' }, action, false];
    }
  };
});

test('renderiza formulario de login con campos e inputs requeridos', () => {
  render(<AdminLoginPage />);
  expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
});

test('muestra error genérico al fallar login', () => {
  render(<AdminLoginPage />);
  expect(screen.getByText(/credenciales incorrectas/i)).toBeInTheDocument();
});
