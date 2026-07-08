import Link from 'next/link';
import { Home, FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <FileQuestion className="mb-6 w-16 h-16 text-muted-foreground" />
      <h1 className="mb-3 text-4xl font-bold text-foreground">
        404
      </h1>
      <p className="mb-2 text-xl font-medium text-foreground">
        Halaman ini tidak ada
      </p>
      <p className="mb-8 max-w-md text-muted-foreground">
        Mungkin halaman sudah dipindah, dihapus, atau memang tidak pernah ada. Kenyataan memang kadang tidak sesuai ekspektasi.
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
          Baca Artikel
        </Link>
      </div>
    </div>
  );
}
