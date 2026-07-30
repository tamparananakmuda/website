import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid gap-8 py-16 md:grid-cols-12 md:gap-6 md:py-20">
          <div className="md:col-span-3">
            <p className="mb-3 font-display text-lg font-bold tracking-tight">
              TAMPARAN ANAK MUDA
            </p>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Awakening the youth to reality.
            </p>
            <p className="text-sm italic text-muted-foreground/80">
              Built for thinkers, not scrollers.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
              Konten
            </p>
            <nav className="flex flex-col gap-3 text-sm" aria-label="Navigasi konten">
              <Link href="/artikel" className="text-muted-foreground transition-colors hover:text-foreground">
                Artikel
              </Link>
              <Link href="/kategori" className="text-muted-foreground transition-colors hover:text-foreground">
                Kategori
              </Link>
              <Link href="/whitepaper" className="text-muted-foreground transition-colors hover:text-foreground">
                Whitepaper
              </Link>
              <Link href="/seri" className="text-muted-foreground transition-colors hover:text-foreground">
                Seri
              </Link>
              <Link href="/sosial" className="text-muted-foreground transition-colors hover:text-foreground">
                Konten Sosial
              </Link>
            </nav>
          </div>

          <div className="md:col-span-3">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
              Informasi
            </p>
            <nav className="flex flex-col gap-3 text-sm" aria-label="Navigasi informasi">
              <Link href="/tentang" className="text-muted-foreground transition-colors hover:text-foreground">
                Tentang
              </Link>
              <Link href="/donasi" className="text-muted-foreground transition-colors hover:text-foreground">
                Donasi
              </Link>
              <Link href="/newsletter" className="text-muted-foreground transition-colors hover:text-foreground">
                Newsletter
              </Link>
              <Link href="/newsletter-arsip" className="text-muted-foreground transition-colors hover:text-foreground">
                Arsip Newsletter
              </Link>
              <Link href="/masuk" className="text-muted-foreground transition-colors hover:text-foreground">
                Akun
              </Link>
              <Link href="/rss.xml" className="text-muted-foreground transition-colors hover:text-foreground">
                RSS Feed
              </Link>
              <div className="mt-2 border-t border-border/40 pt-3">
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/80">
                  Legal
                </p>
                <div className="flex flex-col gap-3">
                  <Link href="/kebijakan-privasi" className="text-muted-foreground transition-colors hover:text-foreground">
                    Kebijakan Privasi
                  </Link>
                  <Link href="/syarat-ketentuan" className="text-muted-foreground transition-colors hover:text-foreground">
                    Syarat Ketentuan
                  </Link>
                  <Link href="/disclaimer" className="text-muted-foreground transition-colors hover:text-foreground">
                    Disclaimer
                  </Link>
                </div>
              </div>
            </nav>
          </div>

          <div className="md:col-span-3">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
              Sosial
            </p>
            <nav className="flex flex-col gap-3 text-sm" aria-label="Media sosial">
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
            </nav>
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
