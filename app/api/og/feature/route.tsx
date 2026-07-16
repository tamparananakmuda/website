import { ImageResponse } from '@vercel/og';
import { getPublishedPostWithRelationsBySlug, countPublishedPostsInSeries } from '@/lib/db/queries/posts';
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

  const post = await getPublishedPostWithRelationsBySlug(slug);

  if (!post) {
    return new Response('Article not found', { status: 404 });
  }

  const fonts = await getFonts();

  const category = post.category ?? null;
  const author = post.author ?? null;
  const series = post.series ?? null;

  let seriesCurrent: number | undefined;
  let seriesTotal: number | undefined;
  if (series && post.seriesOrder) {
    seriesTotal = await countPublishedPostsInSeries(series.id);
    seriesCurrent = post.seriesOrder ?? undefined;
  }

  return new ImageResponse(
    (
      <OgTemplate
        title={post.title}
        category={category?.title}
        categoryColor={category?.color}
        categorySlug={category?.slug}
        excerpt={post.excerpt || undefined}
        readingTime={post.readingTime || undefined}
        publishedAt={post.publishedAt}
        authorName={author?.name}
        isPremium={post.isPremium || undefined}
        isSponsored={post.isSponsored || undefined}
        seriesCurrent={seriesCurrent}
        seriesTotal={seriesTotal}
        coverImageUrl={post.coverImageUrl}
        ogHeadline={post.ogHeadline || undefined}
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
