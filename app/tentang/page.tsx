import type { Metadata } from 'next';
import Link from 'next/link';
import { AboutPageSchema } from '@/components/schema/about-page-schema';
import { ArrowUpRight, Sparkles, Shield, Compass, Layers, CheckCircle } from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';

export const metadata: Metadata = {
  title: 'Tentang Kami — TAMPARAN ANAK MUDA',
  description:
    'Manifesto editorial, visi, dan komitmen riset independen TAMPARAN ANAK MUDA. Media digital modern yang menyajikan analisis tajam, jujur, dan bertahan lama.',
  keywords: ['tentang tamparan anak muda', 'editorial media indonesia', 'prinsip editorial', 'jurnalisme independen'],
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${siteUrl}/tentang`,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: `${siteUrl}/tentang`,
    siteName: 'TAMPARAN ANAK MUDA',
    title: 'Tentang Kami — TAMPARAN ANAK MUDA',
    description:
      'Manifesto editorial, visi, dan komitmen riset independen TAMPARAN ANAK MUDA. Media digital modern yang menyajikan analisis tajam, jujur, dan bertahan lama.',
    images: [
      {
        url: 'https://cdn.tamparananakmuda.com/og/homepage-feature.webp',
        width: 1600,
        height: 900,
        alt: 'Tentang TAMPARAN ANAK MUDA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tentang Kami — TAMPARAN ANAK MUDA',
    description:
      'Manifesto editorial, visi, dan komitmen riset independen TAMPARAN ANAK MUDA. Media digital modern yang menyajikan analisis tajam, jujur, dan bertahan lama.',
    images: ['https://cdn.tamparananakmuda.com/og/homepage-feature.webp'],
  },
};

const prinsipEditorial = [
  {
    num: '01',
    title: 'Transparansi Data & Rujukan',
    desc: 'Semua angka, kutipan, dan statistik selalu tertaut pada sumber asli yang terverifikasi.',
  },
  {
    num: '02',
    title: 'Akuntabilitas Koreksi Publik',
    desc: 'Revisi dilakukan secara terbuka dengan catatan transparan. Tanpa suntingan diam-diam.',
  },
  {
    num: '03',
    title: 'Independensi Komersial',
    desc: 'Kemitraan atau sponsorship selalu diberi label tegas. Analisis editorial bebas intervensi.',
  },
  {
    num: '04',
    title: 'Analisis Akar Masalah',
    desc: 'Menghindari tips instan 5 menit. Kami membedah konteks sistemik di balik setiap fenomena.',
  },
];

const misi = [
  {
    title: 'Evergreen Analysis',
    desc: 'Tulisan yang tetap berbobot dan bernilai ketika dibaca ulang hingga beberapa tahun mendatang.',
  },
  {
    title: 'Verifiable Claims',
    desc: 'Menghilangkan asumsi tanpa rujukan. Setiap argumen dibangun di atas fakta publik.',
  },
  {
    title: 'Perspektif Berbasis Bukti',
    desc: 'Opini disampaikan tegas berbasis data empiris, bukan netralitas palsu.',
  },
  {
    title: 'Akses Pengetahuan Terbuka',
    desc: 'Seluruh karya editorial utama dapat diakses bebas oleh siapapun tanpa dinding bayar.',
  },
];

const roadmap = [
  {
    stage: 'FASE 01',
    title: 'Publikasi & Riset Dasar',
    items: ['Artikel editorial mendalam 6 pilar', 'Weekly Newsletter tertulis', 'Dokumentasi sosial faktual'],
  },
  {
    stage: 'FASE 02',
    title: 'Toolkit & Komunitas',
    items: ['Panduan kerja & riset terbuka', 'Dataset publik interaktif', 'Komunitas diskusi terbatas'],
  },
  {
    stage: 'FASE 03',
    title: 'Forum & Edisi Cetak',
    items: ['Kolaborasi dengan peneliti pakar', 'Ruang diskusi tematik', 'Publikasi cetak terbatasi'],
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
      <AboutPageSchema />

      {/* ULTRA MODERN HERO WITH GLASS CARDS & GRADIENTS */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24 border-b border-border/40">
        {/* Modern Ambient Radial Background */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[500px] w-[800px] bg-gradient-to-tr from-primary/10 via-accent/15 to-transparent blur-[140px] opacity-70" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="mx-auto max-w-4xl space-y-8 text-center">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Manifesto Editorial &bull; V.2026</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.15] text-balance">
              Dunia Tidak Membutuhkan <br />
              <span className="bg-gradient-to-r from-primary via-foreground to-muted-foreground bg-clip-text text-transparent font-semibold italic">
                Satu Lagi Motivasi Instan.
              </span>
            </h1>

            {/* Sub-text */}
            <p className="mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground font-normal leading-relaxed text-balance">
              Setiap hari anak muda dibombardir konten inspiratif 60 detik yang habis dikonsumsi lalu dilupakan. Kami hadir memberikan analisis mendalam tentang ekonomi, kerja, dan kenyataan sosial yang sesungguhnya.
            </p>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY FEATURED CARD (TAMPARAN VS PELUKAN) */}
      <section className="py-16 md:py-24 border-b border-border/40 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-b from-card/80 to-card/40 p-8 sm:p-12 shadow-xl backdrop-blur-sm">
              <div className="grid gap-8 lg:grid-cols-12 items-center">
                
                <div className="lg:col-span-5 space-y-3">
                  <span className="text-xs font-medium tracking-wider text-primary uppercase">Filosofi Nama</span>
                  <h2 className="text-2xl sm:text-3xl font-medium tracking-tight">
                    Mengapa &ldquo;Tamparan&rdquo;, <br className="hidden sm:inline" />Bukan &ldquo;Pelukan&rdquo;?
                  </h2>
                </div>

                <div className="lg:col-span-7 space-y-4 border-l border-border/60 pl-0 lg:pl-8">
                  <blockquote className="text-lg sm:text-xl font-normal italic leading-relaxed text-foreground">
                    &ldquo;Pelukan menenangan emosi sejenak, tetapi Tamparan membangunkan kesadaran.&rdquo;
                  </blockquote>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Terkadang yang kamu butuhkan bukanlah kata-kata penenang, melainkan analisis jujur berbasis fakta yang menjelaskan situasi sebenarnya di balik sistem yang sedang kamu hadapi.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VISI & MISI SECTION */}
      <section className="py-16 md:py-24 border-b border-border/40">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl space-y-16">
            
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-medium tracking-wider text-primary uppercase">Arah & Purpose</span>
              <h2 className="text-2xl sm:text-4xl font-medium tracking-tight">Visi &amp; Misi Operasional</h2>
              <p className="text-sm text-muted-foreground">Komitmen kami untuk membangun media editorial anak muda yang independen dan berbobot.</p>
            </div>

            {/* Visi Grid */}
            <div className="grid gap-8 lg:grid-cols-12 items-stretch">
              
              <div className="lg:col-span-5 rounded-2xl border border-primary/20 bg-primary/5 p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Compass className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-widest text-primary font-medium">Visi Utama</span>
                  <h3 className="text-xl font-medium leading-snug">
                    Menjadi Institusi Editorial Terdepan Anak Muda Indonesia.
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Menyajikan analisis kritis, jujur, dan bertahan lama yang membedah kenyataan di balik narasi populer secara independen.
                </p>
              </div>

              <div className="lg:col-span-7 grid gap-4 sm:grid-cols-2">
                {misi.map((item, idx) => (
                  <div key={idx} className="rounded-2xl border border-border/60 bg-card p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-foreground font-mono text-xs font-medium">
                      0{idx + 1}
                    </div>
                    <h4 className="font-medium text-base">{item.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* PRINSIP EDITORIAL GRID */}
      <section className="py-16 md:py-24 border-b border-border/40 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl space-y-12">
            
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-medium tracking-wider text-primary uppercase">Kode Etik</span>
              <h2 className="text-2xl sm:text-4xl font-medium tracking-tight">Prinsip Akuntabilitas Editorial</h2>
              <p className="text-sm text-muted-foreground">Empat janji tertulis yang kami pegang dalam setiap publikasi naskah.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {prinsipEditorial.map((item) => (
                <div key={item.num} className="group rounded-2xl border border-border/60 bg-card p-8 space-y-4 hover:border-primary/40 transition-all shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-medium text-primary">{item.num}</span>
                    <Shield className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ROADMAP STAGES */}
      <section className="py-16 md:py-24 border-b border-border/40">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl space-y-12">
            
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-medium tracking-wider text-primary uppercase">Tahapan Kerja</span>
              <h2 className="text-2xl sm:text-4xl font-medium tracking-tight">Peta Jalan Pengembangan</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {roadmap.map((block, idx) => (
                <div key={idx} className="rounded-2xl border border-border/60 bg-card p-6 space-y-4">
                  <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[11px] font-mono font-medium text-primary">
                    {block.stage}
                  </span>
                  <h3 className="font-medium text-base">{block.title}</h3>
                  <ul className="space-y-2 pt-2 border-t border-border/40">
                    {block.items.map((item, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* MODERN CTA BANNER */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl space-y-6">
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight">
              Siap Membaca Analisis yang Sebenarnya?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Jelajahi kumpulan artikel, riset, dan analisis sosial-ekonomi yang dirancang khusus untuk memperluas pemahamanmu.
            </p>
            <div className="pt-4">
              <Link
                href="/artikel"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-lg hover:opacity-90 transition-all hover:scale-105"
              >
                <span>Mulai Membaca Artikel</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
