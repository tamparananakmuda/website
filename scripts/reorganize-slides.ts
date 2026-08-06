import { S3Client, CopyObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { config } from 'dotenv';

config({ path: '.env.local' });

const bucketName = process.env.R2_BUCKET_NAME || 'cdn-tam';
const cdnBaseUrl = process.env.CDN_BASE_URL || 'https://cdn.tamparananakmuda.com';
const slidesRoot = '/Users/yoviesetiawan/TAMPARAN ANAK MUDA/SOSIAL MEDIA/SLIDE/KONTEN';
const tempDir = '/tmp/tam-slides-webp';

interface SlideSet {
  id: string;
  date: string;
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

function findSlideDirs(root: string): { date: string; imageDir: string; caption: string }[] {
  const results: { date: string; imageDir: string; caption: string }[] = [];
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

    for (const dateFolder of dates) {
      const dateDir = join(monthDir, dateFolder);
      const match = dateFolder.match(/^(\d{2})-(\d{2})-(\d{4})$/);
      if (!match) continue;
      const date = `${match[3]}-${match[2]}-${match[1]}`;

      // Find images dir: images/, exports/, or Images/images/
      const possibleDirs = [
        join(dateDir, 'images'),
        join(dateDir, 'exports'),
        join(dateDir, 'Images', 'images'),
      ];

      let imageDir = '';
      for (const d of possibleDirs) {
        if (existsSync(d)) {
          const pngs = readdirSync(d).filter((f) => f.toLowerCase().endsWith('.png'));
          if (pngs.length > 0) {
            imageDir = d;
            break;
          }
        }
      }

      if (!imageDir) continue;

      const captionFile = join(dateDir, 'caption.txt');
      const caption = existsSync(captionFile) ? readFileSync(captionFile, 'utf-8').trim() : '';

      results.push({ date, imageDir, caption });
    }
  }

  // Sort chronologically
  results.sort((a, b) => a.date.localeCompare(b.date));
  return results;
}

async function main() {
  const client = getS3Client();
  const slideDirs = findSlideDirs(slidesRoot);
  console.log(`Found ${slideDirs.length} slide sets\n`);

  execSync(`rm -rf ${tempDir} && mkdir -p ${tempDir}`);

  const allSets: SlideSet[] = [];
  let copied = 0;
  let uploaded = 0;

  for (let idx = 0; idx < slideDirs.length; idx++) {
    const { date, imageDir, caption } = slideDirs[idx];
    const setNum = String(idx + 1).padStart(3, '0');
    const setId = `konten-tam-${setNum}`;

    console.log(`Processing: ${setId} (${date})`);

    const pngs = readdirSync(imageDir)
      .filter((f) => f.toLowerCase().endsWith('.png'))
      .sort();

    const slideUrls: string[] = [];

    for (let i = 0; i < pngs.length; i++) {
      const slideNum = i + 1;
      const newKey = `slides/${setId}/slide-${slideNum}.webp`;
      const oldKey = `slides/${date}-${String(slideNum).padStart(2, '0')}.webp`;

      // Try CopyObject first (if old key exists)
      try {
        await client.send(
          new CopyObjectCommand({
            Bucket: bucketName,
            Key: newKey,
            CopySource: `${bucketName}/${oldKey}`,
            ContentType: 'image/webp',
            CacheControl: 'public, max-age=31536000, immutable',
            MetadataDirective: 'REPLACE',
          })
        );
        copied++;
      } catch {
        // Old key doesn't exist, convert from PNG and upload
        const pngPath = join(imageDir, pngs[i]);
        const tempWebp = join(tempDir, `temp-${slideNum}.webp`);
        execSync(`cwebp -q 85 "${pngPath}" -o "${tempWebp}" 2>/dev/null`);
        const buf = readFileSync(tempWebp);
        await client.send(
          new PutObjectCommand({
            Bucket: bucketName,
            Key: newKey,
            Body: buf,
            ContentType: 'image/webp',
            CacheControl: 'public, max-age=31536000, immutable',
          })
        );
        uploaded++;
      }

      slideUrls.push(`${cdnBaseUrl}/${newKey}`);

      if ((copied + uploaded) % 50 === 0) {
        console.log(`  Progress: ${copied + uploaded} images...`);
      }
    }

    allSets.push({ id: setId, date, caption, slides: slideUrls });
    console.log(`  Done: ${pngs.length} slides (copied or uploaded)`);
  }

  execSync(`rm -rf ${tempDir}`);

  const outputPath = join(process.cwd(), 'files', 'slides-data.json');
  writeFileSync(outputPath, JSON.stringify(allSets, null, 2));
  console.log(`\nTotal: ${copied} copied, ${uploaded} uploaded fresh`);
  console.log(`Slide sets: ${allSets.length}`);
  console.log(`Data written to: ${outputPath}`);
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
