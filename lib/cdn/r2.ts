import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

export type OGImageType = 'card' | 'feature' | 'og';

const bucketName = process.env.R2_BUCKET_NAME || 'tam-cdn';
const cdnBaseUrl = process.env.CDN_BASE_URL || 'https://cdn.tamparananakmuda.com';

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
  return `og/${slug}-${type}.png`;
}

export function getCDNUrl(slug: string, type: OGImageType): string {
  return `${cdnBaseUrl}/${getObjectKey(slug, type)}`;
}

export async function uploadOGImage(
  slug: string,
  type: OGImageType,
  buffer: Buffer
): Promise<string> {
  const client = getS3Client();
  const key = getObjectKey(slug, type);

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: 'image/png',
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );

  return getCDNUrl(slug, type);
}

export async function deleteOGImage(slug: string, type: OGImageType): Promise<void> {
  const client = getS3Client();
  const key = getObjectKey(slug, type);

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
  );
}

export async function deleteAllOGImages(slug: string): Promise<void> {
  await Promise.all([
    deleteOGImage(slug, 'card'),
    deleteOGImage(slug, 'feature'),
    deleteOGImage(slug, 'og'),
  ]);
}
