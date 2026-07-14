import { ImageResponse } from '@vercel/og';
import { createClient } from '@supabase/supabase-js';
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
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  const { data: wp } = await supabase
    .from('whitepapers')
    .select('title, summary, subtitle, cover_image_url, published_at')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

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
        publishedAt={wp.published_at}
        coverImageUrl={wp.cover_image_url}
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
