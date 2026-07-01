const differentiators = [
  {
    negative: 'Bukan ringkasan 60 detik',
    positive: 'Tulisan yang membuat kamu berhenti dan berpikir.',
  },
  {
    negative: 'Bukan motivasi yang terlalu manis',
    positive: 'Kenyataan yang mungkin tidak nyaman didengar.',
  },
  {
    negative: 'Bukan konten untuk algoritma',
    positive: 'Tulisan untuk manusia yang ingin tumbuh.',
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
      </div>
    </section>
  );
}
