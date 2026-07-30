import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, MapPin, Users, ArrowLeft, ArrowRight, Heart, Clock } from 'lucide-react';
import Image from 'next/image';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';

interface Activity {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  location: string;
  participants: string;
  status: 'upcoming' | 'completed';
  category: string;
  imageUrl?: string;
  description: string;
  objectives: string[];
  agenda: { time: string; activity: string }[];
}

const activities: Activity[] = [
  {
    slug: 'kunjungan-panti-jompo-bahagia',
    title: 'Kunjungan ke Panti Jompo Bahagia',
    excerpt:
      'Mengunjungi panti jompo untuk mendengar cerita hidup para lansia. Pelajaran tentang penuaan, kesepian, dan apa yang sebenarnya berarti di akhir hidup.',
    date: '2026-08-15',
    location: 'Panti Jompo Bahagia, Jakarta Selatan',
    participants: '15 relawan',
    status: 'upcoming',
    category: 'Panti Jompo',
    description:
      'Kunjungan ke Panti Jompo Bahagia adalah kegiatan pertama TAM Story. Kami akan mengunjungi panti jompo untuk mendengar cerita hidup para lansia, bercengkerama, dan belajar dari pengalaman mereka. Kegiatan ini bukan sekadar memberikan bantuan, tapi juga mendengarkan kisah-kisah yang sering terlupakan.',
    objectives: [
      'Mendengarkan dan mendokumentasikan cerita hidup para lansia',
      'Memberikan kebersamaan dan perhatian yang tulus',
      'Membawa sembako dan kebutuhan harian',
      'Belajar tentang penuaan dan kesepian di Indonesia',
    ],
    agenda: [
      { time: '08:00', activity: 'Berangkat dari titik kumpul' },
      { time: '09:00', activity: 'Sambutan dan perkenalan dengan pengurus panti' },
      { time: '09:30', activity: 'Bercengkerama dan mendengar cerita lansia' },
      { time: '11:00', activity: 'Penyerahan bantuan sembako' },
      { time: '12:00', activity: 'Makan siang bersama' },
      { time: '13:00', activity: 'Refleksi dan dokumentasi' },
      { time: '14:00', activity: 'Pulang' },
    ],
  },
  {
    slug: 'kunjungan-chloe-house',
    title: 'Kunjungan ke Chloe House',
    excerpt:
      'Berbagi waktu dengan anak-anak di Chloe House. Belajar tentang mimpi, harapan, dan kenyataan tumbuh tanpa orang tua.',
    date: '2025-06-25',
    location: 'Jl. Pidada, Ubung, Denpasar Utara, Bali 80111',
    participants: '31 relawan',
    status: 'completed',
    category: 'Panti Asuhan',
    imageUrl: 'https://cdn.tamparananakmuda.com/story/kunjungan-chloe-house.jpeg',
    description:
      'Kunjungan ke Chloe House adalah kesempatan untuk berbagi waktu dengan anak-anak yang tumbuh tanpa orang tua. Kami akan bermain, belajar, dan mendengarkan mimpi-mimpi mereka. Kegiatan ini bertujuan untuk memberikan dukungan emosional dan inspirasi bagi anak-anak di Chloe House.',
    objectives: [
      'Bermain dan berinteraksi dengan anak-anak panti asuhan',
      'Membagikan buku bacaan dan alat tulis',
      'Workshop mini tentang mimpi dan cita-cita',
      'Mendengarkan kisah dan aspirasi anak-anak',
    ],
    agenda: [
      { time: '08:30', activity: 'Berangkat dari titik kumpul' },
      { time: '09:30', activity: 'Perkenalan dengan anak-anak Chloe House' },
      { time: '10:00', activity: 'Ice breaking dan permainan' },
      { time: '11:00', activity: 'Workshop mini: mimpi dan cita-cita' },
      { time: '12:00', activity: 'Makan siang bersama' },
      { time: '13:00', activity: 'Penyerahan buku dan alat tulis' },
      { time: '14:00', activity: 'Foto bersama dan pulang' },
    ],
  },
  {
    slug: 'workshop-keuangan-gen-z',
    title: 'Workshop Keuangan Gen Z',
    excerpt:
      'Workshop gratis tentang literasi keuangan untuk generasi muda. Belajar kelola uang, hindari jebakan paylater, dan mulai investasi dari nol.',
    date: '2026-09-10',
    location: 'Coworking Space, Jakarta Pusat',
    participants: '50 peserta',
    status: 'upcoming',
    category: 'Workshop',
    description:
      'Workshop Keuangan Gen Z adalah sesi belajar gratis tentang literasi keuangan. Kami akan membahas cara mengelola uang, menghindari jebakan paylater, dan memulai investasi dari nol. Workshop ini dirancang khusus untuk generasi muda yang ingin mandiri secara finansial.',
    objectives: [
      'Mengajarkan dasar-dasar manajemen keuangan pribadi',
      'Membahas bahaya paylater dan cara menghindarinya',
      'Memperkenalkan konsep investasi untuk pemula',
      'Memberikan template budgeting yang bisa langsung dipakai',
    ],
    agenda: [
      { time: '13:00', activity: 'Registrasi peserta' },
      { time: '13:30', activity: 'Sesi 1: Mindset keuangan Gen Z' },
      { time: '14:30', activity: 'Sesi 2: Budgeting dan tracking pengeluaran' },
      { time: '15:30', activity: 'Coffee break' },
      { time: '16:00', activity: 'Sesi 3: Bahaya paylater dan cara keluar' },
      { time: '17:00', activity: 'Sesi 4: Investasi untuk pemula' },
      { time: '18:00', activity: 'Q&A dan penutup' },
    ],
  },
  {
    slug: 'bakti-sosial-panti-werdha',
    title: 'Bakti Sosial Panti Werdha',
    excerpt:
      'Kegiatan bakti sosial di panti werdha. Memasak, bercengkerama, dan mendengarkan kisah hidup para lansia yang sering terlupakan.',
    date: '2026-07-20',
    location: 'Panti Werdha Sejahtera, Bandung',
    participants: '12 relawan',
    status: 'completed',
    category: 'Panti Jompo',
    description:
      'Bakti Sosial Panti Werdha adalah kegiatan pertama TAM Story yang sudah selesai. Kami mengunjungi panti werdha di Bandung, memasak makan siang bersama para lansia, dan mendengarkan kisah hidup mereka. Kegiatan ini memberikan pelajaran berharga tentang penuaan, kesepian, dan arti kebersamaan.',
    objectives: [
      'Memasak dan menyajikan makan siang untuk para lansia',
      'Bercengkerama dan mendengarkan kisah hidup',
      'Membawa sembako dan kebutuhan harian',
      'Dokumentasi cerita lansia untuk pembelajaran',
    ],
    agenda: [
      { time: '07:00', activity: 'Berangkat dari Jakarta' },
      { time: '10:00', activity: 'Tiba di panti werdha' },
      { time: '10:30', activity: 'Persiapan masak bersama' },
      { time: '12:00', activity: 'Makan siang bersama lansia' },
      { time: '13:00', activity: 'Bercengkerama dan dokumentasi cerita' },
      { time: '15:00', activity: 'Penyerahan bantuan' },
      { time: '16:00', activity: 'Pulang' },
    ],
  },
];

