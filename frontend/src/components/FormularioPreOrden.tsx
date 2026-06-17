"use client";

import { useId, useRef, useState, useTransition } from "react";
import {
  solicitarPorWhatsApp,
  type PreOrdenState,
} from "@/app/producto/[id]/actions";

type Campo = "customerName" | "customerPhone" | "customerEmail" | "quantity";

const LIMITES = { name: 120, phone: 25, email: 254 } as const;
const CANTIDAD_MAX = 99;
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORMATO_TEL = /^[+\d\s]+$/;

const VALORES_VACIOS = {
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  quantity: "1",
};

// Mismo guardia que el servidor: solo se navega a un host oficial de WhatsApp.
function esEnlaceWhatsApp(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      u.protocol === "https:" &&
      (u.hostname === "wa.me" || u.hostname === "api.whatsapp.com")
    );
  } catch {
    return false;
  }
}

const claseControl =
  "w-full rounded-md border border-gris-claro bg-white px-3 py-2 text-tinta " +
  "placeholder:text-gris transition-colors focus:border-oro focus:outline-none " +
  "focus:ring-2 focus:ring-oro/40 disabled:opacity-60";

function claseError(hayError: boolean) {
  return hayError
    ? "border-red-600 focus:border-red-600 focus:ring-red-600/30"
    : "";
}

