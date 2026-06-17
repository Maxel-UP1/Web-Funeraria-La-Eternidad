"use server";

import { createLead } from "@/lib/api";
import type { CreateLeadInput } from "@/lib/types";

type Campo = "name" | "email" | "phone" | "message";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<Campo, string>>;
};

// Mismos límites que el cliente: la validación se duplica, no se delega.
const LIMITES = { name: 120, email: 254, phone: 25, message: 2000 } as const;
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function texto(valor: FormDataEntryValue | null): string {
  return typeof valor === "string" ? valor.trim() : "";
}

export async function enviarConsulta(
  formData: FormData,
): Promise<ContactFormState> {
  // Honeypot: campo señuelo invisible para una persona. Si llega con contenido
  // proviene de un bot; se descarta sin tocar el backend y se responde como un
  // éxito normal para no delatar la trampa.
  if (texto(formData.get("empresa"))) {
    return { status: "success" };
  }

  const name = texto(formData.get("name"));
  const email = texto(formData.get("email"));
  const phone = texto(formData.get("phone"));
  const message = texto(formData.get("message"));

  const errors: NonNullable<ContactFormState["errors"]> = {};

  if (name.length < 2) errors.name = "Ingresa tu nombre.";
  else if (name.length > LIMITES.name)
    errors.name = `Máximo ${LIMITES.name} caracteres.`;

  if (message.length < 5) errors.message = "Cuéntanos brevemente tu consulta.";
  else if (message.length > LIMITES.message)
    errors.message = `Máximo ${LIMITES.message} caracteres.`;

  if (email && (email.length > LIMITES.email || !FORMATO_EMAIL.test(email)))
    errors.email = "El correo no tiene un formato válido.";

  // Solo se valida la forma; el visitante puede escribir el teléfono como prefiera.
  if (phone && (phone.length > LIMITES.phone || phone.replace(/\D/g, "").length < 7))
    errors.phone = "El teléfono no parece válido.";

  if (Object.keys(errors).length > 0) {
    return { status: "error", errors };
  }

  const payload: CreateLeadInput = {
    name,
    message,
    source: "website_contact_form",
    ...(phone ? { phone } : {}),
    ...(email ? { email } : {}),
  };

  try {
    await createLead(payload);
    return { status: "success" };
  } catch (error) {
    // No se filtra el detalle interno al visitante ni se registra PII en producción.
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "enviarConsulta: createLead falló:",
        error instanceof Error ? error.message : error,
      );
    }
    return {
      status: "error",
      message:
        "No pudimos enviar tu consulta en este momento. Inténtalo nuevamente más tarde.",
    };
  }
}
