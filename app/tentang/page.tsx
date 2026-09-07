import type { Metadata } from 'next';
import Link from 'next/link';
import { AboutPageSchema } from '@/components/schema/about-page-schema';
import {
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Shield,
  Compass,
  CheckCircle2,
  TrendingUp,
  Briefcase,
  Cpu,
  HeartHandshake,
  Brain,
  FileCheck,
  Search,
  Scale,
  BookOpen,
  Flame,
  Layers,
  XCircle,
  HelpCircle,
} from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';

export const metadata: Metadata = {
  title: 'Tentang Kami — TAMPARAN ANAK MUDA',
  description:
    'Manifesto editorial, visi, dan komitmen riset independen TAMPARAN ANAK MUDA. Media digital modern yang menyajikan analisis tajam, jujur, dan bertahan lama untuk generasi muda Indonesia.',
  keywords: [
    'tentang tamparan anak muda',
    'editorial media indonesia',
    'prinsip editorial',
    'jurnalisme independen',
    'manifesto tamparan anak muda',
    'analisis sosial ekonomi anak muda',
  ],
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

const pillars = [
  {
    slug: 'uang',
    title: 'Uang & Finansial',
    color: '#E63946',
    icon: TrendingUp,
    angle: 'Membedah jebakan inflasi gaya hidup, ilusi investasi spekulatif, dan realitas ekonomi riil yang dihadapi generasi muda.',
  },
  {
    slug: 'karier',
    title: 'Karier & Kerja',
    color: '#3A86FF',
    icon: Briefcase,
    angle: 'Mengupas struktur pasar tenaga kerja, negosiasi kompensasi, burnout struktural, dan politik korporasi tanpa romantisasi.',
  },
  {
    slug: 'bisnis',
    title: 'Bisnis & Industri',
    color: '#2A9D8F',
    icon: Scale,
    angle: 'Membongkar mitos startup bakar uang, dinamika rantai pasok, dan strategi membangun usaha berdaya tahan tinggi.',
  },
  {
    slug: 'teknologi',
    title: 'Teknologi & Masa Depan',
    color: '#9B5DE5',
    icon: Cpu,
    angle: 'Meneliti pergeseran AI, otomasi tenaga kerja, algoritma adiktif, serta kedaulatan data di era digital.',
  },
  {
    slug: 'kehidupan',
    title: 'Kehidupan & Sosial',
    color: '#F4A261',
    icon: HeartHandshake,
    angle: 'Menyingkap fenomena sandwich generation, isolasi sosial perkotaan, dan beban ekspektasi modern yang jarang dibicarakan.',
  },
  {
    slug: 'mindset',
    title: 'Mindset & Logika',
    color: '#00B4D8',
    icon: Brain,
    angle: 'Melatih model mental, imunitas terhadap bias kognitif, dan kerangka berpikir jernih untuk mengambil keputusan hidup.',
  },
];

const dialectics = [
  {
    myth: 'Konten motivasi 60 detik yang membuatmu merasa pintar sesaat lalu bingung besok pagi.',
    reality: 'Esai investigatif mendalam berakar riset dan data empiris yang tetap relevan bertahun-tahun kemudian.',
  },
  {
    myth: 'Menyalahkan individu atas masalah struktural ("Kamu kurang kerja keras").',
    reality: 'Menganalisis sistem sosial-ekonomi di baliknya sembari memberikan panduan langkah konkret yang realistis.',
  },
  {
    myth: 'Judul clickbait sensasional demi memaksimalkan impresi algoritma platform.',
    reality: 'Keterbukaan penuh atas sumber data, catatan rujukan, dan akuntabilitas koreksi terbuka tanpa revisi diam-diam.',
  },
  {
    myth: 'Optimisme palsu dan ilusi kenyamanan instan.',
    reality: 'Kejujuran radikal yang menyadarkan realita agar kamu bisa bertindak dengan navigasi yang akurat.',
  },
];

const editorialPrinciples = [
  {
    num: '01',
    title: 'Transparansi Data & Rujukan Primer',
    desc: 'Setiap angka, klaim statistik, dan kutipan tertaut langsung ke sumber primer terverifikasi (BPS, Bank Indonesia, laporan lembaga riset resmi).',
    badge: '100% Verifiable',
  },
  {
    num: '02',
    title: 'Akuntabilitas & Koreksi Terbuka',
    desc: 'Bila kami keliru, revisi dilakukan transparan dengan catatan pembaruan tanggal dan ringkasan koreksi. Tanpa suntingan diam-diam.',
    badge: 'Zero Silent Edits',
  },
  {
    num: '03',
    title: 'Independensi Komersial yang Tegas',
    desc: 'Kemitraan atau sponsorship selalu ditandai dengan label jelas. Pemasang iklan tidak memiliki kendali atau hak intervensi ruang redaksi.',
    badge: 'Editorial Shield',
  },
  {
    num: '04',
    title: 'Analisis Akar Masalah & Evergreen',
    desc: 'Menolak tips instan 5 menit. Kami membedah akar struktural di balik setiap fenomena agar tulisan tetap bernilai saat dibaca ulang di masa depan.',
    badge: 'Long-term Value',
  },
];

const verificationProcess = [
  {
    step: '01',
    title: 'Riset Data & Sumber Primer',
    desc: 'Mengumpulkan dokumen resmi, data statistik publik, dan jurnal terakreditasi sebelum menentukan hipotesis analisis.',
  },
  {
    step: '02',
    title: 'Uji Fakta & Pemisahan Opini',
    desc: 'Membedakan fakta objektif, premis logika, dan sudut pandang editorial dengan kriteria validasi yang ketat.',
  },
  {
    step: '03',
    title: 'Peer Review & Kurasi Humanis',
    desc: 'Naskah melewati tinjauan ketat editor untuk memastikan ketajaman narasi, etika berbahasa, dan kejelasan substansi.',
  },
  {
    step: '04',
    title: 'Publikasi Terbuka & Catatan Sumber',
    desc: 'Diterbitkan dengan modul rujukan lengkap dan kanal umpan balik publik untuk menjaga akuntabilitas jangka panjang.',
  },
];

const roadmap = [
  {
    stage: 'FASE 01',
    status: 'Aktif Berjalan',
    title: 'Publikasi & Riset Dasar',
    items: [
      'Penerbitan esai mendalam 6 pilar secara konsisten',
      'Kurasi Weekly Newsletter bernas setiap minggu',
      'Dokumentasi infografis berbasis data di media sosial',
      'Pustaka artikel evergreen bebas paywall',
    ],
  },
  {
    stage: 'FASE 02',
    status: 'Dalam Pengembangan',
    title: 'Toolkit & Riset Publik',
    items: [
      'Panduan kerja interaktif & kalkulator keputusan riil',
      'Repositori dataset publik & visualisasi ekonomi interaktif',
      'Fitur bookmark, tracking baca, dan personalisasi pembaca',
      'Sirkel diskusi pemikiran kritis terkurasi',
    ],
  },
  {
    stage: 'FASE 03',
    status: 'Visi Jangka Panjang',
    title: 'Forum Pemikiran & Edisi Fisik',
    items: [
      'Kolaborasi riset dengan akademisi & praktisi independen',
      'Ruang debat tematik berkala untuk isu krusial anak muda',
      'Penerbitan jurnal / buku antologi edisi fisik terbatas',
      'Program hibah riset mini untuk talenta muda',
    ],
  },
];

const faqs = [
  {
    q: 'Siapa yang berada di balik TAMPARAN ANAK MUDA?',
    a: 'TAMPARAN ANAK MUDA (TAM) dibangun oleh kolektif penulis, analis data, dan praktisi multidisiplin yang gelisah melihat banjirnya konten dangkal dan motivasi instan yang meninabobokan generasi muda Indonesia.',
  },
  {
    q: 'Apakah seluruh konten di website ini gratis?',
    a: 'Ya. Seluruh esai dan artikel editorial utama kami dapat diakses bebas tanpa paywall. Kami percaya bahwa literasi kritis dan data objektif adalah hak publik yang harus mudah dijangkau.',
  },
  {
    q: 'Bagaimana cara berkontribusi atau mengajukan sanggahan data?',
    a: 'Kami menyambut baik koreksi faktual, kritik data, maupun pengajuan naskah tamu berkualitas tinggi. Anda dapat menghubungi tim redaksi melalui surel di editorial@tamparananakmuda.com.',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
      <AboutPageSchema />

      {/* HERO SECTION - CINEMATIC EDITORIAL IDENTITY */}
      <section className="relative overflow-hidden pt-24 pb-20 md:pt-36 md:pb-28 border-b border-border">
        {/* Background Ambient Glow & Vignette */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[600px] w-[1000px] bg-gradient-to-b from-primary/20 via-primary/5 to-transparent blur-[160px] opacity-80" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(165,30,45,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(165,30,45,0.25),rgba(0,0,0,0))]" />

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="mx-auto max-w-4xl text-center space-y-8">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-display font-semibold tracking-wide text-primary shadow-sm backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>MANIFESTO EDITORIAL &bull; TAMPARAN ANAK MUDA</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight leading-[1.08] text-balance">
              Dunia Tidak Butuh <br className="hidden sm:inline" />
              <span className="relative inline-block mt-1">
                <span className="bg-gradient-to-r from-primary via-primary/90 to-foreground bg-clip-text text-transparent">
                  Satu Lagi Motivasi Instan.
                </span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground font-sans font-normal leading-relaxed text-balance">
              Setiap hari generasi muda dibombardir ilusi kesuksesan 60 detik yang lenyap begitu layar dimatikan. Kami hadir menyajikan analisis tajam, jujur, dan berakar pada realitas sosial-ekonomi yang sesungguhnya.
            </p>

            {/* Quick Metrics Bar */}
            <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
              <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-md text-center">
                <div className="text-2xl sm:text-3xl font-display font-bold text-primary">6 Pilar</div>
                <div className="text-xs text-muted-foreground mt-1">Liputan Multidisiplin</div>
              </div>
              <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-md text-center">
                <div className="text-2xl sm:text-3xl font-display font-bold text-foreground">100%</div>
                <div className="text-xs text-muted-foreground mt-1">Rujukan Terbuka</div>
              </div>
              <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-md text-center">
                <div className="text-2xl sm:text-3xl font-display font-bold text-foreground">0%</div>
                <div className="text-xs text-muted-foreground mt-1">Clickbait Algoritma</div>
              </div>
              <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-md text-center">
                <div className="text-2xl sm:text-3xl font-display font-bold text-primary">Bebas</div>
                <div className="text-xs text-muted-foreground mt-1">Akses Paywall</div>
              </div>
            </div>

            {/* Quick Action Links */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/artikel"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-display font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-105"
              >
                <span>Jelajahi Arsip Tulisan</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#filosofi"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card/80 px-6 py-3.5 text-sm font-display font-semibold text-foreground hover:bg-muted/80 transition-all"
              >
                <span>Baca Filosofi Kami</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* PHILOSOPHY CARD - TAMPARAN VS PELUKAN */}
      <section id="filosofi" className="py-20 md:py-32 border-b border-border bg-card/40 relative">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mx-auto max-w-5xl space-y-16">
            
            {/* Highlight Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-card via-card/90 to-primary/10 p-8 sm:p-12 md:p-14 shadow-2xl backdrop-blur-md">
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
              
              <div className="grid gap-8 lg:grid-cols-12 items-center relative z-10">
                <div className="lg:col-span-5 space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-display font-semibold text-primary">
                    <Flame className="h-3.5 w-3.5" />
                    <span>FILOSOFI DASAR</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight leading-tight">
                    Mengapa &ldquo;Tamparan&rdquo;, <br />
                    Bukan &ldquo;Pelukan&rdquo;?
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Nama ini bukan tentang kekerasan fisik, melainkan metafora kejujuran intelektual yang memecah kabut ilusi.
                  </p>
                </div>

                <div className="lg:col-span-7 space-y-6 lg:border-l lg:border-border lg:pl-10">
                  <blockquote className="font-display text-xl sm:text-2xl md:text-3xl font-bold italic leading-snug text-foreground">
                    &ldquo;Pelukan menenangkan emosi sesaat. Tamparan membangunkan kesadaran selamanya.&rdquo;
                  </blockquote>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Ketika kamu sedang tersesat di tengah hutan, kamu tidak butuh seseorang yang memelukmu dan berbisik bahwa segalanya baik-baik saja. Kamu membutuhkan kompas yang akurat, peta medan yang jujur, dan peringatan tegas tentang jurang di depanmu.
                  </p>
                  <div className="flex items-center gap-3 pt-2 text-xs font-display font-semibold text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Rasionalitas di atas kepalsuan emosional</span>
                  </div>
                </div>
              </div>
            </div>

            {/* DIALECTIC COMPARISON (MITOS VS REALITA) */}
            <div className="space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-display font-semibold tracking-widest text-primary uppercase">
                  Kontras Editorial
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">
                  Yang Diberikan Media Umum vs Sikap Kami
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {dialectics.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-border bg-card p-6 space-y-4 hover:border-primary/40 transition-colors shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full bg-destructive/10 p-1 text-destructive shrink-0">
                        <XCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-display font-bold uppercase tracking-wider text-muted-foreground">
                          Ilusi Populer
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                          {item.myth}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-border/60 pt-3 flex items-start gap-3">
                      <div className="mt-0.5 rounded-full bg-primary/10 p-1 text-primary shrink-0">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-display font-bold uppercase tracking-wider text-primary">
                          Komitmen TAM
                        </div>
                        <p className="text-sm font-medium text-foreground mt-1 leading-relaxed">
                          {item.reality}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6 PILAR LIPUTAN & BIDANG RISET */}
      <section className="py-20 md:py-32 border-b border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mx-auto max-w-5xl space-y-16">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-display font-semibold text-primary">
                <Layers className="h-3.5 w-3.5" />
                <span>CAKUPAN RISET</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight">
                Enam Pilar Analisis Mendalam
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Kami tidak menulis tentang segalanya. Kami fokus pada enam dimensi krusial yang menentukan masa depan dan kemandirian anak muda Indonesia.
              </p>
            </div>

            {/* Pillar Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pillars.map((pillar) => {
                const IconComponent = pillar.icon;
                return (
                  <Link
                    key={pillar.slug}
                    href={`/kategori/${pillar.slug}`}
                    className="group relative flex flex-col justify-between rounded-3xl border border-border bg-card p-7 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-110"
                          style={{
                            backgroundColor: `${pillar.color}15`,
                            color: pillar.color,
                          }}
                        >
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-mono font-medium text-muted-foreground group-hover:text-primary transition-colors">
                          Lihat Kategori &rarr;
                        </span>
                      </div>
                      <h3 className="text-xl font-display font-bold text-foreground group-hover:text-primary transition-colors">
                        {pillar.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {pillar.angle}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs font-display font-semibold text-primary">
                      <span>Eksplorasi Artikel</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </Link>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* PRINSIP AKUNTABILITAS EDITORIAL */}
      <section id="prinsip-editorial" className="py-20 md:py-32 border-b border-border bg-muted/15">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mx-auto max-w-5xl space-y-16">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-display font-semibold text-primary">
                <Shield className="h-3.5 w-3.5" />
                <span>STANDAR AKUNTABILITAS</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight">
                Janji Editorial Tertulis
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Empat fondasi etika dan metodologi yang mengikat setiap naskah yang terbit di TAMPARAN ANAK MUDA.
              </p>
            </div>

            {/* Principles Cards */}
            <div className="grid gap-6 md:grid-cols-2">
              {editorialPrinciples.map((item) => (
                <div
                  key={item.num}
                  className="group rounded-3xl border border-border bg-card p-8 space-y-5 hover:border-primary/50 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-primary px-2.5 py-1 rounded-lg bg-primary/10">
                        {item.num}
                      </span>
                      <span className="text-[11px] font-display font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="text-xl font-display font-bold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <div className="h-1 w-12 rounded-full bg-primary/20 group-hover:w-full group-hover:bg-primary transition-all duration-300" />
                  </div>
                </div>
              ))}
            </div>

            {/* Editorial Policy Link */}
            <div className="text-center">
              <Link
                href="/kebijakan-editorial"
                className="inline-flex items-center gap-2 text-sm font-display font-semibold text-primary hover:underline"
              >
                <span>Baca Dokumen Lengkap Kebijakan Editorial & Standar Koreksi</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* VERIFICATION & PRODUCTION PIPELINE */}
      <section className="py-20 md:py-32 border-b border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mx-auto max-w-5xl space-y-16">
            
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-display font-semibold text-primary">
                <FileCheck className="h-3.5 w-3.5" />
                <span>ALUR PRODUKSI</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight">
                Bagaimana Satu Esai Lahir?
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Kami menerapkan siklus verifikasi 4 lapis sebelum sebuah artikel dinyatakan layak tayang ke hadapan pembaca.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {verificationProcess.map((proc) => (
                <div
                  key={proc.step}
                  className="relative rounded-3xl border border-border bg-card p-6 space-y-4 flex flex-col justify-between hover:border-primary/40 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="text-3xl font-display font-extrabold text-primary/40">
                      {proc.step}
                    </div>
                    <h3 className="text-lg font-display font-bold text-foreground">
                      {proc.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {proc.desc}
                    </p>
                  </div>
                  <div className="h-0.5 w-full bg-border" />
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ROADMAP & VISI PENGEMBANGAN */}
      <section className="py-20 md:py-32 border-b border-border bg-card/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mx-auto max-w-5xl space-y-16">
            
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-display font-semibold text-primary">
                <Compass className="h-3.5 w-3.5" />
                <span>PETA JALAN</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight">
                Membangun Institusi Jangka Panjang
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                TAMPARAN ANAK MUDA bukan proyek temporer. Ini adalah pembangunan ekosistem pemikiran yang bertumbuh secara terukur.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {roadmap.map((block, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl border border-border bg-card p-7 space-y-6 flex flex-col justify-between shadow-sm hover:border-primary/40 transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-mono font-bold text-primary">
                        {block.stage}
                      </span>
                      <span className="text-[11px] font-sans font-medium text-muted-foreground">
                        {block.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-display font-bold text-foreground">
                      {block.title}
                    </h3>
                    <ul className="space-y-3 pt-4 border-t border-border/60">
                      {block.items.map((item, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-2.5 leading-relaxed">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mx-auto max-w-4xl space-y-12">
            
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-display font-semibold text-primary">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>TANYA JAWAB</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-display font-bold tracking-tight">
                Pertanyaan yang Sering Diajukan
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-3"
                >
                  <h3 className="text-base sm:text-lg font-display font-bold text-foreground flex items-center gap-3">
                    <span className="text-primary font-mono text-sm">Q{index + 1}.</span>
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-7">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-24 md:py-36 relative overflow-hidden bg-gradient-to-b from-background via-card/60 to-background">
        <div className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 h-[400px] w-[800px] bg-primary/10 blur-[140px] opacity-70" />
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <div className="mx-auto max-w-3xl space-y-8">
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight leading-tight">
              Siap Menyadari Realitas <br className="hidden sm:inline" />
              dan Mengambil Kendali?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Jelajahi ratusan artikel, esai investigasi, dan analisis kritis yang dirancang untuk memperluas cakrawala berpikirmu.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/artikel"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-display font-bold text-primary-foreground shadow-xl hover:bg-primary/90 transition-all hover:scale-105"
              >
                <span>Mulai Membaca Sekarang</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/newsletter"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-7 py-4 text-sm font-display font-bold text-foreground hover:bg-muted transition-all"
              >
                <span>Berlangganan Newsletter Mingguan</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
