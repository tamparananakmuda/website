import type { Metadata } from 'next';
import Link from 'next/link';
import { AboutPageSchema } from '@/components/schema/about-page-schema';
import {
  ArrowRight,
  ArrowUpRight,
  Shield,
  Compass,
  CheckCircle2,
  TrendingUp,
  Briefcase,
  Cpu,
  HeartHandshake,
  Brain,
  FileCheck,
  Scale,
  Flame,
  Layers,
} from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';

export const metadata: Metadata = {
  title: 'Tentang Kami — TAMPARAN ANAK MUDA',
  description:
    'Alasan kenapa TAMPARAN ANAK MUDA ada. Kami menulis tentang uang, karier, bisnis, teknologi, kehidupan, dan mindset dengan jujur, berbasis data, dan tanpa motivasi instan.',
  keywords: [
    'tentang tamparan anak muda',
    'media independen anak muda',
    'alasan tamparan anak muda',
    'analisis realitas gen z',
    'literasi finansial karier indonesia',
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
      'Kami menulis tentang uang, karier, bisnis, teknologi, dan kehidupan tanpa motivasi manis. Berakar pada fakta dan realitas sosial-ekonomi yang sesungguhnya.',
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
      'Kami menulis tentang uang, karier, bisnis, teknologi, dan kehidupan tanpa motivasi manis. Berakar pada fakta dan realitas sosial-ekonomi yang sesungguhnya.',
    images: ['https://cdn.tamparananakmuda.com/og/homepage-feature.webp'],
  },
};

const pillars = [
  {
    slug: 'uang',
    title: 'Uang & Finansial',
    color: '#E63946',
    icon: TrendingUp,
    angle: 'Bukan tips hemat receh, tapi bedah inflasi, jebakan pinjol/judol, biaya hidup ugal-ugalan, dan cara mengamankan masa depan secara realistis.',
  },
  {
    slug: 'karier',
    title: 'Karier & Kerja',
    color: '#3A86FF',
    icon: Briefcase,
    angle: 'Realitas bursa kerja, cuti minim, politik kantor, negosiasi gaji, dan kenapa kerja keras membabi-buta sering kali cuma diganjar burnout.',
  },
  {
    slug: 'bisnis',
    title: 'Bisnis & Industri',
    color: '#2A9D8F',
    icon: Scale,
    angle: 'Membongkar mitos startup bakar uang, kenapa banyak bisnis anak muda gulung tikar, dan fondasi usaha riil yang menghasilkan arus kas sehat.',
  },
  {
    slug: 'teknologi',
    title: 'Teknologi & Masa Depan',
    color: '#9B5DE5',
    icon: Cpu,
    angle: 'Bagaimana algoritma medsos memanipulasi fokus kita, pergeseran AI terhadap lapangan kerja, serta cara bertahan di era otomasi digital.',
  },
  {
    slug: 'kehidupan',
    title: 'Kehidupan & Sosial',
    color: '#F4A261',
    icon: HeartHandshake,
    angle: 'Beban generasi sandwich, sepi dan isolasi di kota besar, tekanan ekspektasi sosial, dan navigasi hubungan manusia di zaman serba transaksional.',
  },
  {
    slug: 'mindset',
    title: 'Mindset & Logika',
    color: '#00B4D8',
    icon: Brain,
    angle: 'Melatih logika berpikir jernih, imunitas terhadap penipuan halus dan tren FOMO, serta cara mengambil keputusan hidup dengan kepala dingin.',
  },
];

const dialectics = [
  {
    myth: 'Konten kilat 60 detik yang membuat merasa pintar sesaat, namun langsung bingung dan cemas ketika menghadapi masalah nyata.',
    reality: 'Esai mendalam berbasis data empiris yang tetap relevan dan bernilai saat dibaca ulang bertahun-tahun kemudian.',
  },
  {
    myth: 'Menyalahkan individu secara sepihak: "Kamu susah karena kurang bangun pagi atau kurang bersyukur."',
    reality: 'Membongkar akar masalah struktural dan realitas sistemik, lalu merumuskan opsi tindakan yang rasional.',
  },
  {
    myth: 'Judul umpan klik (clickbait) berlebihan demi mengejar algoritma platform dan tayangan impresi semata.',
    reality: 'Transparansi penuh atas sumber data, catatan rujukan yang dapat diverifikasi, dan ralat terbuka jika ada kekeliruan.',
  },
  {
    myth: 'Jualan ilusi cepat kaya lewat jalan pintas dan motivasi manis yang meninabobokan.',
    reality: 'Kejujuran apa adanya yang membuka mata, agar pembaca memahami medan tempur sesungguhnya dan tidak mudah diperdaya.',
  },
];

