'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  Building2,
  QrCode,
  ShieldCheck,
  Sparkles,
  Zap,
  Lock,
  HelpCircle,
  ChevronDown,
  Clock,
} from 'lucide-react';
import QRCode from 'qrcode';
import { DonationGoalBar } from '@/components/donation-goal-bar';
import { DonorWall } from '@/components/donor-wall';
import { Turnstile } from '@/components/turnstile';
import { trackEvent } from '@/lib/track';

const presetAmounts = [
  { value: 25000, label: 'Rp 25K', desc: 'Secangkir kopi riset data' },
  { value: 50000, label: 'Rp 50K', desc: 'Biayai 1 esai analisis mendalam' },
  { value: 100000, label: 'Rp 100K', desc: 'Sokong cloud & arsip merdeka' },
  { value: 250000, label: 'Rp 250K', desc: 'Patron utama independensi TAM' },
];

const paymentMethods = [
  {
    id: 'qris',
    label: 'QRIS Instan',
    badge: 'Paling Populer',
    description: 'GoPay, OVO, DANA, ShopeePay, BCA, Mandiri & e-wallet lain',
    icon: 'qr',
  },
  {
    id: 'bni_va',
    label: 'BNI Virtual Account',
    badge: 'Bank Transfer',
    description: 'Bayar via ATM, Mobile Banking, atau Internet Banking BNI',
    icon: 'bank',
  },
  {
    id: 'bri_va',
    label: 'BRI Virtual Account',
    badge: 'Bank Transfer',
    description: 'Bayar via BRImo, ATM, atau Internet Banking BRI',
    icon: 'bank',
  },
  {
    id: 'permata_va',
    label: 'Permata Virtual Account',
    badge: 'Bank Transfer',
    description: 'Bayar via PermataMobile X atau jaringan ATM Bersama / Prima',
    icon: 'bank',
  },
  {
    id: 'cimb_niaga_va',
    label: 'CIMB Niaga VA',
    badge: 'Bank Transfer',
    description: 'Bayar via OCTO Mobile, OCTO Clicks, atau ATM CIMB',
    icon: 'bank',
  },
];

