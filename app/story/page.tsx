import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, MapPin, Users, ArrowRight, Heart } from 'lucide-react';
import Image from 'next/image';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';

export const metadata: Metadata = {
  title: 'Story - Kegiatan Lapangan TAM',
  description:
    'Kegiatan lapangan TAMPARAN ANAK MUDA. Kunjungan ke panti jompo, panti asuhan, dan komunitas. Bukan teori, tapi aksi nyata.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/story`,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/story`,
    title: 'Story - Tamparan Anak Muda',
    description: 'Kegiatan lapangan TAM. Bukan teori, tapi aksi nyata.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Story - Tamparan Anak Muda',
    description: 'Kegiatan lapangan TAM. Bukan teori, tapi aksi nyata.',
  },
};

export const revalidate = 3600;

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
}

const activities: Activity[] = [
  {
    slug: 'kunjungan-panti-jompo-syailendra',
    title: 'Kunjungan ke Panti Jompo Syailendra',
    excerpt:
      'Mengunjungi panti jompo untuk mendengar cerita hidup para lansia. Pelajaran tentang penuaan, kesepian, dan apa yang sebenarnya berarti di akhir hidup.',
    date: '2026-08-02',
    location: 'Jimbaran, Kuta Sel., Badung, Bali 80361',
    participants: 'Mendatang',
    status: 'upcoming',
    category: 'Panti Jompo',
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
  },
];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function StoryPage() {
  const upcoming = activities.filter((a) => a.status === 'upcoming');
  const completed = activities.filter((a) => a.status === 'completed');

  return (
    <main className="container mx-auto px-4 py-12 md:py-16">
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Story', href: '/story' },
      ]} />

      {/* Hero */}
      <div className="mb-12 max-w-3xl">
        <div className="mb-6 flex items-center gap-4">
          <span className="font-display text-sm font-bold text-primary">Story</span>
          <div className="h-px w-24 bg-border" />
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Kegiatan Lapangan
          </span>
        </div>
        <h1 className="mb-4 font-display text-3xl font-bold leading-tight tracking-tight md:text-5xl">
          Bukan cuma nulis. Kami turun ke lapangan.
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          TAM percaya bahwa menulis tentang masalah tidak cukup. Kami harus melihat, mendengar, dan merasakan langsung. Inilah catatan kegiatan kami di lapangan.
        </p>
      </div>

      {/* Upcoming Activities */}
      {upcoming.length > 0 && (
        <section className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Calendar size={16} />
            </span>
            <h2 className="font-display text-xl font-bold md:text-2xl">Kegiatan Mendatang</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((activity) => (
              <Link
                key={activity.slug}
                href={`/story/${activity.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/30">
                  {activity.imageUrl ? (
                    <Image
                      src={activity.imageUrl}
                      alt={activity.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Heart size={40} className="text-muted-foreground/20" />
                    </div>
                  )}
                  <div className="absolute left-3 top-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
                      {activity.category}
                    </span>
                  </div>
                  <div className="absolute right-3 top-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                      Upcoming
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="mb-2 font-display text-lg font-bold leading-snug transition-colors group-hover:text-primary">
                    {activity.title}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {activity.excerpt}
                  </p>
                  <div className="mt-auto space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar size={12} />
                      <span>{formatDate(activity.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={12} />
                      <span className="line-clamp-1">{activity.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={12} />
                      <span>{activity.participants}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Completed Activities */}
      {completed.length > 0 && (
        <section>
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/15 text-green-600">
              <Heart size={16} />
            </span>
            <h2 className="font-display text-xl font-bold md:text-2xl">Kegiatan Selesai</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {completed.map((activity) => (
              <Link
                key={activity.slug}
                href={`/story/${activity.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/30">
                  {activity.imageUrl ? (
                    <Image
                      src={activity.imageUrl}
                      alt={activity.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Heart size={40} className="text-muted-foreground/20" />
                    </div>
                  )}
                  <div className="absolute left-3 top-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {activity.category}
                    </span>
                  </div>
                  <div className="absolute right-3 top-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-600/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                      Selesai
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="mb-2 font-display text-lg font-bold leading-snug transition-colors group-hover:text-primary">
                    {activity.title}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {activity.excerpt}
                  </p>
                  <div className="mt-auto space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar size={12} />
                      <span>{formatDate(activity.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={12} />
                      <span className="line-clamp-1">{activity.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={12} />
                      <span>{activity.participants}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="mt-16 rounded-2xl border border-border bg-secondary/30 p-8 text-center md:p-12">
        <h2 className="mb-3 font-display text-2xl font-bold md:text-3xl">
          Mau ikut kegiatan berikutnya?
        </h2>
        <p className="mb-6 text-muted-foreground">
          Kami buka untuk relawan. Daftar dan jadi bagian dari aksi nyata TAM.
        </p>
        <Link
          href="/donasi"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90"
        >
          Jadi Relawan
          <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  );
}
