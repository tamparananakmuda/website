import { ImageResponse } from '@vercel/og';
import { getPublishedPostWithRelationsBySlug, countPublishedPostsInSeries } from '@/lib/db/queries/posts';
import { OgTemplate } from '@/lib/og/template';
import { getFonts } from '@/lib/og/fonts';

export const runtime = 'nodejs';
export const revalidate = 3600;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/webp';

interface Props {
  params: { slug: string };
}

export default async function Image({ params }: Props) {
  const post = await getPublishedPostWithRelationsBySlug(params.slug);

  if (post?.ogImageUrl) {
    const res = await fetch(post.ogImageUrl);
    const buffer = await res.arrayBuffer();
    return new Response(buffer, {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=3600, immutable',
      },
    });
  }

  if (!post) {
    const fonts = await getFonts();
    return new ImageResponse(
      (
        <OgTemplate
          title="Artikel tidak ditemukan"
          category="TAMPARAN ANAK MUDA"
          size="og"
        />
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          { name: 'Syne', data: fonts.display, weight: 700, style: 'normal' },
          { name: 'Plus Jakarta Sans', data: fonts.body, weight: 400, style: 'normal' },
          { name: 'Plus Jakarta Sans', data: fonts.bodySemiBold, weight: 600, style: 'normal' },
          { name: 'JetBrains Mono', data: fonts.mono, weight: 400, style: 'normal' },
        ],
      }
    );
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
        size="og"
      />
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Syne', data: fonts.display, weight: 700, style: 'normal' },
        { name: 'Plus Jakarta Sans', data: fonts.body, weight: 400, style: 'normal' },
        { name: 'Plus Jakarta Sans', data: fonts.bodySemiBold, weight: 600, style: 'normal' },
        { name: 'JetBrains Mono', data: fonts.mono, weight: 400, style: 'normal' },
      ],
    }
  );
}
