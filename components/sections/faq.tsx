const faqItems = [
  {
    question: 'Apa itu TAMPARAN ANAK MUDA?',
    answer:
      'TAMPARAN ANAK MUDA adalah editorial media digital Indonesia. Kami menulis tentang uang, karier, bisnis, teknologi, kehidupan, dan mindset, bukan ringkasan 60 detik, tapi tulisan mendalam yang membuat kamu berpikir. Kami bukan media berita dan bukan content creator. Kami adalah media tertulis yang bertanya "apa yang harus dipahami?" bukan "apa yang terjadi hari ini?"',
  },
  {
    question: 'Kenapa baca kalau bisa nonton?',
    answer:
      'Karena membaca adalah aktivitas aktif. Video mengalir tanpa kamu sadari, kamu menonton, lalu lupa. Membaca memaksa kamu berhenti, memproses, dan membentuk opini sendiri. Pemahaman datang dari kata-kata yang ditulis dengan sungguh-sungguh, bukan konten yang dibuat untuk retensi 3 detik.',
  },
  {
    question: 'Topik apa yang dibahas TAM?',
    answer:
      'Enam topik: Uang, Karier, Bisnis, Teknologi, Kehidupan, dan Mindset. Kami fokus pada topik yang relevan untuk anak muda Indonesia yang ingin bertumbuh, bukan membahas segala hal, tapi mendalam pada apa yang kami pilih.',
  },
  {
    question: 'Apakah konten TAM gratis?',
    answer:
      'Ya, semua artikel gratis dibaca. Tidak ada paywall. Kami percaya pengetahuan yang layak harus dapat diakses semua orang.',
  },
  {
    question: 'Bagaimana cara berlangganan newsletter?',
    answer:
      'Daftarkan email kamu di halaman newsletter. Satu email per minggu, tidak ada spam, bisa berhenti kapan saja. Isinya bukan link-link acak, tapi perspektif yang kami pilih untuk membantumu melihat sesuatu dari sudut yang berbeda.',
  },
];

export function Faq() {
  return (
    <section className="py-24 md:py-40">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 flex items-center gap-4">
            <span className="font-display text-sm font-bold text-primary">05</span>
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
              FAQ
            </span>
          </div>
          <h2 className="mb-12 font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl">
            Pertanyaan yang sering muncul
          </h2>
          <div className="divide-y divide-border">
            {faqItems.map((item, index) => (
              <div key={index} className="py-6 md:py-8">
                <div className="mb-3 flex items-start gap-4">
                  <span className="mt-1 shrink-0 font-display text-xs font-bold text-primary">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-base font-bold leading-snug md:text-lg">
                    {item.question}
                  </h3>
                </div>
                <p className="pl-8 text-sm leading-relaxed text-muted-foreground md:pl-10 md:text-base">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export { faqItems };
