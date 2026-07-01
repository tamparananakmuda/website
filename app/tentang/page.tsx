import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { OrganizationSchema } from '@/components/schema/organization-schema';

export const metadata = {
  title: 'Tentang Kami',
  description:
    'TAMPARAN ANAK MUDA adalah editorial media digital Indonesia. Kenali prinsip editorial, visi, dan roadmap kami — bukan sekadar konten, tapi komitmen tertulis.',
};

const prinsipEditorial = [
  {
    title: 'Setiap klaim ada sumbernya',
    desc: 'Angka, data, dan kutipan selalu dicantumkan dengan sumber. Tidak ada statistik tanpa origin. Kalau kami pakai data, kami tunjukkan dari mana.',
  },
  {
    title: 'Koreksi publik jika salah',
    desc: 'Kalau kami keliru, kami perbaiki terbuka. Setiap artikel punya tanggal update dan catatan revisi. Tidak ada diam-diam edit tanpa akuntabilitas.',
  },
  {
    title: 'Tidak ada konten sponsored yang disamarkan',
    desc: 'Kalau ada brand yang bayar, kami tulis jelas. Konten editorial dan konten sponsored tidak pernah dicampur tanpa label.',
  },
  {
    title: 'Angle kritik sosial, bukan tips generik',
    desc: 'Kami tidak menulis "5 cara sukses". Kami menulis kenapa sistemnya begini — dan apa yang bisa kamu lakukan setelah memahaminya.',
  },
];

const roadmap = [
  {
    phase: 'Sekarang',
    items: [
      'Editorial media tertulis — artikel mendalam di 6 topik',
      'Newsletter mingguan gratis',
      'Konten Instagram/TikTok sebagai distribution channel',
    ],
  },
  {
    phase: '6–12 bulan',
    items: [
      'Digital products: template keuangan, career guide, worksheet',
      'Sponsored content dari brand yang align dengan values kami',
      'Komunitas reader (Discord/Telegram)',
    ],
  },
  {
    phase: '12+ bulan',
    items: [
      'Membership premium: artikel eksklusif, deep dive series',
      'Kolaborasi dengan penulis guest',
      'Event/workshop tertulis (bukan video)',
    ],
  },
];

const misi = [
  {
    title: 'Tulisan yang bertahan',
    desc: 'Menulis konten yang bisa dibaca ulang dalam 2 tahun dan tetap relevan. Evergreen, bukan chasing trend.',
  },
  {
    title: 'Sumber yang bisa dicek',
    desc: 'Setiap angka dan klaim dicantumkan dengan sumber. Reader bisa verifikasi sendiri.',
  },
  {
    title: 'Sudut pandang, bukan netral palsu',
    desc: 'Kami punya opini. Kami tidak berpura-pura netral. Tapi opini kami berdasar data, bukan emosi.',
  },
  {
    title: 'Akses gratis, selamanya',
    desc: 'Artikel gratis dibaca. Tidak ada paywall untuk konten editorial. Monetisasi lewat produk dan sponsorship, bukan membatasi akses.',
  },
];

export default function AboutPage() {
  return (
    <main>
      <OrganizationSchema />

      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Tentang Kami
            </p>
            <h1 className="mb-12 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              Mengapa kami ada?
            </h1>
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>
                TAMPARAN ANAK MUDA lahir dari keresahan: setiap hari anak muda Indonesia dibombardir konten yang terlihat inspiratif tapi sebenarnya tidak mengubah apa-apa. Video 60 detik, carousel motivasi, thread Twitter — semuanya dikonsumsi cepat, lalu dilupakan lebih cepat.
              </p>
              <p>
                Kami melihat gap yang nyata: tidak ada media tertulis Indonesia yang khusus untuk anak muda, dengan depth editorial dan tone yang jujur. Ada banyak video, banyak podcast, banyak carousel — tapi tidak ada tempat untuk membaca analisis mendalam tentang uang, karier, bisnis, teknologi, dan kehidupan.
              </p>
              <p>
                Kenapa &ldquo;tamparan&rdquo; bukan &ldquo;pelukan&rdquo;? Karena terkadang yang kamu butuhkan bukan seseorang yang mengatakan &ldquo;kamu pasti bisa&rdquo;, tapi seseorang yang mengatakan &ldquo;hei, kamu bohong pada dirimu sendiri&rdquo;. Tamparan tidak menyenangkan. Tapi tamparan membangunkan.
              </p>
              <p>
                Kami bukan media berita. Kami adalah editorial media. Kami tidak bertanya &ldquo;apa yang terjadi hari ini?&rdquo; tapi &ldquo;apa yang harus dipahami dari apa yang terjadi?&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Visi
            </p>
            <p className="text-3xl font-bold leading-snug tracking-tight md:text-4xl md:leading-tight">
              Menjadi editorial media tertulis terdepan untuk anak muda Indonesia — tempat membaca analisis yang jujur, tajam, dan bertahan.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Misi
            </p>
            <div className="space-y-8">
              {misi.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <span className="text-2xl font-bold text-primary">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="mb-1 text-xl font-bold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Prinsip Editorial
            </p>
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              &ldquo;Tamparan&rdquo; bukan cuma tone. Ini bukti.
            </h2>
            <p className="mb-12 text-lg text-muted-foreground">
              Bukan klaim kejujuran, tapi komitmen yang bisa dipegang. Kalau kami melanggar, kamu berhak menegur.
            </p>
            <div className="space-y-8">
              {prinsipEditorial.map((item, index) => (
                <div key={index} className="border-l-2 border-primary pl-6">
                  <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Roadmap
            </p>
            <h2 className="mb-12 text-3xl font-bold tracking-tight md:text-4xl">
              Rencana kami, tertulis.
            </h2>
            <div className="space-y-12">
              {roadmap.map((phase, index) => (
                <div key={index}>
                  <h3 className="mb-4 text-lg font-bold text-primary">{phase.phase}</h3>
                  <ul className="space-y-2">
                    {phase.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Suara di Balik TAM
            </p>
            <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
              Bukan anonymous. Bukan satu wajah.
            </h2>
            <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
              <p>
                TAM dibangun sebagai brand institusional, bukan personal brand satu orang. Tapi kami percaya reader butuh tahu siapa yang menulis.
              </p>
              <p>
                Setiap artikel ditulis dengan nama penulis dan bio. Tidak ada ghost writer tanpa atribusi. Kalau kami kutip orang lain, kami tulis siapa. Kalau opini kami sendiri, kami tulis jelas.
              </p>
              <p>
                Di fase awal, kamu akan melihat suara yang konsisten di setiap tulisan — editor TAM. Seiring waktu, lebih banyak penulis akan bergabung, masing-masing dengan suara dan keahlian sendiri.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <Button asChild size="lg">
            <Link href="/artikel">Mulai Membaca</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
