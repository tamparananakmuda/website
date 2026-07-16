import { getAllSeries } from '@/lib/db/queries/series';
import Link from 'next/link';

export const revalidate = 60;

export const metadata = {
  title: 'Seri Konten',
  description: 'Seri artikel mendalam TAMPARAN ANAK MUDA. Topik yang dibahas tuntas dalam beberapa bagian.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/seri`,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/seri`,
    title: 'Seri Konten - Tamparan Anak Muda',
    description: 'Seri artikel mendalam TAMPARAN ANAK MUDA. Topik yang dibahas tuntas dalam beberapa bagian.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Seri Konten - Tamparan Anak Muda',
    description: 'Seri artikel mendalam TAMPARAN ANAK MUDA. Topik yang dibahas tuntas dalam beberapa bagian.',
  },
};

export default async function SeriesPage() {
  const series = await getAllSeries();

  return (
    <main className="container mx-auto px-4 py-20 md:py-32">
      <header className="mb-12 max-w-2xl">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">
          Seri Konten
        </h1>
        <p className="text-lg text-muted-foreground">
          Kumpulan artikel yang saling berhubungan, membahas satu tema secara mendalam.
        </p>
      </header>

      {series && series.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {series.map((item) => (
            <Link
              key={item.id}
              href={`/seri/${item.slug}`}
              className="group rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent"
            >
              <h2 className="mb-2 text-xl font-bold transition-colors group-hover:text-primary">
                {item.title}
              </h2>
              {item.description && (
                <p className="text-sm text-muted-foreground">{item.description}</p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Belum ada seri konten.</p>
      )}
    </main>
  );
}
