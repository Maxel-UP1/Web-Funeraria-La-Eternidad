import Link from "next/link";
import SliderPrincipal from "@/components/SliderPrincipal";

// Iconos SVG inline para las tarjetas de características (sin dependencias externas)
const Icono24 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconoServicios = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
  </svg>
);

const IconoCorazon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

export default async function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-tinta to-tinta/90 text-white">
        {/* Textura de fondo sutil para dar profundidad (opcional) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(191,159,98,0.15),transparent_50%)]"></div>
        <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-0 text-center">
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Acompañamos a tu familia
            <span className="block text-oro">con respeto y dignidad</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl font-body text-lg text-crema/80 md:text-xl">
            Servicios funerarios integrales con la calidez y profesionalismo que tu familia merece.
          </p>

          <div className="mt-10 mb-12">
            <SliderPrincipal />
          </div>

          <div className="flex flex-wrap justify-center gap-4 pb-16">
            <Link
              href="/servicios"
              className="group inline-flex items-center rounded-full border-2 border-oro bg-transparent px-8 py-3 font-body font-semibold text-white transition-all duration-300 hover:bg-oro hover:text-tinta hover:shadow-lg hover:shadow-oro/30 active:scale-95"
            >
              Ver servicios
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center rounded-full border border-white/30 px-8 py-3 font-body font-semibold text-white transition-all duration-300 hover:bg-white/10 hover:border-white/50 active:scale-95"
            >
              Contáctanos
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Características (tarjetas con iconos) */}
      <section className="relative bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 sm:grid-cols-3">
            {/* Tarjeta 1 */}
            <div className="group rounded-2xl border border-gris-claro bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-oro/10">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-oro/10 text-oro group-hover:bg-oro group-hover:text-white transition-colors duration-300">
                <Icono24 />
              </div>
              <h3 className="font-display text-xl font-semibold text-tinta">Atención 24/7</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-tinta/70">
                Estamos disponibles en todo momento para acompañarte.
              </p>
            </div>

            {/* Tarjeta 2 */}
            <div className="group rounded-2xl border border-gris-claro bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-oro/10">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-oro/10 text-oro group-hover:bg-oro group-hover:text-white transition-colors duration-300">
                <IconoServicios />
              </div>
              <h3 className="font-display text-xl font-semibold text-tinta">Servicios completos</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-tinta/70">
                Planes funerarios, salas de velación y arreglos florales.
              </p>
            </div>

            {/* Tarjeta 3 */}
            <div className="group rounded-2xl border border-gris-claro bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-oro/10">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-oro/10 text-oro group-hover:bg-oro group-hover:text-white transition-colors duration-300">
                <IconoCorazon />
              </div>
              <h3 className="font-display text-xl font-semibold text-tinta">Trato humano</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-tinta/70">
                Cada familia recibe un acompañamiento cercano y respetuoso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mapa + Descripción instalaciones */}
      <section id="mapa" className="bg-crema/20 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            {/* Mapa */}
            <div className="group rounded-2xl overflow-hidden shadow-lg border border-gris-claro transition-shadow duration-300 hover:shadow-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.5518698547437!2d-73.03914672398516!3d5.827690094153926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e6a3f0b1147c72b%3A0x8a04461a8b71714e!2sORGANIZACION%20CASA%20FUNERARIA%20LA%20ETERNIDAD!5e0!3m2!1ses!2sco!4v1717550000000!5m2!1ses!2sco"
                width="100%"
                height="320"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de la sede principal en Duitama"
                className="w-full h-auto min-h-[280px]"
              ></iframe>
            </div>
            {/* Descripción de las salas */}
            <div className="space-y-5 text-tinta">
              <span className="mb-2 inline-block font-body text-sm font-semibold uppercase tracking-[0.2em] text-oro">
                Nuestra sede principal
              </span>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                Instalaciones pensadas para ti
              </h2>
              <p className="text-tinta/80 leading-relaxed">
                Contamos con <strong className="text-oro">tres amplias salas de velación</strong>, diseñadas
                para brindar privacidad y calidez a las familias. Una de ellas es{" "}
                <strong className="text-oro">VIP</strong>, con acabados de lujo y mayor capacidad, ideal
                para homenajes especiales.
              </p>
              <p className="text-tinta/80 leading-relaxed">
                Todas nuestras sedes han sido pensadas para ofrecer un ambiente sereno y
                acogedor, con todos los servicios necesarios para acompañar a tus seres queridos en su
                despedida.
              </p>
              <p className="text-sm font-medium text-gris">
                <span className="text-tinta">📍 Cra. 14 #1251, Duitama, Boyacá.</span>
              </p>
              <div className="pt-2">
                <Link
                  href="/sedes"
                  className="group inline-flex items-center rounded-full bg-oro px-7 py-3 font-body font-semibold text-tinta transition-all duration-300 hover:bg-oro-fuerte hover:shadow-lg hover:shadow-oro/30 active:scale-95"
                >
                  Conoce nuestras sedes
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final: dos columnas */}
      <section className="bg-tinta text-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid md:grid-cols-[1fr_1px_1fr] gap-0 items-center">
            {/* Columna izquierda */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left px-8 py-6">
              <span className="block w-12 h-0.5 bg-oro mb-6"></span>
              <h2 className="font-display text-2xl font-semibold leading-tight sm:text-3xl">
                ¿Necesitas ayuda ahora?
              </h2>
              <p className="mt-4 max-w-xs text-crema/80">
                Estamos disponibles para acompañarte. Escríbenos y te responderemos lo antes posible.
              </p>
              <Link
                href="/contacto"
                className="mt-8 inline-flex items-center rounded-full border-2 border-oro bg-transparent px-7 py-3 font-body font-semibold text-white transition-all duration-300 hover:bg-oro hover:text-tinta hover:shadow-lg hover:shadow-oro/30 active:scale-95"
              >
                Ir a contacto
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            {/* Divisor vertical */}
            <div className="hidden md:block self-stretch bg-white/15 w-px"></div>

            {/* Columna derecha */}
            <div className="flex flex-col items-center md:items-end text-center md:text-right px-8 py-6 border-t border-white/10 md:border-t-0">
              <span className="block w-12 h-0.5 bg-oro mb-6"></span>
              <h2 className="font-display text-2xl font-semibold leading-tight sm:text-3xl">
                Conócenos
              </h2>
              <p className="mt-4 max-w-xs text-crema/80">
                Descubre nuestra historia, misión y los valores que guían cada servicio que brindamos.
              </p>
              <Link
                href="/quienes-somos"
                className="mt-8 inline-flex items-center rounded-full border border-white/30 px-7 py-3 font-body font-semibold text-white transition-all duration-300 hover:bg-white/10 hover:border-white/50 active:scale-95"
              >
                Quiénes somos
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}