const faqItems = [
  {
    q: 'Apakah saya bisa berdonasi secara anonim?',
    a: 'Tentu saja. Anda cukup mengaktifkan tombol "Sembunyikan nama saya di dinding donatur". Nama dan identitas Anda tidak akan pernah dipublikasikan di situs ini.',
  },
  {
    q: 'Ke mana saja dana donasi ini dialokasikan?',
    a: '50% dialokasikan langsung untuk riset literatur dan kompensasi penulis muda, 30% untuk pemeliharaan server, database, dan engine AI publik (TAMI), serta 20% untuk pengarsipan dokumen digital terbuka tanpa iklan.',
  },
  {
    q: 'Apakah TAM memasang paywall untuk konten premium?',
    a: 'Tidak akan pernah. Prinsip dasar Tamparan Anak Muda adalah akses pengetahuan gratis dan merdeka untuk seluruh pemuda Indonesia. Donasi Anda memastikan konten kami tetap terbuka untuk siapa saja.',
  },
  {
    q: 'Bagaimana jika pembayaran saya terpotong tapi status belum berubah?',
    a: 'Sistem webhook payment gateway Louvin bekerja secara otomatis dalam hitungan detik. Jika terjadi penundaan jaringan dari bank, status transaksi akan tetap tersinkronisasi otomatis begitu verifikasi diterima.',
  },
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

export default function DonasiForm() {
  const [amount, setAmount] = useState<number>(50000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentType, setPaymentType] = useState<string>('qris');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transaction, setTransaction] = useState<TransactionData | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>('pending');
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileKey, setTurnstileKey] = useState(0);

  const finalAmount = customAmount ? parseInt(customAmount, 10) || 0 : amount;

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
          turnstile_token: turnstileToken || undefined,
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
          width: 240,
          margin: 1,
          color: { dark: '#000000', light: '#ffffff' },
        });
        setQrDataUrl(url);
      }
    } catch {
      setError('Terjadi kesalahan koneksi. Silakan coba kembali.');
      setTurnstileToken(null);
      setTurnstileKey((k) => k + 1);
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
        if (data.status === 'settled' && transaction) {
          trackEvent('donation_completed', {
            amount: transaction.transaction.net_amount,
          });
        }
      }
    } catch {
      // silent fail
    }
  }, [transaction]);

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
    <main className="relative min-h-screen bg-background overflow-hidden pt-24 pb-28 md:pt-32 md:pb-36">
      {/* Ambient background glows */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(225,29,72,0.12),transparent_70%)] pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute top-96 right-[-15%] w-[450px] h-[450px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header / Hero Statement */}
        <div className="max-w-3xl mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-widest mb-6">
            <Heart size={13} className="fill-primary text-primary" />
            <span>KOMITMEN INDEPENDENSI • TAMPARAN ANAK MUDA</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.08] mb-6">
            Jaga Ruang Pikir Ini Tetap{' '}
            <span className="italic font-serif text-primary font-normal">Merdeka &amp; Bebas Sponsor.</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Tamparan Anak Muda berdiri tanpa uang oligarki, tanpa paywall, dan tanpa kompromi iklan terselubung.
            Setiap tulisan kami hadir murni berkat solidaritas pembaca yang percaya bahwa akal sehat publik harus terus dipertahankan.
          </p>

          {/* Quick value props */}
          <div className="mt-8 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-foreground/80">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 backdrop-blur-sm px-3.5 py-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>100% Bebas Intervensi Sponsor</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 backdrop-blur-sm px-3.5 py-1.5">
              <Zap className="w-4 h-4 text-primary" />
              <span>0 Rupiah Paywall — Terbuka Selamanya</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 backdrop-blur-sm px-3.5 py-1.5">
              <Lock className="w-4 h-4 text-primary" />
              <span>Dukungan Terverifikasi &amp; Aman</span>
            </div>
          </div>
        </div>

        {/* Two-column layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: Editorial Narrative, Allocation & Accountability */}
          <div className="lg:col-span-7 space-y-8">
            {/* Monthly Goal Tracker */}
            <DonationGoalBar />

            {/* Editorial Independence Manifesto */}
            <div className="rounded-2xl border border-border/80 bg-card/50 backdrop-blur-sm p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
                  Mengapa Kami Menolak Sponsor Korporasi &amp; Partai?
                </h2>
              </div>

              <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                  Media di Indonesia hari ini terjebak dalam dua jurang: ketergantungan pada anggaran pencitraan (advertorial) atau tunduk pada algoritma clickbait yang mendegradasi kecerdasan publik.
                </p>
                <p>
                  Di <strong className="text-foreground font-semibold">Tamparan Anak Muda</strong>, kami memilih jalan ketiga: bertahan sepenuhnya lewat pembaca. Kami tidak punya dewan komisaris konglomerat yang menyortir mana isu yang aman dikritisi.
                </p>
              </div>

              {/* 3 Principles Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="rounded-xl border border-border/60 bg-background/50 p-4">
                  <span className="font-mono text-xs font-bold text-primary">01.</span>
                  <h4 className="mt-1 text-sm font-semibold text-foreground">Otonomi Redaksi</h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    Tulisan lahir dari analisis data dan kegelisahan generasi, bukan pesanan humas.
                  </p>
                </div>

                <div className="rounded-xl border border-border/60 bg-background/50 p-4">
                  <span className="font-mono text-xs font-bold text-primary">02.</span>
                  <h4 className="mt-1 text-sm font-semibold text-foreground">Akses Tanpa Kelas</h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    Pengetahuan tidak boleh dikunci di balik paywall. Semua orang berhak membaca gratis.
                  </p>
                </div>

                <div className="rounded-xl border border-border/60 bg-background/50 p-4">
                  <span className="font-mono text-xs font-bold text-primary">03.</span>
                  <h4 className="mt-1 text-sm font-semibold text-foreground">Etika Transparansi</h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    Setiap rupiah donasi terhitung untuk keberlanjutan infrastruktur dan kompensasi penulis.
                  </p>
                </div>
              </div>
            </div>

            {/* Fund Allocation Breakdown */}
            <div className="rounded-2xl border border-border/80 bg-card/50 backdrop-blur-sm p-6 sm:p-8">
              <h3 className="font-display text-lg font-bold tracking-tight text-foreground mb-4">
                Transparansi Penggunaan Dana
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-6">
                Kami mengelola dana secara hemat dan langsung tertuju pada esensi kerja literasi intelektual:
              </p>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-foreground">50% — Riset Investigasi &amp; Honorarium Penulis Muda</span>
                    <span className="text-primary font-mono">50%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '50%' }} />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Memastikan penulis muda mendapatkan apresiasi yang layak atas esai komprehensif mereka.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-foreground">30% — Infrastruktur Cloud, Database &amp; AI TAMI</span>
                    <span className="text-primary font-mono">30%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary/80 rounded-full" style={{ width: '30%' }} />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Biaya server tanpa pelacak iklan, database terdistribusi, dan komputasi asisten TAMI.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-foreground">20% — Digital Preservation &amp; Arsip Terbuka</span>
                    <span className="text-primary font-mono">20%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary/60 rounded-full" style={{ width: '20%' }} />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Perawatan dokumentasi, perpustakaan digital, serta jaminan akses publik selamanya.
                  </p>
                </div>
              </div>
            </div>

            {/* Reader Solidarity Wall */}
            <DonorWall />

            {/* Frequently Asked Questions */}
            <div className="rounded-2xl border border-border/80 bg-card/50 backdrop-blur-sm p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
                  Pertanyaan Sering Diajukan
                </h3>
              </div>

              <div className="divide-y divide-border/60">
                {faqItems.map((item, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0">
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="flex w-full items-center justify-between text-left text-sm font-semibold text-foreground hover:text-primary transition-colors gap-4"
                        aria-expanded={isOpen}
                      >
                        <span>{item.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-primary' : ''
                          }`}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                              {item.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Donation Console (Sticky on Desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="relative rounded-3xl border border-border/80 bg-card/75 backdrop-blur-xl shadow-2xl p-6 sm:p-8 overflow-hidden">
              {/* Subtle top glow bar */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

              <AnimatePresence mode="wait">
                {paymentStatus === 'settled' ? (
                  /* PAYMENT SUCCESS VIEW */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="text-center py-6"
                  >
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary animate-pulse">
                      <Heart size={40} className="fill-primary" />
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-500 mb-3">
                      <Check size={14} /> Pembayaran Terkonfirmasi
                    </span>

                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">
                      Terima Kasih, Patron!
                    </h2>
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                      Solidaritas Anda resmi diterima. Bantuan ini menjaga ruang redaksi TAM tetap kritis, independen, dan tegak tanpa kompromi.
                    </p>

                    <div className="rounded-2xl border border-border/80 bg-secondary/40 p-4 mb-6 text-left">
                      <div className="flex justify-between items-center text-xs text-muted-foreground pb-2 border-b border-border/50">
                        <span>Status</span>
                        <span className="font-semibold text-emerald-500">Berhasil Diterima</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-xs text-muted-foreground">Total Donasi</span>
                        <span className="font-mono text-base font-bold text-foreground">
                          {transaction && formatRupiah(transaction.transaction.net_amount)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setTransaction(null);
                        setPaymentStatus('pending');
                        setQrDataUrl('');
                      }}
                      className="w-full rounded-full border border-border/80 bg-background py-3.5 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
                    >
                      Berdonasi Lagi
                    </button>
                  </motion.div>
                ) : transaction ? (
                  /* PAYMENT INSTRUCTIONS VIEW (QRIS OR VIRTUAL ACCOUNT) */
                  <motion.div
                    key="payment-pending"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between pb-4 border-b border-border/60">
                      <div>
                        <h3 className="font-display text-lg font-bold text-foreground">
                          Menunggu Pembayaran
                        </h3>
                        <p className="text-xs text-muted-foreground">Selesaikan sebelum waktu berakhir</p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-500 animate-pulse">
                        <Clock size={12} />
                        Pending
                      </span>
                    </div>

                    {transaction.payment.qr_string ? (
                      /* QRIS DISPLAY */
                      <div className="flex flex-col items-center">
                        <div className="mb-4 rounded-2xl border-2 border-border/80 bg-white p-4 shadow-md">
                          {qrDataUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={qrDataUrl} alt="QRIS Code" width={220} height={220} className="rounded-lg" />
                          ) : (
                            <div className="w-[220px] h-[220px] flex items-center justify-center text-zinc-400">
                              <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                          )}
                        </div>

                        <div className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground mb-4">
                          <QrCode className="w-4 h-4 text-primary" />
                          <span>Scan pakai GoPay, OVO, DANA, BCA, atau mobile banking</span>
                        </div>

                        <div className="w-full rounded-xl border border-border/80 bg-secondary/30 p-4 text-center mb-4">
                          <p className="text-xs text-muted-foreground mb-1">Nominal Pas yang Harus Dibayar</p>
                          <p className="font-display text-2xl sm:text-3xl font-bold text-foreground font-mono">
                            {formatRupiah(transaction.payment.total_payment)}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-1">
                            Batas waktu:{' '}
                            <span className="font-semibold text-foreground/80">
                              {new Date(transaction.payment.expired_at).toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}{' '}
                              WIB
                            </span>
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* VIRTUAL ACCOUNT DISPLAY */
                      <div className="space-y-4">
                        <div className="rounded-2xl border border-border/80 bg-secondary/40 p-5 text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Building2 className="w-4 h-4 text-primary" />
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                              {transaction.payment.bank || 'Bank'} Virtual Account
                            </span>
                          </div>

                          <div className="my-3 rounded-xl border border-border/60 bg-background p-3">
                            <p className="font-mono text-xl sm:text-2xl font-bold tracking-widest text-foreground select-all">
                              {transaction.payment.va_number}
                            </p>
                          </div>

                          <button
                            onClick={() => copyToClipboard(transaction.payment.va_number || '')}
                            className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
                          >
                            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                            <span>{copied ? 'Nomor Berhasil Disalin!' : 'Salin Nomor VA'}</span>
                          </button>
                        </div>

                        <div className="rounded-xl border border-border/80 bg-secondary/30 p-4 text-center">
                          <p className="text-xs text-muted-foreground mb-1">Total yang Harus Ditransfer</p>
                          <p className="font-display text-2xl font-bold text-foreground font-mono">
                            {formatRupiah(transaction.payment.total_payment)}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-1">
                            Berlaku sampai:{' '}
                            <span className="font-semibold text-foreground/80">
                              {new Date(transaction.payment.expired_at).toLocaleString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Auto-polling indicator */}
                    <div className="flex items-center justify-center gap-2 rounded-xl bg-primary/5 border border-primary/10 p-3 text-xs text-muted-foreground">
                      <Loader2 size={14} className="animate-spin text-primary shrink-0" />
                      <span>Sistem otomatis mendeteksi ketika pembayaran Anda berhasil...</span>
                    </div>

                    <button
                      onClick={() => {
                        setTransaction(null);
                        setPaymentStatus('pending');
                        setQrDataUrl('');
                      }}
                      className="w-full rounded-full border border-border/80 py-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      Batal / Ganti Metode Pembayaran
                    </button>
                  </motion.div>
                ) : (
                  /* DONATION FORM VIEW */
                  <motion.div
                    key="form-entry"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {/* Header console */}
                    <div>
                      <h3 className="font-display text-xl font-bold tracking-tight text-foreground mb-1">
                        Formulir Solidaritas
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Pilih nominal dan metode pembayaran favorit Anda.
                      </p>
                    </div>

                    {/* Frequency selector: Sekali vs Bulanan */}
                    <div className="grid grid-cols-2 gap-2 rounded-xl border border-border/80 bg-background/60 p-1">
                      <button
                        type="button"
                        onClick={() => setIsRecurring(false)}
                        className={`rounded-lg py-2 text-xs font-semibold transition-all ${
                          !isRecurring
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        Donasi Sekali
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsRecurring(true)}
                        className={`relative rounded-lg py-2 text-xs font-semibold transition-all ${
                          isRecurring
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <span>Patron Bulanan</span>
                        <span className="absolute -top-2 -right-1 rounded-full bg-emerald-500 px-1.5 py-0.2 text-[9px] font-bold text-white shadow">
                          Rutin
                        </span>
                      </button>
                    </div>

                    {/* Amount Presets */}
                    <div>
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Pilih Nominal Dukungan
                      </label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {presetAmounts.map((preset) => {
                          const isSelected = !customAmount && amount === preset.value;
                          return (
                            <button
                              key={preset.value}
                              type="button"
                              onClick={() => {
                                setAmount(preset.value);
                                setCustomAmount('');
                              }}
                              className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                                isSelected
                                  ? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary/40'
                                  : 'border-border/80 bg-background/50 hover:border-primary/40'
                              }`}
                            >
                              <span
                                className={`font-display text-base font-bold ${
                                  isSelected ? 'text-primary' : 'text-foreground'
                                }`}
                              >
                                {preset.label}
                              </span>
                              <span className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                                {preset.desc}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Custom Amount Input */}
                      <div className="mt-3 relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                          Rp
                        </span>
                        <input
                          type="number"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          placeholder="Nominal kustom (cth: 150000)"
                          min={1000}
                          className="w-full rounded-xl border border-border/80 bg-background/60 py-3 pl-10 pr-4 text-xs font-medium outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/50"
                        />
                      </div>
                    </div>

                    {/* Payment Method Selector */}
                    <div>
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Metode Pembayaran
                      </label>
                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                        {paymentMethods.map((method) => {
                          const isSelected = paymentType === method.id;
                          return (
                            <button
                              key={method.id}
                              type="button"
                              onClick={() => setPaymentType(method.id)}
                              className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                                isSelected
                                  ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                                  : 'border-border/60 bg-background/50 hover:border-primary/40'
                              }`}
                            >
                              <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                  isSelected
                                    ? 'bg-primary/15 text-primary'
                                    : 'bg-secondary text-muted-foreground'
                                }`}
                              >
                                {method.icon === 'qr' ? (
                                  <QrCode size={18} />
                                ) : (
                                  <Building2 size={18} />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-xs font-semibold text-foreground truncate">
                                    {method.label}
                                  </p>
                                  <span className="text-[9px] rounded-full bg-secondary px-1.5 py-0.2 text-muted-foreground shrink-0 font-medium">
                                    {method.badge}
                                  </span>
                                </div>
                                <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                                  {method.description}
                                </p>
                              </div>

                              <div
                                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                                  isSelected
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-border'
                                }`}
                              >
                                {isSelected && <Check size={10} />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Supporter Details (Optional) */}
                    <div className="space-y-3 pt-2 border-t border-border/60">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Profil Pendukung
                        </label>
                        <span className="text-[10px] text-muted-foreground">Opsional</span>
                      </div>

                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Nama atau inisial Anda"
                        className="w-full rounded-xl border border-border/80 bg-background/60 px-3.5 py-2.5 text-xs outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/50"
                      />

                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="Email (untuk resi digital bukti transfer)"
                        className="w-full rounded-xl border border-border/80 bg-background/60 px-3.5 py-2.5 text-xs outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/50"
                      />

                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tulis pesan penyemangat atau catatan untuk redaksi TAM..."
                        maxLength={280}
                        rows={2}
                        className="w-full rounded-xl border border-border/80 bg-background/60 px-3.5 py-2.5 text-xs outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/50 resize-none"
                      />

                      {/* Anonymous toggle */}
                      <div className="flex items-center gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsAnonymous(!isAnonymous)}
                          className={`relative flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                            isAnonymous ? 'bg-primary' : 'bg-secondary'
                          }`}
                          aria-label="Toggle anonymous"
                        >
                          <span
                            className={`h-4 w-4 rounded-full bg-white transition-transform ${
                              isAnonymous ? 'translate-x-4' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                        <span className="text-xs text-muted-foreground">
                          Sembunyikan nama saya di Dinding Solidaritas
                        </span>
                      </div>
                    </div>

                    {/* Error Banner */}
                    {error && (
                      <div className="flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-xs text-destructive">
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Cloudflare Turnstile */}
                    <div className="pt-1 flex justify-center">
                      <Turnstile
                        key={turnstileKey}
                        onVerify={setTurnstileToken}
                        onExpire={() => setTurnstileToken(null)}
                      />
                    </div>

                    {/* Submit CTA */}
                    <button
                      onClick={handleSubmit}
                      disabled={
                        loading ||
                        !turnstileToken ||
                        finalAmount < (paymentType === 'qris' ? 1500 : 1000)
                      }
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/95 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>Menyiapkan Pembayaran...</span>
                        </>
                      ) : (
                        <>
                          <Heart size={16} className="fill-primary-foreground" />
                          <span>Kirim Dukungan {formatRupiah(finalAmount)}</span>
                        </>
                      )}
                    </button>

                    {/* Trust Footnote */}
                    <div className="flex items-center justify-center gap-3 text-[11px] text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Lock size={12} className="text-muted-foreground/80" />
                        <span>256-bit Encrypted</span>
                      </div>
                      <span>•</span>
                      <span>Gateway Resmi Louvin</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
