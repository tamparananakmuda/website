'use client';

import { useState, useEffect } from 'react';
import { Heart, RefreshCw } from 'lucide-react';

interface Donor {
  customer_name: string;
  amount: number;
  net_amount: number;
  message: string | null;
  is_recurring: boolean;
  updated_at: string;
}

export function DonorWall() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonors();
  }, []);

  async function fetchDonors() {
    setLoading(true);
    try {
      const res = await fetch('/api/donasi/donors');
      const data = await res.json();
      setDonors(data.donors || []);
    } catch {
      setDonors([]);
    } finally {
      setLoading(false);
    }
  }

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      notation: 'compact',
    }).format(value);

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground text-center">Memuat donatur...</p>
      </div>
    );
  }

  if (donors.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Dukung dari pembaca</span>
        </div>
        <button
          onClick={fetchDonors}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Refresh"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {donors.map((donor, i) => (
          <div key={i} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
              {donor.customer_name[0]?.toUpperCase() || 'D'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground truncate">
                  {donor.customer_name}
                </p>
                {donor.is_recurring && (
                  <span className="text-xs rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                    Pendukung tetap
                  </span>
                )}
              </div>
              {donor.message && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  &ldquo;{donor.message}&rdquo;
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatRupiah(donor.net_amount)} - {new Date(donor.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
