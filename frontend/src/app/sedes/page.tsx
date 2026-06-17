import ListaSedes from "@/components/ListaSedes";
import Image from "next/image";

export const metadata = { title: "Sedes | Casa Funeraria La Eternidad" };

export default function SedesPage() {
  return (
    <>
      {/* Hero */}
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

      {/* Sección 1: imagen izquierda + texto derecha */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            {/* Imagen */}
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <Image
                src="/img_sedes/secu.png"
                alt="Sede principal"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Texto */}
            <div className="space-y-4">
              <span className="inline-block font-body text-sm font-semibold uppercase tracking-[0.2em] text-oro">
                Cobertura y compromiso
              </span>
              <p className="text-lg leading-relaxed text-tinta/80">
                Nuestras siete sedes cuentan con salas de velación amplias,
                elegantes y confortables; un servicio amable e integral donde
                la comodidad y la paz interior sobresalen en nuestro entorno,
                con el único propósito de aligerar el abatimiento a los
                familiares en ese inevitable momento tan doloroso.
              </p>
              <p className="text-lg leading-relaxed text-tinta/80">
                Con la sede principal y el apoyo de nuestras demás sedes,
                estamos en capacidad de dar cubrimiento 100% a la zona centro,
                Norte de Boyacá y de la Provincia de García y Rovira en
                Santander.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 2: mapa grande centrado */}
      <section className="bg-crema/20 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center font-display text-3xl font-semibold text-tinta mb-8 md:text-4xl">
            Nuestra cobertura
          </h2>
          <div className="overflow-hidden rounded-2xl shadow-lg">
            <Image
              src="/img_sedes/mapa.png"
              alt="Mapa de cobertura de todas las sedes"
              width={1200}
              height={600}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Sección 3: texto izquierda + imagen derecha */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            {/* Texto (izquierda) */}
            <div className="order-2 md:order-1 space-y-4">
              <span className="inline-block font-body text-sm font-semibold uppercase tracking-[0.2em] text-oro">
                Infraestructura y talento humano
              </span>
              <p className="text-lg leading-relaxed text-tinta/80">
                Nuestra infraestructura moderna y talento humano calificado
                para atender a sus afiliados en estas situaciones adversas.
                Nuestra cobertura es dentro del territorio nacional, dando
                apoyo con amor a las familias en cualquier municipio del
                centro y norte de Boyacá y la provincia de García Rovira del
                departamento de Santander (sur de Santander).
              </p>
              <p className="text-lg leading-relaxed text-tinta/80">
                Garantizando servicios funerarios de calidad, coordinando
                integralmente: iniciales, finales, completos, traslados desde
                Boyacá o Santander a cualquier parte del país.
              </p>
            </div>
            {/* Imagen (derecha) */}
            <div className="order-1 md:order-2 overflow-hidden rounded-2xl shadow-lg">
              <Image
                src="/img_sedes/princi.png"
                alt="Infraestructura moderna"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Listado de sedes desde el backend */}
      <section className="bg-crema/20 pb-20 pt-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center font-display text-3xl font-semibold text-tinta mb-8 md:text-4xl">
            Nuestras ubicaciones
          </h2>
          <ListaSedes />
        </div>
      </section>
    </>
  );
}