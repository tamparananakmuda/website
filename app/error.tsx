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
    console.error('[Error boundary] Page error:', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex gap-1">
          <div className="h-8 w-1.5 rounded-full bg-primary" />
          <div className="h-8 w-1.5 rounded-full bg-primary" />
        </div>
        <span className="font-display text-sm font-bold tracking-tight text-foreground">
          TAMPARAN ANAK MUDA
        </span>
      </div>

      <AlertTriangle className="mb-4 w-12 h-12 text-muted-foreground" />
      <h1 className="mb-2 text-2xl font-bold text-foreground">
        Ada yang tidak beres
      </h1>
      <p className="mb-6 max-w-md text-muted-foreground">
        Halaman ini gagal dimuat. Bukan salahmu, tapi sistemnya. Coba lagi.
      </p>
      {error.digest && (
        <p className="mb-4 text-xs text-muted-foreground/50">
          Error ID: {error.digest}
        </p>
      )}
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