const editorialPrinciples = [
  {
    num: '01',
    title: 'Semua Angka Punya Sumber',
    desc: 'Kami tidak membuat klaim dari udara hampa. Setiap data statistik dan kutipan berasal dari lembaga resmi (BPS, BI, OJK, riset terverifikasi) dan tertaut langsung.',
    badge: 'Terverifikasi',
  },
  {
    num: '02',
    title: 'Koreksi Terbuka Tanpa Diam-Diam',
    desc: 'Jika data atau kesimpulan kami keliru, kami perbaiki secara terbuka dengan catatan revisi di artikel. Kami menolak praktik silent edits.',
    badge: 'Akuntabel',
  },
  {
    num: '03',
    title: 'Redaksi Tidak Bisa Dibeli',
    desc: 'Tulisan bersponsor selalu diberi label transparan. Mitra komersial sama sekali tidak memiliki hak untuk mengatur opini atau kesimpulan analisis kami.',
    badge: 'Independen',
  },
  {
    num: '04',
    title: 'Menulis untuk Jangka Panjang',
    desc: 'Kami menolak mengejar gosip musiman. Kami fokus pada isu-isu fundamental yang tetap menentukan masa depan hidupmu dalam 5 hingga 10 tahun ke depan.',
    badge: 'Evergreen',
  },
];

const verificationProcess = [
  {
    step: '01',
    title: 'Riset Data & Sumber Primer',
    desc: 'Mengumpulkan laporan resmi, statistik publik, dan riset terakreditasi sebelum menyusun kerangka analisis.',
  },
  {
    step: '02',
    title: 'Uji Fakta & Logika',
    desc: 'Memisahkan data objektif dari asumsi subjektif agar argumen yang dibangun kokoh dan tidak manipulatif.',
  },
  {
    step: '03',
    title: 'Penyuntingan Ketat',
    desc: 'Naskah disunting untuk memastikan alur bahasa tajam, bebas basa-basi, dan mudah dipahami siapa saja.',
  },
  {
    step: '04',
    title: 'Publikasi dengan Catatan Sumber',
    desc: 'Diterbitkan lengkap dengan daftar rujukan terbuka agar pembaca bisa memeriksa langsung kebenaran datanya.',
  },
];

const roadmap = [
  {
    stage: 'FASE 01',
    status: 'Sedang Berjalan',
    title: 'Publikasi & Riset Dasar',
    items: [
      'Penerbitan esai mendalam 6 pilar secara konsisten',
      'Kurasi Weekly Newsletter bernas setiap minggu ke inbox pembaca',
      'Rangkuman infografis berbasis data di media sosial',
      'Arsip tulisan terbuka yang bebas diakses siapa saja',
    ],
  },
  {
    stage: 'FASE 02',
    status: 'Dalam Pengembangan',
    title: 'Toolkit & Panduan Praktis',
    items: [
      'Kalkulator dan lembar kerja keputusan karier & keuangan riil',
      'Visualisasi data ekonomi interaktif yang mudah dipahami',
      'Fitur simpan bacaan, tracking progres, dan arsip personal',
      'Ruang interaksi dan diskusi kritis terarah antarpembaca',
    ],
  },
  {
    stage: 'FASE 03',
    status: 'Visi Jangka Panjang',
    title: 'Edisi Cetak & Komunitas Berpikir',
    items: [
      'Kolaborasi riset lapangan bersama praktisi dan peneliti independen',
      'Buku antologi dan jurnal cetak edisi terbatas',
      'Sesi temu wicara dan bedah isu strategis secara berkala',
      'Dukungan bagi karya tulis bermutu dari talenta muda daerah',
    ],
  },
];

