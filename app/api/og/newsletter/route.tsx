import { ImageResponse } from '@vercel/og';
import { OgTemplate } from '@/lib/og/template';
import { getFonts } from '@/lib/og/fonts';

export const runtime = 'nodejs';
export const revalidate = 3600;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const edition = searchParams.get('edition');
  const editionNumber = edition ? parseInt(edition, 10) : undefined;

  const fonts = await getFonts();

  return new ImageResponse(
    (
      <OgTemplate
        title="TAMPARAN ANAK MUDA"
        size="newsletter"
        publishedAt={new Date().toISOString()}
        editionNumber={editionNumber}
      />
    ),
    {
      width: 1200,
      height: 300,
      fonts: [
        { name: 'Syne', data: fonts.display, weight: 700, style: 'normal' },
        { name: 'Plus Jakarta Sans', data: fonts.body, weight: 400, style: 'normal' },
        { name: 'Plus Jakarta Sans', data: fonts.bodySemiBold, weight: 600, style: 'normal' },
        { name: 'JetBrains Mono', data: fonts.mono, weight: 400, style: 'normal' },
      ],
    }
  );
}
