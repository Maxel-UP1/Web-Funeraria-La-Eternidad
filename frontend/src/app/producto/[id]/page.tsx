import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError, getProductById } from "@/lib/api";
import type { Product } from "@/lib/types";
import FormularioPreOrden from "@/components/FormularioPreOrden";

function formatoCOP(precio: string) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(precio));
}

// Un 404 del backend significa producto inexistente (página notFound); cualquier
// otro fallo se propaga al boundary de error de Next.
async function obtenerProducto(id: string): Promise<Product | null> {
  try {
    return await getProductById(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const producto = await obtenerProducto(id);

  if (!producto) {
    return { title: "Producto no encontrado | Casa Funeraria La Eternidad" };
  }

  return {
    title: `${producto.name} | Casa Funeraria La Eternidad`,
    description:
      producto.description ??
      "Conoce los detalles de este servicio o arreglo floral.",
  };
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const producto = await obtenerProducto(id);

  if (!producto) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <nav aria-label="Ruta de navegación" className="mb-6 text-sm text-gris">
        <Link href="/" className="transition-colors hover:text-oro">
          Inicio
        </Link>
        <span className="px-2" aria-hidden="true">
          /
        </span>
        <span className="text-tinta">{producto.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-crema/40">
          {producto.imageBase64 ? (
            <Image
              src={producto.imageBase64}
              alt={producto.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gris">
              Sin imagen
            </div>
          )}
        </div>

        <div>
          <h1 className="font-display text-3xl text-tinta sm:text-4xl">
            {producto.name}
          </h1>
          <p className="mt-3 text-2xl font-medium text-oro">
            {formatoCOP(producto.price)}
          </p>

          {producto.description && (
            <p className="mt-5 whitespace-pre-line leading-relaxed text-gris">
              {producto.description}
            </p>
          )}

          <div className="mt-8 border-t border-gris-claro pt-8">
            <h2 className="font-display text-xl text-tinta">
              Solicitar información
            </h2>
            <p className="mt-2 text-sm text-gris">
              Déjanos tus datos y continuaremos la conversación por WhatsApp, sin
              compromiso.
            </p>
            <div className="mt-5">
              <FormularioPreOrden productId={producto.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
