'use client';

import { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GlobalError] Root-level error:', error);
  }, [error]);

  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0A] px-4 text-center text-white">
        <div className="mb-6 flex gap-1">
          <div className="h-8 w-1.5 bg-red-600" />
          <div className="h-8 w-1.5 bg-red-600" />
        </div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-red-500">
          TAMPARAN ANAK MUDA
        </p>
        <h1 className="mb-3 text-3xl font-bold">
          Sistem sedang bermasalah
        </h1>
        <p className="mb-8 max-w-md text-sm text-white/60">
          Ada yang rusak di tingkat paling bawah. Tim kami sudah diberi tahu. Coba muat ulang halaman.
        </p>
        {error.digest && (
          <p className="mb-6 text-xs text-white/30">
            Error ID: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700"
        >
          <RefreshCw className="h-4 w-4" />
          Muat ulang
        </button>
      </body>
    </html>
  );
}
