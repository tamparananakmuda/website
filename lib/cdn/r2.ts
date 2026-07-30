import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const bucketName = process.env.R2_BUCKET_NAME || 'cdn-tam';
const cdnBaseUrl = process.env.CDN_BASE_URL || 'https://cdn.tamparananakmuda.com';

export type OGImageType = 'card' | 'feature';

function getS3Client(): S3Client {
  return new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT!,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

function getObjectKey(slug: string, type: OGImageType): string {
  return `og/${slug}-${type}.webp`;
}

export function getCDNUrl(slug: string, type: OGImageType): string {
  return `${cdnBaseUrl}/${getObjectKey(slug, type)}`;
}

export async function uploadOGImage(slug: string, type: OGImageType, buffer: Buffer): Promise<string> {
  const client = getS3Client();
  const key = getObjectKey(slug, type);
  const contentType = 'image/webp';

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=0, s-maxage=0',
    })
  );

  return getCDNUrl(slug, type);
}

export async function deleteOldOGImages(slug: string): Promise<void> {
  const client = getS3Client();
  // Only delete legacy PNG formats and old single-webp format.
  // Do NOT delete current -card.webp and -feature.webp files here,
  // because PutObjectCommand overwrites them on upload. Deleting them
  // before upload creates a race where the file is missing if upload fails.
  const oldKeys = [
    `og/${slug}-card.png`,
    `og/${slug}-feature.png`,
    `og/${slug}-og.png`,
    `og/${slug}.webp`,
  ];

  await Promise.all(
    oldKeys.map(key =>
      client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: key }))
    )
  );
}
