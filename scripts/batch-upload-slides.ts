import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { join, basename, dirname } from 'path';
import { config } from 'dotenv';

config({ path: '.env.local' });

const bucketName = process.env.R2_BUCKET_NAME || 'cdn-tam';
const cdnBaseUrl = process.env.CDN_BASE_URL || 'https://cdn.tamparananakmuda.com';
const slidesRoot = '/Users/yoviesetiawan/TAMPARAN ANAK MUDA/SOSIAL MEDIA/SLIDE/KONTEN';
const tempDir = '/tmp/tam-slides-webp';

interface SlideSet {
  date: string;
  month: string;
  caption: string;
  slides: string[];
}

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

async function uploadFile(client: S3Client, localPath: string, key: string): Promise<string> {
  const buffer = readFileSync(localPath);
  const ext = localPath.split('.').pop()?.toLowerCase() || 'webp';
  const contentType = ext === 'png' ? 'image/png' : ext === 'jpeg' || ext === 'jpg' ? 'image/jpeg' : 'image/webp';

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );

  return `${cdnBaseUrl}/${key}`;
}

function findImageDirs(root: string): string[] {
  const results: string[] = [];
  const months = readdirSync(root).filter((f) => {
    const full = join(root, f);
    return statSync(full).isDirectory() && !f.startsWith('.');
  });

  for (const month of months) {
    const monthDir = join(root, month);
    const dates = readdirSync(monthDir).filter((f) => {
      const full = join(monthDir, f);
      return statSync(full).isDirectory() && !f.startsWith('.');
    });

    for (const date of dates) {
      const dateDir = join(monthDir, date);
      // Check for images/ or Images/images/
      const imagesDir = join(dateDir, 'images');
      const nestedImagesDir = join(dateDir, 'Images', 'images');

      if (existsSync(imagesDir)) {
        const pngs = readdirSync(imagesDir).filter((f) => f.toLowerCase().endsWith('.png'));
        if (pngs.length > 0) results.push(imagesDir);
      }
      if (existsSync(nestedImagesDir)) {
        const pngs = readdirSync(nestedImagesDir).filter((f) => f.toLowerCase().endsWith('.png'));
        if (pngs.length > 0) results.push(nestedImagesDir);
      }
    }
  }

  return results;
}

function parseDateFromPath(imageDir: string): { date: string; month: string; datePath: string } {
  // .../KONTEN/MONTH/DATE/images or .../KONTEN/MONTH/DATE/Images/images
  const parts = imageDir.split('/');
  const monthIdx = parts.findIndex((p) => ['APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'].includes(p));
  const month = parts[monthIdx];
  const dateFolder = parts[monthIdx + 1];

  // Convert DD-MM-YYYY to YYYY-MM-DD
  const match = dateFolder.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  let date = dateFolder;
  if (match) {
    date = `${match[3]}-${match[2]}-${match[1]}`;
  }

  return { date, month, datePath: `${month}/${dateFolder}` };
}

function getCaption(imageDir: string): string {
  const dateDir = dirname(imageDir);
  const captionFile = join(dateDir, 'caption.txt');
  if (existsSync(captionFile)) {
    return readFileSync(captionFile, 'utf-8').trim();
  }
  return '';
}

async function main() {
  const client = getS3Client();
  const imageDirs = findImageDirs(slidesRoot);
  console.log(`Found ${imageDirs.length} slide sets\n`);

  // Create temp dir
  execSync(`rm -rf ${tempDir} && mkdir -p ${tempDir}`);

  const allSets: SlideSet[] = [];
  let uploaded = 0;

  // Sort by date
  imageDirs.sort();

  for (const imageDir of imageDirs) {
    const { date, month, datePath } = parseDateFromPath(imageDir);
    const caption = getCaption(imageDir);

    console.log(`Processing: ${datePath} (${date})`);

    // Get all PNG files sorted
    const pngs = readdirSync(imageDir)
      .filter((f) => f.toLowerCase().endsWith('.png'))
      .sort();

    const slideUrls: string[] = [];

    for (let i = 0; i < pngs.length; i++) {
      const pngFile = pngs[i];
      const pngPath = join(imageDir, pngFile);
      const slideNum = String(i + 1).padStart(2, '0');
      const webpName = `${date}-${slideNum}.webp`;
      const webpPath = join(tempDir, webpName);

      // Convert to WebP
      execSync(`cwebp -q 85 "${pngPath}" -o "${webpPath}" 2>/dev/null`);

      // Upload to R2 under slides/ folder
      const r2Key = `slides/${date}-${slideNum}.webp`;
      const url = await uploadFile(client, webpPath, r2Key);
      slideUrls.push(url);
      uploaded++;

      if (uploaded % 50 === 0) {
        console.log(`  Uploaded ${uploaded} images...`);
      }
    }

    allSets.push({ date, month, caption, slides: slideUrls });
    console.log(`  Done: ${pngs.length} slides -> ${slideUrls.length} URLs`);
  }

  // Clean up temp
  execSync(`rm -rf ${tempDir}`);

  // Write JSON output
  const outputPath = join(process.cwd(), 'files', 'slides-data.json');
  writeFileSync(outputPath, JSON.stringify(allSets, null, 2));
  console.log(`\nTotal uploaded: ${uploaded} images`);
  console.log(`Data written to: ${outputPath}`);
  console.log(`Slide sets: ${allSets.length}`);
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
