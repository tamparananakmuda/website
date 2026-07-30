'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, TrendingUp, DollarSign, CheckCircle, XCircle, Clock, CreditCard } from 'lucide-react';

interface DonationAnalytics {
  totalGross: number;
  totalNet: number;
  totalFee: number;
  totalSettled: number;
  totalPending: number;
  totalFailed: number;
  successRate: number;
  avgAmount: number;
  byPaymentType: { paymentType: string; count: number; total: number }[];
  byMonth: { month: string; count: number; total: number }[];
  recent: {
    id: string;
    louvinTransactionId: string;
    amount: number;
    netAmount: number;
    paymentType: string;
    status: string;
    customerName: string | null;
    customerEmail: string | null;
    isAnonymous: boolean;
    createdAt: string;
  }[];
}

const PAYMENT_TYPE_LABELS: Record<string, string> = {
  qris: 'QRIS',
  bni_va: 'BNI VA',
  bri_va: 'BRI VA',
  permata_va: 'Permata VA',
  cimb_niaga_va: 'CIMB VA',
};

const MONTH_LABELS: Record<string, string> = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'Mei', '06': 'Jun',
  '07': 'Jul', '08': 'Agu', '09': 'Sep', '10': 'Okt', '11': 'Nov', '12': 'Des',
};

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    settled: { label: 'Settled', className: 'bg-emerald-500/15 text-emerald-500' },
    pending: { label: 'Pending', className: 'bg-amber-500/15 text-amber-500' },
    failed: { label: 'Failed', className: 'bg-red-500/15 text-red-500' },
  };
  const { label, className } = map[status] || { label: status, className: 'bg-secondary text-muted-foreground' };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>{label}</span>
  );
}

export default function AdminDonasiPage() {
  const [data, setData] = useState<DonationAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/analytics/donations');
      if (!res.ok) throw new Error('Failed to fetch');
      setData(await res.json());
    } catch {
      setError('Gagal memuat data. Coba refresh halaman.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data) {
    return <p className="text-muted-foreground">{error || 'Gagal memuat data.'}</p>;
  }

  const maxMonthTotal = Math.max(...data.byMonth.map((m) => m.total), 1);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Donation Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Ringkasan performa donasi dan transaksi terbaru.</p>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-2 flex items-center gap-2 text-muted-foreground">
            <DollarSign size={15} />
            <span className="text-xs">Total Terkumpul (Gross)</span>
          </div>
          <p className="text-xl font-bold text-foreground">{formatRupiah(data.totalGross)}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Net: {formatRupiah(data.totalNet)}</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-2 flex items-center gap-2 text-emerald-500">
            <CheckCircle size={15} />
            <span className="text-xs">Transaksi Berhasil</span>
          </div>
          <p className="text-xl font-bold text-emerald-500">{data.totalSettled}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Avg: {formatRupiah(data.avgAmount)}</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-2 flex items-center gap-2 text-blue-500">
            <TrendingUp size={15} />
            <span className="text-xs">Success Rate</span>
          </div>
          <p className="text-xl font-bold text-blue-500">{data.successRate.toFixed(1)}%</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Fee total: {formatRupiah(data.totalFee)}</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-2 flex items-center gap-2 text-muted-foreground">
            <Clock size={15} />
            <span className="text-xs">Pending / Gagal</span>
          </div>
          <p className="text-xl font-bold">
            <span className="text-amber-500">{data.totalPending}</span>
            <span className="mx-1 text-muted-foreground/40">/</span>
            <span className="text-red-500">{data.totalFailed}</span>
          </p>
        </div>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* By Month */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-sm font-semibold">Donasi per Bulan</h2>
          {data.byMonth.length > 0 ? (
            <div className="space-y-2">
              {data.byMonth.slice(-12).map((m) => {
                const [year, month] = m.month.split('-');
                const label = `${MONTH_LABELS[month] || month} ${year}`;
                const width = (m.total / maxMonthTotal) * 100;
                return (
                  <div key={m.month} className="flex items-center gap-3">
                    <span className="w-16 text-xs text-muted-foreground">{label}</span>
                    <div className="flex-1 overflow-hidden rounded-full bg-secondary h-6">
                      <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${width}%` }} />
                    </div>
                    <span className="w-24 text-right text-xs text-muted-foreground">{formatRupiah(m.total)}</span>
                    <span className="w-4 text-right text-xs font-medium">{m.count}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Belum ada donasi settled.</p>
          )}
        </div>

        {/* By Payment Type */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-sm font-semibold">Metode Pembayaran</h2>
          {data.byPaymentType.length > 0 ? (
            <div className="space-y-3">
              {data.byPaymentType.map((p) => (
                <div key={p.paymentType} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2">
                    <CreditCard size={14} className="text-muted-foreground" />
                    <span className="text-sm font-medium">{PAYMENT_TYPE_LABELS[p.paymentType] || p.paymentType}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatRupiah(p.total)}</p>
                    <p className="text-xs text-muted-foreground">{p.count} transaksi</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Belum ada data.</p>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-sm font-semibold">Transaksi Terbaru (30 Hari)</h2>
        {data.recent.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="pb-2 text-left font-medium">Donatur</th>
                  <th className="pb-2 text-left font-medium">Metode</th>
                  <th className="pb-2 text-right font-medium">Jumlah</th>
                  <th className="pb-2 text-center font-medium">Status</th>
                  <th className="pb-2 text-right font-medium">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {data.recent.map((d) => (
                  <tr key={d.id} className="border-b border-border/50 last:border-0">
                    <td className="py-2.5 text-left">
                      {d.isAnonymous ? (
                        <span className="text-muted-foreground">Anonim</span>
                      ) : (
                        <span>{d.customerName || 'Donatur TAM'}</span>
                      )}
                    </td>
                    <td className="py-2.5 text-left text-muted-foreground">
                      {PAYMENT_TYPE_LABELS[d.paymentType] || d.paymentType}
                    </td>
                    <td className="py-2.5 text-right font-medium">{formatRupiah(d.amount)}</td>
                    <td className="py-2.5 text-center">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="py-2.5 text-right text-xs text-muted-foreground">
                      {new Date(d.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Belum ada transaksi 30 hari terakhir.</p>
        )}
      </div>
    </div>
  );
}
