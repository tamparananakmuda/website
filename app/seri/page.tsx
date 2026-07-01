import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const revalidate = 60;

export const metadata = {
  title: 'Seri Konten',
};

export default async function SeriesPage() {
  const supabase = createClient();

  const { data: series } = await supabase
    .from('series')
    .select('*')
    .order('title', { ascending: true });

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
