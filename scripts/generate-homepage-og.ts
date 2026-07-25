import { generateAndUploadOGImages } from '../lib/cdn/generate';
import { getCDNUrl } from '../lib/cdn/r2';

require('dotenv').config({ path: '.env.local' });

async function main() {
  console.log('Generating homepage OG image...\n');

  const urls = await generateAndUploadOGImages('homepage', {
    title: 'Melawan Ilusi. Membangun Realita.',
    excerpt: 'Editorial media untuk anak muda Indonesia. Tulisan mendalam tentang uang, karier, bisnis, teknologi, dan kehidupan.',
  });

  console.log('Card:', urls.card);
  console.log('Feature:', urls.feature);
  process.exit(0);
}

main().catch(console.error);

export {};
