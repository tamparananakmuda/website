import { readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const articlesDir = join(process.cwd(), 'content', 'seri', 'kesehatan-mental-era-digital');

const slugs = [
  'kesehatan-mental-era-digital-part-1-tiktok-diagnosis',
  'kesehatan-mental-era-digital-part-2-healing-industri',
  'kesehatan-mental-era-digital-part-3-toxic-productivity',
  'kesehatan-mental-era-digital-part-4-emotional-exhaustion',
  'kesehatan-mental-era-digital-part-5-dopamin-loop',
  'kesehatan-mental-era-digital-part-6-fomo',
  'kesehatan-mental-era-digital-part-7-trauma-content',
  'kesehatan-mental-era-digital-part-8-attention-span',
  'kesehatan-mental-era-digital-part-9-self-improvement',
  'kesehatan-mental-era-digital-part-10-generasi-stroberi',
  'kesehatan-mental-era-digital-part-11-quarter-life-crisis',
  'kesehatan-mental-era-digital-part-12-industri-mental-health',
];

console.log('=== SERI-10-SCHEDULE: MENTAL HEALTH DI ERA DIGITAL ===\n');
console.log('Part | Status    | PublishedAt (UTC)         | WIB         | Slot');
console.log('-----|-----------|---------------------------|-------------|-----');

let allOk = true;
const now = new Date();

for (let i = 0; i < 12; i++) {
  const { data: f } = matter(readFileSync(join(articlesDir, slugs[i] + '.md'), 'utf8'));
  const pubDate = new Date(f.publishedAt);
  const wib = new Date(pubDate.getTime() + 7 * 60 * 60 * 1000);
  const wibStr = wib.toISOString().replace('T', ' ').substring(0, 16);
  const utcStr = pubDate.toISOString().replace('T', ' ').substring(0, 16);
  
  // Determine slot
  const hourUTC = pubDate.getUTCHours();
  let slot = '';
  if (hourUTC === 1) slot = '08:00 WIB (pagi)';
  else if (hourUTC === 5) slot = '12:00 WIB (siang)';
  else if (hourUTC === 10) slot = '17:00 WIB (sore)';
  else slot = `custom (${hourUTC}:00 UTC)`;
  
  // Check status
  let status = f.status;
  let warning = '';
  if (status === 'scheduled' && pubDate <= now) {
    warning = ' ⚠ PAST DATE!';
    allOk = false;
  }
  if (status !== 'scheduled' && status !== 'published') {
    warning = ` ⚠ UNKNOWN STATUS: ${status}`;
    allOk = false;
  }
  
  // Check sequence
  if (i > 0) {
    const prevDate = new Date(
      matter(readFileSync(join(articlesDir, slugs[i-1] + '.md'), 'utf8')).data.publishedAt
    );
    if (pubDate < prevDate) {
      warning += ' ⚠ OUT OF ORDER!';
      allOk = false;
    }
  }
  
  console.log(`  ${String(i+1).padStart(2)}  | ${status.padEnd(9)} | ${utcStr} | ${wibStr} | ${slot}${warning}`);
}

console.log(`\n=== ${allOk ? 'ALL SCHEDULES OK ===' : 'HAS ISSUES ==='}`);

// Summary
console.log('\n=== SCHEDULE SUMMARY ===');
console.log('Date         | Parts');
console.log('-------------|------');
const byDate: Record<string, number[]> = {};
for (let i = 0; i < 12; i++) {
  const { data: f } = matter(readFileSync(join(articlesDir, slugs[i] + '.md'), 'utf8'));
  const dateStr = f.publishedAt.substring(0, 10);
  if (!byDate[dateStr]) byDate[dateStr] = [];
  byDate[dateStr].push(i + 1);
}
for (const [date, parts] of Object.entries(byDate)) {
  console.log(`${date} | Part ${parts.join(', ')}`);
}

console.log('\n=== CRON INFO ===');
console.log('Cron job: .github/workflows/publish-scheduled.yml');
console.log('Runs every 5 minutes, auto-publishes when publishedAt <= now()');
console.log('Auto-generates OG images after publish');
console.log('Requires: CRON_SECRET in Vercel env + GitHub Secrets');
