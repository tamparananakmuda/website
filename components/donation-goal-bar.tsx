'use client';

import { useState, useEffect } from 'react';
import { Target } from 'lucide-react';

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

  return (
    <div className="rounded-xl border border-border bg-card p-5 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Target donasi bulan ini</span>
      </div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="font-display text-2xl font-bold text-foreground">
          {formatRupiah(data.current)}
        </span>
        <span className="text-sm text-muted-foreground">
          dari {formatRupiah(data.target)}
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
          style={{ width: `${data.progress}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {data.progress}% tercapai. Setiap rupiah membantu TAM tetap independen.
      </p>
    </div>
  );
}
