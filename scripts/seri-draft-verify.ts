import { readFileSync, readdirSync } from 'fs';

const dir = '/tmp/tam-seri-drafts/';
const files = readdirSync(dir).filter(f => f.endsWith('.json')).sort();

console.log('=== VERIFICATION: 12 PART DRAFT ===\n');

let allPass = true;

for (const file of files) {
  const data = JSON.parse(readFileSync(dir + file, 'utf-8'));
  const body = data.body || '';
  
  // Word count (Indonesian: split by spaces)
  const words = body.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  
  // Em dash check
  const emDashCount = (body.match(/—/g) || []).length;
  const enDashCount = (body.match(/–/g) || []).length;
  
  // Internal links
  const internalLinks = (body.match(/\/artikel\//g) || []).length;
  
  // H2 count
  const h2Count = (body.match(/^## /gm) || []).length;
  
  // Metadata checks
  const metaTitleLen = (data.seo_meta_title || '').length;
  const metaDescLen = (data.seo_meta_description || '').length;
  const ogLen = (data.og_headline || '').length;
  const slugLen = (data.slug || '').length;
  const excerptLen = (data.excerpt || '').length;
  
  // Series check
  const hasSeries = data.series === 'kesehatan-mental-era-digital';
  const hasOrder = typeof data.series_order === 'number';
  
  // Tags
  const tagCount = (data.seo_keywords || []).length;
  
  // Source refs
  const refCount = (data.source_references || []).length;
  
  // Human signature
  const hasHumanSig = data.human_signature === true;
  
  // Recap (part 2+)
  const partNum = data.series_order;
  const hasRecap = partNum >= 2 ? body.includes('Sebelumnya di') : true;
  
  // Teaser (part 1-11)
  const hasTeaser = partNum <= 11 ? body.includes('Selanjutnya di') : true;
  
  // Status
  const issues: string[] = [];
  if (wordCount < 1000) issues.push(`WORD COUNT LOW: ${wordCount}`);
  if (wordCount > 2500) issues.push(`WORD COUNT HIGH: ${wordCount}`);
  if (emDashCount > 0) issues.push(`EM DASH FOUND: ${emDashCount}`);
  if (enDashCount > 0) issues.push(`EN DASH FOUND: ${enDashCount}`);
  if (internalLinks < 2) issues.push(`INTERNAL LINKS LOW: ${internalLinks}`);
  if (h2Count < 3) issues.push(`H2 LOW: ${h2Count}`);
  if (metaTitleLen > 70) issues.push(`META TITLE TOO LONG: ${metaTitleLen}`);
  if (metaDescLen > 160) issues.push(`META DESC TOO LONG: ${metaDescLen}`);
  if (ogLen > 50) issues.push(`OG HEADLINE TOO LONG: ${ogLen}`);
  if (slugLen > 60) issues.push(`SLUG TOO LONG: ${slugLen}`);
  if (excerptLen > 160) issues.push(`EXCERPT TOO LONG: ${excerptLen}`);
  if (!hasSeries) issues.push('MISSING SERIES');
  if (!hasOrder) issues.push('MISSING SERIES_ORDER');
  if (tagCount < 3) issues.push(`TAGS LOW: ${tagCount}`);
  if (refCount < 2) issues.push(`SOURCE REFS LOW: ${refCount}`);
  if (!hasHumanSig) issues.push('MISSING HUMAN_SIGNATURE');
  if (!hasRecap) issues.push('MISSING RECAP');
  if (!hasTeaser) issues.push('MISSING TEASER');
  
  const status = issues.length === 0 ? 'PASS' : 'FAIL';
  if (issues.length > 0) allPass = false;
  
  console.log(`Part ${partNum}: ${status} | words: ${wordCount} | h2: ${h2Count} | links: ${internalLinks} | refs: ${refCount} | tags: ${tagCount}`);
  if (issues.length > 0) {
    issues.forEach(i => console.log(`  ⚠ ${i}`));
  }
}

console.log('\n=== SUMMARY ===');
console.log(`Total parts: ${files.length}`);
console.log(`Overall: ${allPass ? 'ALL PASS' : 'HAS ISSUES'}`);

// Em dash check across all bodies
let totalEmDash = 0;
for (const file of files) {
  const data = JSON.parse(readFileSync(dir + file, 'utf-8'));
  totalEmDash += (data.body.match(/—/g) || []).length;
  totalEmDash += (data.body.match(/–/g) || []).length;
}
console.log(`Total em/en dashes: ${totalEmDash}`);
