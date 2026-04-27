const tiers = [
  {
    name: "Gratis",
    price: "Rp 0",
    period: "selamanya",
    description: "Cukup buat yang baru mulai jalan.",
    features: [
      "5 invoice per bulan",
      "1 template default",
      "Share via link",
      "Track status pembayaran",
    ],
    cta: "Mulai Gratis",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "Rp 49.000",
    period: "per bulan",
    description: "Buat freelancer yang serius scaling.",
    features: [
      "Invoice unlimited",
      "Custom branding & logo",
      "Multi-template",
      "Priority support",
      "Export PDF & laporan",
    ],
    cta: "Upgrade ke Pro",
    highlighted: true,
  },
];

export function Pricing() {
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
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={
                tier.highlighted
                  ? "relative rounded-2xl border border-ink bg-ink p-8 text-bg shadow-[0_30px_60px_-20px_rgba(42,31,23,0.4)] md:p-10"
                  : "rounded-2xl border border-line bg-surface p-8 md:p-10"
              }
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-8 rounded-full bg-brand px-3 py-1 text-xs font-medium tracking-wide text-bg uppercase">
                  Populer
                </span>
              )}

              <h3
                className={
                  tier.highlighted
                    ? "font-display text-2xl font-medium"
                    : "font-display text-2xl font-medium text-ink"
                }
              >
                {tier.name}
              </h3>
              <p
                className={
                  tier.highlighted
                    ? "mt-2 text-sm text-bg/70"
                    : "mt-2 text-sm text-muted"
                }
              >
                {tier.description}
              </p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-5xl font-medium tracking-tight">
                  {tier.price}
                </span>
                <span
                  className={tier.highlighted ? "text-bg/60" : "text-muted"}
                >
                  / {tier.period}
                </span>
              </div>

              <ul className="mt-8 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <span
                      aria-hidden
                      className={
                        tier.highlighted
                          ? "mt-0.5 text-brand-soft"
                          : "mt-0.5 text-brand"
                      }
                    >
                      ✓
                    </span>
                    <span
                      className={tier.highlighted ? "text-bg/90" : "text-ink-soft"}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#daftar"
                className={
                  tier.highlighted
                    ? "mt-10 block rounded-full bg-bg px-6 py-3.5 text-center text-sm font-medium text-ink transition hover:bg-brand-soft"
                    : "mt-10 block rounded-full border border-ink px-6 py-3.5 text-center text-sm font-medium text-ink transition hover:bg-ink hover:text-bg"
                }
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
