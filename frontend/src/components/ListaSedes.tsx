import { getBranches } from "@/lib/api";
import type { Branch } from "@/lib/types";

function TarjetaSede({ sede }: { sede: Branch }) {
  const maps = `https://www.google.com/maps/search/?api=1&query=${sede.latitude},${sede.longitude}`;

  return (
    <article className="rounded-lg border border-gris-claro p-6">
      <h3 className="font-display text-xl text-tinta">{sede.name}</h3>
      <p className="mt-2 text-sm text-gris">{sede.address}</p>
      <p className="text-sm text-gris">
        {sede.city}, {sede.department}
      </p>
      <p className="mt-3 text-sm">Tel: {sede.contactPhone}</p>
      {sede.contactEmail && <p className="text-sm">{sede.contactEmail}</p>}
      <a
        href={maps}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block text-oro hover:underline"
      >
        Ver en mapa →
      </a>
    </article>
  );
}

export default async function ListaSedes() {
  let sedes: Branch[] = [];
  let error = false;

  try {
    sedes = await getBranches();
  } catch {
    error = true;
  }

  if (error) {
    return (
      <p className="rounded-md bg-crema/50 p-4 text-center text-tinta">
        No pudimos cargar las sedes en este momento.
      </p>
    );
  }

  if (sedes.length === 0) {
    return (
      <p className="p-4 text-center text-gris">Aún no hay sedes registradas.</p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {sedes.map((s) => (
        <TarjetaSede key={s.id} sede={s} />
      ))}
    </div>
  );
}
