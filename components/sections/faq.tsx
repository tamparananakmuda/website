const faqItems = [
  {
    question: 'Apa itu TAMPARAN ANAK MUDA?',
    answer:
      'TAMPARAN ANAK MUDA adalah editorial media digital Indonesia. Kami menulis tentang uang, karier, bisnis, teknologi, kehidupan, dan mindset — bukan ringkasan 60 detik, tapi tulisan mendalam yang membuat kamu berpikir. Kami bukan media berita dan bukan content creator. Kami adalah media tertulis yang bertanya "apa yang harus dipahami?" bukan "apa yang terjadi hari ini?"',
  },
  {
    question: 'Kenapa baca kalau bisa nonton?',
    answer:
      'Karena membaca adalah aktivitas aktif. Video mengalir tanpa kamu sadari — kamu menonton, lalu lupa. Membaca memaksa kamu berhenti, memproses, dan membentuk opini sendiri. Kami percaya pemahaman sejati datang dari kata-kata yang ditulis dengan sungguh-sungguh, bukan konten yang dibuat untuk retensi 3 detik.',
  },
  {
    question: 'Topik apa yang dibahas TAM?',
    answer:
      'Enam topik: Uang, Karier, Bisnis, Teknologi, Kehidupan, dan Mindset. Kami fokus pada topik yang relevan untuk anak muda Indonesia yang ingin bertumbuh — bukan membahas segala hal, tapi mendalam pada apa yang kami pilih.',
  },
  {
    question: 'Apakah konten TAM gratis?',
    answer:
      'Ya, semua artikel gratis dibaca. Tidak ada paywall. Kami percaya pengetahuan yang layak harus dapat diakses semua orang.',
  },
  {
    question: 'Bagaimana cara berlangganan newsletter?',
    answer:
      'Daftarkan email kamu di halaman newsletter. Satu email per minggu, tidak ada spam, bisa berhenti kapan saja. Isinya bukan link-link acak — tapi perspektif yang kami pilih untuk membantumu melihat sesuatu dari sudut yang berbeda.',
  },
];

export function Faq() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-3xl font-bold tracking-tight md:text-4xl">
            Pertanyaan yang sering muncul
          </h2>
          <div className="space-y-8">
            {faqItems.map((item, index) => (
              <div key={index} className="border-b border-border pb-6">
                <h3 className="mb-3 text-lg font-bold md:text-xl">
                  {item.question}
                </h3>
                <p className="leading-relaxed text-muted-foreground">
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
