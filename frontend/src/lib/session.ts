import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ACCESS_TOKEN_COOKIE = 'admin_access_token';
const REFRESH_TOKEN_COOKIE = 'admin_refresh_token';

// Configuración de cookies: httpOnly, Secure en producción, SameSite=Lax
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 15, // 15 minutos (coincide con JWT_EXPIRATION)
});

export async function setTokens(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, getCookieOptions());
  cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    ...getCookieOptions(),
    maxAge: 60 * 60 * 24 * 7, // 7 días (coincide con JWT_REFRESH_EXPIRATION)
  });
}

export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
}

export async function clearTokens() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}

// Helper para páginas admin que requieren sesión
export async function requireAdmin() {
  const token = await getAccessToken();
  if (!token) redirect('/admin/login');
  return token;
}
