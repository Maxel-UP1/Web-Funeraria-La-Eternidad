import type { Metadata } from "next";
import Image from "next/image";
import FormularioContacto from "@/components/FormularioContacto";
import AutoScrollAlFormulario from "@/components/AutoScrollAlFormulario";
// Import estático: Next agrega un hash de contenido al nombre del archivo, así
// cada cambio de la imagen genera una URL nueva y el navegador nunca cachea la vieja.
import contactoImg from "../../../public/img_contacto/contacto.png";

export const metadata: Metadata = {
  title: "Contacto | Casa Funeraria La Eternidad",
  description:
    "Escríbenos para resolver tus dudas sobre servicios funerarios, planes y arreglos florales. Te acompañamos con respeto y dignidad.",
};

export default function ContactoPage() {
  return (
    <div className="w-full">
      {/* A los 5 s la vista baja sola de la imagen al formulario (salvo que el visitante ya haya hecho scroll) */}
      <AutoScrollAlFormulario targetId="formulario-contacto" delayMs={5000} />

      {/* Banner superior: manos.jpg de lado a lado — object-contain para no deformar la imagen cuadrada */}
      <div className="w-full overflow-hidden" style={{ backgroundColor: "#d6d0c8" }}>
        <Image
          src="/img_contacto/manos.jpeg"
          alt="Te amo y te amaré por toda La Eternidad - Casa Funeraria La Eternidad"
          width={1080}
          height={1080}
          priority
          sizes="100vw"
          //tamaño de la imagen manos
          className="w-full max-w-[1600px] h-auto max-h-[850px] object-contain mx-auto block"
          style={{ display: "block" }}
        />
      </div>

      {/* Sección inferior: imagen contacto.png a la izquierda, formulario a la derecha */}
      <div id="formulario-contacto" className="mx-auto max-w-6xl px-4 py-14 scroll-mt-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1fr] items-start">
          {/* Lado izquierdo: solo la imagen contacto.png (ya contiene la info de contacto) */}
          <aside>
            {/* object-contain + width/height reales: muestra toda la info sin recortarla */}
            <Image
              src={contactoImg}
              alt="Contáctanos - Casa Funeraria La Eternidad"
              sizes="(max-width: 1024px) 100vw, 640px"
              className="w-full h-auto rounded-3xl shadow-lg border border-gris-claro/20 object-contain transition-transform duration-500 hover:scale-105"
            />
          </aside>

          {/* Lado derecho: formulario */}
          <div>
            <FormularioContacto />
          </div>
        </div>
      </div>
    </div>
  );
}
