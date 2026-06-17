import ListaSedes from "@/components/ListaSedes";

export const metadata = { title: "Sedes | Casa Funeraria La Eternidad" };

export default function SedesPage() {
  return (
    <>
      {/* Hero de la sección */}
      <section className="relative overflow-hidden bg-gradient-to-b from-azul-claro/30 via-white to-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(191,159,98,0.08),transparent_60%)]"></div>
        <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-12 md:pt-28 md:pb-16 text-center">
          <span className="mb-3 block font-body text-sm font-semibold uppercase tracking-[0.2em] text-oro">
            Encuéntranos
          </span>
          <h1 className="font-display text-4xl font-bold tracking-tight text-tinta sm:text-5xl lg:text-6xl">
            Nuestras sedes
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-tinta/75 md:text-xl">
            Visítanos en cualquiera de nuestras ubicaciones. Estamos cerca para
            acompañarte cuando más lo necesites.
          </p>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-oro"></div>
        </div>
      </section>

      {/* Listado de sedes */}
      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-4">
          <ListaSedes />
        </div>
      </section>
    </>
  );
}