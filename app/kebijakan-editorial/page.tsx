import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, FileCheck, AlertCircle, BookOpen, ArrowRight } from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';

export const metadata: Metadata = {
  title: 'Kebijakan Editorial — TAMPARAN ANAK MUDA',
  description:
    'Standar editorial, kebijakan koreksi, dan pedoman pemilihan sumber TAMPARAN ANAK MUDA. Komitmen transparansi untuk pembaca.',
  keywords: ['kebijakan editorial', 'standar jurnalisme', 'koreksi artikel', 'pedoman sumber', 'editorial policy', 'tamparan anak muda'],
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${siteUrl}/kebijakan-editorial`,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: `${siteUrl}/kebijakan-editorial`,
    title: 'Kebijakan Editorial — TAMPARAN ANAK MUDA',
    description:
      'Standar editorial, kebijakan koreksi, dan pedoman pemilihan sumber TAMPARAN ANAK MUDA.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kebijakan Editorial — TAMPARAN ANAK MUDA',
    description:
      'Standar editorial, kebijakan koreksi, dan pedoman pemilihan sumber TAMPARAN ANAK MUDA.',
  },
};

export default function EditorialPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground antialiased">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40 pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[400px] w-[700px] bg-gradient-to-tr from-primary/10 via-accent/10 to-transparent blur-[120px] opacity-60" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
              <Shield className="h-3.5 w-3.5" />
              <span>Transparansi Editorial</span>
            </div>
            <h1 className="font-display text-3xl font-bold leading-tight tracking-tight md:text-5xl md:leading-[1.1]">
              Kebijakan Editorial
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Bagaimana kami memilih sumber, memisahkan fakta dari opini, dan memperbaiki kesalahan. Komitmen ini bikin kami bisa dipercaya.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-3xl px-4 py-16 md:py-24">
        <div className="space-y-12">

          {/* Standar Editorial */}
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <FileCheck size={20} className="text-primary" />
              <h2 className="font-display text-xl font-bold md:text-2xl">Standar Editorial</h2>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Setiap artikel TAMPARAN ANAK MUDA melalui proses berikut:
              </p>
              <ul className="space-y-2.5 pl-4">
                <li className="list-disc">Riset berbasis data dari sumber primer (BPS, lembaga riset, laporan resmi) atau sumber sekunder kredibel (media nasional terverifikasi).</li>
                <li className="list-disc">Pemisahan jelas antara fakta, opini, dan analisis. Fakta ditulis sebagai pernyataan, opini ditandai dengan konteks personal, analisis diberi label jelas.</li>
                <li className="list-disc">Verifikasi angka dan klaim sebelum publikasi. Setiap statistik yang dikutip harus punya sumber yang bisa dilacak.</li>
                <li className="list-disc">Review oleh editor sebelum publikasi. Artikel bertanda <span className="font-semibold text-foreground">Human Reviewed</span> berarti sudah melewati proses ini.</li>
                <li className="list-disc">Konten sponsored selalu ditandai dengan label jelas. Pemasang iklan tidak punya kendali atas konten editorial.</li>
              </ul>
            </div>
          </div>

          {/* Kebijakan Koreksi */}
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <AlertCircle size={20} className="text-primary" />
              <h2 className="font-display text-xl font-bold md:text-2xl">Kebijakan Koreksi</h2>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Kami mengakui kesalahan dan memperbaikinya secara transparan.
              </p>
              <ul className="space-y-2.5 pl-4">
                <li className="list-disc">Koreksi fakta: diperbaiki segera setelah diketahui. Tanggal koreksi dicatat di metadata artikel (modifiedTime).</li>
                <li className="list-disc">Koreksi angka: jika angka salah, kami perbaiki dan tambahkan catatan koreksi di akhir artikel jika perubahan signifikan.</li>
                <li className="list-disc">Retraksi: jika artikel mengandung kesalahan fundamental yang mengubah kesimpulan, kami tarik dan beri penjelasan.</li>
                <li className="list-disc">Pembaca bisa melaporkan kesalahan via email <Link href="mailto:editorial@tamparananakmuda.com" className="text-primary underline">editorial@tamparananakmuda.com</Link> atau melalui form kontak.</li>
              </ul>
            </div>
          </div>

          {/* Pedoman Sumber */}
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <BookOpen size={20} className="text-primary" />
              <h2 className="font-display text-xl font-bold md:text-2xl">Pedoman Pemilihan Sumber</h2>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Tidak semua sumber setara. Ini cara kami memilih:
              </p>
              <ul className="space-y-2.5 pl-4">
                <li className="list-disc"><span className="font-semibold text-foreground">Sumber primer:</span> data langsung dari lembaga resmi (BPS, Bank Indonesia, Kemenkeu, lembaga riset terverifikasi). Prioritas tertinggi.</li>
                <li className="list-disc"><span className="font-semibold text-foreground">Sumber sekunder:</span> media nasional kredibel yang menyebutkan sumber primernya (Kompas, CNBC Indonesia, Tempo, investor.id). Dipakai jika sumber primer tidak tersedia langsung.</li>
                <li className="list-disc"><span className="font-semibold text-foreground">Sumber tersier:</span> blog, opini, atau media tanpa rujukan jelas. Tidak dipakai untuk klaim fakta, hanya untuk konteks opini.</li>
                <li className="list-disc">Setiap artikel punya bagian <span className="font-semibold text-foreground">Sumber &amp; Metodologi</span> yang mencantumkan semua rujukan dengan tanggal akses.</li>
                <li className="list-disc">Data yang sudah lebih dari 2 tahun ditandai sebagai data historis, bukan data terkini.</li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-2xl border border-border bg-secondary/20 p-6 text-center">
            <p className="mb-4 text-sm text-muted-foreground">
              Punya pertanyaan tentang proses editorial kami?
            </p>
            <Link
              href="/tentang"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all hover:gap-3"
            >
              Pelajari lebih lanjut tentang kami
              <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
