// src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { getCategories, getProducts, getBranches } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://funerarialaeternidad.com';

  // Rutas estáticas públicas
  const staticRoutes = ['', '/servicios', '/productos', '/sedes', '/contacto'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Productos dinámicos
  let products: { id: string; updatedAt: string }[] = [];
  try {
    const cats = await getCategories();
    const flowerId = cats.find(c => c.type === 'FLOWER')?.id;
    const serviceId = cats.find(c => c.type === 'SERVICE')?.id;
    const [flowers, services] = await Promise.all([
      getProducts({ categoryId: flowerId, limit: 100 }),
      getProducts({ categoryId: serviceId, limit: 100 }),
    ]);
    products = [...flowers.data, ...services.data].map(p => ({ id: p.id, updatedAt: p.updatedAt }));
  } catch { /* silencio */ }

  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/producto/${product.id}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  // Sedes dinámicas (opcional)
  let branches: { id: string }[] = [];
  try {
    branches = await getBranches();
  } catch {}
  const branchRoutes = branches.map((branch) => ({
    url: `${baseUrl}/sedes#${branch.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...productRoutes, ...branchRoutes];
}
