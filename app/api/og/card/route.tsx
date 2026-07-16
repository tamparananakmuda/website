import { ImageResponse } from '@vercel/og';
import { getPublishedPostWithRelationsBySlug } from '@/lib/db/queries/posts';
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

  return new ImageResponse(
    (
      <OgTemplate
        title={post.title}
        category={category?.title}
        categoryColor={category?.color}
        categorySlug={category?.slug}
        publishedAt={post.publishedAt}
        isPremium={post.isPremium || undefined}
        isSponsored={post.isSponsored || undefined}
        coverImageUrl={post.coverImageUrl}
        ogHeadline={post.ogHeadline || undefined}
        size="card"
      />
    ),
    {
      width: 800,
      height: 450,
      fonts: [
        { name: 'Syne', data: fonts.display, weight: 700, style: 'normal' },
        { name: 'Plus Jakarta Sans', data: fonts.body, weight: 400, style: 'normal' },
        { name: 'Plus Jakarta Sans', data: fonts.bodySemiBold, weight: 600, style: 'normal' },
        { name: 'JetBrains Mono', data: fonts.mono, weight: 400, style: 'normal' },
      ],
    }
  );
}
