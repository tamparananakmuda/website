'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Copy, Check, Loader2, AlertCircle, Building2 } from 'lucide-react';
import QRCode from 'qrcode';
import { DonationGoalBar } from '@/components/donation-goal-bar';
import { DonorWall } from '@/components/donor-wall';

const presetAmounts = [
  { value: 25000, label: 'Rp 25K' },
  { value: 50000, label: 'Rp 50K' },
  { value: 100000, label: 'Rp 100K' },
  { value: 250000, label: 'Rp 250K' },
];

const paymentMethods = [
  { id: 'qris', label: 'QRIS', description: 'Scan dengan e-wallet apa saja', icon: 'qr' },
  { id: 'bni_va', label: 'BNI Virtual Account', description: 'Transfer via BNI', icon: 'bank' },
  { id: 'bri_va', label: 'BRI Virtual Account', description: 'Transfer via BRI', icon: 'bank' },
  { id: 'permata_va', label: 'Permata Virtual Account', description: 'Transfer via Permata', icon: 'bank' },
  { id: 'cimb_niaga_va', label: 'CIMB Niaga Virtual Account', description: 'Transfer via CIMB', icon: 'bank' },
];

interface TransactionData {
  transaction_id: string;
  payment: {
    order_id: string;
    qr_string?: string;
    va_number?: string;
    bank?: string;
    payment_number?: string;
    expired_at: string;
    total_payment: number;
  };
  transaction: {
    amount: number;
    fee: number;
    net_amount: number;
  };
}

