'use client';

import { useState, useEffect } from 'react';
import { Heart, RefreshCw, Users, MessageSquareQuote } from 'lucide-react';

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
      <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm p-6 text-center">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <RefreshCw className="w-4 h-4 animate-spin text-primary" />
          <span>Memuat dinding solidaritas...</span>
        </div>
      </div>
    );
  }

  if (donors.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/80 bg-card/40 backdrop-blur-sm p-6 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Heart className="w-5 h-5" />
        </div>
        <h4 className="font-display text-sm font-semibold text-foreground">Jadilah Patron Pertama Bulan Ini</h4>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
          Dukungan kamu langsung tercatat di sini sebagai bukti nyata solidaritas menjaga ruang baca merdeka.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm p-6 shadow-sm transition-all hover:border-primary/30">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wide">Dinding Solidaritas Pembaca</h3>
            <p className="text-[11px] text-muted-foreground">{donors.length} orang telah bersolidaritas</p>
          </div>
        </div>
        <button
          onClick={fetchDonors}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
          aria-label="Segarkan daftar donatur"
          title="Segarkan daftar"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {donors.map((donor, i) => (
          <div
            key={i}
            className="group rounded-xl border border-border/60 bg-background/50 p-3.5 transition-all hover:border-primary/30 hover:bg-background/80"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                {donor.customer_name[0]?.toUpperCase() || 'P'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {donor.customer_name}
                  </p>
                  <span className="font-mono text-xs font-bold text-primary shrink-0">
                    {formatRupiah(donor.net_amount)}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-0.5">
                  {donor.is_recurring && (
                    <span className="inline-flex items-center gap-1 text-[10px] rounded-full bg-primary/10 px-2 py-0.2 font-medium text-primary">
                      <Heart className="w-2.5 h-2.5 fill-primary" /> Patron Rutin
                    </span>
                  )}
                  <span className="text-[11px] text-muted-foreground/80">
                    {new Date(donor.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                </div>

                {donor.message && (
                  <div className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground/90 italic bg-secondary/30 rounded-lg p-2 border border-border/30">
                    <MessageSquareQuote className="w-3.5 h-3.5 text-primary/60 shrink-0 mt-0.5 not-italic" />
                    <span className="line-clamp-3 leading-relaxed">&ldquo;{donor.message}&rdquo;</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
