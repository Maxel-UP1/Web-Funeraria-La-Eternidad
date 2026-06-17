"use server";

import { createPreOrder } from "@/lib/api";
import type { CreatePreOrderInput } from "@/lib/types";

type Campo = "customerName" | "customerPhone" | "customerEmail" | "quantity";

export type PreOrdenState = {
  status: "idle" | "success" | "error";
  waLink?: string;
  message?: string;
  errors?: Partial<Record<Campo, string>>;
};

const LIMITES = { name: 120, phone: 25, email: 254 } as const;
const CANTIDAD_MAX = 99;
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORMATO_TEL = /^[+\d\s]+$/;
const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function texto(valor: FormDataEntryValue | null): string {
  return typeof valor === "string" ? valor.trim() : "";
}

// El backend ya arma el wa.me, pero se reverifica el host aquí (defensa en
// profundidad): nunca se devuelve al cliente un enlace que no sea de WhatsApp.
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

export async function solicitarPorWhatsApp(
  formData: FormData,
): Promise<PreOrdenState> {
  // Honeypot: campo señuelo invisible. Si llega con contenido es un bot; se
  // descarta sin tocar el backend y sin devolver enlace de WhatsApp.
  if (texto(formData.get("empresa"))) {
    return { status: "success" };
  }

  const productId = texto(formData.get("productId"));
  const customerName = texto(formData.get("customerName"));
  const customerPhone = texto(formData.get("customerPhone"));
  const customerEmail = texto(formData.get("customerEmail"));
  const cantidadCruda = texto(formData.get("quantity"));

  // productId no es editable por el visitante; si no es un UUID la petición es inválida.
  if (!UUID.test(productId)) {
    return {
      status: "error",
      message:
        "No pudimos identificar el producto. Recarga la página e inténtalo de nuevo.",
    };
  }

  const errors: NonNullable<PreOrdenState["errors"]> = {};

  if (customerName.length < 2) errors.customerName = "Ingresa tu nombre.";
  else if (customerName.length > LIMITES.name)
    errors.customerName = `Máximo ${LIMITES.name} caracteres.`;

  const digitos = customerPhone.replace(/\D/g, "");
  if (!customerPhone) errors.customerPhone = "Ingresa un teléfono de contacto.";
  else if (
    !FORMATO_TEL.test(customerPhone) ||
    customerPhone.length > LIMITES.phone ||
    digitos.length < 7 ||
    digitos.length > 15
  )
    errors.customerPhone = "El teléfono no parece válido.";

  if (
    customerEmail &&
    (customerEmail.length > LIMITES.email || !FORMATO_EMAIL.test(customerEmail))
  )
    errors.customerEmail = "El correo no tiene un formato válido.";

  const quantity = cantidadCruda ? Number(cantidadCruda) : 1;
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > CANTIDAD_MAX)
    errors.quantity = `Indica una cantidad entre 1 y ${CANTIDAD_MAX}.`;

  if (Object.keys(errors).length > 0) {
    return { status: "error", errors };
  }

  const payload: CreatePreOrderInput = {
    productId,
    customerName,
    customerPhone,
    quantity,
    ...(customerEmail ? { customerEmail } : {}),
  };

  try {
    const preOrden = await createPreOrder(payload);
    if (!preOrden.waLink || !esEnlaceWhatsApp(preOrden.waLink)) {
      return {
        status: "error",
        message:
          "No pudimos generar el enlace de WhatsApp. Inténtalo nuevamente más tarde.",
      };
    }
    return { status: "success", waLink: preOrden.waLink };
  } catch (error) {
    // No se registra PII ni el waLink (datos del cliente) en producción.
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "solicitarPorWhatsApp: createPreOrder falló:",
        error instanceof Error ? error.message : error,
      );
    }
    return {
      status: "error",
      message:
        "No pudimos procesar tu solicitud en este momento. Inténtalo nuevamente más tarde.",
    };
  }
}
