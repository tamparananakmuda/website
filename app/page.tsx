import { createClient } from '@/lib/supabase/server';
import { ArticleCard } from '@/components/article-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const revalidate = 60;

export default async function HomePage() {
  const supabase = createClient();

  const { data: featuredPosts } = await supabase
    .from('posts')
    .select('*, category:categories(*)')
    .eq('status', 'published')
    .eq('featured', true)
    .order('published_at', { ascending: false })
    .limit(3);

  const { data: recentPosts } = await supabase
    .from('posts')
    .select('*, category:categories(*)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(6);

  const posts = featuredPosts?.length
    ? featuredPosts
    : recentPosts?.slice(0, 3) || [];

  const morePosts = featuredPosts?.length
    ? recentPosts?.filter(
        (p) => !featuredPosts.some((fp) => fp.id === p.id)
      )?.slice(0, 3) || []
    : [];

  return (
    <main>
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium tracking-wider text-muted-foreground uppercase">
            Tamparan untuk generasi yang lagi berproses
          </p>
          <h1 className="mb-6 font-serif text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            TAMPARAN ANAK MUDA
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-muted-foreground md:text-xl">
            Perspektif jujur untuk anak muda Indonesia yang lagi berproses
            menjadi diri sendiri. Tanpa embel-embel motivasi, tanpa clickbait.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/artikel">Baca Artikel</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/newsletter">Langganan Newsletter</Link>
            </Button>
          </div>
        </div>
      </section>

      {posts.length > 0 && (
        <section className="border-t border-border bg-muted/30">
          <div className="container mx-auto px-4 py-16">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="font-serif text-2xl font-bold md:text-3xl">
                Artikel Terbaru
              </h2>
              <Link
                href="/artikel"
                className="text-sm font-medium text-primary hover:underline"
              >
                Lihat semua
              </Link>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {morePosts.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {morePosts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl">
            <h2 className="mb-4 font-serif text-2xl font-bold md:text-3xl">
              Jangan Ketinggalan
            </h2>
            <p className="mb-6 text-muted-foreground">
              Satu email per minggu. Tidak ada spam. Hanya tamparan yang kamu butuhkan untuk tetap jujur sama diri sendiri.
            </p>
            <Button asChild size="lg">
              <Link href="/newsletter">Langganan Newsletter</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
