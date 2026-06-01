import Link from "next/link";

export function Pricing({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  return (
    <section id="harga" className="border-y border-line bg-bg-soft/40">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium tracking-[0.2em] text-brand uppercase">
            Harga
          </p>
          <h2 className="mt-3 font-display text-4xl leading-tight tracking-tight text-ink md:text-5xl">
            Mulai gratis, upgrade kalau{" "}
            <em className="font-light italic">butuh</em>.
          </h2>
          <p className="mt-4 text-ink-soft">
            Nggak ada trial expire. Nggak ada kartu kredit di awal.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
          {/* Free */}
          <div className="rounded-2xl border border-line bg-surface p-8 md:p-10">
            <h3 className="font-display text-2xl font-medium text-ink">Gratis</h3>
            <p className="mt-2 text-sm text-muted">Cukup buat yang baru mulai jalan.</p>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="font-display text-5xl font-medium tracking-tight text-ink">Rp 0</span>
              <span className="text-muted">/ selamanya</span>
            </div>
            <ul className="mt-8 space-y-3">
              {["5 invoice per bulan", "1 template default", "Share via link", "Track status pembayaran"].map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <span aria-hidden className="mt-0.5 text-brand">✓</span>
                  <span className="text-ink-soft">{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="mt-10 block rounded-full border border-ink px-6 py-3.5 text-center text-sm font-medium text-ink transition hover:bg-ink hover:text-bg"
            >
              {isLoggedIn ? "Buka Dashboard" : "Mulai Gratis"}
            </Link>
          </div>

          {/* Pro */}
          <div className="relative rounded-2xl border border-ink bg-ink p-8 text-bg shadow-[0_30px_60px_-20px_rgba(42,31,23,0.4)] md:p-10">
            <span className="absolute -top-3 left-8 rounded-full bg-brand px-3 py-1 text-xs font-medium tracking-wide text-bg uppercase">
              Populer
            </span>
            <h3 className="font-display text-2xl font-medium">Pro</h3>
            <p className="mt-2 text-sm text-bg/70">Buat freelancer yang serius scaling.</p>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="font-display text-5xl font-medium tracking-tight">Rp 49.000</span>
              <span className="text-bg/60">/ per bulan</span>
            </div>
            <ul className="mt-8 space-y-3">
              {["Invoice unlimited", "Custom branding & logo", "Multi-template", "Priority support", "Export PDF & laporan"].map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <span aria-hidden className="mt-0.5 text-brand-soft">✓</span>
                  <span className="text-bg/90">{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/upgrade"
              className="mt-10 block rounded-full bg-bg px-6 py-3.5 text-center text-sm font-medium text-ink transition hover:bg-brand-soft"
            >
              Upgrade ke Pro
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
