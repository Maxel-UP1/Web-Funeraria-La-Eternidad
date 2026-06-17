# Casa Funeraria La Eternidad — Frontend

Portal web público para una funeraria que hoy solo tiene Facebook.
Stack: Next.js (App Router) + TypeScript + Tailwind CSS v4 + next/font.

## Estructura
- Usamos carpeta `src/`: `src/app/`, `src/components/`, `src/lib/`.
- `public/` va en la RAÍZ (no dentro de src). El logo: `public/logoPrincipal.png` → se usa como `/logoPrincipal.png`.
- Alias `@/` = `./src/` (ver tsconfig.json: "@/*": ["./src/*"]).
- Tailwind v4: sin tailwind.config.ts; paleta y fuentes en src/app/globals.css con @theme.

## Estado del frontend
- It.1 COMPLETA: Home (src/app/page.tsx), /servicios, /flores, /sedes.
- It.2 COMPLETA: /contacto (formulario PQRS → POST /leads vía Server Action).
- It.3 COMPLETA: /producto/[id] (ficha + pre-orden → POST /pre-orders → apertura validada de WhatsApp).
- Componentes de lectura reutilizables: ListaProductos (props: categoryId, titulo, limite) y ListaSedes.
  Cada tarjeta enlaza a /producto/[id].
- Formularios: FormularioContacto + FormularioPreOrden ("use client") con sus Server Actions colocados
  (src/app/contacto/actions.ts y src/app/producto/[id]/actions.ts).
- Datos vía src/lib/api.ts (Server Components y Server Actions, sin estado). Nunca fetch suelto en componentes.
- Imágenes externas: next.config.ts restringe remotePatterns al host exacto de Supabase Storage (sin comodín de hostname).
- Las páginas degradan con elegancia si el backend está caído o sin datos (try/catch → mensaje).

## Estilo de comentarios
- Escasos y profesionales, en español. Explican el PORQUÉ, no el QUÉ.
- Nada de tono didáctico/tutorial, emojis, ni narrar lo que el código ya dice.
- Comentar solo lo no evidente (ej.: por qué se desempaqueta `.data`, por qué `price` es string).

## Cómo correr
- Dev: `npm run dev -- -p 3001` (el backend ocupa el 3000)
- Lint: `npm run lint`  · Build: `npm run build`
- Variable: `NEXT_PUBLIC_API_URL=http://localhost:3000/api` (en .env.local)

## Contrato del backend (NestJS) — REGLAS QUE NO SE ROMPEN
- Prefijo global `/api`. Todo se consume SIEMPRE a través de `lib/api.ts`, nunca con fetch suelto en componentes.
- Toda respuesta exitosa viene envuelta: `{ success, data, timestamp }`. Hay que leer `.data`.
- Las listas paginadas traen OTRA capa: `data.data` (array) + `data.meta` (total, page, limit, totalPages).
- Los decimales (price, latitude, longitude) llegan como STRING → convertir con Number().
- Autenticación SOLO para admin (ADMIN/SUPER_ADMIN). NO existe registro ni login de clientes.
- NO hay carrito ni pasarela de pagos. La conversión es: POST /pre-orders → el backend devuelve `waLink` → abrir ese enlace de WhatsApp.

### Endpoints públicos (los del sitio)
- GET /categories · GET /products?categoryId&search&page&limit · GET /products/:id
- GET /branches · POST /leads · POST /pre-orders · GET /health

## Marca (Manual de Imagen)
- Colores (tokens Tailwind): oro #bf9f62 (principal), tinta #18222e (texto/oscuro),
  oro-fuerte #ccad52, crema #e7d8ad, gris #9a9da4, azul-claro #d3e3ef, gris-claro #e0e3e8.
- Tipografía: display = "adobe-myungjo" → fallback Playfair Display (font-display);
  cuerpo = Source Sans 3 (font-body).
- Tono: sobrio, digno, respetuoso. Nada estridente. Lujo discreto.

