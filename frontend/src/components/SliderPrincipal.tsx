"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const imagenes = [
  { src: "/img_sliderPrincipal/manos1.png", alt: "Manos entrelazadas en señal de acompañamiento" },
  { src: "/img_sliderPrincipal/bosque2.png", alt: "Bosque sereno que evoca paz y eternidad" },
  { src: "/img_sliderPrincipal/insta3.png", alt: "Momento de recogimiento y recuerdo" },
  { src: "/img_sliderPrincipal/manosFinal4.png", alt: "Último gesto de cariño y despedida" },
];

const INTERVALO_MS = 4000; // 4 segundos

export default function SliderPrincipal() {
  const [indiceActivo, setIndiceActivo] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndiceActivo((prev) => (prev + 1) % imagenes.length);
    }, INTERVALO_MS);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="w-full">
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
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-contain object-center"
                priority
              />
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
