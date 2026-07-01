import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid gap-12 py-16 md:grid-cols-12 md:py-20">
          <div className="md:col-span-5">
            <p className="mb-3 font-display text-lg font-bold tracking-tight">
              TAMPARAN ANAK MUDA
            </p>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Awakening the youth to reality.
            </p>
            <p className="text-sm italic text-muted-foreground/60">
              Built for thinkers, not scrollers.
            </p>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
              Navigasi
            </p>
            <nav className="flex flex-col gap-3 text-sm">
              <Link href="/artikel" className="text-muted-foreground transition-colors hover:text-foreground">
                Artikel
              </Link>
              <Link href="/kategori" className="text-muted-foreground transition-colors hover:text-foreground">
                Kategori
              </Link>
              <Link href="/seri" className="text-muted-foreground transition-colors hover:text-foreground">
                Seri
              </Link>
              <Link href="/tentang" className="text-muted-foreground transition-colors hover:text-foreground">
                Tentang
              </Link>
              <Link href="/donasi" className="text-muted-foreground transition-colors hover:text-foreground">
                Donasi
              </Link>
              <Link href="/newsletter" className="text-muted-foreground transition-colors hover:text-foreground">
                Newsletter
              </Link>
            </nav>
          </div>

          <div className="md:col-span-3">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
              Sosial
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <a
                href="https://instagram.com/tamparananakmuda.id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Instagram
              </a>
              <a
                href="https://tiktok.com/@tamparananakmuda"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                TikTok
              </a>
              <a
                href="https://x.com/tamparananakmuda"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                X (Twitter)
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border py-6">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} TAMPARAN ANAK MUDA
          </p>
        </div>
      </div>
    </footer>
  );
}
