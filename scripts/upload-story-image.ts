import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

config({ path: '.env.local' });

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

async function uploadStoryImage(localPath: string, key: string): Promise<string> {
  const client = getS3Client();
  const buffer = readFileSync(localPath);

  const ext = localPath.split('.').pop()?.toLowerCase() || 'jpeg';
  const contentType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );

  const url = `${cdnBaseUrl}/${key}`;
  console.log(`Uploaded: ${url}`);
  return url;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: npx tsx scripts/upload-story-image.ts <local-path> <slug>');
    console.error('Example: npx tsx scripts/upload-story-image.ts ./photo.jpeg kunjungan-chloe-house');
    process.exit(1);
  }

  const [localPath, slug] = args;
  const ext = localPath.split('.').pop()?.toLowerCase() || 'jpeg';
  const key = `story/${slug}.${ext}`;

  try {
    const url = await uploadStoryImage(localPath, key);
    console.log(`\nImage URL: ${url}`);
    console.log(`CDN path: story/${slug}.jpeg`);
  } catch (err) {
    console.error('Upload failed:', err);
    process.exit(1);
  }
}

main();
