export function CTA() {
  return (
    <section id="daftar" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <div className="relative overflow-hidden rounded-3xl border border-line bg-surface px-8 py-16 text-center md:px-16 md:py-24">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_var(--color-brand-soft),_transparent_60%)]"
        />

        <h2 className="mx-auto max-w-2xl font-display text-4xl leading-tight tracking-tight text-ink md:text-6xl">
          Mulai bikin invoice{" "}
          <em className="font-light italic text-brand">sekarang</em>.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-ink-soft">
          Gratis selamanya untuk 5 invoice per bulan. Upgrade kapan-kapan.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#"
            className="rounded-full bg-ink px-8 py-4 text-sm font-medium text-bg transition hover:bg-brand"
          >
            Daftar Gratis
          </a>
          <a
            href="#fitur"
            className="rounded-full px-6 py-4 text-sm font-medium text-ink-soft transition hover:text-ink"
          >
            Lihat fitur lengkap →
          </a>
        </div>
      </div>
    </section>
  );
}
