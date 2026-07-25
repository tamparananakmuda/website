import { readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

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

let allPass = true;
for (const slug of slugs) {
  const filePath = join(process.cwd(), 'content', 'seri', 'kesehatan-mental-era-digital', slug + '.md');
  const { data: f } = matter(readFileSync(filePath, 'utf-8'));
  const issues: string[] = [];
  if (!f.series) issues.push('series is null');
  if (!f.seriesOrder) issues.push('seriesOrder is null');
  if (!f.publishedAt) issues.push('publishedAt is null');
  if (!f.seoMetaTitle) issues.push('seoMetaTitle empty');
  if (!f.ogHeadline) issues.push('ogHeadline empty');
  if (f.excerpt && f.excerpt.length > 160) issues.push('excerpt > 160');
  if (f.seoMetaDescription && f.seoMetaDescription.length > 160) issues.push('metaDesc > 160');
  if (f.ogHeadline && f.ogHeadline.length > 50) issues.push('ogHeadline > 50');
  
  if (issues.length) {
    console.log(`${slug}: ISSUES: ${issues.join(', ')}`);
    allPass = false;
  } else {
    console.log(`Part ${f.seriesOrder}: PASS | series=${f.series} | order=${f.seriesOrder} | status=${f.status} | publishedAt=${f.publishedAt}`);
  }
}
console.log(`\n=== ${allPass ? 'ALL 12 PARTS VERIFIED ===' : 'HAS ISSUES ==='}`);
