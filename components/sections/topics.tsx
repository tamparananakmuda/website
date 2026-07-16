import Link from 'next/link';
import type { Category } from '@/lib/db/schema';

interface TopicsProps {
  categories: Category[];
}

export function Topics({ categories }: TopicsProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="bg-card py-24 md:py-40">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-8 flex items-center gap-4">
          <span className="font-display text-sm font-bold text-primary">02</span>
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Topik
          </span>
        </div>
        <h2 className="mb-4 font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl">
          Enam topik. Satu sudut pandang: kenapa, bukan cuma apa.
        </h2>
        <p className="mb-12 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Kami tidak menulis &ldquo;5 cara hemat&rdquo;. Kami menulis kenapa sistemnya bikin kamu susah hemat, dan apa yang bisa kamu lakukan setelah memahaminya.
        </p>
        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/kategori/${category.slug}`}
              className="group relative flex flex-col bg-card p-6 transition-colors hover:bg-secondary md:p-8"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="font-display text-xs font-bold text-muted-foreground/50">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div
                  className="h-2 w-2 rounded-full transition-transform group-hover:scale-125"
                  style={{ backgroundColor: category.color }}
                />
              </div>
              <h3 className="mb-2 font-display text-xl font-bold tracking-tight transition-colors group-hover:text-primary md:text-2xl">
                {category.title}
              </h3>
              {category.description && (
                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  {category.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
