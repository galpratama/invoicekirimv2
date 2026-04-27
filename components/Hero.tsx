export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl gap-16 px-6 pt-20 pb-24 md:grid-cols-2 md:items-center md:gap-12 md:pt-28 md:pb-32">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-bg-soft px-3 py-1 text-xs font-medium tracking-wide text-ink-soft uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Untuk Freelancer & UKM
          </span>

          <h1 className="mt-6 font-display text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl lg:text-7xl">
            Bikin invoice{" "}
            <em className="font-light italic text-brand">profesional</em> dalam
            30 detik.
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
            Nggak perlu Excel, nggak perlu template ribet. Isi form, klik
            kirim, selesai.
          </p>

          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <a
              href="#daftar"
              className="rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-bg shadow-sm transition hover:bg-brand"
            >
              Mulai Gratis — Tanpa Kartu Kredit
            </a>
            <span className="text-sm text-muted">
              Setup &lt; 2 menit · Bahasa Indonesia
            </span>
          </div>
        </div>

        <div className="relative">
          <HeroMockup />
        </div>
      </div>
    </section>
  );
}

function HeroMockup() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-bg-soft" />

      <div className="rounded-2xl border border-line bg-surface p-6 shadow-[0_30px_60px_-20px_rgba(42,31,23,0.15)]">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <p className="font-display text-xl font-medium text-ink">
              Invoice #INV-024
            </p>
            <p className="mt-1 text-xs text-muted">Jatuh tempo 30 Apr 2026</p>
          </div>
          <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand">
            Terkirim
          </span>
        </div>

        <div className="mt-5 space-y-3 text-sm">
          <Row label="Klien" value="PT Senja Kreatif" />
          <Row label="Proyek" value="Branding Package" />
          <div className="my-4 border-t border-dashed border-line" />
          <Row label="Subtotal" value="Rp 12.000.000" />
          <Row label="PPN 11%" value="Rp 1.320.000" muted />
        </div>

        <div className="mt-5 flex items-end justify-between border-t border-line pt-4">
          <span className="text-xs tracking-wide text-muted uppercase">
            Total Tagihan
          </span>
          <span className="font-display text-2xl font-medium text-ink">
            Rp 13.320.000
          </span>
        </div>

        <button
          type="button"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3 text-sm font-medium text-bg transition hover:bg-brand"
        >
          Salin Link Invoice
          <span aria-hidden>→</span>
        </button>
      </div>

      <div className="absolute -right-4 -bottom-6 hidden rounded-xl border border-line bg-surface px-4 py-3 shadow-md sm:block">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-brand">
            ✓
          </span>
          <div>
            <p className="text-xs text-muted">Pembayaran masuk</p>
            <p className="text-sm font-medium text-ink">2 menit lalu</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted">{label}</span>
      <span className={muted ? "text-ink-soft" : "text-ink"}>{value}</span>
    </div>
  );
}
