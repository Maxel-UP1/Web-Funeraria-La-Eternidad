"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const imagenes = [
  { src: "/img_sliderPrincipal/manos1.png", alt: "Conoce nuestros servicios", href: "/servicios" },
  { src: "/img_sliderPrincipal/bosque2.png", alt: "Bosque de paz y eternidad, conoce nuestra cobertura", href: "/#mapa" },
  { src: "/img_sliderPrincipal/insta3.png", alt: "Momento de recogimiento y recuerdo", href: "/sedes" },
  { src: "/img_sliderPrincipal/manosFinal4.png", alt: "Contáctanos", href: "/contacto" },
];

const INTERVALO_MS = 4000; // 4 segundos

export default function SliderPrincipal() {
  const [indiceActivo, setIndiceActivo] = useState(0);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    if (pausado) return;
    const intervalo = setInterval(() => {
      setIndiceActivo((prev) => (prev + 1) % imagenes.length);
    }, INTERVALO_MS);
    return () => clearInterval(intervalo);
  }, [pausado]);

  return (
    <div className="w-full" onMouseEnter={() => setPausado(true)} onMouseLeave={() => setPausado(false)}>
      {/* Contenedor del carrusel */}
      <div className="relative overflow-hidden rounded-2xl shadow-xl">
        <div
          className="relative aspect-[16/9] w-full transition-opacity duration-700 ease-in-out"
          aria-live="polite"
        >
          {imagenes.map((img, idx) => (
            <div
              key={img.src}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${idx === indiceActivo ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
            >
              <Link
                href={img.href}
                className="block w-full h-full relative group"
                aria-label={img.alt}
                scroll={true}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 1200px"
                  className="object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
                  priority
                />
                {/* Overlay hint al hover */}
                <span className="absolute inset-0 flex items-end justify-center pb-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <span className="rounded-full bg-oro/90 px-5 py-2 font-body text-sm font-semibold text-tinta shadow-lg">
                    {img.alt}
                  </span>
                </span>
              </Link>
            </div>
          ))}
        </div>

        {/* Indicadores (puntos) */}
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
          {imagenes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setIndiceActivo(idx)}
              className={`h-2 w-2 rounded-full transition-all ${idx === indiceActivo ? "bg-oro w-4" : "bg-white/60 hover:bg-white/90"
                }`}
              aria-label={`Ir a imagen ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