export default function DonasiPage() {
  const [amount, setAmount] = useState<number>(50000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentType, setPaymentType] = useState<string>('qris');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transaction, setTransaction] = useState<TransactionData | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>('pending');
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const finalAmount = customAmount ? parseInt(customAmount, 10) : amount;

  const handleSubmit = async () => {
    const minAmount = paymentType === 'qris' ? 1500 : 1000;
    if (finalAmount < minAmount) {
      setError(`Nominal donasi minimal Rp ${minAmount.toLocaleString('id-ID')}`);
      return;
    }

    setLoading(true);
    setError(null);
    setTransaction(null);
    setPaymentStatus('pending');

    try {
      const res = await fetch('/api/donasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount,
          payment_type: paymentType,
          customer_name: customerName || undefined,
          customer_email: customerEmail || undefined,
          is_anonymous: isAnonymous,
          message: message || undefined,
          is_recurring: isRecurring,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Gagal membuat transaksi');
        return;
      }

      setTransaction(data);
      if (data.payment.qr_string) {
        const url = await QRCode.toDataURL(data.payment.qr_string, {
          width: 200,
          margin: 1,
          color: { dark: '#000000', light: '#ffffff' },
        });
        setQrDataUrl(url);
      }
    } catch {
      setError('Terjadi kesalahan. Coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = useCallback(async (txId: string) => {
    try {
      const res = await fetch(`/api/donasi/status?transaction_id=${txId}`);
      const data = await res.json();

      if (data.success) {
        setPaymentStatus(data.status);
      }
    } catch {
      // silent fail
    }
  }, []);

  useEffect(() => {
    if (!transaction) return;
    if (paymentStatus !== 'pending') return;

    let active = true;

    const poll = async () => {
      if (!active) return;
      await checkStatus(transaction.transaction_id);
    };

    poll();

    const interval = setInterval(poll, 5000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [transaction, paymentStatus, checkStatus]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <main className="min-h-screen bg-background pt-20 md:pt-28">
      <div className="container mx-auto max-w-2xl px-4 md:px-8 pb-24">
        {/* Header */}
        <div className="mb-12">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-primary">
            Dukung TAM
          </p>
          <h1 className="mb-4 font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl">
            Dukung jurnalisme independen
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            TAM gratis untuk semua. Tidak ada paywall, tidak ada iklan yang mengganggu.
            Donasi kamu membantu kami tetap independen dan terus menulis tanpa kompromi.
          </p>
        </div>

        <DonationGoalBar />

        <AnimatePresence mode="wait">
        {paymentStatus === 'settled' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="rounded-2xl border border-border bg-card p-8 text-center md:p-12"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Heart size={32} className="text-primary" />
            </div>
            <h2 className="mb-3 font-display text-2xl font-bold">Terima kasih</h2>
            <p className="mb-2 text-muted-foreground">
              Donasi kamu telah diterima. Setiap rupiah membantu kami melanjutkan tulisan ini.
            </p>
            <p className="text-sm text-muted-foreground">
              {transaction && formatRupiah(transaction.transaction.net_amount)}
            </p>
            <button
              onClick={() => {
                setTransaction(null);
                setPaymentStatus('pending');
                setQrDataUrl('');
              }}
              className="mt-8 rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
            >
              Donasi lagi
            </button>
          </motion.div>
        ) : transaction ? (
          <motion.div
            key="payment"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="rounded-2xl border border-border bg-card p-6 md:p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Selesaikan pembayaran</h2>
              <span className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
                {paymentStatus === 'pending' ? 'Menunggu pembayaran' : paymentStatus}
              </span>
            </div>

            {transaction.payment.qr_string ? (
              <div className="flex flex-col items-center">
                <div className="mb-6 rounded-2xl border border-border bg-white p-6">
                  {qrDataUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={qrDataUrl} alt="QRIS Code" width={200} height={200} />
                  )}
                </div>
                <p className="mb-2 text-sm text-muted-foreground">Scan QRIS dengan e-wallet apa saja</p>
                <p className="mb-6 font-display text-2xl font-bold">
                  {formatRupiah(transaction.payment.total_payment)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Berlaku sampai{' '}
                  {new Date(transaction.payment.expired_at).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="mb-6 w-full rounded-xl border border-border bg-secondary/50 p-6 text-center">
                  <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                    {transaction.payment.bank || 'Bank'} Virtual Account
                  </p>
                  <p className="mb-4 font-mono text-lg font-bold tracking-wider md:text-2xl">
                    {transaction.payment.va_number}
                  </p>
                  <button
                    onClick={() => copyToClipboard(transaction.payment.va_number || '')}
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Tersalin' : 'Salin nomor'}
                  </button>
                </div>
                <p className="mb-2 text-sm text-muted-foreground">Total yang harus dibayar</p>
                <p className="mb-6 font-display text-2xl font-bold">
                  {formatRupiah(transaction.payment.total_payment)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Berlaku sampai{' '}
                  {new Date(transaction.payment.expired_at).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            )}

            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 size={16} className="animate-spin" />
              Menunggu konfirmasi pembayaran...
            </div>

            <button
              onClick={() => {
                setTransaction(null);
                setPaymentStatus('pending');
                setQrDataUrl('');
              }}
              className="mt-6 w-full rounded-full border border-border py-3 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Batalkan
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-8"
          >
            {/* Amount Selection */}
            <div>
              <label className="mb-4 block text-sm font-semibold text-foreground">
                Pilih nominal
              </label>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {presetAmounts.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => {
                      setAmount(preset.value);
                      setCustomAmount('');
                    }}
                    className={`rounded-xl border py-4 text-sm font-semibold transition-all ${
                      !customAmount && amount === preset.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-card text-foreground hover:border-primary/50'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="mt-3">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Nominal lain"
                    min={1000}
                    className="w-full rounded-xl border border-border bg-card py-4 pl-10 pr-4 text-sm font-medium outline-none transition-colors focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="mb-4 block text-sm font-semibold text-foreground">
                Metode pembayaran
              </label>
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentType(method.id)}
                    className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                      paymentType === method.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-card hover:border-primary/50'
                    }`}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                      paymentType === method.id ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'
                    }`}>
                      {method.icon === 'qr' ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="7" height="7" rx="1" />
                          <rect x="14" y="3" width="7" height="7" rx="1" />
                          <rect x="3" y="14" width="7" height="7" rx="1" />
                          <path d="M14 14h3v3h-3z" />
                          <path d="M20 14v3" />
                          <path d="M14 20h3" />
                          <path d="M20 20v.01" />
                        </svg>
                      ) : <Building2 size={20} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{method.label}</p>
                      <p className="text-xs text-muted-foreground">{method.description}</p>
                    </div>
                    <div className={`h-5 w-5 rounded-full border-2 ${
                      paymentType === method.id ? 'border-primary bg-primary' : 'border-border'
                    }`}>
                      {paymentType === method.id && (
                        <div className="flex h-full w-full items-center justify-center">
                          <Check size={12} className="text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Info */}
            <div className="space-y-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                  Nama (opsional)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nama kamu"
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                  Email (opsional)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="email@kamu.com"
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                  Pesan untuk TAM (opsional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Kata-kata dukungan, saran, atau apa saja"
                  maxLength={280}
                  rows={2}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-primary resize-none"
                />
                <p className="mt-1 text-xs text-muted-foreground">{message.length}/280 karakter</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`flex h-5 w-9 items-center rounded-full transition-colors ${
                    isAnonymous ? 'bg-primary' : 'bg-secondary'
                  }`}
                  aria-label="Toggle anonymous"
                >
                  <span className={`h-4 w-4 rounded-full bg-white transition-transform ${
                    isAnonymous ? 'translate-x-4' : 'translate-x-0.5'
                  }`} />
                </button>
                <span className="text-sm text-muted-foreground">
                  Sembunyikan nama saya di dinding donatur
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsRecurring(!isRecurring)}
                  className={`flex h-5 w-9 items-center rounded-full transition-colors ${
                    isRecurring ? 'bg-primary' : 'bg-secondary'
                  }`}
                  aria-label="Toggle recurring"
                >
                  <span className={`h-4 w-4 rounded-full bg-white transition-transform ${
                    isRecurring ? 'translate-x-4' : 'translate-x-0.5'
                  }`} />
                </button>
                <span className="text-sm text-muted-foreground">
                  Jadikan dukungan tetap (bulanan)
                </span>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                <AlertCircle size={18} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading || finalAmount < (paymentType === 'qris' ? 1500 : 1000)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Heart size={18} />
                  Donasi {formatRupiah(finalAmount)}
                </>
              )}
            </button>

            <p className="text-center text-xs text-muted-foreground">
              Fee transaksi ditanggung donatur. Pembayaran diproses oleh Louvin.
            </p>
          </motion.div>
        )}
        </AnimatePresence>

        <DonorWall />
      </div>
    </main>
  );
}
