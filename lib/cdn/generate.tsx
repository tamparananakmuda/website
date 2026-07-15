import React from 'react';
import { ImageResponse } from '@vercel/og';
import { OgTemplate, TemplateProps } from '../og/template';
import { getFonts } from '../og/fonts';
import { uploadOGImage, getCDNUrl, type OGImageType } from './r2';

const SIZE_CONFIG: Record<OGImageType, { width: number; height: number }> = {
  card: { width: 800, height: 450 },
  feature: { width: 1600, height: 900 },
  og: { width: 1200, height: 630 },
};

async function imageResponseToBuffer(response: ImageResponse): Promise<Buffer> {
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function generateOGImage(
  props: Omit<TemplateProps, 'size'>,
  type: OGImageType
): Promise<Buffer> {
  const fonts = await getFonts();
  const { width, height } = SIZE_CONFIG[type];

  const response = new ImageResponse(
    <OgTemplate {...props} size={type} />,
    {
      width,
      height,
      fonts: [
        { name: 'Syne', data: fonts.display, weight: 700, style: 'normal' },
        { name: 'Plus Jakarta Sans', data: fonts.body, weight: 400, style: 'normal' },
        { name: 'Plus Jakarta Sans', data: fonts.bodySemiBold, weight: 600, style: 'normal' },
        { name: 'JetBrains Mono', data: fonts.mono, weight: 400, style: 'normal' },
      ],
    }
  );

  return imageResponseToBuffer(response);
}

export interface OGImageUrls {
  card: string;
  feature: string;
  og: string;
}

export async function generateAndUploadOGImages(
  slug: string,
  templateProps: Omit<TemplateProps, 'size'>
): Promise<OGImageUrls> {
  const [cardBuffer, featureBuffer, ogBuffer] = await Promise.all([
    generateOGImage(templateProps, 'card'),
    generateOGImage(templateProps, 'feature'),
    generateOGImage(templateProps, 'og'),
  ]);

  const [cardUrl, featureUrl, ogUrl] = await Promise.all([
    uploadOGImage(slug, 'card', cardBuffer),
    uploadOGImage(slug, 'feature', featureBuffer),
    uploadOGImage(slug, 'og', ogBuffer),
  ]);

  return { card: cardUrl, feature: featureUrl, og: ogUrl };
}

export { getCDNUrl };
