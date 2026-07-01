import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-center px-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          TAMPARAN ANAK MUDA
        </Link>
      </div>
    </header>
  );
}
