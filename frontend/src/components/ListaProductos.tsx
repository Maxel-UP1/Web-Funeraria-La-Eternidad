import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/api";
import type { Product } from "@/lib/types";

function formatoCOP(precio: string) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(precio));
}

function Tarjeta({ producto }: { producto: Product }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-gris-claro bg-white transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] bg-crema/40">
        {producto.imageBase64 ? (
          <Image
            src={producto.imageBase64}
            alt={producto.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gris">
            Sin imagen
          </div>
        )}
      </div>

      <div className="space-y-2 p-5">
        <h3 className="font-display text-lg text-tinta">{producto.name}</h3>
        {producto.description && (
          <p className="line-clamp-2 text-sm text-gris">
            {producto.description}
          </p>
        )}
        <p className="pt-1 font-medium text-oro">{formatoCOP(producto.price)}</p>
      </div>
    </article>
  );
}

export default async function ListaProductos({
  categoryId,
  titulo,
  limite = 12,
}: {
  categoryId?: string;
  titulo?: string;
  limite?: number;
}) {
  let productos: Product[] = [];
  let error = false;

  try {
    const resultado = await getProducts({ categoryId, limit: limite });
    productos = resultado.data;
  } catch {
    error = true;
  }

  if (error) {
    return (
      <p className="rounded-md bg-crema/50 p-4 text-center text-tinta">
        No pudimos cargar el catálogo en este momento.
      </p>
    );
  }

  if (productos.length === 0) {
    return (
      <p className="p-4 text-center text-gris">
        No hay productos disponibles por ahora.
      </p>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      {titulo && (
        <h2 className="mb-8 font-display text-3xl text-tinta">{titulo}</h2>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {productos.map((p) => (
          <Link
            key={p.id}
            href={`/producto/${p.id}`}
            className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oro focus-visible:ring-offset-2"
          >
            <Tarjeta producto={p} />
          </Link>
        ))}
      </div>
    </section>
  );
}