export default function FormularioPreOrden({
  productId,
}: {
  productId: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const baseId = useId();
  const [valores, setValores] = useState(VALORES_VACIOS);
  const [errores, setErrores] = useState<Partial<Record<Campo, string>>>({});
  const [estado, setEstado] = useState<"idle" | "success" | "error">("idle");
  const [mensajeGeneral, setMensajeGeneral] = useState("");
  const [waLink, setWaLink] = useState<string | null>(null);
  const [enviando, startTransition] = useTransition();

  function validar(): Partial<Record<Campo, string>> {
    const e: Partial<Record<Campo, string>> = {};
    const name = valores.customerName.trim();
    const phone = valores.customerPhone.trim();
    const email = valores.customerEmail.trim();
    const digitos = phone.replace(/\D/g, "");

    if (name.length < 2) e.customerName = "Ingresa tu nombre.";
    else if (name.length > LIMITES.name)
      e.customerName = `Máximo ${LIMITES.name} caracteres.`;

    if (!phone) e.customerPhone = "Ingresa un teléfono de contacto.";
    else if (
      !FORMATO_TEL.test(phone) ||
      phone.length > LIMITES.phone ||
      digitos.length < 7 ||
      digitos.length > 15
    )
      e.customerPhone = "El teléfono no parece válido.";

    if (email && (email.length > LIMITES.email || !FORMATO_EMAIL.test(email)))
      e.customerEmail = "El correo no tiene un formato válido.";

    const cantidad = Number(valores.quantity);
    if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > CANTIDAD_MAX)
      e.quantity = `Indica una cantidad entre 1 y ${CANTIDAD_MAX}.`;

    return e;
  }

  function actualizar(campo: Campo, valor: string) {
    setValores((v) => ({ ...v, [campo]: valor }));
    if (errores[campo]) setErrores((e) => ({ ...e, [campo]: undefined }));
  }

  function abrirWhatsApp(url: string) {
    // El popup puede quedar bloqueado al no abrirse dentro del gesto directo del
    // usuario; por eso el estado de éxito también ofrece un enlace manual.
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function manejarEnvio(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (enviando) return;

    setEstado("idle");
    setMensajeGeneral("");

    const validacion = validar();
    if (Object.keys(validacion).length > 0) {
      setErrores(validacion);
      return;
    }
    setErrores({});

    const formData = new FormData(ev.currentTarget);
    startTransition(async () => {
      const res: PreOrdenState = await solicitarPorWhatsApp(formData);

      if (res.status === "success" && res.waLink && esEnlaceWhatsApp(res.waLink)) {
        setWaLink(res.waLink);
        setEstado("success");
        abrirWhatsApp(res.waLink);
        return;
      }

      if (res.errors) setErrores(res.errors);
      setEstado("error");
      setMensajeGeneral(
        res.message ?? "Revisa los campos marcados e inténtalo de nuevo.",
      );
    });
  }

  if (estado === "success" && waLink) {
    return (
      <div
        role="status"
        className="rounded-lg border border-oro/40 bg-crema/40 p-6 text-tinta"
      >
        <p className="font-display text-xl">Hemos registrado tu solicitud.</p>
        <p className="mt-2 text-sm text-gris">
          Te estamos llevando a WhatsApp para continuar la conversación. Si no se
          abre automáticamente, usa el siguiente botón.
        </p>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center rounded-md bg-[#25D366] px-5 py-2.5 font-medium text-white transition-colors hover:bg-[#1ebe57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
        >
          Abrir WhatsApp
        </a>
      </div>
    );
  }

  const idDe = (campo: Campo) => `${baseId}-${campo}`;
  const idError = (campo: Campo) => `${baseId}-${campo}-error`;

  return (
    <form ref={formRef} onSubmit={manejarEnvio} noValidate className="relative space-y-5">
      {/* Señuelo anti-spam: fuera de pantalla y excluido del foco y de lectores. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor={`${baseId}-empresa`}>No completar este campo</label>
        <input
          id={`${baseId}-empresa`}
          name="empresa"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <input type="hidden" name="productId" value={productId} />

      <div>
        <label htmlFor={idDe("customerName")} className="block text-sm font-medium text-tinta">
          Nombre <span className="text-oro" aria-hidden="true">*</span>
        </label>
        <input
          id={idDe("customerName")}
          name="customerName"
          type="text"
          required
          aria-required="true"
          maxLength={LIMITES.name}
          autoComplete="name"
          value={valores.customerName}
          onChange={(e) => actualizar("customerName", e.target.value)}
          aria-invalid={errores.customerName ? true : undefined}
          aria-describedby={errores.customerName ? idError("customerName") : undefined}
          className={`mt-1 ${claseControl} ${claseError(!!errores.customerName)}`}
        />
        {errores.customerName && (
          <p id={idError("customerName")} className="mt-1 text-sm text-red-700">
            {errores.customerName}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={idDe("customerPhone")} className="block text-sm font-medium text-tinta">
            Teléfono <span className="text-oro" aria-hidden="true">*</span>
          </label>
          <input
            id={idDe("customerPhone")}
            name="customerPhone"
            type="tel"
            inputMode="tel"
            required
            aria-required="true"
            maxLength={LIMITES.phone}
            autoComplete="tel"
            value={valores.customerPhone}
            onChange={(e) => actualizar("customerPhone", e.target.value)}
            aria-invalid={errores.customerPhone ? true : undefined}
            aria-describedby={errores.customerPhone ? idError("customerPhone") : undefined}
            className={`mt-1 ${claseControl} ${claseError(!!errores.customerPhone)}`}
          />
          {errores.customerPhone && (
            <p id={idError("customerPhone")} className="mt-1 text-sm text-red-700">
              {errores.customerPhone}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={idDe("quantity")} className="block text-sm font-medium text-tinta">
            Cantidad
          </label>
          <input
            id={idDe("quantity")}
            name="quantity"
            type="number"
            inputMode="numeric"
            min={1}
            max={CANTIDAD_MAX}
            step={1}
            value={valores.quantity}
            onChange={(e) => actualizar("quantity", e.target.value)}
            aria-invalid={errores.quantity ? true : undefined}
            aria-describedby={errores.quantity ? idError("quantity") : undefined}
            className={`mt-1 ${claseControl} ${claseError(!!errores.quantity)}`}
          />
          {errores.quantity && (
            <p id={idError("quantity")} className="mt-1 text-sm text-red-700">
              {errores.quantity}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor={idDe("customerEmail")} className="block text-sm font-medium text-tinta">
          Correo
        </label>
        <input
          id={idDe("customerEmail")}
          name="customerEmail"
          type="email"
          inputMode="email"
          maxLength={LIMITES.email}
          autoComplete="email"
          value={valores.customerEmail}
          onChange={(e) => actualizar("customerEmail", e.target.value)}
          aria-invalid={errores.customerEmail ? true : undefined}
          aria-describedby={errores.customerEmail ? idError("customerEmail") : undefined}
          className={`mt-1 ${claseControl} ${claseError(!!errores.customerEmail)}`}
        />
        {errores.customerEmail && (
          <p id={idError("customerEmail")} className="mt-1 text-sm text-red-700">
            {errores.customerEmail}
          </p>
        )}
      </div>

      {estado === "error" && mensajeGeneral && (
        <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {mensajeGeneral}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="rounded-md bg-oro px-6 py-3 font-medium text-tinta transition-colors hover:bg-oro-fuerte focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oro focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {enviando ? "Enviando…" : "Solicitar por WhatsApp"}
      </button>

      <p className="text-xs text-gris">
        Al continuar abrirás una conversación de WhatsApp con un mensaje
        prellenado. No realizamos cobros en línea.
      </p>
    </form>
  );
}
