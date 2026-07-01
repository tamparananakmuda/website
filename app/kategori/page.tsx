import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const revalidate = 60;

export const metadata = {
  title: 'Kategori',
};

export default async function CategoriesPage() {
  const supabase = createClient();

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('title', { ascending: true });

  return (
    <main className="container mx-auto px-4 py-16">
      <header className="mb-12 max-w-2xl">
        <h1 className="mb-4 font-serif text-3xl font-bold md:text-4xl">
          Kategori
        </h1>
        <p className="text-lg text-muted-foreground">
          Pilih topik yang paling relevan dengan apa yang sedang kamu pikirkan.
        </p>
      </header>

      {categories && categories.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/kategori/${category.slug}`}
              className="group rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent"
            >
              <h2
                className="mb-2 font-serif text-xl font-bold transition-colors group-hover:text-primary"
                style={{ color: category.color }}
              >
                {category.title}
              </h2>
              {category.description && (
                <p className="text-sm text-muted-foreground">{category.description}</p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Belum ada kategori.</p>
      )}
    </main>
  );
}
