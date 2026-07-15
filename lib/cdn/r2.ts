import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const bucketName = process.env.R2_BUCKET_NAME || 'cdn-tam';
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

function getObjectKey(slug: string): string {
  return `og/${slug}.webp`;
}

export function getCDNUrl(slug: string): string {
  return `${cdnBaseUrl}/${getObjectKey(slug)}`;
}

export async function uploadOGImage(slug: string, buffer: Buffer): Promise<string> {
  const client = getS3Client();
  const key = getObjectKey(slug);

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );

  return getCDNUrl(slug);
}

export async function deleteOGImage(slug: string): Promise<void> {
  const client = getS3Client();
  const key = getObjectKey(slug);

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
  );
}

export async function deleteOldOGImages(slug: string): Promise<void> {
  const client = getS3Client();
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