const faqs = [
  {
    q: 'Siapa yang menulis di TAMPARAN ANAK MUDA?',
    a: 'TAMPARAN ANAK MUDA (TAM) digerakkan oleh kolektif penulis, analis data, dan praktisi independen yang gelisah melihat ruang publik anak muda dipenuhi motivasi manis tanpa substansi nyata.',
  },
  {
    q: 'Kenapa gaya bahasanya terasa blak-blakan?',
    a: 'Karena hidup kita sudah cukup rumit. Basa-basi manis tidak menyelesaikan cicilan, tidak membenahi sistem kerja, dan tidak menuntun masa depan. Kami percaya anak muda Indonesia layak diajak berdiskusi sebagai manusia dewasa yang kritis dan cerdas.',
  },
  {
    q: 'Apakah saya harus membayar untuk membaca artikel di sini?',
    a: 'Tidak. Seluruh artikel dan arsip utama kami dapat diakses gratis tanpa paywall. Kami meyakini bahwa akses terhadap data akurat dan pemikiran jernih adalah hak setiap anak muda.',
  },
  {
    q: 'Bagaimana jika saya menemukan kesalahan data dalam artikel?',
    a: 'Kami sangat menghargai koreksi. Anda dapat mengirimkan sanggahan atau masukan data melalui surel ke editorial@tamparananakmuda.com. Jika terbukti keliru, kami akan segera memperbaikinya secara transparan.',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
      <AboutPageSchema />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-border pt-20 pb-16 md:pt-32 md:pb-24">
        {/* Subtle Ambient Vignette & Gradient */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[800px] bg-gradient-to-b from-primary/15 via-primary/5 to-transparent blur-[140px] opacity-70" />

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="mx-auto max-w-4xl text-center space-y-6 md:space-y-8">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3.5 py-1 text-xs font-mono font-medium tracking-wider text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>CATATAN REDAKSI &bull; TENTANG KAMI</span>
            </div>

            {/* Headline with Clean, Stable Hierarchy */}
            <h1 className="mx-auto max-w-3xl font-display text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.14]">
              <span className="block text-foreground">Berhenti Diberi Janji Manis.</span>
              <span className="block text-primary mt-2">Saatnya Menatap Kenyataan.</span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground font-sans leading-relaxed">
              Kami muak dengan motivasi dangkal yang menyuruhmu kerja 18 jam sehari tanpa pernah membahas kenapa gaji fresh graduate stagnan, harga rumah makin tak terjangkau, dan sistem kerja bikin cepat remuk. TAM hadir untuk membedah fakta yang sebenarnya terjadi.
            </p>

            {/* Direct Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-1">
              <Link
                href="/artikel"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-display font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition-all hover:scale-[1.02]"
              >
                <span>Mulai Baca Tulisan</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#filosofi"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3.5 text-sm font-display font-semibold text-foreground hover:bg-secondary transition-all"
              >
                <span>Kenapa Kami Ada</span>
              </Link>
            </div>

            {/* Unified Metrics Ribbon (Editorial Divider Bar) */}
            <div className="pt-8">
              <div className="max-w-4xl mx-auto rounded-2xl border border-border bg-card/50 backdrop-blur-md overflow-hidden shadow-sm">
                <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 divide-x-0 sm:divide-x divide-border">
                  <div className="p-4 sm:p-5 text-center">
                    <div className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">6 Pilar</div>
                    <div className="text-xs text-muted-foreground mt-1">Fokus Analisis Kritis</div>
                  </div>
                  <div className="p-4 sm:p-5 text-center">
                    <div className="font-display text-2xl sm:text-3xl font-extrabold text-primary">100% Data</div>
                    <div className="text-xs text-muted-foreground mt-1">Rujukan Terverifikasi</div>
                  </div>
                  <div className="p-4 sm:p-5 text-center">
                    <div className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">Terbuka</div>
                    <div className="text-xs text-muted-foreground mt-1">Bebas Akses Tanpa Paywall</div>
                  </div>
                  <div className="p-4 sm:p-5 text-center">
                    <div className="font-display text-2xl sm:text-3xl font-extrabold text-primary">Independen</div>
                    <div className="text-xs text-muted-foreground mt-1">Bebas Basa-Basi Manis</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 01. PHILOSOPHY SECTION */}
      <section id="filosofi" className="py-20 md:py-28 border-b border-border bg-card/30 relative">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mx-auto max-w-5xl space-y-16">
            
            {/* TAM Index Marker */}
            <div className="flex items-center gap-4">
              <span className="font-display text-sm font-medium text-primary">01</span>
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
                Filosofi & Alasan
              </span>
            </div>

            {/* Highlight Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-card via-card/95 to-primary/5 p-7 sm:p-10 md:p-12 shadow-md">
              <div className="grid gap-8 lg:grid-cols-12 items-center relative z-10">
                <div className="lg:col-span-5 space-y-3">
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-primary">
                    <Flame className="h-3.5 w-3.5" />
                    <span>ALASAN NAMA INI ADA</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold tracking-tight leading-tight text-foreground">
                    Mengapa &ldquo;Tamparan&rdquo;, <br />
                    Bukan &ldquo;Pelukan&rdquo;?
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed pt-1">
                    Nama ini bukan tentang kekerasan fisik. Ini adalah metafora kejujuran intelektual yang merobek ilusi palsu.
                  </p>
                </div>

                <div className="lg:col-span-7 space-y-5 lg:border-l lg:border-border lg:pl-10">
                  <blockquote className="font-display text-xl sm:text-2xl font-bold leading-snug text-foreground">
                    &ldquo;Pelukan menenangkan emosi sesaat. Tamparan membangunkan kesadaran selamanya.&rdquo;
                  </blockquote>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Banyak media memilih jalan pintas: menyajikan konten manis yang membelai ego atau tips 30 detik yang gampang viral. Tapi masalah hidup anak muda Indonesia—mulai dari jebakan sandwich generation, inflasi gaya hidup, sampai karut-marut dunia kerja—tidak pernah selesai hanya dengan kalimat mutiara. Kami memilih bicara jujur, bahkan ketika kejujuran itu pahit untuk didengar.
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-xs font-display font-semibold text-primary">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Rasionalitas dan fakta di atas kepalsuan emosional</span>
                  </div>
                </div>
              </div>
            </div>

            {/* DIALECTIC COMPARISON */}
            <div className="space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-mono font-medium uppercase tracking-[0.25em] text-primary">
                  Perbandingan Sudut Pandang
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-foreground">
                  Kenapa Tulisan Kami Terasa Berbeda?
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {dialectics.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between hover:border-primary/40 transition-colors shadow-sm"
                  >
                    <div className="space-y-3 pb-4">
                      <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground/80">
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                        <span>Pola Konten Pada Umumnya</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed pl-3.5 border-l border-border">
                        {item.myth}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border/60 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-primary">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>Pendekatan Redaksi TAM</span>
                      </div>
                      <p className="text-sm font-medium text-foreground leading-relaxed pl-3.5 border-l-2 border-primary">
                        {item.reality}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 02. 6 PILAR LIPUTAN */}
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mx-auto max-w-5xl space-y-14">
            
            {/* TAM Index Marker */}
            <div className="flex items-center gap-4">
              <span className="font-display text-sm font-medium text-primary">02</span>
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
                Fokus Liputan
              </span>
            </div>

            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-primary uppercase tracking-wider">
                <Layers className="h-3.5 w-3.5" />
                <span>ENAM TOPIK UTAMA</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-display font-bold tracking-tight text-foreground">
                Hal-Hal Fundamental yang Menentukan Masa Depan
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Kami tidak menulis tentang tren musiman dua hari. Kami fokus pada enam pilar krusial yang menentukan kemandirian hidup anak muda Indonesia.
              </p>
            </div>

            {/* Pillar Grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {pillars.map((pillar) => {
                const IconComponent = pillar.icon;
                return (
                  <Link
                    key={pillar.slug}
                    href={`/kategori/${pillar.slug}`}
                    className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div
                          className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                          style={{
                            backgroundColor: `${pillar.color}15`,
                            color: pillar.color,
                          }}
                        >
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-mono text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                          <span>Kategori</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                      <h3 className="text-lg font-display font-bold text-foreground group-hover:text-primary transition-colors">
                        {pillar.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {pillar.angle}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between text-xs font-display font-semibold text-primary">
                      <span>Lihat Artikel</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* 03. PRINSIP & KOMITMEN EDITORIAL */}
      <section id="prinsip-editorial" className="py-20 md:py-28 border-b border-border bg-card/20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mx-auto max-w-5xl space-y-14">
            
            {/* TAM Index Marker */}
            <div className="flex items-center gap-4">
              <span className="font-display text-sm font-medium text-primary">03</span>
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
                Standar & Akuntabilitas
              </span>
            </div>

            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-primary uppercase tracking-wider">
                <Shield className="h-3.5 w-3.5" />
                <span>KODE ETIK PENULISAN</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-display font-bold tracking-tight text-foreground">
                Prinsip yang Kami Pegang Teguh
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Empat fondasi yang menjadi pagar akuntabilitas di setiap artikel yang kami publikasikan.
              </p>
            </div>

            {/* Principles Cards */}
            <div className="grid gap-5 md:grid-cols-2">
              {editorialPrinciples.map((item) => (
                <div
                  key={item.num}
                  className="group rounded-2xl border border-border bg-card p-7 space-y-4 hover:border-primary/50 transition-all shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-primary px-2.5 py-1 rounded bg-primary/10">
                        {item.num}
                      </span>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground bg-secondary/80 px-2.5 py-0.5 rounded">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-display font-bold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <div className="h-0.5 w-8 rounded-full bg-primary/20 group-hover:w-full group-hover:bg-primary transition-all duration-300" />
                  </div>
                </div>
              ))}
            </div>

            {/* Editorial Policy Link */}
            <div className="text-center pt-2">
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

      {/* 04. DAPUR REDAKSI / ALUR VERIFIKASI */}
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mx-auto max-w-5xl space-y-14">
            
            {/* TAM Index Marker */}
            <div className="flex items-center gap-4">
              <span className="font-display text-sm font-medium text-primary">04</span>
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
                Alur Kerja Redaksi
              </span>
            </div>

            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-primary uppercase tracking-wider">
                <FileCheck className="h-3.5 w-3.5" />
                <span>PROSES PEMBUATAN ARTIKEL</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-display font-bold tracking-tight text-foreground">
                Bagaimana Satu Tulisan Dikerjakan?
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Kami tidak asal salin-tempel opini. Setiap tulisan melewati proses verifikasi bertahap sebelum sampai ke layar kamu.
              </p>
            </div>

            {/* Verification Steps in TAM Signature 1px Grid */}
            <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
              {verificationProcess.map((proc) => (
                <div
                  key={proc.step}
                  className="bg-card p-6 sm:p-7 space-y-3 flex flex-col justify-between hover:bg-card/80 transition-colors"
                >
                  <div className="space-y-2">
                    <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
                      Langkah {proc.step}
                    </span>
                    <h3 className="text-base font-display font-bold text-foreground">
                      {proc.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {proc.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 05. ROADMAP / LANGKAH KE DEPAN */}
      <section className="py-20 md:py-28 border-b border-border bg-card/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mx-auto max-w-5xl space-y-14">
            
            {/* TAM Index Marker */}
            <div className="flex items-center gap-4">
              <span className="font-display text-sm font-medium text-primary">05</span>
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
                Rencana & Roadmap
              </span>
            </div>

            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-primary uppercase tracking-wider">
                <Compass className="h-3.5 w-3.5" />
                <span>LANGKAH KE DEPAN</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-display font-bold tracking-tight text-foreground">
                Apa yang Sedang Kami Bangun?
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                TAM bukan sekadar website artikel. Kami ingin membangun ruang berpikir sehat dan navigasi nyata bagi generasi muda Indonesia.
              </p>
            </div>

            {/* Roadmap Cards */}
            <div className="grid gap-5 md:grid-cols-3">
              {roadmap.map((block, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-card p-6 sm:p-7 space-y-5 flex flex-col justify-between shadow-sm hover:border-primary/40 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-mono font-bold text-primary">
                        {block.stage}
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {block.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-display font-bold text-foreground">
                      {block.title}
                    </h3>
                    <ul className="space-y-2.5 pt-3 border-t border-border/60">
                      {block.items.map((item, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-2 leading-relaxed">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
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

      {/* 06. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mx-auto max-w-4xl space-y-12">
            
            {/* TAM Index Marker */}
            <div className="flex items-center gap-4">
              <span className="font-display text-sm font-medium text-primary">06</span>
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
                Tanya Jawab
              </span>
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-foreground">
                Pertanyaan yang Sering Diajukan
              </h2>
              <p className="text-sm text-muted-foreground">
                Hal-hal yang paling sering ditanyakan pembaca mengenai redaksi dan prinsip kerja kami.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-border bg-card p-5 sm:p-6 space-y-2 shadow-sm"
                >
                  <h3 className="text-base font-display font-bold text-foreground flex items-start gap-2.5">
                    <span className="text-primary font-mono text-xs font-bold mt-0.5">
                      0{index + 1}.
                    </span>
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-background to-card/50">
        <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
          <div className="mx-auto max-w-2xl space-y-6">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-foreground">
              Sudah Cukup Diberi Janji Manis.{' '}
              <span className="text-primary block sm:inline">Saatnya Ambil Kendali.</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Buka matamu, pelajari sistemnya, dan temukan tulisan-tulisan yang membantu kamu mengambil keputusan hidup dengan kepala dingin.
            </p>
            
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/artikel"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-display font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-[1.02]"
              >
                <span>Mulai Baca Sekarang</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/newsletter"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-display font-semibold text-foreground hover:bg-secondary transition-all"
              >
                <span>Langganan Newsletter Mingguan</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
