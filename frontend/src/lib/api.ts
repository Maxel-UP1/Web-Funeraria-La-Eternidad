import type {
  ApiEnvelope,
  Paginated,
  Product,
  Category,
  Branch,
  CreateLeadInput,
  CreatePreOrderInput,
  PreOrder,
} from "./types";

// Este módulo se ejecuta solo en el servidor (Server Components y Server Actions),
// por eso se prioriza una variable NO pública: así el host del backend no viaja al
// bundle del navegador. NEXT_PUBLIC_API_URL queda como respaldo de compatibilidad.
const BASE_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3000/api";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { next?: { revalidate?: number } } = {},
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const body = await res.json();
      message = body?.message ?? message;
    } catch {
      // respuesta sin cuerpo JSON
    }
    throw new ApiError(res.status, message);
  }

  // El backend envuelve toda respuesta en { success, data, timestamp }.
  const envelope = (await res.json()) as ApiEnvelope<T>;
  return envelope.data;
}

export const getCategories = () =>
  request<Category[]>("/categories", { next: { revalidate: 300 } });

export const getProducts = (params?: {
  categoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const qs = new URLSearchParams();
  if (params?.categoryId) qs.set("categoryId", params.categoryId);
  if (params?.search) qs.set("search", params.search);
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const suffix = qs.toString() ? `?${qs}` : "";
  return request<Paginated<Product>>(`/products${suffix}`, {
    next: { revalidate: 120 },
  });
};

export const getProductById = (id: string) =>
  request<Product>(`/products/${id}`, { next: { revalidate: 120 } });

export const getBranches = () =>
  request<Branch[]>("/branches", { next: { revalidate: 600 } });

export const createLead = (input: CreateLeadInput) =>
  request<{ id: string }>("/leads", {
    method: "POST",
    body: JSON.stringify(input),
  });

export const createPreOrder = (input: CreatePreOrderInput) =>
  request<PreOrder>("/pre-orders", {
    method: "POST",
    body: JSON.stringify(input),
  });
