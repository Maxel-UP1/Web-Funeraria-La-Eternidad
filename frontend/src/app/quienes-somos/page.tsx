import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quiénes somos | Casa Funeraria La Eternidad",
  description:
    "Conoce nuestra historia, misión y valores. Acompañamos a las familias con respeto, dignidad y calidez humana.",
};

// Iconos inline para mantener la estética sin dependencias externas
const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
    />
  </svg>
);

const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
    />
  </svg>
);

export default function QuienesSomosPage() {
  return (
    <div className="bg-white">
      {/* Hero con imagen de fondo nubes.jpg */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden md:h-[80vh]">
        <Image
          src="/img_quienesSomos/nubes.jpg"
          alt="Cielo azul con nube blanca y logo de La Eternidad"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Overlay sutil para mejorar la legibilidad del texto */}
        <div className="absolute inset-0 bg-tinta/20"></div>
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
          <h1 className="font-display text-oro text-5xl font-bold drop-shadow-lg md:text-7xl">
            Quiénes somos
          </h1>
          {/* Spacer to avoid colliding with background logo */}
          <div className="h-36 md:h-52" aria-hidden="true"></div>
          <p className="max-w-3xl font-body text-xl leading-relaxed text-crema/90 drop-shadow md:text-2xl">
            En{" "}
            {/*  <strong className="font-semibold text-oro-fuerte"></strong> */}
            <strong className="font-semibold text-tinta">
              Casa Funeraria La Eternidad
            </strong>{" "}
            entendemos que la despedida de un ser querido es uno de los momentos
            más delicados de la vida.
          </p>
          <div className="mt-8 h-1 w-20 rounded-full bg-oro"></div>
        </div>
      </section>

      {/* Nuestra razón de ser (experiencia) */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <span className="mb-4 block font-body text-sm font-semibold uppercase tracking-[0.2em] text-oro">
            Nuestra razón de ser
          </span>
          <h2 className="font-display text-4xl font-bold text-tinta md:text-5xl lg:text-6xl">
            Más de 15 años de experiencia
          </h2>
          <p className="mx-auto mt-6 max-w-3xl font-body text-lg leading-relaxed text-tinta/80 md:text-xl">
            Entregando excelentes servicios funerarios en el mercado nacional,
            con una red de atención inmediata a toda la comunidad residente en
            el centro y norte de Boyacá, sumándole la extensa provincia de
            García Rovira del departamento de Santander.
          </p>
        </div>
      </section>

      {/* Misión y Visión (imagen grande centrada) */}
      <section className="bg-crema/20 py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <span className="mb-3 block font-body text-sm font-semibold uppercase tracking-widest text-oro">
            Lo que nos guía
          </span>
          <h2 className="font-display text-3xl font-semibold text-tinta md:text-4xl">
            Misión y Visión
          </h2>
          <div className="mt-10 overflow-hidden rounded-2xl shadow-2xl shadow-oro/10">
            <Image
              src="/img_quienesSomos/misiyVisi.jpeg"
              alt="Misión y Visión de Casa Funeraria La Eternidad"
              width={1200}
              height={800}
              className="h-auto w-full object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* Valores (se mantiene igual) */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <span className="mb-3 block text-center font-body text-sm font-semibold uppercase tracking-widest text-oro">
            Lo que nos define
          </span>
          <h2 className="text-center font-display text-3xl font-semibold text-tinta md:text-4xl">
            Nuestros valores
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                titulo: "Respeto",
                descripcion:
                  "Honramos la memoria de cada persona y las creencias de cada familia.",
              },
              {
                titulo: "Dignidad",
                descripcion:
                  "Velamos por un trato justo y transparente en todos los servicios.",
              },
              {
                titulo: "Cercanía",
                descripcion:
                  "Acompañamos en cada paso del proceso, con escucha activa y apoyo continuo.",
              },
              {
                titulo: "Excelencia",
                descripcion:
                  "Contamos con instalaciones modernas y personal capacitado para ofrecer lo mejor.",
              },
            ].map((valor) => (
              <div
                key={valor.titulo}
                className="group rounded-xl border border-gris-claro bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-oro/10"
              >
                <h3 className="font-display text-xl font-semibold text-oro">
                  {valor.titulo}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-tinta/75">
                  {valor.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nuestras instalaciones (simplificado, con CTA a sedes) */}
      <section className="bg-tinta py-20 text-center text-white">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-display text-4xl font-semibold md:text-5xl">
            Conócenos
          </h2>
          <p className="mt-4 font-body text-lg text-crema/80">
            Descubre nuestras sedes y encuentra el espacio más cercano para
            acompañarte.
          </p>
          <Link
            href="/sedes"
            className="mt-8 inline-block rounded-full bg-oro px-10 py-4 font-body text-lg font-semibold text-tinta transition-all duration-300 hover:bg-oro-fuerte hover:shadow-xl hover:shadow-oro/30"
          >
            Ver nuestras sedes
          </Link>
        </div>
      </section>

      {/* Contacto directo */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <span className="mb-3 inline-block font-body text-xl font-semibold uppercase tracking-widest text-oro">
            Hablemos
          </span>
          <h2 className="font-display text-3xl font-semibold text-tinta md:text-4xl">
            Contacto directo
          </h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-8 sm:flex-row flex-wrap">
            <a
              href="tel:3202345667"
              className="inline-flex items-center gap-3 rounded-full border border-oro/40 px-6 py-3 text-lg text-tinta transition-all duration-300 hover:border-oro hover:text-oro-fuerte hover:shadow-lg hover:shadow-oro/20"
            >
              <PhoneIcon />
              <span>320 234 5667</span>
            </a>
            <a
              href="tel:3138585851"
              className="inline-flex items-center gap-3 rounded-full border border-oro/40 px-6 py-3 text-lg text-tinta transition-all duration-300 hover:border-oro hover:text-oro-fuerte hover:shadow-lg hover:shadow-oro/20"
            >
              <PhoneIcon />
              <span>313 858 5851</span>
            </a>
            <a
              href="tel:3107598714"
              className="inline-flex items-center gap-3 rounded-full border border-oro/40 px-6 py-3 text-lg text-tinta transition-all duration-300 hover:border-oro hover:text-oro-fuerte hover:shadow-lg hover:shadow-oro/20"
            >
              <PhoneIcon />
              <span>310 759 8714</span>
            </a>
            <a
              href="mailto:organizacionlaeternidad@gmail.com"
              className="inline-flex items-center gap-3 rounded-full border border-oro/40 px-6 py-3 text-lg text-tinta transition-all duration-300 hover:border-oro hover:text-oro-fuerte hover:shadow-lg hover:shadow-oro/20"
            >
              <MailIcon />
              <span>organizacionlaeternidad@gmail.com</span>
            </a>
            <Link
              href="/contacto"
              className="inline-flex items-center rounded-full bg-oro px-8 py-3 font-body text-lg font-semibold text-tinta transition-all duration-300 hover:bg-oro-fuerte hover:shadow-xl hover:shadow-oro/30"
            >
              Formulario de contacto
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}