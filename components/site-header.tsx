import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="font-serif text-xl font-bold tracking-tight">
          TAMPARAN ANAK MUDA
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/artikel" className="text-muted-foreground transition-colors hover:text-foreground">
            Artikel
          </Link>
          <Link href="/kategori" className="text-muted-foreground transition-colors hover:text-foreground">
            Kategori
          </Link>
          <Link href="/seri" className="text-muted-foreground transition-colors hover:text-foreground">
            Seri
          </Link>
          <Link href="/newsletter" className="text-muted-foreground transition-colors hover:text-foreground">
            Newsletter
          </Link>
          <Link href="/tentang" className="text-muted-foreground transition-colors hover:text-foreground">
            Tentang
          </Link>
        </nav>
      </div>
    </header>
  );
}
