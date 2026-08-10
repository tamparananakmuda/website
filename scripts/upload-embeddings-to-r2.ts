import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Load .env.local manually
const envPath = join(process.cwd(), '.env.local');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) return;
    const key = trimmed.substring(0, eqIdx).trim();
    const value = trimmed.substring(eqIdx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

const CACHE_PATH = join(process.cwd(), 'lib', 'tami', 'rag', 'embeddings-cache.json');

async function main() {
  if (!existsSync(CACHE_PATH)) {
    console.error('Embeddings cache not found at', CACHE_PATH);
    process.exit(1);
  }

  const fileBuffer = readFileSync(CACHE_PATH);
  const fileSizeMB = (fileBuffer.length / 1024 / 1024).toFixed(1);
  console.log(`Uploading embeddings cache (${fileSizeMB} MB) to R2...`);

  const client = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT || `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });

  const key = 'tami/embeddings-cache.json';
  const bucketName = process.env.R2_BUCKET_NAME || 'cdn-tam';

  await client.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileBuffer,
    ContentType: 'application/json',
    CacheControl: 'public, max-age=86400',
  }));

  const cdnUrl = `${process.env.CDN_BASE_URL || 'https://cdn.tamparananakmuda.com'}/${key}`;
  console.log(`Uploaded to R2: ${cdnUrl}`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
