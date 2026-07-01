export function FeaturedQuote() {
  return (
    <section className="border-y border-border bg-background py-24 md:py-40">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto max-w-4xl">
          <span className="mb-8 block font-display text-6xl leading-none text-primary/30 md:text-8xl">
            &ldquo;
          </span>
          <blockquote className="-mt-4 md:-mt-8">
            <p className="text-2xl font-medium leading-relaxed tracking-tight text-foreground md:text-4xl md:leading-relaxed">
              Kamu bisa menonton ribuan video motivasi.
              <span className="mt-2 block text-muted-foreground">
                Tapi memahami kenyataan memberi peluang lebih besar daripada mengabaikannya.
              </span>
            </p>
          </blockquote>
          <div className="mt-10 flex items-center gap-3 md:mt-12">
            <div className="h-px w-12 bg-primary" />
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
              TAMPARAN ANAK MUDA
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
