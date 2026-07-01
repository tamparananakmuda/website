import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { OrganizationSchema } from '@/components/schema/organization-schema';

export const metadata = {
  title: 'Tentang Kami',
  description:
    'TAMPARAN ANAK MUDA lahir dari keresahan melihat banyaknya informasi yang cepat viral tetapi miskin makna. Kenali visi, misi, dan nilai kami.',
};

const misi = [
  {
    title: 'Konten yang relevan dan jujur',
    desc: 'Menyajikan konten edukatif yang relevan, jujur, dan mudah dipahami.',
  },
  {
    title: 'Membangun growth mindset',
    desc: 'Membangun pola pikir bertumbuh melalui pembahasan bisnis, keuangan, teknologi, dan pengembangan diri.',
  },
  {
    title: 'Mendorong tindakan nyata',
    desc: 'Menginspirasi generasi muda untuk berani mengambil tindakan, bukan hanya mengonsumsi informasi.',
  },
  {
    title: 'Wadah berbagi wawasan',
    desc: 'Menjadi wadah berbagi wawasan dan pengalaman yang memberikan dampak positif bagi masyarakat.',
  },
];

const nilai = [
  {
    negative: 'Kami tidak mengejar viral',
    positive: 'Kami mengejar nilai.',
  },
  {
    negative: 'Kami tidak menjual motivasi kosong',
    positive: 'Kami membahas kenyataan.',
  },
  {
    negative: 'Kami tidak menulis untuk algoritma',
    positive: 'Kami menulis untuk manusia.',
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
                TAMPARAN ANAK MUDA lahir dari keresahan melihat banyaknya informasi yang cepat viral tetapi miskin makna. Setiap hari, anak muda Indonesia dibombardir dengan konten yang terlihat inspiratif tapi sebenarnya tidak mengubah apa-apa. Motivasi murahan diproduksi massal, dipacking cantik, dan didistribusi tanpa pemikiran.
              </p>
              <p>
                Kami melihat gap yang nyata: antara motivasi yang terlalu manis dan realita yang terlalu kompleks. Antara konten yang dibuat untuk algoritma dan tulisan yang dibuat untuk manusia. Antara informasi yang dikonsumsi dan pemahaman yang benar-benar bertahan.
              </p>
              <p>
                Kenapa &ldquo;tamparan&rdquo; bukan &ldquo;pelukan&rdquo;? Karena terkadang yang kamu butuhkan bukan seseorang yang mengatakan &ldquo;kamu pasti bisa&rdquo;, tapi seseorang yang mengatakan &ldquo;hei, kamu bohong pada dirimu sendiri&rdquo;. Tamparan tidak menyenangkan. Tapi tamparan membangunkan. Dan itulah yang kami ingin lakukan — membangunkan.
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
              Menjadi media inspiratif yang mendorong lahirnya generasi muda Indonesia yang mandiri, berintegritas, dan mampu menciptakan perubahan nyata.
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
          <div className="mx-auto max-w-2xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Nilai
            </p>
            <h2 className="mb-12 text-3xl font-bold tracking-tight md:text-4xl">
              Kami berbeda karena
            </h2>
            <div className="space-y-8">
              {nilai.map((item, index) => (
                <div key={index} className="flex flex-col gap-2 md:flex-row md:items-baseline md:gap-6">
                  <p className="text-xl text-muted-foreground line-through decoration-muted-foreground/40 md:text-2xl">
                    {item.negative}
                  </p>
                  <p className="text-2xl font-bold text-primary md:text-3xl">
                    {item.positive}
                  </p>
                </div>
              ))}
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
