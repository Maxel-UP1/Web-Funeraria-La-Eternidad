import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './session';
import type { Category, Product, Branch, Lead, PreOrder, Paginated, ApiEnvelope } from './types';

const ADMIN_API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export class AdminApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'AdminApiError';
  }
}

export async function adminFetch<T>(
  path: string,
  options: RequestInit & { requiresAuth?: boolean } = {}
): Promise<T> {
  const { requiresAuth = true, ...fetchOptions } = options;
  // Record<string, string> es subtipo de HeadersInit y admite indexación con strings
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (fetchOptions.headers) {
    // Normalizar los headers entrantes al mismo tipo plano
    const incoming = fetchOptions.headers;
    if (incoming instanceof Headers) {
      incoming.forEach((v, k) => { headers[k] = v; });
    } else if (Array.isArray(incoming)) {
      for (const [k, v] of incoming) headers[k] = v;
    } else {
      Object.assign(headers, incoming as Record<string, string>);
    }
  }

  if (requiresAuth) {
    const token = await getAccessToken();
    if (!token) throw new AdminApiError(401, 'No hay sesión activa');
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${ADMIN_API_URL}${path}`;
  let res = await fetch(url, { ...fetchOptions, headers });

  // Si el accessToken expiró (401) intentar renovar con el refreshToken
  if (res.status === 401 && requiresAuth) {
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      const refreshRes = await fetch(`${ADMIN_API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (refreshRes.ok) {
        const refreshData = (await refreshRes.json()) as ApiEnvelope<{ accessToken: string; refreshToken: string }>;
        const newAccess = refreshData.data.accessToken;
        const newRefresh = refreshData.data.refreshToken;
        await setTokens(newAccess, newRefresh);
        
        // Reintentar la llamada original con el nuevo accessToken
        const retryHeaders: Record<string, string> = { ...headers, Authorization: `Bearer ${newAccess}` };
        res = await fetch(url, { ...fetchOptions, headers: retryHeaders });
      } else {
        await clearTokens();
        throw new AdminApiError(401, 'Sesión expirada, inicia sesión nuevamente');
      }
    } else {
      await clearTokens();
      throw new AdminApiError(401, 'No hay sesión activa');
    }
  }

  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const body = await res.json();
      message = body?.message || body?.error || message;
    } catch {}
    throw new AdminApiError(res.status, message);
  }

  const envelope = (await res.json()) as ApiEnvelope<T>;
  return envelope.data;
}

// ========== Auth ==========
export async function adminLogin(email: string, password: string) {
  const data = await adminFetch<{ accessToken: string; refreshToken: string }>(
    '/auth/login',
    { method: 'POST', body: JSON.stringify({ email, password }), requiresAuth: false }
  );
  await setTokens(data.accessToken, data.refreshToken);
  return data;
}

export async function adminLogout() {
  await clearTokens();
}

// ========== Leads ==========
export async function getLeads(params?: { status?: string; page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set('status', params.status);
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  const suffix = qs.toString() ? `?${qs}` : '';
  return adminFetch<Paginated<Lead>>(`/leads${suffix}`);
}

export async function getLeadById(id: string) {
  return adminFetch<Lead>(`/leads/${id}`);
}

export async function updateLeadStatus(id: string, status: Lead['status']) {
  return adminFetch<Lead>(`/leads/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
}

export async function deleteLead(id: string) {
  return adminFetch<Lead>(`/leads/${id}`, { method: 'DELETE' });
}

// ========== Pre-orders ==========
export async function getPreOrders(params?: { status?: string; page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set('status', params.status);
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  const suffix = qs.toString() ? `?${qs}` : '';
  return adminFetch<Paginated<PreOrder>>(`/pre-orders${suffix}`);
}

export async function getPreOrderById(id: string) {
  return adminFetch<PreOrder>(`/pre-orders/${id}`);
}

export async function updatePreOrderStatus(id: string, status: PreOrder['status']) {
  return adminFetch<PreOrder>(`/pre-orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
}

export async function deletePreOrder(id: string) {
  return adminFetch<PreOrder>(`/pre-orders/${id}`, { method: 'DELETE' });
}

// ========== Categories ==========
export async function getCategoriesAdmin() {
  return adminFetch<Category[]>('/categories');
}

export async function createCategory(data: { name: string; type: 'FLOWER' | 'SERVICE'; description?: string }) {
  return adminFetch<Category>('/categories', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateCategory(id: string, data: Partial<{ name: string; type: 'FLOWER' | 'SERVICE'; description: string | null; isActive: boolean }>) {
  return adminFetch<Category>(`/categories/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function deleteCategory(id: string) {
  return adminFetch<Category>(`/categories/${id}`, { method: 'DELETE' });
}

// ========== Products ==========
export async function getProductsAdmin(params?: { categoryId?: string; search?: string; page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.categoryId) qs.set('categoryId', params.categoryId);
  if (params?.search) qs.set('search', params.search);
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  const suffix = qs.toString() ? `?${qs}` : '';
  return adminFetch<Paginated<Product>>(`/products${suffix}`);
}

export async function createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'category'> & { categoryId: string }) {
  return adminFetch<Product>('/products', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateProduct(id: string, data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'category'>> & { categoryId?: string }) {
  return adminFetch<Product>(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function deleteProduct(id: string) {
  return adminFetch<Product>(`/products/${id}`, { method: 'DELETE' });
}

// ========== Branches ==========
export async function getBranchesAdmin() {
  return adminFetch<Branch[]>('/branches');
}

export async function createBranch(data: Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>) {
  return adminFetch<Branch>('/branches', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateBranch(id: string, data: Partial<Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>>) {
  return adminFetch<Branch>(`/branches/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function deleteBranch(id: string) {
  return adminFetch<Branch>(`/branches/${id}`, { method: 'DELETE' });
}
