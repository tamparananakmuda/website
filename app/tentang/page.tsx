import type { Metadata } from 'next';
import Link from 'next/link';
import { AboutPageSchema } from '@/components/schema/about-page-schema';
import {
  ArrowUpRight,
  ArrowRight,
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
  XCircle,
  HelpCircle,
  Sparkles,
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
    myth: 'Konten 60 detik yang bikin kamu merasa pintar sesaat, tapi langsung bingung dan cemas besok pagi.',
    reality: 'Esai mendalam berbasis data empiris yang tetap relevan dan bernilai saat kamu baca ulang bertahun-tahun kemudian.',
  },
  {
    myth: 'Menyalahkan individu secara sepihak: "Kamu susah karena kurang bangun pagi atau kurang bersyukur."',
    reality: 'Membongkar masalah struktural dan sistem ekonominya, lalu memberikan opsi langkah nyata yang masuk akal dijalankan.',
  },
  {
    myth: 'Judul clickbait berlebihan demi mengejar algoritma platform dan tayangan iklan semata.',
    reality: 'Transparansi penuh atas sumber data, catatan rujukan yang bisa diverifikasi, dan ralat terbuka jika ada kekeliruan.',
  },
  {
    myth: 'Jualan mimpi cepat kaya lewat jalan pintas dan motivasi manis yang meninabobokan.',
    reality: 'Kejujuran apa adanya yang membuka mata, agar kamu tahu medan tempur yang sesungguhnya dan tidak mudah tertipu.',
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
    desc: 'Jika data atau kesimpulan kami keliru, kami perbaiki secara terbuka dengan catatan revisi di artikel. Kami tidak melakukan silent edits.',
    badge: 'Akuntabel',
  },
  {
    num: '03',
    title: 'Redaksi Tidak Bisa Dibeli',
    desc: 'Tulisan bersponsor selalu diberi label transparan. Pemasang iklan sama sekali tidak punya hak untuk mengatur opini atau kesimpulan analisis kami.',
    badge: 'Independen',
  },
  {
    num: '04',
    title: 'Menulis untuk Jangka Panjang',
    desc: 'Kami menolak menulis gosip atau tren musiman 2 hari. Kami fokus pada isu-isu fundamental yang tetap penting bagi hidupmu dalam 5 sampai 10 tahun ke depan.',
    badge: 'Evergreen',
  },
];

