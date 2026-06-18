import { getCategories } from "@/lib/api";
import ListaProductos from "@/components/ListaProductos";

export const metadata = { title: "Servicios | Casa Funeraria La Eternidad" };

export default async function ServiciosPage() {
  let serviceCategoryIds: string[] = [];
  try {
    const categorias = await getCategories();
    serviceCategoryIds = categorias
      .filter((c) => c.type === "SERVICE" && c.isActive)
      .map((c) => c.id);
  } catch {
    serviceCategoryIds = [];
  }

  return (
    <>
      {/* Hero de la sección */}
      <section className="relative overflow-hidden bg-gradient-to-b from-azul-claro/30 via-white to-white">
        {/* Decoración sutil de fondo */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(191,159,98,0.08),transparent_60%)]"></div>
        <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-12 md:pt-28 md:pb-16 text-center">
          <span className="mb-3 block font-body text-sm font-semibold uppercase tracking-[0.2em] text-oro">
            Acompañamiento profesional
          </span>
          <h1 className="font-display text-4xl font-bold tracking-tight text-tinta sm:text-5xl lg:text-6xl">
            Servicios
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-tinta/75 md:text-xl">
            Planes y servicios funerarios diseñados para acompañar a tu familia
            con respeto, dignidad y calidez.
          </p>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-oro"></div>
        </div>
      </section>

      {/* Listado de servicios — solo type=SERVICE */}
      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-4">
          {serviceCategoryIds.length > 0 ? (
            serviceCategoryIds.map((catId) => (
              <ListaProductos key={catId} categoryId={catId} />
            ))
          ) : (
            <p className="text-center text-tinta/60 py-16">No hay servicios disponibles.</p>
          )}
        </div>
      </section>
    </>
  );
}