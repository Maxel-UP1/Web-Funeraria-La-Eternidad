import { getCategories } from "@/lib/api";
import ListaProductos from "@/components/ListaProductos";
import Image from "next/image";

export const metadata = { title: "Productos | Casa Funeraria La Eternidad" };

export default async function ProductosPage() {
  let productCategoryIds: string[] = [];
  try {
    const categorias = await getCategories();
    productCategoryIds = categorias
      .filter((c) => c.type === "PRODUCT" && c.isActive)
      .map((c) => c.id);
  } catch {
    productCategoryIds = [];
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-azul-claro/30 via-white to-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(191,159,98,0.08),transparent_60%)]"></div>
        <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-12 md:pt-28 md:pb-16 text-center">
          <span className="mb-3 block font-body text-sm font-semibold uppercase tracking-[0.2em] text-oro">
            Honra su memoria
          </span>
          <h1 className="font-display text-4xl font-bold tracking-tight text-tinta sm:text-5xl lg:text-6xl">
            Productos y Arreglos
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-tinta/75 md:text-xl">
            Flores, arreglos y productos cuidadosamente seleccionados para honrar la
            memoria de tu ser querido con delicadeza y respeto.
          </p>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-oro"></div>
        </div>
      </section>

      {/* Galería visual de tipos de arreglos */}
      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center font-display text-3xl font-semibold text-tinta mb-12 md:text-4xl">
            Categorías de Arreglos
          </h2>

          <div className="space-y-16">

            {/* ==================== PEDESTALES ==================== */}
            <div>
              <h3 className="mb-6 text-center font-display text-2xl font-semibold text-tinta">
                Pedestal
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {["p1", "p2", "p3"].map((img) => (
                  <div
                    key={img}
                    className="relative h-96 bg-white rounded-2xl shadow-md overflow-hidden group"
                  >
                    <Image
                      src={`/img_flores/pedestal/${img}.png`}
                      alt={`Pedestal ${img}`}
                      fill
                      sizes="(max-width:640px) 100vw,
                             (max-width:1024px) 50vw,
                             33vw"
                      className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ==================== CORONAS ==================== */}
            <div>
              <h3 className="mb-6 text-center font-display text-2xl font-semibold text-tinta">
                Corona
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {["c1", "c2", "c3"].map((img) => (
                  <div
                    key={img}
                    className="relative h-96 bg-white rounded-2xl shadow-md overflow-hidden group"
                  >
                    <Image
                      src={`/img_flores/corona/${img}.png`}
                      alt={`Corona ${img}`}
                      fill
                      sizes="(max-width:640px) 100vw,
                             (max-width:1024px) 50vw,
                             33vw"
                      className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ==================== ORQUÍDEAS ==================== */}
            <div>
              <h3 className="mb-6 text-center font-display text-2xl font-semibold text-tinta">
                Orquídeas
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {["o1", "o2", "o3", "o4", "o5", "oM"].map((img) => (
                  <div
                    key={img}
                    className="relative h-96 bg-white rounded-2xl shadow-md overflow-hidden group"
                  >
                    <Image
                      src={`/img_flores/orquideas/${img}.png`}
                      alt={`Orquídea ${img}`}
                      fill
                      sizes="(max-width:640px) 100vw,
                             (max-width:1024px) 50vw,
                             33vw"
                      className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Lista de productos del backend — solo type=PRODUCT */}
      <section className="bg-crema/20 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center font-display text-3xl font-semibold text-tinta mb-8 md:text-4xl">
            Selecciona un producto
          </h2>
          {productCategoryIds.length > 0 ? (
            productCategoryIds.map((catId) => (
              <ListaProductos key={catId} categoryId={catId} />
            ))
          ) : (
            <p className="text-center text-tinta/60">No hay productos disponibles.</p>
          )}
        </div>
      </section>
    </>
  );
}
