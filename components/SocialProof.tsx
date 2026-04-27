const testimonials = [
  {
    quote:
      "Dulu bikin invoice di Excel, ribet banget format-nya. Sekarang 30 detik kelar dan keliatan profesional.",
    name: "Rara A.",
    role: "Illustrator Freelance",
  },
  {
    quote:
      "Fitur share link-nya juara. Klien tinggal klik, bayar, beres. Nggak ada lagi PDF nyangkut di email.",
    name: "Fadli H.",
    role: "Web Developer",
  },
  {
    quote:
      "Bisa lihat siapa yang udah bayar, siapa yang belum, dalam satu layar. Nggak perlu spreadsheet lagi.",
    name: "Ayu M.",
    role: "Content Strategist",
  },
];

const stats = [
  { value: "500+", label: "invoice dibuat" },
  { value: "Rp 2M+", label: "tertagih" },
  { value: "98%", label: "user balik lagi" },
];

export function SocialProof() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <div className="max-w-2xl">
        <p className="text-xs font-medium tracking-[0.2em] text-brand uppercase">
          Cerita pengguna
        </p>
        <h2 className="mt-3 font-display text-4xl leading-tight tracking-tight text-ink md:text-5xl">
          Dipakai freelancer yang{" "}
          <em className="font-light italic">capek ribet</em>.
        </h2>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure
            key={t.name}
            className="flex flex-col rounded-2xl border border-line bg-surface p-7"
          >
            <span
              aria-hidden
              className="font-display text-5xl leading-none text-brand/60"
            >
              &ldquo;
            </span>
            <blockquote className="-mt-2 text-base leading-relaxed text-ink-soft">
              {t.quote}
            </blockquote>
            <figcaption className="mt-6 border-t border-line pt-4">
              <p className="font-medium text-ink">{t.name}</p>
              <p className="mt-0.5 text-sm text-muted">{t.role}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-3 divide-x divide-line rounded-2xl border border-line bg-bg-soft/60">
        {stats.map((s) => (
          <div key={s.label} className="px-4 py-8 text-center md:py-10">
            <p className="font-display text-3xl font-medium text-ink md:text-4xl">
              {s.value}
            </p>
            <p className="mt-2 text-sm text-muted">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
