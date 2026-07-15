import React from 'react';
import { ImageResponse } from '@vercel/og';
import sharp from 'sharp';
import { OgTemplate, TemplateProps } from '../og/template';
import { getFonts } from '../og/fonts';
import { uploadOGImage, getCDNUrl } from './r2';

async function imageResponseToBuffer(response: ImageResponse): Promise<Buffer> {
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function generateOGImageWebp(
  props: Omit<TemplateProps, 'size'>
): Promise<Buffer> {
  const fonts = await getFonts();

  const response = new ImageResponse(
    <OgTemplate {...props} size="og" />,
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

  const pngBuffer = await imageResponseToBuffer(response);
  const webpBuffer = await sharp(pngBuffer).webp({ quality: 85 }).toBuffer();
  return webpBuffer;
}

export async function generateAndUploadOGImage(
  slug: string,
  templateProps: Omit<TemplateProps, 'size'>
): Promise<string> {
  const webpBuffer = await generateOGImageWebp(templateProps);
  return uploadOGImage(slug, webpBuffer);
}

export { getCDNUrl };
