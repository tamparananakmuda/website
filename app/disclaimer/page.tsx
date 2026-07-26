import type { Metadata } from 'next';
import Link from 'next/link';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description:
    'Disclaimer TAMPARAN ANAK MUDA. Konten kami adalah opini editorial, bukan nasihat profesional. Baca batasan tanggung jawab, hak jawab, dan hak koreksi.',
  keywords: ['disclaimer', 'singkatan tanggung jawab', 'hak jawab', 'hak koreksi', 'nasihat profesional', 'editorial media'],
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${siteUrl}/disclaimer`,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: `${siteUrl}/disclaimer`,
    title: 'Disclaimer - Tamparan Anak Muda',
    description:
      'Konten TAM adalah opini editorial, bukan nasihat profesional. Baca batasan tanggung jawab dan hak koreksi.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Disclaimer - Tamparan Anak Muda',
    description:
      'Konten TAM adalah opini editorial, bukan nasihat profesional.',
  },
};

export default function DisclaimerPage() {
  return (
    <main>
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Legal
            </p>
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              Disclaimer
            </h1>
            <p className="mb-2 text-sm text-muted-foreground">
              Berlaku efektif sejak 26 Juli 2026
            </p>
            <p className="mb-2 text-sm text-muted-foreground">
              Versi 1.0
            </p>
            <div className="mt-8 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Disclaimer ini menjelaskan batasan tanggung jawab TAMPARAN ANAK MUDA (&ldquo;TAM&rdquo;) terkait konten yang dipublikasi di website ini. Dengan mengakses dan membaca konten TAM, Anda mengakui bahwa Anda telah membaca dan memahami disclaimer ini.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="bukan-nasihat" className="bg-card py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              1. Bukan Nasihat Profesional
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Semua konten di website TAM adalah opini editorial dan analisis, bukan nasihat profesional. Kategori konten yang perlu perhatian khusus:
              </p>
              <div className="space-y-4">
                <div className="border-l-2 border-primary pl-6">
                  <h3 className="mb-1 font-semibold">Konten Keuangan (kategori Uang)</h3>
                  <p>Artikel tentang keuangan, investasi, dan uang bukan rekomendasi investasi atau nasihat keuangan. Risiko investasi ditanggung sendiri. Konsultasi perencana keuangan bersertifikat untuk keputusan finansial penting.</p>
                </div>
                <div className="border-l-2 border-primary pl-6">
                  <h3 className="mb-1 font-semibold">Konten Karier (kategori Karier)</h3>
                  <p>Artikel tentang karier bukan nasihat karier profesional. Setiap situasi karier berbeda. Konsultasi career coach atau HR profesional untuk keputusan karier spesifik.</p>
                </div>
                <div className="border-l-2 border-primary pl-6">
                  <h3 className="mb-1 font-semibold">Konten Kesehatan Mental (seri Kesehatan Mental)</h3>
                  <p>Artikel tentang kesehatan mental bukan pengganti terapi atau konsultasi profesional. Jika Anda dalam krisis, hubungi profesional kesehatan mental atau hotline krisis terdekat.</p>
                </div>
                <div className="border-l-2 border-primary pl-6">
                  <h3 className="mb-1 font-semibold">Konten Hukum</h3>
                  <p>Artikel yang membahas aspek hukum bukan nasihat hukum. Konsultasi lawyer untuk masalah hukum spesifik.</p>
                </div>
              </div>
              <p>
                Untuk keputusan penting dalam hidup Anda, selalu konsultasi dengan profesional bersertifikat di bidang terkait.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="tone-tamparan" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              2. Tone &ldquo;Tamparan&rdquo;
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                TAM dikenal dengan tone yang tajam dan jujur. Kami menyebut hal yang perlu didengar, bukan yang ingin didengar. Tapi ada batas yang kami pegang:
              </p>
              <ul className="ml-4 space-y-2">
                <li className="list-disc">Kami mengkritik sistem, institusi, dan narasi populer, bukan menyerang individu secara personal</li>
                <li className="list-disc">Kritik kami berbasis data, logika, dan pengalaman nyata, bukan emosi atau sentimen</li>
                <li className="list-disc">Kami tidak menggurui. Kami mengajak berpikir, bukan memberi jawaban instan</li>
              </ul>
              <p>
                Sesuai Putusan Mahkamah Konstitusi No. 105/PUU-XXII/2024, pasal pencemaran nama baik (Pasal 27A UU ITE) hanya berlaku untuk individu perseorangan, tidak untuk lembaga, korporasi, atau institusi. Kritik terhadap sistem tidak dapat dikategorikan sebagai pencemaran nama baik.
              </p>
              <p>
                Meski demikian, kami berkomitmen untuk tidak menyerang individu secara personal. Jika Anda merasa diserang secara personal oleh konten kami, hubungi kami melalui <Link href="#hak-jawab" className="text-primary hover:underline">hak jawab</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="akurasi-koreksi" className="bg-card py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              3. Akurasi dan Koreksi
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Kami berkomitmen pada prinsip editorial: setiap klaim ada sumbernya. Data, angka, dan kutipan selalu dicantumkan dengan sumber yang dapat diverifikasi.
              </p>
              <p>
                Namun, kami tidak menjamin bahwa konten 100% bebas dari error atau selalu up-to-date. Informasi dapat berubah seiring waktu.
              </p>
              <p>
                <span className="font-semibold text-foreground">Mekanisme koreksi:</span> Jika kami keliru, kami perbaiki terbuka. Setiap artikel memiliki catatan revisi jika pernah di-update. Tidak ada edit diam-diam tanpa akuntabilitas.
              </p>
              <p>
                <span className="font-semibold text-foreground">Cara melaporkan error:</span> Kirim email ke halo@tamparananakmuda.com dengan subjek &ldquo;Koreksi&rdquo;, sebutkan artikel dan bagian yang salah, beserta sumber yang benar. Kami akan verifikasi dan koreksi dalam 7 hari kerja.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="opini-fakta" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              4. Opini vs Fakta
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                TAM membedakan opini dan fakta. Artikel opini diberi label melalui POV tag (kontra-narasi, refleksi, opini, tamparan). Artikel berbasis data diberi label data atau riset.
              </p>
              <p>
                <span className="font-semibold text-foreground">Fakta:</span> Merupakan informasi yang dapat diverifikasi dari sumber independen. Kami selalu mencantumkan sumber.
              </p>
              <p>
                <span className="font-semibold text-foreground">Opini:</span> Merupakan sudut pandang TAM atau penulis. Opini berdasar data dan logika, tapi tetap opini. Anda boleh setuju atau tidak.
              </p>
              <p>
                <span className="font-semibold text-foreground">Panduan:</span> Merupakan langkah praktis atau framework yang bisa Anda coba. Tidak menjamin hasil karena variabel individu berbeda.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="user-generated" className="bg-card py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              5. Konten User-Generated
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Komentar di artikel TAM adalah opini penulis komentar, bukan opini TAM. Kami menyediakan ruang untuk diskusi, tetapi tidak bertanggung jawab atas isi komentar pengguna.
              </p>
              <p>
                TAM berhak memoderasi, menghapus, atau menolak komentar yang melanggar <Link href="/syarat-ketentuan#komentar" className="text-primary hover:underline">syarat dan ketentuan</Link>.
              </p>
              <p>
                Jika Anda menemukan komentar yang melanggar (ujaran kebencian, spam, konten terlarang), laporkan ke halo@tamparananakmuda.com.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="link-eksternal" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              6. Link Eksternal
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Artikel TAM mungkin berisi link ke website pihak ketiga. Link ini disediakan untuk referensi dan kenyamanan, bukan sebagai endorsement.
              </p>
              <p>
                TAM tidak bertanggung jawab atas konten, kebijakan privasi, atau praktik dari website pihak ketiga. Anda mengakses link eksternal atas risiko sendiri.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="sponsored" className="bg-card py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              7. Konten Sponsored
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Konten sponsored di TAM selalu di-label dengan jelas. TAM tetap bertanggung jawab atas editorial independence. Sponsored content tidak mempengaruhi opini editorial.
              </p>
              <p>
                Jika sebuah artikel sponsored, label &ldquo;Sponsored&rdquo; atau &ldquo;Bersponsor&rdquo; akan terlihat di bagian atas artikel, beserta nama sponsor.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="affiliate" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              8. Affiliate
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Saat ini TAM tidak menggunakan link affiliate. Jika di masa depan kami menggunakan link affiliate, kami akan mengungkapnya transparan di bagian ini dan di setiap artikel yang memuat link affiliate.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="perubahan-konten" className="bg-card py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              9. Perubahan Konten
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Artikel TAM dapat di-update atau diedit dari waktu ke waktu. Setiap revisi material akan dicatat dengan catatan revisi di akhir artikel.
              </p>
              <p>
                Kami tidak memberi pemberitahuan individual untuk setiap update artikel. Anda dapat mengecek tanggal update di setiap artikel.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="tanggung-jawab-pembaca" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              10. Tanggung Jawab Pembaca
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Anda bertanggung jawab atas interpretasi dan keputusan yang Anda buat berdasarkan konten di website TAM.
              </p>
              <p>
                TAM tidak bertanggung jawab atas kerugian, langsung maupun tidak langsung, yang timbul dari tindakan yang Anda ambil berdasarkan konten di website ini.
              </p>
              <p>
                Konten TAM dirancang untuk membuat Anda berpikir, bukan untuk membuat keputusan untuk Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="hak-jawab" className="bg-card py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              11. Hak Jawab dan Hak Koreksi
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Sesuai prinsip jurnalistik dan UU Pers No. 40 Tahun 1999 Pasal 5, setiap orang berhak memberikan tanggahan dan mengoreksi kekeliruan informasi.
              </p>
              <p>
                <span className="font-semibold text-foreground">Hak Jawab:</span> Jika Anda merasa dirugikan oleh konten TAM, Anda berhak memberikan tanggahan. Tanggahan akan dipublikasi di website TAM dengan prominensi yang setara.
              </p>
              <p>
                <span className="font-semibold text-foreground">Hak Koreksi:</span> Jika Anda menemukan informasi yang tidak benar di konten TAM, Anda berhak meminta koreksi. Kami akan verifikasi dan koreksi jika terbukti salah.
              </p>
              <p>
                <span className="font-semibold text-foreground">Cara mengajukan:</span> Kirim email ke halo@tamparananakmuda.com dengan subjek &ldquo;Hak Jawab&rdquo; atau &ldquo;Hak Koreksi&rdquo. Sebutkan artikel, bagian yang Anda keberatan, dan tanggahan/koreksi Anda. Sertakan sumber pendukung jika ada.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="tidak-ada-jaminan-hasil" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              12. Tidak Ada Jaminan Hasil
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Tips, framework, dan saran di konten TAM tidak menjamin hasil. Variabel individu berbeda: latar belakang, kemampuan, lingkungan, dan keberuntungan mempengaruhi hasil akhir.
              </p>
              <p>
                Kami menulis agar kamu melihat kenyataan lebih jelas, bukan untuk menjual harapan palsu. Hidup memang tidak adil. Tapi memahami kenyataan memberi peluang lebih besar.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="kesehatan-mental" className="bg-card py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              13. Konten Kesehatan Mental
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Seri kesehatan mental TAM ditulis untuk membantu Anda memahami kondisi mental dan emosional, bukan sebagai pengganti terapi profesional.
              </p>
              <p>
                <span className="font-semibold text-foreground">Jika Anda dalam krisis:</span> Hubungi profesional kesehatan mental, hotline krisis, atau kunjungi IGD rumah sakit terdekat. Jangan menunda.
              </p>
              <p>
                <span className="font-semibold text-foreground">Hotline krisis Indonesia:</span> Into the Light Indonesia (119 ext 8), Yayasan Pulih, atau hotline krisis terdekat di wilayah Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="konten-keuangan" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              14. Konten Keuangan
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Artikel tentang keuangan, investasi, dan uang di TAM bukan rekomendasi investasi. Kami membahas konsep, risiko, dan strategi, bukan memberi saran spesifik untuk situasi Anda.
              </p>
              <p>
                <span className="font-semibold text-foreground">Risiko investasi:</span> Semua investasi memiliki risiko kerugian. Past performance tidak menjamin future results. Risiko investasi ditanggung sendiri.
              </p>
              <p>
                <span className="font-semibold text-foreground">Konsultasi:</span> Untuk keputusan investasi, konsultasi dengan perencana keuangan bersertifikat (QWP, CFP) atau penasihat investasi berlisensi OJK.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl space-y-4">
            <p className="text-base text-muted-foreground">
              Pertanyaan tentang disclaimer ini? Hubungi kami di halo@tamparananakmuda.com
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/kebijakan-privasi" className="text-primary hover:underline">
                Kebijakan Privasi
              </Link>
              <span className="text-muted-foreground/40">|</span>
              <Link href="/syarat-ketentuan" className="text-primary hover:underline">
                Syarat dan Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
