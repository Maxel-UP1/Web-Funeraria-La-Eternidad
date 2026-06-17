import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Las rutas públicas de admin (solo login) no requieren sesión
const PUBLIC_ADMIN_PATHS = ['/admin/login'];
// Rutas estáticas y públicas generales
const PUBLIC_PATHS = ['/api/health', '/_next', '/favicon.ico', '/img_contacto', '/logoPrincipal.png'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir recursos estáticos y públicos
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Proteger todo /admin/* excepto login
  if (pathname.startsWith('/admin')) {
    const isPublicAdmin = PUBLIC_ADMIN_PATHS.some(p => pathname === p);
    if (isPublicAdmin) return NextResponse.next();

    // Leer la cookie httpOnly que almacena el accessToken
    const accessToken = request.cookies.get('admin_access_token')?.value;
    if (!accessToken) {
      const url = new URL('/admin/login', request.url);
      return NextResponse.redirect(url);
    }
    // Opcional: validar formato básico del JWT (no su firma)
    if (!/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(accessToken)) {
      const url = new URL('/admin/login', request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/health', '/_next/static/:path*', '/favicon.ico'],
};