function getActivityBySlug(slug: string): Activity | undefined {
  return activities.find((a) => a.slug === slug);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export async function generateStaticParams() {
  return activities.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const activity = getActivityBySlug(params.slug);
  if (!activity) {
    return { title: 'Kegiatan Tidak Ditemukan' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';
  const url = `${siteUrl}/story/${activity.slug}`;

  return {
    title: `${activity.title} - TAM Story`,
    description: activity.excerpt,
    robots: { index: true, follow: true },
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      locale: 'id_ID',
      url,
      title: `${activity.title} - TAM Story`,
      description: activity.excerpt,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${activity.title} - TAM Story`,
      description: activity.excerpt,
    },
  };
}

export default function StoryDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const activity = getActivityBySlug(params.slug);
  if (!activity) notFound();

  const isUpcoming = activity.status === 'upcoming';

  return (
    <main className="container mx-auto px-4 py-12 md:py-16">
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Story', href: '/story' },
        { name: activity.title, href: `/story/${activity.slug}` },
      ]} />

      <div className="mx-auto max-w-3xl">
        {/* Back link */}
        <Link
          href="/story"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} />
          Kembali ke Story
        </Link>

        {/* Header */}
        <div className="mb-8">
          {activity.imageUrl && (
            <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-2xl">
              <Image
                src={activity.imageUrl}
                alt={activity.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
          )}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
              {activity.category}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                isUpcoming
                  ? 'bg-amber-500/15 text-amber-600'
                  : 'bg-green-600/15 text-green-600'
              }`}
            >
              {isUpcoming ? 'Upcoming' : 'Selesai'}
            </span>
          </div>

          <h1 className="mb-4 font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl">
            {activity.title}
          </h1>

          <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
            {activity.excerpt}
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 border-y border-border py-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={16} className="text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Tanggal</div>
                <div className="font-semibold text-foreground">{formatDate(activity.date)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={16} className="text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Lokasi</div>
                <div className="font-semibold text-foreground">{activity.location}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users size={16} className="text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Peserta</div>
                <div className="font-semibold text-foreground">{activity.participants}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <section className="mb-10">
          <h2 className="mb-4 font-display text-xl font-bold">Tentang Kegiatan</h2>
          <p className="leading-relaxed text-foreground/80">
            {activity.description}
          </p>
        </section>

        {/* Objectives */}
        <section className="mb-10">
          <h2 className="mb-4 font-display text-xl font-bold">Tujuan Kegiatan</h2>
          <ul className="space-y-2">
            {activity.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-3 text-foreground/80">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                <span className="leading-relaxed">{obj}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Agenda */}
        <section className="mb-10">
          <h2 className="mb-4 font-display text-xl font-bold">Agenda</h2>
          <div className="space-y-3">
            {activity.agenda.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-4"
              >
                <div className="flex w-16 shrink-0 items-center gap-1.5 text-sm font-semibold text-primary">
                  <Clock size={14} />
                  {item.time}
                </div>
                <div className="text-sm leading-relaxed text-foreground/80">
                  {item.activity}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Placeholder for photos */}
        <section className="mb-10">
          <h2 className="mb-4 font-display text-xl font-bold">Dokumentasi</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-border bg-muted/20"
              >
                <Heart size={24} className="text-muted-foreground/20" />
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Foto akan tersedia setelah kegiatan berlangsung
          </p>
        </section>

        {/* CTA */}
        {isUpcoming && (
          <div className="rounded-2xl border border-border bg-secondary/30 p-6 text-center md:p-8">
            <h2 className="mb-2 font-display text-xl font-bold">
              Mau ikut kegiatan ini?
            </h2>
            <p className="mb-5 text-sm text-muted-foreground">
              Daftar sebagai relawan dan jadi bagian dari aksi nyata TAM.
            </p>
            <Link
              href="/donasi"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90"
            >
              Daftar Relawan
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-12 border-t border-border pt-8">
          <Link
            href="/story"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-opacity hover:opacity-70"
          >
            Lihat semua kegiatan
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </main>
  );
}
