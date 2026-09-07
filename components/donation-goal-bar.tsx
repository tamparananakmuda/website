'use client';

import { useState, useEffect } from 'react';
import { Target, Sparkles } from 'lucide-react';

export function DonationGoalBar() {
  const [data, setData] = useState<{
    progress: number;
    target: number;
    current: number;
  } | null>(null);

  useEffect(() => {
    fetch('/api/donasi/goal')
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data || data.target === 0) return null;

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      notation: 'compact',
    }).format(value);

  const displayProgress = Math.min(Math.round(data.progress || 0), 100);

  return (
    <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm p-6 shadow-sm transition-all hover:border-primary/30">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Target className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold tracking-wide text-foreground">Target Operasional Bulan Ini</span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 font-mono text-xs font-semibold text-primary">
          <Sparkles className="w-3 h-3" />
          {displayProgress}% Tercapai
        </span>
      </div>

      <div className="mb-3 flex items-baseline justify-between">
        <span className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          {formatRupiah(data.current)}
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          sasaran <span className="text-foreground/80">{formatRupiah(data.target)}</span>
        </span>
      </div>

      <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary/80">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary shadow-[0_0_12px_rgba(225,29,72,0.4)] transition-all duration-1000 ease-out"
          style={{ width: `${Math.max(displayProgress, 3)}%` }}
        />
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Setiap donasi dialokasikan langsung untuk riset literatur, server tanpa iklan, dan kompensasi penulis muda.
      </p>
    </div>
  );
}
