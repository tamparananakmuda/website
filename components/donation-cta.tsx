import Link from 'next/link';
import { Heart } from 'lucide-react';

export function DonationCTA() {
  return (
    <div className="mx-auto max-w-3xl mt-12 mb-4">
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <Heart className="w-8 h-8 mx-auto mb-3 text-primary" />
        <h3 className="font-semibold text-foreground mb-1">
          TAM gratis untuk semua
        </h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
          Tidak ada paywall, tidak ada iklan. Dukung TAM agar kami terus menulis tanpa kompromi.
        </p>
        <Link
          href="/donasi"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Heart className="w-4 h-4" />
          Dukung TAM
        </Link>
      </div>
    </div>
  );
}
