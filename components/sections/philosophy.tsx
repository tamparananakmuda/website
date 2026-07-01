export function Philosophy() {
  return (
    <section className="py-24 md:py-40">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex items-center gap-4">
            <span className="font-display text-sm font-bold text-primary">01</span>
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
              Filsafat
            </span>
          </div>
          <p className="mb-8 font-display text-3xl font-bold leading-[1.15] tracking-tight md:text-5xl md:leading-[1.1]">
            Konten 60 detik dilupakan.
            <span className="mt-1 block text-primary">
              Tulisan 10 menit mengubah cara berpikir.
            </span>
          </p>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg md:leading-relaxed">
            Di era scroll tanpa henti, kami memilih menulis panjang. Karena pemahaman tidak datang dari ringkasan 30 detik. Ia datang dari membaca sesuatu sampai selesai dan melihat sesuatu dari sudut yang sebelumnya tidak terpikir.
          </p>
        </div>
      </div>
    </section>
  );
}
