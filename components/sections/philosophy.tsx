export function Philosophy() {
  const pillars = [
    {
      number: '01',
      title: 'Riset Mendalam, Bukan Opini Dangkal',
      description:
        'Setiap tulisan dibedah melalui data ekonomi riil, dinamika pasar kerja modern, dan psikologi perilaku. Bukan tips instan yang basi dalam hitungan hari.',
    },
    {
      number: '02',
      title: 'Kejujuran Radikal Tanpa Kompromi',
      description:
        'Kami tidak menjual ilusi cepat kaya atau dongeng motivasi kosong. Kami mengupas risiko struktural dan realitas lapangan yang kerap ditutupi.',
    },
    {
      number: '03',
      title: 'Kerangka Aksi Yang Konkret',
      description:
        'Refleksi tanpa arah hanyalah angan-angan. Tiap naskah dirancang untuk memberi kejelasan peta mental dan keputusan nyata yang bisa langsung dieksekusi.',
    },
  ];

  return (
    <section className="relative overflow-hidden py-24 md:py-36">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-14 flex items-center gap-4 md:mb-20">
          <span className="font-mono text-sm font-semibold tracking-wider text-primary">01</span>
          <div className="h-px flex-1 bg-border" />
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
            MANIFESTO EDITORIAL
          </span>
        </div>

        {/* 2-Column Architectural Layout */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Core Premise */}
          <div className="lg:col-span-6 lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-mono text-muted-foreground backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              PRINSIP PENULISAN TAM
            </div>

            <h2 className="mt-6 font-display text-3xl font-medium leading-[1.18] tracking-tight text-foreground sm:text-4xl md:text-5xl md:leading-[1.12]">
              Konten 60 detik cepat dilupakan.
              <span className="mt-2 block font-serif italic text-primary">
                Tulisan 10 menit mengubah cara berpikir selamanya.
              </span>
            </h2>

            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg md:leading-relaxed">
              Di era banjir stimulasi kilat dan algoritma scroll tanpa henti, kami menolak simplifikasi berlebihan. Pemahaman sejati tidak lahir dari ringkasan kilat — ia lahir dari keberanian membaca tuntas dan membedah kenyataan hingga ke akarnya.
            </p>

            {/* Commitments Pill Tags */}
            <div className="mt-8 flex flex-wrap gap-2.5 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-muted/40 px-3 py-1.5 font-mono text-[11px] text-foreground">
                <span className="text-primary font-bold">✓</span> 100% Bebas Gimmick
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-muted/40 px-3 py-1.5 font-mono text-[11px] text-foreground">
                <span className="text-primary font-bold">✓</span> Riset Independen
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-muted/40 px-3 py-1.5 font-mono text-[11px] text-foreground">
                <span className="text-primary font-bold">✓</span> Tanpa Paywall Terkunci
              </span>
            </div>
          </div>

          {/* Right Column: 3 Editorial Pillars */}
          <div className="space-y-4 lg:col-span-6">
            {pillars.map((pillar) => (
              <div
                key={pillar.number}
                className="group relative rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-card hover:shadow-sm md:p-8"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-xs font-semibold tracking-wider text-primary">
                    PILAR {pillar.number}
                  </span>
                  <div className="h-px w-8 bg-border transition-all duration-300 group-hover:w-12 group-hover:bg-primary/50" />
                </div>

                <h3 className="mt-4 font-display text-xl font-medium tracking-tight text-foreground transition-colors group-hover:text-primary md:text-2xl">
                  {pillar.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base md:leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
