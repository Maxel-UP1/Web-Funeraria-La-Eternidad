"use client";

import { useId, useRef, useState, useTransition } from "react";
import { enviarConsulta, type ContactFormState } from "@/app/contacto/actions";

type Campo = "name" | "email" | "phone" | "message";

const LIMITES = { name: 120, email: 254, phone: 25, message: 2000 } as const;
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VALORES_VACIOS: Record<Campo, string> = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

const claseControl =
  "w-full rounded-md border border-gris-claro bg-white px-3 py-2 text-tinta " +
  "placeholder:text-gris transition-colors focus:border-oro focus:outline-none " +
  "focus:ring-2 focus:ring-oro/40 disabled:opacity-60";

export default function FormularioContacto() {
  const formRef = useRef<HTMLFormElement>(null);
  const baseId = useId();
  const [valores, setValores] = useState<Record<Campo, string>>(VALORES_VACIOS);
  const [errores, setErrores] = useState<Partial<Record<Campo, string>>>({});
  const [estado, setEstado] = useState<"idle" | "success" | "error">("idle");
  const [mensajeGeneral, setMensajeGeneral] = useState("");
  const [enviando, startTransition] = useTransition();

  function validar(): Partial<Record<Campo, string>> {
    const e: Partial<Record<Campo, string>> = {};
    const name = valores.name.trim();
    const email = valores.email.trim();
    const phone = valores.phone.trim();
    const message = valores.message.trim();

    if (name.length < 2) e.name = "Ingresa tu nombre.";
    else if (name.length > LIMITES.name)
      e.name = `Máximo ${LIMITES.name} caracteres.`;

    if (message.length < 5) e.message = "Cuéntanos brevemente tu consulta.";
    else if (message.length > LIMITES.message)
      e.message = `Máximo ${LIMITES.message} caracteres.`;

    if (email && (email.length > LIMITES.email || !FORMATO_EMAIL.test(email)))
      e.email = "El correo no tiene un formato válido.";

    if (phone && (phone.length > LIMITES.phone || phone.replace(/\D/g, "").length < 7))
      e.phone = "El teléfono no parece válido.";

    return e;
  }

  function actualizar(campo: Campo, valor: string) {
    setValores((v) => ({ ...v, [campo]: valor }));
    if (errores[campo]) setErrores((e) => ({ ...e, [campo]: undefined }));
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
      const res: ContactFormState = await enviarConsulta(formData);
      if (res.status === "success") {
        setEstado("success");
        setValores(VALORES_VACIOS);
        formRef.current?.reset();
        return;
      }
      if (res.errors) setErrores(res.errors);
      setEstado("error");
      setMensajeGeneral(res.message ?? "Revisa los campos marcados.");
    });
  }

  if (estado === "success") {
    return (
      <div
        role="status"
        className="rounded-lg border border-oro/40 bg-crema/40 p-6 text-tinta"
      >
        <p className="font-display text-xl">Gracias por escribirnos.</p>
        <p className="mt-2 text-sm text-gris">
          Hemos recibido tu consulta y te responderemos lo antes posible.
        </p>
        <button
          type="button"
          onClick={() => setEstado("idle")}
          className="mt-4 rounded text-sm text-oro underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oro"
        >
          Enviar otra consulta
        </button>
      </div>
    );
  }

  const idDe = (campo: Campo) => `${baseId}-${campo}`;
  const idError = (campo: Campo) => `${baseId}-${campo}-error`;

  return (
    <form
      ref={formRef}
      onSubmit={manejarEnvio}
      noValidate
      className="relative space-y-5"
    >
      {/* Señuelo anti-spam: fuera de pantalla y excluido del foco y de lectores. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor={idDe("name") + "-empresa"}>No completar este campo</label>
        <input
          id={idDe("name") + "-empresa"}
          name="empresa"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor={idDe("name")} className="block text-sm font-medium text-tinta">
          Nombre <span className="text-oro" aria-hidden="true">*</span>
        </label>
        <input
          id={idDe("name")}
          name="name"
          type="text"
          required
          aria-required="true"
          maxLength={LIMITES.name}
          autoComplete="name"
          value={valores.name}
          onChange={(e) => actualizar("name", e.target.value)}
          aria-invalid={errores.name ? true : undefined}
          aria-describedby={errores.name ? idError("name") : undefined}
          className={`mt-1 ${claseControl} ${errores.name ? "border-red-600 focus:border-red-600 focus:ring-red-600/30" : ""}`}
        />
        {errores.name && (
          <p id={idError("name")} className="mt-1 text-sm text-red-700">
            {errores.name}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={idDe("email")} className="block text-sm font-medium text-tinta">
            Correo
          </label>
          <input
            id={idDe("email")}
            name="email"
            type="email"
            inputMode="email"
            maxLength={LIMITES.email}
            autoComplete="email"
            value={valores.email}
            onChange={(e) => actualizar("email", e.target.value)}
            aria-invalid={errores.email ? true : undefined}
            aria-describedby={errores.email ? idError("email") : undefined}
            className={`mt-1 ${claseControl} ${errores.email ? "border-red-600 focus:border-red-600 focus:ring-red-600/30" : ""}`}
          />
          {errores.email && (
            <p id={idError("email")} className="mt-1 text-sm text-red-700">
              {errores.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={idDe("phone")} className="block text-sm font-medium text-tinta">
            Teléfono
          </label>
          <input
            id={idDe("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            maxLength={LIMITES.phone}
            autoComplete="tel"
            value={valores.phone}
            onChange={(e) => actualizar("phone", e.target.value)}
            aria-invalid={errores.phone ? true : undefined}
            aria-describedby={errores.phone ? idError("phone") : undefined}
            className={`mt-1 ${claseControl} ${errores.phone ? "border-red-600 focus:border-red-600 focus:ring-red-600/30" : ""}`}
          />
          {errores.phone && (
            <p id={idError("phone")} className="mt-1 text-sm text-red-700">
              {errores.phone}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor={idDe("message")} className="block text-sm font-medium text-tinta">
          Mensaje <span className="text-oro" aria-hidden="true">*</span>
        </label>
        <textarea
          id={idDe("message")}
          name="message"
          required
          aria-required="true"
          rows={6}
          maxLength={LIMITES.message}
          value={valores.message}
          onChange={(e) => actualizar("message", e.target.value)}
          aria-invalid={errores.message ? true : undefined}
          aria-describedby={errores.message ? idError("message") : undefined}
          className={`mt-1 resize-y ${claseControl} ${errores.message ? "border-red-600 focus:border-red-600 focus:ring-red-600/30" : ""}`}
        />
        <div className="mt-1 flex items-start justify-between gap-3">
          {errores.message ? (
            <p id={idError("message")} className="text-sm text-red-700">
              {errores.message}
            </p>
          ) : (
            <span />
          )}
          <span className="shrink-0 text-xs text-gris" aria-hidden="true">
            {valores.message.length}/{LIMITES.message}
          </span>
        </div>
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
        {enviando ? "Enviando…" : "Enviar consulta"}
      </button>
    </form>
  );
}
