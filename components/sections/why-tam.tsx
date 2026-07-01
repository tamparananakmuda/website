const differentiators = [
  {
    negative: 'Bukan ringkasan 60 detik',
    positive: 'Tulisan yang membuat kamu berhenti dan berpikir.',
  },
  {
    negative: 'Bukan motivasi yang terlalu manis',
    positive: 'Sudut pandang yang mungkin berbeda dari yang biasa kamu dengar.',
  },
  {
    negative: 'Bukan konten untuk algoritma',
    positive: 'Tulisan untuk manusia yang ingin tumbuh.',
  },
];

const commitments = [
  {
    title: 'Setiap klaim ada sumbernya',
    desc: 'Angka, data, dan kutipan selalu dicantumkan dengan sumber. Tidak ada statistik tanpa origin.',
  },
  {
    title: 'Koreksi publik jika salah',
    desc: 'Kalau kami keliru, kami perbaiki terbuka. Setiap artikel punya tanggal update dan catatan revisi.',
  },
  {
    title: 'Angle kritik sosial, bukan tips generik',
    desc: 'Kami tidak menulis "5 cara sukses". Kami menulis kenapa sistemnya begini, dan apa yang bisa kamu lakukan.',
  },
];

export function WhyTam() {
  return (
    <section className="bg-card py-24 md:py-40">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-12 flex items-center gap-4">
          <span className="font-display text-sm font-bold text-primary">04</span>
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Posisi
          </span>
        </div>
        <h2 className="mb-16 font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl">
          Kami berbeda karena
        </h2>
        <div className="space-y-8 md:space-y-10">
          {differentiators.map((item, index) => (
            <div
              key={index}
              className="flex flex-col gap-1 border-l-2 border-border pl-6 transition-colors hover:border-primary md:flex-row md:items-baseline md:gap-8 md:pl-8"
            >
              <p className="text-base text-muted-foreground line-through decoration-muted-foreground/30 md:text-lg">
                {item.negative}
              </p>
              <p className="font-display text-xl font-bold text-primary md:text-2xl">
                {item.positive}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 border-t border-border pt-16">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Komitmen Editorial
          </p>
          <p className="mb-12 max-w-2xl font-display text-2xl font-bold leading-snug tracking-tight md:text-3xl md:leading-tight">
            &ldquo;Kami tidak menulis untuk membuatmu merasa nyaman. Kami menulis agar kamu melihat kenyataan lebih jelas.&rdquo;
          </p>
          <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
            {commitments.map((item, index) => (
              <div key={index} className="bg-card p-6 md:p-8">
                <span className="mb-4 block font-display text-xs font-bold text-primary">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mb-2 font-display text-base font-bold leading-snug md:text-lg">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
