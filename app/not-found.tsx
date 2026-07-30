import Link from 'next/link';
import { Home, FileQuestion, FileText, Info } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex gap-1">
          <div className="h-8 w-1.5 rounded-full bg-primary" />
          <div className="h-8 w-1.5 rounded-full bg-primary" />
        </div>
        <span className="font-display text-sm font-bold tracking-tight text-foreground">
          TAMPARAN ANAK MUDA
        </span>
      </div>

      <div className="mb-4 flex items-baseline gap-3">
        <span className="font-display text-6xl font-bold text-primary">404</span>
        <FileQuestion className="w-8 h-8 text-muted-foreground" />
      </div>

      <h1 className="mb-3 text-2xl font-bold text-foreground">
        Halaman ini tidak ada
      </h1>
      <p className="mb-2 max-w-md text-muted-foreground">
        Mungkin halaman sudah dipindah, dihapus, atau memang tidak pernah ada.
      </p>
      <p className="mb-8 max-w-md text-sm text-muted-foreground/70 italic">
        Kenyataan memang kadang tidak sesuai ekspektasi.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Home className="w-4 h-4" />
          Ke Beranda
        </Link>
        <Link
          href="/artikel"
          className="flex items-center justify-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
        >
          <FileText className="w-4 h-4" />
          Baca Artikel
        </Link>
        <Link
          href="/tentang"
          className="flex items-center justify-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
        >
          <Info className="w-4 h-4" />
          Tentang TAM
        </Link>
      </div>
    </div>
  );
}
