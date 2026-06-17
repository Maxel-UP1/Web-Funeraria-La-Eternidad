import { render, screen, fireEvent } from '@testing-library/react';
import { LeadsTable } from '@/app/admin/leads/LeadsTable';
import { updateLeadStatus } from '@/lib/admin-api';
import { vi, test, expect } from 'vitest';
import type { Lead } from '@/lib/types';

vi.mock('@/lib/admin-api', () => ({
  updateLeadStatus: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}));

const mockLeads: Lead[] = [
  {
    id: 'lead-1',
    name: 'Juan Perez',
    phone: '3001234567',
    email: 'juan@example.com',
    message: 'Interesado en servicios',
    status: 'NEW',
    source: 'web',
    createdAt: '2026-06-02T19:33:17.000Z',
  },
];

const mockMeta = {
  total: 1,
  page: 1,
  limit: 20,
  totalPages: 1,
};

test('permite cambiar el estado de un lead y llama a la API de actualización', () => {
  render(<LeadsTable leads={mockLeads} meta={mockMeta} />);
  
  const select = screen.getByRole('combobox');
  expect(select).toHaveValue('NEW');
  
  fireEvent.change(select, { target: { value: 'CONTACTED' } });
  
  expect(updateLeadStatus).toHaveBeenCalledWith('lead-1', 'CONTACTED');
});
