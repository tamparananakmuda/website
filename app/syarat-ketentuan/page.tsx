import type { Metadata } from 'next';
import Link from 'next/link';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';

export const metadata: Metadata = {
  title: 'Syarat dan Ketentuan',
  description:
    'Syarat dan ketentuan penggunaan website TAMPARAN ANAK MUDA. Aturan yang berlaku untuk akses konten, akun reader, komentar, newsletter, donasi, dan layanan lainnya.',
  keywords: ['syarat ketentuan', 'terms of service', 'ketentuan layanan', 'aturan website', 'UU ITE'],
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${siteUrl}/syarat-ketentuan`,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: `${siteUrl}/syarat-ketentuan`,
    title: 'Syarat dan Ketentuan - Tamparan Anak Muda',
    description:
      'Syarat dan ketentuan penggunaan website TAMPARAN ANAK MUDA. Aturan untuk akses konten, akun, komentar, donasi, dan layanan lainnya.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Syarat dan Ketentuan - Tamparan Anak Muda',
    description:
      'Syarat dan ketentuan penggunaan website TAMPARAN ANAK MUDA.',
  },
};

const layanan = [
  { nama: 'Artikel editorial', desc: 'Konten tertulis detail tentang uang, karier, bisnis, teknologi, kehidupan, dan mindset. Gratis dibaca.' },
  { nama: 'Newsletter mingguan', desc: 'Email mingguan berisi rangkuman artikel terbaru dan insight eksklusif. Gratis.' },
  { nama: 'Akun reader', desc: 'Registrasi gratis untuk bookmark, riwayat baca, dan dashboard reader.' },
  { nama: 'Komentar', desc: 'Berikan komentar pada artikel. Tunduk pada moderasi.' },
  { nama: 'Donasi', desc: 'Dukung operasional TAM melalui QRIS, e-wallet, atau virtual account. Diproses oleh Louvin.' },
  { nama: 'Whitepaper', desc: 'Dokumen lengkap yang dapat diunduh untuk topik tertentu.' },
  { nama: 'Konten premium', desc: 'Artikel deep dive yang memerlukan unlock untuk akses penuh.' },
];

const larangan = [
  'Scraping konten secara otomatis untuk reproduksi massal',
  'Spam komentar dengan konten tidak relevan atau promosi tanpa izin',
  'Mendistribusikan konten terlarang (pornografi, ujaran kebencian, SARA) melalui komentar atau fitur user-generated',
  'Melanggar hak cipta dengan mereproduksi konten TAM untuk tujuan komersial tanpa izin',
  'Menyalahgunakan sistem (DDoS, brute force, SQL injection, atau serangan lainnya)',
  'Membuat akun palsu atau menyamar sebagai pihak lain',
  'Menggunakan bot untuk manipulasi like, komentar, atau donasi',
];

export default function SyaratKetentuanPage() {
  return (
    <main>
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Legal
            </p>
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              Syarat dan Ketentuan
            </h1>
            <p className="mb-2 text-sm text-muted-foreground">
              Berlaku efektif sejak 26 Juli 2026
            </p>
            <p className="mb-2 text-sm text-muted-foreground">
              Versi 1.0
            </p>
            <div className="mt-8 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Selamat datang di TAMPARAN ANAK MUDA. Syarat dan ketentuan ini mengatur penggunaan website tamparananakmuda.com dan semua layanan yang tersedia di dalamnya.
              </p>
              <p>
                Sesuai UU ITE Pasal 18A, ketentuan ini merupakan kontrak elektronik antara Anda dan TAM. Bahasa yang digunakan sederhana, jelas, dan mudah dipahami.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="penerimaan" className="bg-card py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              1. Penerimaan Ketentuan
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Dengan mengakses atau menggunakan website ini, Anda setuju untuk terikat oleh syarat dan ketentuan ini. Jika Anda tidak setuju dengan salah satu bagian, mohon untuk tidak menggunakan website ini.
              </p>
              <p>
                Ketentuan ini berlaku untuk semua pengunjung, pengguna terdaftar, dan pihak lain yang mengakses layanan TAM.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="definisi" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              2. Definisi
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="mb-1 font-semibold">TAM</h3>
                <p className="text-muted-foreground">TAMPARAN ANAK MUDA, brand editorial media digital yang mengelola website tamparananakmuda.com.</p>
              </div>
              <div>
                <h3 className="mb-1 font-semibold">Pengguna</h3>
                <p className="text-muted-foreground">Setiap individu yang mengakses, membaca, atau berinteraksi dengan website TAM, baik terdaftar maupun tidak.</p>
              </div>
              <div>
                <h3 className="mb-1 font-semibold">Konten</h3>
                <p className="text-muted-foreground">Semua materi di website TAM, termasuk artikel, whitepaper, newsletter, komentar, OG images, dan elemen visual.</p>
              </div>
              <div>
                <h3 className="mb-1 font-semibold">Layanan</h3>
                <p className="text-muted-foreground">Semua fitur yang tersedia di website TAM, termasuk artikel, akun reader, newsletter, komentar, donasi, dan whitepaper.</p>
              </div>
              <div>
                <h3 className="mb-1 font-semibold">Donasi</h3>
                <p className="text-muted-foreground">Kontribusi finansial sukarela dari Pengguna untuk mendukung operasional TAM, diproses melalui Louvin.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="layanan" className="bg-card py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              3. Layanan yang Kami Sediakan
            </h2>
            <div className="space-y-4">
              {layanan.map((item, i) => (
                <div key={i} className="border-l-2 border-primary pl-6">
                  <h3 className="mb-1 font-semibold">{item.nama}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="akun" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              4. Akun Pengguna
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Untuk menggunakan fitur tertentu (bookmark, riwayat baca, komentar dengan akun), Anda perlu membuat akun reader. Akun gratis dan dikelola melalui Supabase Auth.
              </p>
              <p>
                <span className="font-semibold text-foreground">Tanggung jawab Anda:</span>
              </p>
              <ul className="ml-4 space-y-2">
                <li className="list-disc">Menjaga keamanan kredensial akun Anda</li>
                <li className="list-disc">Tidak membagikan akun kepada pihak lain</li>
                <li className="list-disc">Bertanggung jawab atas semua aktivitas yang terjadi melalui akun Anda</li>
                <li className="list-disc">Memberikan informasi yang akurat saat registrasi</li>
                <li className="list-disc">Memberi tahu kami jika ada penggunaan akun tanpa izin</li>
              </ul>
              <p>
                <span className="font-semibold text-foreground">Usia minimal:</span> 13 tahun untuk membuat akun. Untuk donasi, minimal 17 tahun atau dengan persetujuan orang tua/wali.
              </p>
              <p>
                Kami berhak menonaktifkan akun yang melanggar ketentuan ini.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="konten-editorial" className="bg-card py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              5. Konten Editorial
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Semua konten editorial di TAM dilindungi Undang-Undang Hak Cipta No. 28 Tahun 2014. Hak cipta dimiliki oleh TAM atau penulis masing-masing artikel.
              </p>
              <p>
                <span className="font-semibold text-foreground">Yang boleh Anda lakukan:</span>
              </p>
              <ul className="ml-4 space-y-2">
                <li className="list-disc">Membaca dan mengakses semua artikel gratis</li>
                <li className="list-disc">Membagikan link artikel ke media sosial atau platform lain</li>
                <li className="list-disc">Mengutip sebagian konten dengan atribusi yang jelas ke TAM dan link ke artikel asli</li>
                <li className="list-disc">Menggunakan konten untuk pembelajaran pribadi non-komersial</li>
              </ul>
              <p>
                <span className="font-semibold text-foreground">Yang tidak boleh Anda lakukan:</span>
              </p>
              <ul className="ml-4 space-y-2">
                <li className="list-disc">Mereproduksi artikel secara utuh untuk tujuan komersial tanpa izin tertulis</li>
                <li className="list-disc">Menggunakan konten TAM untuk melatih model AI tanpa izin</li>
                <li className="list-disc">Menghapus atau mengubah atribusi penulis</li>
                <li className="list-disc">Mengklaim konten TAM sebagai karya Anda</li>
              </ul>
              <p>
                Untuk permintaan izin reproduksi atau lisensi komersial, hubungi halo@tamparananakmuda.com.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="komentar" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              6. Komentar dan Konten User-Generated
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Anda dapat memberikan komentar pada artikel. Komentar adalah konten user-generated yang menjadi tanggung jawab penulis komentar, bukan TAM.
              </p>
              <p>
                <span className="font-semibold text-foreground">Larangan dalam komentar (sesuai UU ITE Pasal 27 dan 28):</span>
              </p>
              <ul className="ml-4 space-y-2">
                <li className="list-disc">Konten yang memuat pencemaran nama baik atau penghinaan terhadap individu</li>
                <li className="list-disc">Ujaran kebencian berdasarkan SARA (suku, agama, ras, antar-golongan)</li>
                <li className="list-disc">Konten pornografi atau tidak senonoh</li>
                <li className="list-disc">Spam atau promosi tanpa konteks yang relevan</li>
                <li className="list-disc">Informasi yang menyesatkan atau hoaks</li>
                <li className="list-disc">Ancaman atau intimidasi</li>
              </ul>
              <p>
                TAM berhak memoderasi, menghapus, atau menolak komentar yang melanggar ketentuan ini tanpa pemberitahuan sebelumnya. Komentar yang dipublikasi tidak mencerminkan opini TAM.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="newsletter" className="bg-card py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              7. Newsletter
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Newsletter TAM dikirim mingguan berisi rangkuman artikel terbaru dan insight eksklusif. Gratis.
              </p>
              <p>
                <span className="font-semibold text-foreground">Berlangganan:</span> Daftar melalui form newsletter di website. Anda akan menerima email konfirmasi.
              </p>
              <p>
                <span className="font-semibold text-foreground">Berhenti berlangganan:</span> Setiap email newsletter berisi link unsubscribe. Klik link tersebut untuk berhenti. Anda juga dapat unsubscribe melalui halaman akun reader.
              </p>
              <p>
                <span className="font-semibold text-foreground">Frekuensi:</span> Mingguan, biasanya akhir pekan. Kami tidak mengirim email promosi terpisah tanpa persetujuan Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="donasi" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              8. Donasi
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Donasi adalah kontribusi sukarela untuk mendukung operasional TAM. Donasi diproses melalui Louvin (louvin.dev), payment gateway berbasis di Indonesia.
              </p>
              <p>
                <span className="font-semibold text-foreground">Metode pembayaran:</span> QRIS, GoPay, ShopeePay, BNI Virtual Account, BRI Virtual Account, Permata Virtual Account, CIMB Niaga Virtual Account.
              </p>
              <p>
                <span className="font-semibold text-foreground">Fee:</span> Fee transaksi ditanggung donatur. Fee besarnya tergantung metode pembayaran yang dipilih.
              </p>
              <p>
                <span className="font-semibold text-foreground">Batas nominal:</span> Maksimum Rp 10.000.000 per transaksi. Minimum Rp 1.500 untuk QRIS, Rp 1.000 untuk metode lainnya.
              </p>
              <p>
                <span className="font-semibold text-foreground">Refund:</span> Donasi bersifat final dan tidak dapat di-refund, kecuali terjadi kesalahan teknis sistem. Permintaan refund dapat diajukan ke halo@tamparananakmuda.com dalam 24 jam setelah transaksi.
              </p>
              <p>
                <span className="font-semibold text-foreground">Data yang dikumpulkan:</span> Nama (opsional), email (opsional), jumlah, metode pembayaran, pesan (opsional). Donatur dapat memilih untuk anonim.
              </p>
              <p>
                <span className="font-semibold text-foreground">Hak donatur (UU Perlindungan Konsumen No. 8/1999 Pasal 4):</span> Anda berhak atas informasi yang benar dan jelas tentang penggunaan donasi, advokasi jika terjadi masalah, dan kompensasi jika terjadi kerugian akibat kelalaian TAM.
              </p>
              <p>
                <span className="font-semibold text-foreground">Transparansi:</span> TAM berkomitmen untuk publik memberikan laporan penggunaan donasi secara berkala.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="sponsored" className="bg-card py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              9. Konten Sponsored
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                TAM menerima konten sponsored dari brand yang align dengan values kami. Setiap konten sponsored wajib di-label dengan jelas.
              </p>
              <p>
                <span className="font-semibold text-foreground">Disclosure:</span> Konten sponsored ditandai dengan label &ldquo;Sponsored&rdquo; atau &ldquo;Bersponsor&rdquo;, nama sponsor, dan link sponsor. Tidak ada konten sponsored yang disamarkan sebagai editorial.
              </p>
              <p>
                <span className="font-semibold text-foreground">Editorial independence:</span> Sponsor tidak memiliki kendali atas opini atau kesimpulan artikel. TAM tetap bertanggung jawab atas konten yang dipublikasi.
              </p>
              <p>
                Sesuai prinsip editorial TAM: &ldquo;Tidak ada konten sponsored yang disamarkan.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="premium" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              10. Konten Premium
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Sebagian artikel TAM dikategorikan sebagai konten premium (deep dive series). Artikel reguler tetap gratis selamanya. Konten premium memerlukan unlock untuk akses penuh.
              </p>
              <p>
                <span className="font-semibold text-foreground">Akses premium:</span> Reader dengan akun dapat meng-unlock artikel premium. Detail mekanisme unlock dapat berubah dari waktu ke waktu.
              </p>
              <p>
                <span className="font-semibold text-foreground">Excerpt:</span> Setiap artikel premium menampilkan excerpt (cuplikan) gratis. Full artikel memerlukan unlock.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="hak-cipta" className="bg-card py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              11. Hak Kekayaan Intelektual
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Semua konten di website TAM, termasuk artikel, whitepaper, newsletter, logo, desain, kode, dan elemen visual, adalah milik TAM atau penulis masing-masing dan dilindungi UU Hak Cipta No. 28 Tahun 2014.
              </p>
              <p>
                Anda diberikan lisensi terbatas untuk:
              </p>
              <ul className="ml-4 space-y-2">
                <li className="list-disc">Mengakses dan membaca konten untuk keperluan pribadi</li>
                <li className="list-disc">Membagikan link ke konten TAM</li>
                <li className="list-disc">Mengutip sebagian konten dengan atribusi yang jelas</li>
              </ul>
              <p>
                Lisensi ini tidak mencakup reproduksi utuh, penggunaan komersial, modifikasi, atau distribusi ulang tanpa izin tertulis dari TAM.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="larangan" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              12. Larangan
            </h2>
            <p className="mb-6 text-base leading-relaxed text-muted-foreground">
              Anda dilarang melakukan hal-hal berikut saat menggunakan website TAM:
            </p>
            <ul className="space-y-3">
              {larangan.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              Pelanggaran dapat menyebabkan pemblokiran akses, penghapusan akun, dan/atau tindakan hukum sesuai peraturan yang berlaku.
            </p>
          </div>
        </div>
      </section>

      <section id="batasan-tanggung-jawab" className="bg-card py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              13. Batasan Tanggung Jawab
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Konten TAM disediakan &ldquo;apa adanya&rdquo; (as is). Kami berkomitmen pada akurasi dan sumber yang dapat diverifikasi, tetapi tidak menjamin bahwa konten 100% bebas dari error atau selalu up-to-date.
              </p>
              <p>
                TAM tidak bertanggung jawab atas keputusan yang Anda buat berdasarkan konten di website ini. Konten editorial adalah opini dan analisis, bukan nasihat profesional. Untuk keputusan penting, konsultasi dengan profesional bersertifikat.
              </p>
              <p>
                Baca <Link href="/disclaimer" className="text-primary hover:underline">disclaimer lengkap</Link> untuk informasi lebih detail.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="sengketa" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              14. Penyelesaian Sengketa
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Sesuai UU ITE Pasal 18A, kontrak elektronik ini tunduk pada hukum Indonesia.
              </p>
              <p>
                <span className="font-semibold text-foreground">Tahap 1: Negosiasi.</span> Hubungi kami melalui email untuk menyelesaikan sengketa secara musyawarah.
              </p>
              <p>
                <span className="font-semibold text-foreground">Tahap 2: Mediasi.</span> Jika negosiasi tidak menemukan solusi, kedua belah pihak setuju untuk mencoba mediasi sebelum mengajukan gugatan.
              </p>
              <p>
                <span className="font-semibold text-foreground">Tahap 3: Gugatan hukum.</span> Jika mediasi gagal, sengketa diselesaikan melalui pengadilan di wilayah hukum Indonesia.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="perubahan" className="bg-card py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              15. Perubahan Ketentuan
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Kami dapat memperbarui syarat dan ketentuan ini dari waktu ke waktu. Perubahan akan diumumkan di website dengan tanggal versi baru di bagian atas halaman ini.
              </p>
              <p>
                Untuk perubahan material, kami akan memberi tahu melalui email (jika Anda berlangganan newsletter) atau pengumuman di homepage minimal 30 hari sebelum perubahan berlaku.
              </p>
              <p>
                Dengan terus menggunakan website setelah perubahan berlaku, Anda dianggap menyetujui versi terbaru.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="penutup" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              16. Penutup
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Syarat dan ketentuan ini dibuat dengan iktikad baik dan transparansi. Tujuannya bukan untuk membatasi hak Anda, tapi untuk memastikan pengalaman yang adil dan aman bagi semua pengguna.
              </p>
              <p>
                <span className="font-semibold text-foreground">Kontak:</span> halo@tamparananakmuda.com
              </p>
              <p>
                <span className="font-semibold text-foreground">Tanggal efektif:</span> 26 Juli 2026
              </p>
              <p>
                <span className="font-semibold text-foreground">Versi:</span> 1.0
              </p>
            </div>
            <div className="mt-8 text-center">
              <Link href="/kebijakan-privasi" className="text-primary hover:underline">
                Baca juga: Kebijakan Privasi
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
