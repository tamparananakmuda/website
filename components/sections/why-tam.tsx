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
    <section className="bg-card py-20 md:py-32">
      <div className="container mx-auto px-4">
        <h2 className="mb-16 text-3xl font-bold tracking-tight md:text-4xl">
          Kami berbeda karena
        </h2>
        <div className="space-y-12">
          {differentiators.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col gap-2 md:flex-row md:items-baseline md:gap-6 ${
                index % 2 === 1 ? 'md:pl-16' : ''
              } ${index % 2 === 2 ? 'md:pl-32' : ''}`}
            >
              <p className="text-xl text-muted-foreground line-through decoration-muted-foreground/40 md:text-2xl">
                {item.negative}
              </p>
              <p className="text-2xl font-bold text-primary md:text-3xl">
                {item.positive}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 border-t border-border pt-12">
          <p className="mb-8 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Komitmen Editorial
          </p>
          <p className="mb-12 max-w-2xl text-2xl font-bold leading-snug tracking-tight md:text-3xl md:leading-tight">
            &ldquo;Kami tidak menulis untuk membuatmu merasa nyaman. Kami menulis agar kamu melihat kenyataan lebih jelas.&rdquo;
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {commitments.map((item, index) => (
              <div key={index}>
                <h3 className="mb-2 text-lg font-bold">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
