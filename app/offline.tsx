import Link from 'next/link';
import { WifiOff, Home, FileText } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <WifiOff className="mb-6 w-16 h-16 text-muted-foreground" />
      <h1 className="mb-3 text-3xl font-bold text-foreground">
        Kamu Sedang Offline
      </h1>
      <p className="mb-2 text-lg font-medium text-foreground">
        Tidak ada koneksi internet
      </p>
      <p className="mb-8 max-w-md text-muted-foreground">
        Beberapa halaman mungkin masih tersedia dari cache. Coba kembali ketika koneksi pulih.
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
      </div>
    </div>
  );
}