const verificationProcess = [
  {
    step: '01',
    title: 'Riset Data & Sumber Primer',
    desc: 'Mengumpulkan laporan resmi, statistik publik, dan jurnal terakreditasi sebelum menyusun kerangka analisis.',
  },
  {
    step: '02',
    title: 'Uji Fakta & Logika',
    desc: 'Memisahkan data objektif dari asumsi personal agar argumen yang dibangun kokoh dan tidak manipulatif.',
  },
  {
    step: '03',
    title: 'Penyuntingan Ketat',
    desc: 'Naskah dibaca ulang untuk memastikan alur bahasa tajam, bebas basa-basi, dan mudah dipahami siapa saja.',
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
      <section className="relative overflow-hidden pt-24 pb-20 md:pt-36 md:pb-28 border-b border-border">
        {/* Background Ambient Glow & Vignette */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[600px] w-[1000px] bg-gradient-to-b from-primary/20 via-primary/5 to-transparent blur-[160px] opacity-80" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(165,30,45,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(165,30,45,0.25),rgba(0,0,0,0))]" />

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="mx-auto max-w-4xl text-center space-y-8">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-display font-semibold tracking-wide text-primary shadow-sm backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>CATATAN REDAKSI &bull; TAMPARAN ANAK MUDA</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight leading-[1.08] text-balance">
              Berhenti Diberi Janji Manis. <br className="hidden sm:inline" />
              <span className="relative inline-block mt-1">
                <span className="bg-gradient-to-r from-primary via-primary/90 to-foreground bg-clip-text text-transparent">
                  Saatnya Menatap Kenyataan.
                </span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto max-w-3xl text-base sm:text-lg md:text-xl text-muted-foreground font-sans font-normal leading-relaxed text-balance">
              Kami muak dengan konten motivasi dangkal yang menyuruhmu kerja 18 jam sehari tanpa pernah membahas kenapa gaji fresh graduate stagnan, harga rumah makin tak terjangkau, dan sistem kerja bikin cepat remuk. TAM hadir untuk membedah fakta yang sebenarnya terjadi.
            </p>

            {/* Quick Metrics Bar */}
            <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
              <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-md text-center">
                <div className="text-2xl sm:text-3xl font-display font-bold text-primary">6 Topik</div>
                <div className="text-xs text-muted-foreground mt-1">Fokus Analisis Kritis</div>
              </div>
              <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-md text-center">
                <div className="text-2xl sm:text-3xl font-display font-bold text-foreground">100% Data</div>
                <div className="text-xs text-muted-foreground mt-1">Rujukan Terverifikasi</div>
              </div>
              <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-md text-center">
                <div className="text-2xl sm:text-3xl font-display font-bold text-foreground">0% Claptrap</div>
                <div className="text-xs text-muted-foreground mt-1">Tanpa Clickbait Palsu</div>
              </div>
              <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-md text-center">
                <div className="text-2xl sm:text-3xl font-display font-bold text-primary">Gratis</div>
                <div className="text-xs text-muted-foreground mt-1">Bebas Akses Tanpa Paywall</div>
              </div>
            </div>

            {/* Quick Action Links */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/artikel"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-display font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-105"
              >
                <span>Mulai Baca Tulisan</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#filosofi"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card/80 px-6 py-3.5 text-sm font-display font-semibold text-foreground hover:bg-muted/80 transition-all"
              >
                <span>Kenapa Kami Ada</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* PHILOSOPHY CARD */}
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
                    <span>ALASAN NAMA INI ADA</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight leading-tight">
                    Mengapa &ldquo;Tamparan&rdquo;, <br />
                    Bukan &ldquo;Pelukan&rdquo;?
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Nama ini bukan tentang kekerasan fisik. Ini adalah metafora kejujuran intelektual yang memecah kabut ilusi.
                  </p>
                </div>

                <div className="lg:col-span-7 space-y-6 lg:border-l lg:border-border lg:pl-10">
                  <blockquote className="font-display text-xl sm:text-2xl md:text-3xl font-bold italic leading-snug text-foreground">
                    &ldquo;Pelukan menenangkan emosi sesaat. Tamparan membangunkan kesadaran selamanya.&rdquo;
                  </blockquote>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Banyak media memilih jalan pintas: menyajikan konten manis yang membelai ego atau tips 30 detik yang gampang viral. Tapi masalah hidup anak muda Indonesia—mulai dari jebakan sandwich generation, inflasi gaya hidup, sampai karut-marut dunia kerja—tidak pernah selesai hanya dengan kalimat mutiara. Kami memilih bicara jujur, bahkan ketika kejujuran itu pahit untuk didengar.
                  </p>
                  <div className="flex items-center gap-3 pt-2 text-xs font-display font-semibold text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Rasionalitas dan fakta di atas kepalsuan emosional</span>
                  </div>
                </div>
              </div>
            </div>

            {/* DIALECTIC COMPARISON */}
            <div className="space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-display font-semibold tracking-widest text-primary uppercase">
                  Perbedaan Sudut Pandang
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">
                  Kenapa Tulisan Kami Terasa Berbeda?
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
                          Pola Konten Biasa
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
                          Cara TAM Menulis
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

      {/* 6 PILAR LIPUTAN */}
      <section className="py-20 md:py-32 border-b border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mx-auto max-w-5xl space-y-16">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-display font-semibold text-primary">
                <Layers className="h-3.5 w-3.5" />
                <span>FOKUS BAHASAN</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight">
                Enam Hal yang Menentukan Masa Depan Kita
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Kami tidak menulis tentang sembarang hal yang lagi viral. Kami fokus pada enam pilar krusial yang menentukan kemandirian hidup anak muda Indonesia.
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
                          Kategori &rarr;
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
                      <span>Lihat Semua Artikel</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </Link>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* PRINSIP & KOMITMEN EDITORIAL */}
      <section id="prinsip-editorial" className="py-20 md:py-32 border-b border-border bg-muted/15">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mx-auto max-w-5xl space-y-16">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-display font-semibold text-primary">
                <Shield className="h-3.5 w-3.5" />
                <span>STANDAR & KOMITMEN</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight">
                Prinsip yang Kami Pegang Teguh
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Empat fondasi yang menjadi pagar akuntabilitas di setiap artikel yang kami publikasikan.
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

      {/* DAPUR REDAKSI / ALUR VERIFIKASI */}
      <section className="py-20 md:py-32 border-b border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mx-auto max-w-5xl space-y-16">
            
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-display font-semibold text-primary">
                <FileCheck className="h-3.5 w-3.5" />
                <span>DAPUR REDAKSI</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight">
                Bagaimana Satu Tulisan Dikerjakan?
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Kami tidak asal salin-tempel opini. Setiap tulisan melewati proses verifikasi bertahap sebelum sampai ke layar kamu.
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

      {/* ROADMAP / LANGKAH KE DEPAN */}
      <section className="py-20 md:py-32 border-b border-border bg-card/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mx-auto max-w-5xl space-y-16">
            
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-display font-semibold text-primary">
                <Compass className="h-3.5 w-3.5" />
                <span>LANGKAH KE DEPAN</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight">
                Apa yang Sedang Kami Bangun?
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                TAM bukan sekadar website artikel. Kami ingin membangun ruang berpikir sehat dan navigasi nyata bagi generasi muda Indonesia.
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
              Sudah Cukup Diberi Janji Manis. <br className="hidden sm:inline" />
              Saatnya Ambil Kendali.
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Buka matamu, pelajari sistemnya, dan temukan tulisan-tulisan yang membantu kamu mengambil keputusan hidup dengan lebih tepat.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/artikel"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-display font-bold text-primary-foreground shadow-xl hover:bg-primary/90 transition-all hover:scale-105"
              >
                <span>Mulai Baca Sekarang</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/newsletter"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-7 py-4 text-sm font-display font-bold text-foreground hover:bg-muted transition-all"
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
