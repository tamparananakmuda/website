import type { Metadata } from 'next';
import Link from 'next/link';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi',
  description:
    'Kebijakan privasi TAMPARAN ANAK MUDA sesuai UU PDP No. 27/2022. Pelajari data apa yang kami kumpulkan, untuk apa, bagaimana kami melindunginya, dan hak Anda atas data pribadi.',
  keywords: ['kebijakan privasi', 'UU PDP', 'perlindungan data pribadi', 'privacy policy', 'data pribadi indonesia'],
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${siteUrl}/kebijakan-privasi`,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: `${siteUrl}/kebijakan-privasi`,
    title: 'Kebijakan Privasi - Tamparan Anak Muda',
    description:
      'Kebijakan privasi TAMPARAN ANAK MUDA sesuai UU PDP No. 27/2022. Data apa yang kami kumpulkan, untuk apa, dan bagaimana kami melindunginya.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kebijakan Privasi - Tamparan Anak Muda',
    description:
      'Kebijakan privasi TAMPARAN ANAK MUDA sesuai UU PDP No. 27/2022.',
  },
};

const dataPribadiUmum = [
  { sumber: 'Newsletter', data: 'Email, topik pilihan, sumber pendaftaran, token unsubscribe', tujuan: 'Mengirim newsletter mingguan', dasar: 'Persetujuan' },
  { sumber: 'Akun Reader (Supabase Auth)', data: 'UUID, email, session token', tujuan: 'Login, bookmark, komentar, dashboard', dasar: 'Pelaksanaan kontrak' },
  { sumber: 'Profil Reader', data: 'Nama, email, topik preferensi, waktu aktif terakhir', tujuan: 'Personalisasi pengalaman membaca', dasar: 'Pelaksanaan kontrak' },
  { sumber: 'Komentar', data: 'Nama, email, isi komentar, ID reader', tujuan: 'Menampilkan komentar di artikel', dasar: 'Persetujuan' },
  { sumber: 'Like Komentar', data: 'ID komentar, ID reader', tujuan: 'Menyukai komentar', dasar: 'Pelaksanaan kontrak' },
  { sumber: 'Bookmark', data: 'ID user, ID artikel, slug artikel', tujuan: 'Menyimpan artikel untuk dibaca nanti', dasar: 'Pelaksanaan kontrak' },
  { sumber: 'Riwayat Baca', data: 'ID reader, slug artikel, waktu baca, progress', tujuan: 'Dashboard reader, rekomendasi', dasar: 'Pelaksanaan kontrak' },
  { sumber: 'Akses Premium', data: 'ID reader, slug artikel yang di-unlock', tujuan: 'Akses konten premium', dasar: 'Pelaksanaan kontrak' },
];

const dataSensitif = [
  { sumber: 'Donasi', data: 'Nama, email, jumlah, fee, metode pembayaran, data transaksi, pesan, status anonim, status berulang', tujuan: 'Memproses donasi dan kirim bukti', dasar: 'Persetujuan + pelaksanaan kontrak' },
  { sumber: 'Notifikasi Push', data: 'ID user, subscription browser (endpoint, keys)', tujuan: 'Mengirim notifikasi push browser', dasar: 'Persetujuan' },
];

const dataAnalytics = [
  { sumber: 'Umami (self-hosted)', data: 'Page views, custom events, browser, device, negara (anonim)', tujuan: 'Analytics konten', cookie: 'Tidak (cookieless)' },
  { sumber: 'Vercel Analytics', data: 'Page views, visitor stats', tujuan: 'Analytics', cookie: 'Minimal (Vercel-managed)' },
  { sumber: 'Vercel Speed Insights', data: 'Core Web Vitals (LCP, CLS, INP)', tujuan: 'Monitoring performa', cookie: 'Minimal' },
];

const cookieList = [
  { nama: 'Supabase Auth', jenis: 'Session cookie', tujuan: 'Menjaga status login dan refresh session', wajib: 'Ya' },
  { nama: 'tam-theme (localStorage)', jenis: 'Local storage', tujuan: 'Preferensi dark/light mode', wajib: 'Ya' },
  { nama: 'Umami', jenis: 'Tidak ada cookie', tujuan: 'Analytics cookieless', wajib: 'N/A' },
  { nama: 'Vercel Analytics', jenis: 'Vercel-managed', tujuan: 'Page view tracking', wajib: 'Tidak' },
];

const pihakKetiga = [
  { provider: 'Supabase', fungsi: 'Autentikasi dan hosting database', lokasi: 'US/Singapore', data: 'UUID, email, session, semua data database', transfer: 'Ya' },
  { provider: 'Vercel', fungsi: 'Hosting website, Analytics, Speed Insights', lokasi: 'US', data: 'IP, page views, performance metrics', transfer: 'Ya' },
  { provider: 'Resend', fungsi: 'Layanan email transaksional', lokasi: 'US', data: 'Email penerima, subject, konten email', transfer: 'Ya' },
  { provider: 'Cloudflare R2', fungsi: 'CDN dan storage untuk OG images', lokasi: 'Global', data: 'OG images saja (tidak ada data pribadi)', transfer: 'Tidak' },
  { provider: 'Cloudflare Turnstile', fungsi: 'Proteksi bot (alternatif CAPTCHA)', lokasi: 'Global', data: 'Browser fingerprint (sementara, tidak disimpan)', transfer: 'Tidak' },
  { provider: 'Louvin', fungsi: 'Payment gateway (QRIS, e-wallet, virtual account)', lokasi: 'Indonesia', data: 'Nama, email, jumlah, data pembayaran', transfer: 'Tidak' },
  { provider: 'Upstash Redis', fungsi: 'Rate limiting', lokasi: 'US (serverless)', data: 'IP address (sementara, auto-expire)', transfer: 'Ya' },
];

const hakSubjekData = [
  { hak: 'Hak atas informasi', desc: 'Mengetahui identitas pengendali data, dasar hukum, tujuan, dan periode retensi.' },
  { hak: 'Hak akses dan salinan', desc: 'Mendapatkan salinan data pribadi yang kami simpan tentang Anda.' },
  { hak: 'Hak koreksi', desc: 'Meminta perbaikan data yang tidak akurat atau tidak lengkap.' },
  { hak: 'Hak penghapusan', desc: 'Meminta penghapusan data pribadi Anda dari sistem kami.' },
  { hak: 'Hak penghentian pemrosesan', desc: 'Meminta kami berhenti memproses data Anda untuk tujuan tertentu.' },
  { hak: 'Hak portabilitas data', desc: 'Menerima data Anda dalam format terstruktur untuk dipindahkan ke layanan lain.' },
  { hak: 'Hak menolak profiling', desc: 'Menolak pemrosesan berbasis profiling otomatis.' },
  { hak: 'Hak menarik persetujuan', desc: 'Menarik persetujuan yang sebelumnya diberikan kapan saja.' },
  { hak: 'Hak mengajukan gugatan', desc: 'Mengajukan gugatan hukum jika hak Anda dilanggar.' },
];

const glosarium = [
  { istilah: 'Data Pribadi', def: 'Informasi tentang individu yang dapat diidentifikasi, seperti nama, email, atau data finansial.' },
  { istilah: 'Data Sensitif', def: 'Kategori data pribadi yang berisiko lebih tinggi jika bocor, termasuk data finansial dan kesehatan.' },
  { istilah: 'Persetujuan', def: 'Pernyataan eksplisit dari Anda untuk mengizinkan kami memproses data Anda untuk tujuan tertentu.' },
  { istilah: 'Cookie', def: 'File kecil yang disimpan di browser untuk menyimpan preferensi atau melacak aktivitas.' },
  { istilah: 'Analytics', def: 'Pengumpulan dan analisis data tentang bagaimana pengunjung menggunakan website.' },
  { istilah: 'Pengendali Data', def: 'Pihak yang menentukan tujuan dan cara pemrosesan data pribadi. Dalam kasus ini, TAMPARAN ANAK MUDA.' },
  { istilah: 'Pemroses Data', def: 'Pihak yang memproses data atas instruksi pengendali data, seperti Supabase, Vercel, atau Resend.' },
];

export default function KebijakanPrivasiPage() {
  return (
    <main>
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Legal
            </p>
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              Kebijakan Privasi
            </h1>
            <p className="mb-2 text-sm text-muted-foreground">
              Berlaku efektif sejak 26 Juli 2026
            </p>
            <p className="mb-2 text-sm text-muted-foreground">
              Versi 1.0
            </p>
            <div className="mt-8 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Kebijakan privasi ini menjelaskan bagaimana TAMPARAN ANAK MUDA (&ldquo;TAM&rdquo;, &ldquo;kami&rdquo;) mengumpulkan, menggunakan, dan melindungi data pribadi Anda. Kebijakan ini disusun sesuai dengan Undang-Undang Perlindungan Data Pribadi No. 27 Tahun 2022 (&ldquo;UU PDP&rdquo;).
              </p>
              <p>
                Dengan menggunakan website tamparananakmuda.com, Anda mengakui bahwa Anda telah membaca dan memahami kebijakan ini.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="pengendali" className="bg-card py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              1. Pengendali Data Pribadi
            </h2>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">Nama:</span> TAMPARAN ANAK MUDA
              </p>
              <p>
                <span className="font-semibold text-foreground">Website:</span> tamparananakmuda.com
              </p>
              <p>
                <span className="font-semibold text-foreground">Email privasi:</span> halo@tamparananakmuda.com
              </p>
              <p>
                Untuk permintaan terkait data pribadi, penghapusan data, atau keluhan privasi, kirim email dengan subjek &ldquo;Permintaan Data Pribadi&rdquo; ke alamat di atas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="data-dikumpulkan" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              2. Data yang Kami Kumpulkan
            </h2>

            <h3 className="mb-4 text-lg font-semibold">Data Pribadi Umum</h3>
            <div className="mb-8 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 pr-4 text-left font-semibold">Sumber</th>
                    <th className="py-3 pr-4 text-left font-semibold">Data</th>
                    <th className="py-3 pr-4 text-left font-semibold">Tujuan</th>
                    <th className="py-3 text-left font-semibold">Dasar Hukum</th>
                  </tr>
                </thead>
                <tbody>
                  {dataPribadiUmum.map((item, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-3 pr-4 font-medium">{item.sumber}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{item.data}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{item.tujuan}</td>
                      <td className="py-3 text-muted-foreground">{item.dasar}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="mb-4 text-lg font-semibold">Data Pribadi Spesifik/Sensitif</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Sesuai UU PDP Pasal 4, data finansial dan data terkait kesehatan dikategorikan sebagai data pribadi spesifik yang memerlukan perlindungan ekstra.
            </p>
            <div className="mb-8 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 pr-4 text-left font-semibold">Sumber</th>
                    <th className="py-3 pr-4 text-left font-semibold">Data</th>
                    <th className="py-3 pr-4 text-left font-semibold">Tujuan</th>
                    <th className="py-3 text-left font-semibold">Dasar Hukum</th>
                  </tr>
                </thead>
                <tbody>
                  {dataSensitif.map((item, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-3 pr-4 font-medium">{item.sumber}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{item.data}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{item.tujuan}</td>
                      <td className="py-3 text-muted-foreground">{item.dasar}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="mb-4 text-lg font-semibold">Data Analytics</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 pr-4 text-left font-semibold">Sumber</th>
                    <th className="py-3 pr-4 text-left font-semibold">Data</th>
                    <th className="py-3 pr-4 text-left font-semibold">Tujuan</th>
                    <th className="py-3 text-left font-semibold">Cookie?</th>
                  </tr>
                </thead>
                <tbody>
                  {dataAnalytics.map((item, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-3 pr-4 font-medium">{item.sumber}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{item.data}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{item.tujuan}</td>
                      <td className="py-3 text-muted-foreground">{item.cookie}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section id="tujuan-dasar" className="bg-card py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              3. Tujuan dan Dasar Hukum Pemrosesan
            </h2>
            <p className="mb-6 text-base leading-relaxed text-muted-foreground">
              Sesuai UU PDP Pasal 20, kami memproses data pribadi Anda berdasarkan salah satu dari dasar hukum berikut:
            </p>
            <div className="space-y-6">
              <div className="border-l-2 border-primary pl-6">
                <h3 className="mb-2 text-lg font-semibold">Persetujuan (Pasal 20 ayat 1)</h3>
                <p className="text-muted-foreground">
                  Untuk newsletter, komentar, notifikasi push, dan donasi. Anda memberikan persetujuan secara eksplisit melalui form yang tersedia. Anda dapat menarik persetujuan kapan saja.
                </p>
              </div>
              <div className="border-l-2 border-primary pl-6">
                <h3 className="mb-2 text-lg font-semibold">Pelaksanaan Kontrak (Pasal 20 ayat 2)</h3>
                <p className="text-muted-foreground">
                  Untuk akun reader, bookmark, riwayat baca, like komentar, dan akses konten premium. Data diproses untuk menjalankan layanan yang Anda minta.
                </p>
              </div>
              <div className="border-l-2 border-primary pl-6">
                <h3 className="mb-2 text-lg font-semibold">Kepentingan Sah (Pasal 20 ayat 6)</h3>
                <p className="text-muted-foreground">
                  Untuk analytics (Umami, Vercel), rate limiting, dan keamanan sistem. Kepentingan sah kami adalah memastikan website berjalan aman, stabil, dan konten dapat dioptimalkan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="persetujuan" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              4. Persetujuan
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Sesuai UU PDP Pasal 21, persetujuan Anda harus eksplisit, spesifik, dan berdasarkan informasi. Kami tidak menggunakan checkbox yang sudah tercentang atau persetujuan diam-diam.
              </p>
              <p>
                <span className="font-semibold text-foreground">Newsletter:</span> Anda mendaftar melalui form subscribe dengan memasukkan email dan memilih topik. Unsubscribe dapat dilakukan kapan saja melalui link di setiap email.
              </p>
              <p>
                <span className="font-semibold text-foreground">Komentar:</span> Anda mengisi form komentar dengan nama, email, dan isi komentar. Persetujuan diberikan saat Anda mengirim komentar.
              </p>
              <p>
                <span className="font-semibold text-foreground">Donasi:</span> Anda mengisi form donasi dengan nama, email, dan jumlah. Persetujuan diberikan saat Anda menyelesaikan transaksi.
              </p>
              <p>
                <span className="font-semibold text-foreground">Notifikasi Push:</span> Browser akan menampilkan prompt persetujuan. Anda dapat menolak atau menerima, dan menarik persetujuan melalui pengaturan browser.
              </p>
              <p>
                Anda dapat menarik persetujuan kapan saja dengan cara yang sama mudahnya dengan memberikannya. Penarikan persetujuan tidak mempengaruhi pemrosesan data yang sudah dilakukan sebelumnya.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="cookie" className="bg-card py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              5. Cookie dan Teknologi Pelacakan
            </h2>
            <p className="mb-6 text-base leading-relaxed text-muted-foreground">
              Daftar lengkap cookie dan teknologi pelacakan yang digunakan di website ini:
            </p>
            <div className="mb-8 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 pr-4 text-left font-semibold">Nama</th>
                    <th className="py-3 pr-4 text-left font-semibold">Jenis</th>
                    <th className="py-3 pr-4 text-left font-semibold">Tujuan</th>
                    <th className="py-3 text-left font-semibold">Wajib?</th>
                  </tr>
                </thead>
                <tbody>
                  {cookieList.map((item, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-3 pr-4 font-medium">{item.nama}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{item.jenis}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{item.tujuan}</td>
                      <td className="py-3 text-muted-foreground">{item.wajib}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Kami menggunakan Umami sebagai analytics utama. Umami adalah platform analytics privacy-first yang tidak menggunakan cookie dan tidak melacak IP address atau identitas personal. Karena itu, kami tidak menampilkan cookie consent banner.
              </p>
              <p>
                Vercel Analytics dan Speed Insights dikategorikan sebagai analytics minimal yang dikelola Vercel. Data yang dikumpulkan terbatas pada page views dan performance metrics, tidak mencakup PII.
              </p>
              <p>
                Cookie Supabase Auth dan local storage tema adalah cookie wajib yang diperlukan untuk fungsi dasar website. Tanpa cookie ini, login dan preferensi tampilan tidak akan berfungsi.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="pihak-ketiga" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              6. Penyedia Pihak Ketiga
            </h2>
            <p className="mb-6 text-base leading-relaxed text-muted-foreground">
              Kami menggunakan layanan pihak ketiga untuk menjalankan website. Mereka bertindak sebagai pemroses data atas instruksi kami. Berikut daftar lengkapnya:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 pr-4 text-left font-semibold">Provider</th>
                    <th className="py-3 pr-4 text-left font-semibold">Fungsi</th>
                    <th className="py-3 pr-4 text-left font-semibold">Lokasi</th>
                    <th className="py-3 pr-4 text-left font-semibold">Data yang Diproses</th>
                    <th className="py-3 text-left font-semibold">Transfer</th>
                  </tr>
                </thead>
                <tbody>
                  {pihakKetiga.map((item, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-3 pr-4 font-medium">{item.provider}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{item.fungsi}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{item.lokasi}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{item.data}</td>
                      <td className="py-3 text-muted-foreground">{item.transfer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section id="transfer-lintas-batas" className="bg-card py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              7. Transfer Data Lintas Batas
            </h2>
            <p className="mb-6 text-base leading-relaxed text-muted-foreground">
              Sesuai UU PDP Pasal 37, transfer data pribadi ke luar wilayah Indonesia wajib memenuhi syarat perlindungan yang setara. Pengungkapan transfer data lintas batas:
            </p>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">Ke Amerika Serikat:</span> Supabase (auth dan database), Vercel (hosting dan analytics), Resend (email), Upstash Redis (rate limiting, IP sementara saja).
              </p>
              <p>
                <span className="font-semibold text-foreground">Ke Singapura:</span> Supabase dapat menyimpan data di region Singapore tergantung konfigurasi.
              </p>
              <p>
                <span className="font-semibold text-foreground">Di Indonesia:</span> Louvin (payment gateway). Data donasi tidak keluar dari Indonesia.
              </p>
              <p>
                <span className="font-semibold text-foreground">Global edge (no PII):</span> Cloudflare R2 dan Turnstile tidak memproses data pribadi.
              </p>
              <p>
                Kami memilih provider yang memiliki komitmen perlindungan data yang kuat. Supabase, Vercel, dan Resend masing-masing memiliki kebijakan privasi dan sertifikasi keamanan (SOC 2, ISO 27001) yang dapat diakses di website masing-masing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="retensi" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              8. Retensi Data
            </h2>
            <p className="mb-6 text-base leading-relaxed text-muted-foreground">
              Kami menyimpan data pribadi Anda hanya selama diperlukan untuk tujuan yang dijelaskan dalam kebijakan ini:
            </p>
            <div className="space-y-4">
              <div className="border-l-2 border-primary pl-6">
                <h3 className="mb-1 font-semibold">Newsletter</h3>
                <p className="text-muted-foreground">Selama Anda berlangganan. Saat unsubscribe, email dihapus dari daftar aktif dalam 30 hari.</p>
              </div>
              <div className="border-l-2 border-primary pl-6">
                <h3 className="mb-1 font-semibold">Akun Reader</h3>
                <p className="text-muted-foreground">Selama akun aktif. Anda dapat meminta penghapusan akun kapan saja.</p>
              </div>
              <div className="border-l-2 border-primary pl-6">
                <h3 className="mb-1 font-semibold">Donasi</h3>
                <p className="text-muted-foreground">Data transaksi disimpan permanen untuk keperluan audit dan pelaporan keuangan.</p>
              </div>
              <div className="border-l-2 border-primary pl-6">
                <h3 className="mb-1 font-semibold">Riwayat Baca dan Bookmark</h3>
                <p className="text-muted-foreground">Selama akun aktif. Dihapus saat akun dihapus.</p>
              </div>
              <div className="border-l-2 border-primary pl-6">
                <h3 className="mb-1 font-semibold">Komentar</h3>
                <p className="text-muted-foreground">Selama artikel terbit. Komentar dapat dihapus oleh penulis atau moderator.</p>
              </div>
              <div className="border-l-2 border-primary pl-6">
                <h3 className="mb-1 font-semibold">Analytics (Umami)</h3>
                <p className="text-muted-foreground">12 bulan (default), disimpan di database yang kami kelola.</p>
              </div>
              <div className="border-l-2 border-primary pl-6">
                <h3 className="mb-1 font-semibold">Rate Limiting (IP)</h3>
                <p className="text-muted-foreground">Sementara, auto-expire sesuai window rate limit (detik hingga menit).</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="keamanan" className="bg-card py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              9. Keamanan Data
            </h2>
            <p className="mb-6 text-base leading-relaxed text-muted-foreground">
              Sesuai UU PDP Pasal 35, kami menerapkan langkah keamanan teknis dan organisasional untuk melindungi data pribadi Anda:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span><span className="font-semibold text-foreground">Row Level Security (RLS):</span> Semua tabel database dilindungi RLS Supabase, memastikan data hanya dapat diakses oleh user yang berwenang.</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span><span className="font-semibold text-foreground">Server-side only:</span> Semua query database menggunakan Drizzle ORM di server, tidak ada query langsung dari client.</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span><span className="font-semibold text-foreground">Rate limiting:</span> Upstash Redis membatasi request per IP untuk mencegah abuse dan brute force.</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span><span className="font-semibold text-foreground">Bot protection:</span> Cloudflare Turnstile melindungi form dari bot dan spam.</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span><span className="font-semibold text-foreground">HTTPS:</span> Seluruh traffic dienkripsi via TLS. Vercel mengaktifkan HTTPS secara default.</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span><span className="font-semibold text-foreground">Environment variables:</span> Semua API key dan kredensial disimpan di server, tidak pernah diekspos ke client.</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span><span className="font-semibold text-foreground">Input validation:</span> Semua input user divalidasi dengan Zod schema sebelum diproses.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="hak-anda" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              10. Hak Anda atas Data Pribadi
            </h2>
            <p className="mb-6 text-base leading-relaxed text-muted-foreground">
              Sesuai UU PDP Pasal 5 sampai 16, Anda memiliki 9 hak atas data pribadi Anda:
            </p>
            <div className="space-y-6">
              {hakSubjekData.map((item, i) => (
                <div key={i} className="border-l-2 border-primary pl-6">
                  <h3 className="mb-1 font-semibold">{i + 1}. {item.hak}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-lg border border-border bg-card p-6">
              <h3 className="mb-2 font-semibold">Cara Menggunakan Hak Anda</h3>
              <p className="text-muted-foreground">
                Kirim email ke <span className="font-medium text-foreground">halo@tamparananakmuda.com</span> dengan subjek &ldquo;Permintaan Data Pribadi&rdquo;. Sebutkan hak yang ingin Anda gunakan dan data terkait. Kami akan merespons dalam 14 hari kerja.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="notifikasi-kebocoran" className="bg-card py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              11. Notifikasi Kebocoran Data
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Sesuai UU PDP Pasal 46, jika terjadi kebocoran data pribadi yang berdampak, kami wajib memberitahu Anda dan lembaga pengawas dalam waktu 3x24 jam (72 jam) sejak kebocoran diketahui.
              </p>
              <p>
                Notifikasi akan berisi:
              </p>
              <ul className="ml-4 space-y-2">
                <li className="list-disc">Data pribadi yang terungkap</li>
                <li className="list-disc">Kapan dan bagaimana kebocoran terjadi</li>
                <li className="list-disc">Upaya penanganan dan mitigasi yang dilakukan</li>
                <li className="list-disc">Langkah yang dapat Anda ambil untuk melindungi diri</li>
              </ul>
              <p>
                Notifikasi akan dikirim melalui email ke alamat yang terdaftar, atau melalui pengumuman di website jika kebocoran berskala luas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="privasi-anak" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              12. Privasi Anak
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Website ini tidak ditujukan untuk anak di bawah 13 tahun. Kami tidak dengan sengaja mengumpulkan data pribadi dari anak di bawah 13 tahun.
              </p>
              <p>
                Jika Anda adalah orang tua atau wali dan mengetahui bahwa anak Anda telah memberikan data pribadi kepada kami, silakan hubungi kami. Kami akan menghapus data tersebut segera.
              </p>
              <p>
                Untuk donasi, kami mengharuskan pengguna berusia minimal 17 tahun atau memiliki persetujuan orang tua/wali untuk transaksi finansial.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="perubahan" className="bg-card py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              13. Perubahan Kebijakan
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan akan diumumkan di website dengan tanggal versi baru di bagian atas halaman ini.
              </p>
              <p>
                Untuk perubahan material yang mempengaruhi hak Anda, kami akan memberi tahu melalui email (jika Anda berlangganan newsletter) atau pengumuman di homepage minimal 30 hari sebelum perubahan berlaku.
              </p>
              <p>
                Tanggal efektif di bagian atas halaman ini menunjukkan kapan versi terakhir diterapkan.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="kontak" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              14. Kontak
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Untuk pertanyaan, permintaan, atau keluhan terkait privasi data pribadi:
              </p>
              <div className="rounded-lg border border-border bg-card p-6">
                <p className="mb-1"><span className="font-semibold text-foreground">Email:</span> halo@tamparananakmuda.com</p>
                <p className="mb-1"><span className="font-semibold text-foreground">Subjek:</span> Permintaan Data Pribadi / Keluhan Privasi / Hak Jawab</p>
                <p><span className="font-semibold text-foreground">Response time:</span> 14 hari kerja</p>
              </div>
              <p>
                Jika Anda merasa keberatan dengan cara kami memproses data Anda dan tidak mendapatkan respons yang memuaskan, Anda berhak mengajukan keluhan kepada lembaga pengawas perlindungan data pribadi Indonesia.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="glosarium" className="bg-card py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
              15. Glosarium
            </h2>
            <div className="space-y-4">
              {glosarium.map((item, i) => (
                <div key={i}>
                  <h3 className="mb-1 font-semibold">{item.istilah}</h3>
                  <p className="text-muted-foreground">{item.def}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <Link href="/syarat-ketentuan" className="text-primary hover:underline">
            Baca juga: Syarat dan Ketentuan
          </Link>
        </div>
      </section>
    </main>
  );
}
