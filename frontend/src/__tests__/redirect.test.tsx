import { requireAdmin } from '@/lib/session';
import { redirect } from 'next/navigation';
import { vi, test, expect } from 'vitest';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    get: vi.fn().mockReturnValue(undefined),
  }),
}));

test('redirige a /admin/login si requireAdmin es llamado sin token', async () => {
  try {
    await requireAdmin();
  } catch (err) {
    // Next.js redirect lanza un error para abortar el flujo del render
  }
  
  expect(redirect).toHaveBeenCalledWith('/admin/login');
});
