export type CategoryType = "FLOWER" | "SERVICE";
export type LeadStatus = "NEW" | "CONTACTED" | "CLOSED";
export type PreOrderStatus =
  | "CREATED"
  | "REDIRECTED_TO_WA"
  | "COMPLETED"
  | "CANCELLED";

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: CategoryType;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string | null;
  price: string; // Decimal serializado como string
  imageBase64: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  department: string;
  latitude: string;
  longitude: string;
  contactPhone: string;
  contactEmail: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  message: string;
  status: LeadStatus;
  source: string | null;
  createdAt: string;
}

export interface CreateLeadInput {
  name: string;
  message: string;
  phone?: string;
  email?: string;
  source?: string;
}

export interface CreatePreOrderInput {
  productId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  quantity?: number;
}

export interface PreOrder {
  id: string;
  productId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  quantity: number;
  status: PreOrderStatus;
  waLink: string | null;
  createdAt: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface Paginated<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}
