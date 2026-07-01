const faqItems = [
  {
    question: 'Apa itu TAMPARAN ANAK MUDA?',
    answer:
      'TAMPARAN ANAK MUDA adalah media digital Indonesia yang membahas mindset, bisnis, keuangan, teknologi, dan pengembangan diri untuk generasi muda. Kami bukan media berita — kami adalah editorial media yang bertanya "apa yang harus dipahami dari apa yang terjadi?" bukan sekadar "apa yang terjadi hari ini?"',
  },
  {
    question: 'Topik apa yang dibahas TAM?',
    answer:
      'Kami membahas enam topik utama: Uang, Karier, Bisnis, Teknologi, Kehidupan, dan Mindset. Setiap topik dibahas dengan pendekatan editorial, bukan sekadar berita.',
  },
  {
    question: 'Apakah konten TAM gratis?',
    answer:
      'Ya, semua artikel di TAMPARAN ANAK MUDA gratis untuk dibaca. Tidak ada paywall. Kami percaya pengetahuan harus dapat diakses semua orang.',
  },
  {
    question: 'Bagaimana cara berlangganan newsletter?',
    answer:
      'Kamu bisa berlangganan newsletter mingguan kami dengan mendaftarkan email di halaman newsletter. Satu email per minggu, tidak ada spam, dan bisa berhenti kapan saja.',
  },
  {
    question: 'Apakah TAM menerima kontribusi artikel?',
    answer:
      'Kami terbuka untuk diskusi mengenai kontribusi konten. Hubungi kami melalui Instagram @tamparananakmuda.id untuk informasi lebih lanjut.',
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
