import { ImageResponse } from '@vercel/og';
import { getPublishedWhitepaperBySlug } from '@/lib/db/queries/whitepapers';
import { OgTemplate } from '@/lib/og/template';
import { getFonts } from '@/lib/og/fonts';

export const runtime = 'nodejs';
export const revalidate = 3600;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Props {
  params: { slug: string };
}

export default async function Image({ params }: Props) {
  const wp = await getPublishedWhitepaperBySlug(params.slug);

  const fonts = await getFonts();

  if (!wp) {
    return new ImageResponse(
      (
        <OgTemplate
          title="Whitepaper tidak ditemukan"
          category="WHITEPAPER"
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

  return new ImageResponse(
    (
      <OgTemplate
        title={wp.title}
        category="WHITEPAPER"
        excerpt={wp.summary || wp.subtitle || undefined}
        publishedAt={wp.publishedAt}
        coverImageUrl={wp.coverImageUrl}
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
