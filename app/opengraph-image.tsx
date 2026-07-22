import { ImageResponse } from '@vercel/og';
import { OgTemplate } from '@/lib/og/template';
import { getFonts } from '@/lib/og/fonts';

export const runtime = 'nodejs';
export const revalidate = 3600;
export const alt = 'TAMPARAN ANAK MUDA - Menyadarkan Generasi Muda akan Kenyataan';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const fonts = await getFonts();

  return new ImageResponse(
    (
      <OgTemplate
        title="Menyadarkan Generasi Muda akan Kenyataan"
        category="TAMPARAN ANAK MUDA"
        size="og"
        publishedAt={new Date().toISOString()}
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
