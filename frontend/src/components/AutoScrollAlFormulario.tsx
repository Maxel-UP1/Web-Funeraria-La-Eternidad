"use client";

import { useEffect } from "react";

type Props = {
  /** id del elemento destino al que se desplaza la vista */
  targetId: string;
  /** retraso en milisegundos antes de desplazarse */
  delayMs?: number;
};

/**
 * Tras un retraso, desplaza la vista hasta el formulario. Respeta la
 * preferencia de movimiento reducido del sistema y no actúa si el visitante
 * ya hizo scroll por su cuenta, para no arrebatarle el control.
 */
export default function AutoScrollAlFormulario({
  targetId,
  delayMs = 3000,
}: Props) {
  useEffect(() => {
    const prefiereMenosMovimiento = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const cancelarPorInteraccion = () => {
      window.clearTimeout(temporizador);
    };

    const temporizador = window.setTimeout(() => {
      const destino = document.getElementById(targetId);
      if (!destino) return;
      destino.scrollIntoView({
        behavior: prefiereMenosMovimiento ? "auto" : "smooth",
        block: "start",
      });
    }, delayMs);

    window.addEventListener("wheel", cancelarPorInteraccion, { passive: true });
    window.addEventListener("touchmove", cancelarPorInteraccion, {
      passive: true,
    });

    return () => {
      window.clearTimeout(temporizador);
      window.removeEventListener("wheel", cancelarPorInteraccion);
      window.removeEventListener("touchmove", cancelarPorInteraccion);
    };
  }, [targetId, delayMs]);

  return null;
}
