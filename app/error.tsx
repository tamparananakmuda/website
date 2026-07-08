'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <AlertTriangle className="mb-4 w-12 h-12 text-muted-foreground" />
      <h1 className="mb-2 text-2xl font-bold text-foreground">
        Ada yang tidak beres
      </h1>
      <p className="mb-6 max-w-md text-muted-foreground">
        Halaman ini gagal dimuat. Bukan salahmu, tapi sistemnya. Coba lagi.
      </p>
      <button
        onClick={reset}
        className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        <RefreshCw className="w-4 h-4" />
        Coba lagi
      </button>
    </div>
  );
}
