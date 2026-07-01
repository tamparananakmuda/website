import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <p className="mb-4 text-lg font-bold tracking-tight">
              TAMPARAN ANAK MUDA
            </p>
            <p className="text-sm text-muted-foreground">
              Awakening the youth to reality.
            </p>
          </div>

          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Navigasi
            </p>
            <nav className="flex flex-col gap-2 text-sm">
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
              <Link href="/newsletter" className="text-muted-foreground transition-colors hover:text-foreground">
                Newsletter
              </Link>
            </nav>
          </div>

          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Sosial
            </p>
            <div className="flex flex-col gap-2 text-sm">
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

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} TAMPARAN ANAK MUDA
          </p>
          <p className="text-sm italic text-muted-foreground">
            Built for thinkers, not scrollers.
          </p>
        </div>
      </div>
    </footer>
  );
}
