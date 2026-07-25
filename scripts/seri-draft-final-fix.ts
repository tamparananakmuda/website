import { readFileSync, writeFileSync } from 'fs';

const dir = '/tmp/tam-seri-drafts/';

// Part 3: add ~40 words
let d3 = JSON.parse(readFileSync(dir + 'part-03.json', 'utf-8'));
d3.body = d3.body.replace(
  '## Dari Produktif ke Kosong',
  'Sistem yang mengaitkan worth dengan output tidak akan pernah mengajarkan kamu untuk berhenti. Karena berhenti berarti tidak menghasilkan, dan tidak menghasilkan berarti tidak bernilai. Conditioning ini begitu dalam sehingga kamu tidak menyadarinya. Kamu pikir rasa bersalah saat istirahat adalah sifat alamimu, padahal itu sifat yang diajarkan sistem kepadamu.\n\n## Dari Produktif ke Kosong'
);
writeFileSync(dir + 'part-03.json', JSON.stringify(d3, null, 2));

// Part 8: add ~30 words
let d8 = JSON.parse(readFileSync(dir + 'part-08.json', 'utf-8'));
d8.body = d8.body.replace(
  '## Siapa yang Merancang?',
  'Sistem yang sama yang di Part 5 membuatmu kecanduan, di Part 6 membuatmu merasa tidak cukup, di Part 7 memakan penderitaanmu untuk engagement. Sekarang sistem ini juga mengubah cara otakmu bekerja, tanpa kamu sadari, tanpa kamu pilih, tanpa kamu setuju.\n\n## Siapa yang Merancang?'
);
writeFileSync(dir + 'part-08.json', JSON.stringify(d8, null, 2));

// Verify all 12
let allOk = true;
for (let i = 1; i <= 12; i++) {
  const file = dir + 'part-' + String(i).padStart(2, '0') + '.json';
  const d = JSON.parse(readFileSync(file, 'utf-8'));
  const wc = d.body.split(/\s+/).filter((w: string) => w.length > 0).length;
  const og = (d.og_headline || '').length;
  const md = (d.seo_meta_description || '').length;
  const ex = (d.excerpt || '').length;
  const em = (d.body.match(/—/g) || []).length + (d.body.match(/–/g) || []).length;
  const links = (d.body.match(/\/artikel\//g) || []).length;
  const h2 = (d.body.match(/^## /gm) || []).length;
  const tags = (d.seo_keywords || []).length;
  const refs = (d.source_references || []).length;
  const hasRecap = d.series_order >= 2 ? d.body.includes('Sebelumnya di') : true;
  const hasTeaser = d.series_order <= 11 ? d.body.includes('Selanjutnya di') : true;
  const hasSeries = d.series === 'kesehatan-mental-era-digital';
  
  const issues: string[] = [];
  if (wc < 1000) issues.push('WC=' + wc);
  if (wc > 2500) issues.push('WC_HIGH=' + wc);
  if (og > 50) issues.push('OG=' + og);
  if (md > 160) issues.push('MD=' + md);
  if (ex > 160) issues.push('EX=' + ex);
  if (em > 0) issues.push('EM=' + em);
  if (links < 2) issues.push('LINKS=' + links);
  if (h2 < 3) issues.push('H2=' + h2);
  if (tags < 3) issues.push('TAGS=' + tags);
  if (refs < 2) issues.push('REFS=' + refs);
  if (!hasRecap) issues.push('NO_RECAP');
  if (!hasTeaser) issues.push('NO_TEASER');
  if (!hasSeries) issues.push('NO_SERIES');
  if (issues.length > 0) allOk = false;
  
  console.log(`Part ${i}: ${issues.length ? issues.join(' ') : 'PASS'} (wc=${wc} links=${links} h2=${h2})`);
}

console.log('\n=== FINAL: ' + (allOk ? 'ALL 12 PARTS PASS ===' : 'HAS ISSUES ==='));
