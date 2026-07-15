import React from 'react';
import { ImageResponse } from '@vercel/og';
import sharp from 'sharp';
import { OgTemplate, TemplateProps } from '../og/template';
import { getFonts } from '../og/fonts';
import { uploadOGImage, getCDNUrl, OGImageType } from './r2';

async function imageResponseToBuffer(response: ImageResponse): Promise<Buffer> {
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

const SIZE_MAP: Record<OGImageType, { width: number; height: number; templateSize: 'card' | 'feature' }> = {
  card: { width: 800, height: 450, templateSize: 'card' },
  feature: { width: 1600, height: 900, templateSize: 'feature' },
};

async function generateOGImageWebp(
  props: Omit<TemplateProps, 'size'>,
  type: OGImageType
): Promise<Buffer> {
  const fonts = await getFonts();
  const { width, height, templateSize } = SIZE_MAP[type];

  const response = new ImageResponse(
    <OgTemplate {...props} size={templateSize} />,
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

  const pngBuffer = await imageResponseToBuffer(response);
  const webpBuffer = await sharp(pngBuffer).webp({ quality: 85 }).toBuffer();
  return webpBuffer;
}

export interface OGImageUrls {
  card: string;
  feature: string;
}

export async function generateAndUploadOGImages(
  slug: string,
  templateProps: Omit<TemplateProps, 'size'>
): Promise<OGImageUrls> {
  const [cardBuffer, featureBuffer] = await Promise.all([
    generateOGImageWebp(templateProps, 'card'),
    generateOGImageWebp(templateProps, 'feature'),
  ]);

  const [cardUrl, featureUrl] = await Promise.all([
    uploadOGImage(slug, 'card', cardBuffer),
    uploadOGImage(slug, 'feature', featureBuffer),
  ]);

  return { card: cardUrl, feature: featureUrl };
}

export { getCDNUrl };
