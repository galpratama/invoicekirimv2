import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-bg/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-display text-xl font-medium tracking-tight text-ink"
        >
          Invoice<span className="text-brand">Kirim</span>
        </Link>

        <div className="hidden items-center gap-8 text-sm text-ink-soft md:flex">
          <a href="#fitur" className="transition hover:text-ink">
            Fitur
          </a>
          <a href="#harga" className="transition hover:text-ink">
            Harga
          </a>
          <a href="#login" className="transition hover:text-ink">
            Login
          </a>
        </div>

        <a
          href="#daftar"
          className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-bg transition hover:bg-brand"
        >
          Mulai Gratis
        </a>
      </nav>
    </header>
  );
}
