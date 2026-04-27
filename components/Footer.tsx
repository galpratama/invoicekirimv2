export function Footer() {
  return (
    <footer className="border-t border-line bg-bg">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-xl font-medium text-ink">
              Invoice<span className="text-brand">Kirim</span>
            </p>
            <p className="mt-2 max-w-xs text-sm text-muted">
              Tagihan beres, fokus balik ke kerjaan.
            </p>
          </div>

          <nav className="flex flex-wrap gap-6 text-sm text-ink-soft">
            <a href="#" className="transition hover:text-ink">
              Tentang
            </a>
            <a href="#" className="transition hover:text-ink">
              Kontak
            </a>
            <a href="#" className="transition hover:text-ink">
              Privacy Policy
            </a>
            <a href="#" className="transition hover:text-ink">
              Syarat & Ketentuan
            </a>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>© 2026 InvoiceKirim. Semua hak dilindungi.</p>
          <p>Dibuat di Indonesia.</p>
        </div>
      </div>
    </footer>
  );
}
