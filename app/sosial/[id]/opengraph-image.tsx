import { ImageResponse } from '@vercel/og';
import { getPublishedSocialPostById } from '@/lib/db/queries/social-posts';
import { OgTemplate } from '@/lib/og/template';
import { getFonts } from '@/lib/og/fonts';

export const runtime = 'nodejs';
export const revalidate = 3600;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Props {
  params: { id: string };
}

export default async function Image({ params }: Props) {
  const post = await getPublishedSocialPostById(params.id);

  const fonts = await getFonts();

  if (!post) {
    return new ImageResponse(
      (
        <OgTemplate
          title="Konten tidak ditemukan"
          category="SOSIAL"
          size="sosial"
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

  return new ImageResponse(
    (
      <OgTemplate
        title={post.title || 'Konten TAM'}
        category="SOSIAL"
        platform={post.platform}
        publishedAt={post.publishedAt}
        size="sosial"
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
