export function FeaturedQuote() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-muted/25 py-16 md:py-24 dark:bg-muted/10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              REFLEKSI EDITORIAL
            </span>
          </div>

          <blockquote className="relative">
            <span 
              className="pointer-events-none absolute -left-4 -top-8 select-none font-serif text-7xl font-bold leading-none text-primary/15 md:-left-8 md:-top-10 md:text-9xl"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <p className="relative font-display text-2xl font-medium leading-[1.3] tracking-tight text-foreground md:text-4xl md:leading-[1.25]">
              Kamu bisa menonton ribuan video motivasi.
              <span className="mt-2 block font-serif italic text-muted-foreground">
                Tapi memahami kenyataan memberi peluang bertahan lebih besar daripada mengabaikannya.
              </span>
            </p>
          </blockquote>

          <div className="mt-8 flex items-center gap-3 md:mt-10">
            <div className="h-px w-10 bg-primary" />
            <span className="font-mono text-xs font-semibold tracking-wider text-foreground">
              TAMPARAN ANAK MUDA
            </span>
            <span className="text-muted-foreground/40">•</span>
            <span className="text-xs text-muted-foreground">
              Catatan Redaksi
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
