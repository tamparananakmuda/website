const differentiators = [
  {
    negative: 'Kami tidak mengejar viral',
    positive: 'Kami mengejar nilai.',
  },
  {
    negative: 'Kami tidak menjual motivasi kosong',
    positive: 'Kami membahas kenyataan.',
  },
  {
    negative: 'Kami tidak menulis untuk algoritma',
    positive: 'Kami menulis untuk manusia.',
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
