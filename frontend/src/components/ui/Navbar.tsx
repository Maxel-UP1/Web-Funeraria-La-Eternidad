import Image from "next/image";
import Link from "next/link";

const enlaces = [
  { href: "/", label: "Inicio" },
  { href: "/quienes-somos", label: "Quiénes somos" },
  { href: "/servicios", label: "Servicios" },
  { href: "/productos", label: "Productos" },
  { href: "/sedes", label: "Sedes" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gris-claro bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center">
          <Image
            src="/logoPrincipal.png"
            alt="Casa Funeraria La Eternidad"
            width={402}
            height={157}
            priority
            className="h-12 w-auto"
          />
        </Link>

        <ul className="hidden gap-6 text-sm sm:flex">
          {enlaces.map((e) => (
            <li key={e.href}>
              <Link
                href={e.href}
                className="text-tinta transition-colors hover:text-oro"
              >
                {e.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
