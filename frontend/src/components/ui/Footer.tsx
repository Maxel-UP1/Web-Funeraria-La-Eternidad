import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-tinta text-gris-claro">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <p className="font-display text-xl text-oro">La Eternidad</p>
          <p className="mt-2 text-sm text-gris">
            Acompañamos a las familias con respeto y dignidad.
          </p>
        </div>

        <div className="text-sm">
          <p className="mb-2 font-medium text-white">Contacto</p>
          <p>Tel: 320 234 5667</p>
          <p>Tel: 313 858 5851 · 310 759 8714</p>
          <p>organizacionlaeternidad@gmail.com</p>
        </div>

        <div className="text-sm">
          <p className="mb-2 font-medium text-white">Secciones</p>
          <ul className="space-y-1">
            <li><Link href="/servicios" className="hover:text-oro">Servicios</Link></li>
            <li><Link href="/productos" className="hover:text-oro">Productos</Link></li>
            <li><Link href="/sedes" className="hover:text-oro">Sedes</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-gris">
        © {new Date().getFullYear()} Casa Funeraria La Eternidad. Todos los derechos reservados.
      </div>
    </footer>
  );
}
