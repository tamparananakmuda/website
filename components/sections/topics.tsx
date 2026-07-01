import Link from 'next/link';
import { Category } from '@/types/database';

interface TopicsProps {
  categories: Category[];
}

export function Topics({ categories }: TopicsProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="bg-card py-20 md:py-32">
      <div className="container mx-auto px-4">
        <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
          Enam topik. Satu sudut pandang: kenapa, bukan cuma apa.
        </h2>
        <p className="mb-12 max-w-2xl text-lg text-muted-foreground">
          Kami tidak menulis &ldquo;5 cara hemat&rdquo;. Kami menulis kenapa sistemnya bikin kamu susah hemat, dan apa yang bisa kamu lakukan setelah memahaminya.
        </p>
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/kategori/${category.slug}`}
              className="group bg-card p-8 transition-colors hover:bg-secondary"
            >
              <div
                className="mb-3 h-1 w-12 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <h3 className="mb-2 text-2xl font-bold tracking-tight transition-colors group-hover:text-primary">
                {category.title}
              </h3>
              {category.description && (
                <p className="text-muted-foreground">{category.description}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