## Convenciones de código
- Server Components por defecto. `"use client"` SOLO para formularios/interactividad.
- Texto de UI en español. Precios formateados en COP (Intl.NumberFormat "es-CO").
- Toda <Image> y enlace con alt/aria adecuados (sitio sensible, accesibilidad importa).
- Categorías: type "SERVICE" = servicios; type "FLOWER" = flores.

## Qué NO hacer
- No inventar endpoints de carrito, pago o cuentas de cliente: no existen.
- No exponer rutas de admin en el sitio público.
- No hardcodear la URL del backend. En servidor se prefiere API_URL (NO pública); NEXT_PUBLIC_API_URL queda como respaldo. Las escrituras (ej. /leads) pasan por un Server Action: el navegador llama al propio dominio Next, nunca a NestJS directo.
- Anti-spam en formularios: honeypot oculto + validación duplicada (cliente y servidor). Botón deshabilitado durante el envío. Nunca renderizar entrada del usuario como HTML.
- Redirección a WhatsApp: validar el waLink (host wa.me / api.whatsapp.com) en cliente Y servidor antes de abrirlo. Abrir solo con window.open(url, "_blank", "noopener,noreferrer"). Nunca abrir una URL arbitraria de la API. No registrar PII ni el waLink en producción.

## Roadmap
- It.1 COMPLETA: Home, /servicios, /flores, /sedes (solo lectura, GET).
- It.2 COMPLETA: formulario de contacto / PQRS (POST /leads vía Server Action).
- It.3 COMPLETA: ficha de producto + pre-orden → WhatsApp (GET /products/:id, POST /pre-orders).
- It.4 COMPLETA: panel admin + SEO + accesibilidad + testing.

## Iteración 4 (Panel administrativo + seguridad + SEO)
- **Autenticación BFF**: Los JWT viven SOLO en cookies httpOnly. Middleware protege `/admin/*`.
- **Tokens**: `admin_access_token` (15m), `admin_refresh_token` (7d). Renovación automática ante 401.
- **CSRF**: Mitigado por SameSite=Lax + Server Actions same‑origin. No hay endpoints mutadores públicos.
- **SEO**: `robots.txt` deshabilita `/admin`; `sitemap.xml` cubre todas las rutas públicas dinámicas.
- **Cabeceras de seguridad**: CSP estricta, HSTS (`Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`), Permissions-Policy (`camera=(), microphone=(), geolocation=()`), X-Frame-Options DENY, X-Content-Type-Options, Referrer-Policy.
- **Panel**: Rutas `/admin/leads`, `/admin/pre-orders`, `/admin/products`, `/admin/categories`, `/admin/branches`, `/admin/users`. Cada una con tabla, filtros, paginación y acciones (soft-delete, cambio de estado).
- **Validaciones**: Cliente + servidor (Zod) en todos los formularios admin.
- **Pruebas críticas**: Se agregarán con Vitest + React Testing Library (setup documentado en `vitest.config.ts`).

## Cambios recientes (jun 2026)
- **Home**: Se eliminó la visualización directa de servicios (ya existe botón "Ver servicios").
- **Home**: Se añadió un carrusel automático (`SliderPrincipal`) con las imágenes de `/public/img_sliderPrincipal/` (manos1, bosque2, insta3, manosFinal4). Cambia cada 2.8 segundos, fondo azul claro, indicadores de navegación.

## Cambios recientes (jun 2026) - Segunda tanda
- **Home**: Se eliminaron los tres carteles de características y se reemplazaron por un mapa de Google Maps (sede principal Duitama) y una descripción de las instalaciones (3 salas, una VIP).
- **Home**: En el CTA final, se dividió en dos columnas: izquierda "¿Necesitas ayuda ahora?" con botón a contacto; derecha "Conócenos" con botón a nueva página estática `/quienes-somos`.
- **Nueva página**: `/quienes-somos` (estática, sin llamadas al backend) con información institucional, misión, valores y otro mapa embebido.
- **Navegación**: Se añadió el enlace "Quiénes somos" en la barra superior, entre Inicio y Servicios.
- **Seguridad**: Se actualizó la CSP en `next.config.ts` para permitir `frame-src` de Google Maps (necesario para el iframe).
