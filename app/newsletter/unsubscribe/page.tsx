import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Berhenti Berlangganan - TAMPARAN ANAK MUDA',
  description: 'Konfirmasi berhenti berlangganan newsletter TAM',
  robots: { index: false, follow: false },
};

export default function UnsubscribePage({
  searchParams,
}: {
  searchParams: { success?: string; error?: string };
}) {
  const isSuccess = searchParams.success === 'true';
  const isError = !!searchParams.error;

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-20">
      <div className="mx-auto max-w-md text-center">
        {isSuccess ? (
          <>
            <div className="mb-6 flex justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
            </div>
            <h1 className="mb-4 font-display text-2xl font-bold text-foreground">
              Kamu sudah berhenti berlangganan
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Email kamu sudah dihapus dari daftar. Kamu tidak akan menerima email dari TAM lagi.
            </p>
            <p className="mt-6 text-sm text-muted-foreground">
              Berubah pikiran?{' '}
              <a href="/newsletter" className="text-primary font-medium hover:underline">
                Daftar lagi
              </a>
            </p>
          </>
        ) : isError ? (
          <>
            <div className="mb-6 flex justify-center">
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-destructive">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
            </div>
            <h1 className="mb-4 font-display text-2xl font-bold text-foreground">
              Link tidak valid
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Link unsubscribe ini tidak valid atau sudah kedaluwarsa.
            </p>
          </>
        ) : (
          <>
            <h1 className="mb-4 font-display text-2xl font-bold text-foreground">
              Memproses...
            </h1>
            <p className="text-muted-foreground">
              Tunggu sebentar, sedang memproses permintaan kamu.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
