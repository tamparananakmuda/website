import { ImageResponse } from '@vercel/og';
import { createClient } from '@supabase/supabase-js';
import { OgTemplate } from '@/lib/og/template';
import { getFonts } from '@/lib/og/fonts';

export const runtime = 'nodejs';
export const revalidate = 86400;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return new Response('Missing slug parameter', { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  const { data: post } = await supabase
    .from('posts')
    .select(`
      title, excerpt, og_headline, cover_image_url, published_at, reading_time,
      is_premium, is_sponsored, series_order,
      category:categories ( title, slug, color ),
      series:series ( id, title ),
      author:authors ( name )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!post) {
    return new Response('Article not found', { status: 404 });
  }

  const fonts = await getFonts();

  const categoryList = post.category as unknown as { title: string; slug: string; color: string }[] | null;
  const authorList = post.author as unknown as { name: string }[] | null;
  const seriesList = post.series as unknown as { id: string; title: string }[] | null;
  const category = categoryList?.[0] ?? null;
  const author = authorList?.[0] ?? null;
  const series = seriesList?.[0] ?? null;

  let seriesCurrent: number | undefined;
  let seriesTotal: number | undefined;
  if (series && post.series_order) {
    const { count } = await supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .eq('series_id', series.id)
      .eq('status', 'published');
    seriesCurrent = post.series_order;
    seriesTotal = count || undefined;
  }

  return new ImageResponse(
    (
      <OgTemplate
        title={post.title}
        category={category?.title}
        categoryColor={category?.color}
        categorySlug={category?.slug}
        excerpt={post.excerpt || undefined}
        readingTime={post.reading_time}
        publishedAt={post.published_at}
        authorName={author?.name}
        isPremium={post.is_premium}
        isSponsored={post.is_sponsored}
        seriesCurrent={seriesCurrent}
        seriesTotal={seriesTotal}
        coverImageUrl={post.cover_image_url}
        ogHeadline={post.og_headline || undefined}
        size="feature"
      />
    ),
    {
      width: 1600,
      height: 900,
      fonts: [
        { name: 'Syne', data: fonts.display, weight: 700, style: 'normal' },
        { name: 'Plus Jakarta Sans', data: fonts.body, weight: 400, style: 'normal' },
        { name: 'Plus Jakarta Sans', data: fonts.bodySemiBold, weight: 600, style: 'normal' },
        { name: 'JetBrains Mono', data: fonts.mono, weight: 400, style: 'normal' },
      ],
    }
  );
}
