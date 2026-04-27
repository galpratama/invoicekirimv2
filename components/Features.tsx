const features = [
  {
    number: "01",
    title: "Invoice Instan",
    description:
      "Isi form sederhana — nama klien, item, harga. Invoice langsung jadi dengan layout rapi siap kirim.",
  },
  {
    number: "02",
    title: "Share Link",
    description:
      "Kirim invoice lewat link unik. Klien tinggal buka di browser, nggak perlu install apa-apa.",
  },
  {
    number: "03",
    title: "Track Status",
    description:
      "Tahu mana invoice yang sudah dibayar, masih pending, atau lewat jatuh tempo — semua dalam satu dashboard.",
  },
];

export function Features() {
  return (
    <section id="fitur" className="border-y border-line bg-bg-soft/40">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-[0.2em] text-brand uppercase">
            Fitur
          </p>
          <h2 className="mt-3 font-display text-4xl leading-tight tracking-tight text-ink md:text-5xl">
            Tiga langkah dari{" "}
            <em className="font-light italic">ide</em> ke{" "}
            <em className="font-light italic">dibayar</em>.
          </h2>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.number}
              className="group bg-surface p-8 transition hover:bg-bg-soft md:p-10"
            >
              <span className="font-display text-sm font-medium text-faint">
                {feature.number}
              </span>
              <h3 className="mt-6 font-display text-2xl font-medium text-ink">
                {feature.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-ink-soft">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
