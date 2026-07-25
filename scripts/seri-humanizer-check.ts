import { readFileSync, writeFileSync } from 'fs';
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

console.log('=== HUMANIZER AUTO-CHECK (12 PARTS) ===\n');

const aiId = ['signifikan','krusial','esensial','vital','mendalam','pada dasarnya','secara fundamental','pada intinya','pada akhirnya','menariknya','perlu dicatat','perlu diingat','tidak dapat dipungkiri','memperhatikan'];
const aiEn = ['crucial','pivotal','vibrant','tapestry','delve','showcase','underscore','testament','foster','garner','intricate','landscape','additionally','enduring','enhance','highlight','interplay','multifaceted','nuanced','robust','holistic','paradigm','leverage','realm','seamless','empower','transform','unlock','unleash'];

let allClean = true;
const toneData: any[] = [];

for (let i = 0; i < 12; i++) {
  const { data: f, content } = matter(readFileSync(join(articlesDir, slugs[i] + '.md'), 'utf8'));
  const issues: string[] = [];

  // Em/en dash
  if (content.includes('\u2014') || content.includes('\u2013')) issues.push('Em/en dash');

  // Curly quotes
  if (content.includes('\u201c') || content.includes('\u201d')) issues.push('Curly quotes');

  // AI vocab ID
  const foundId = aiId.filter(w => content.toLowerCase().includes(w));
  if (foundId.length) issues.push('AI vocab ID: ' + foundId.join(', '));

  // AI vocab EN
  const foundEn = aiEn.filter(w => content.toLowerCase().includes(w));
  if (foundEn.length) issues.push('AI vocab EN: ' + foundEn.join(', '));

  // Rule of three
  const triples = content.match(/(\w+,\s+\w+,\s+(?:dan)\s+\w+)/g) || [];
  if (triples.length > 2) issues.push('Rule of three: ' + triples.length);

  // Negative parallelisms
  const neg = content.match(/(tidak hanya.*tapi juga|bukan hanya.*melainkan|not only.*but also)/gi) || [];
  if (neg.length) issues.push('Negative parallelisms: ' + neg.length);

  // Staccato drama
  const sentences = content.split(/[.!?]\s+/);
  let currentRun = 0, maxRun = 0;
  for (const s of sentences) {
    if (s.split(/\s+/).length <= 6) { currentRun++; maxRun = Math.max(maxRun, currentRun); }
    else currentRun = 0;
  }
  if (maxRun >= 3) issues.push('Staccato drama');

  // Human signature
  const personal = (content.match(/\bkita\b|\bkamu\b|\bsaya\b|\bgue\b|\bguwe\b/gi) || []).length;
  if (personal < 3) issues.push('Human signature weak (need 3+, found ' + personal + ')');

  // Exclamation marks
  const excl = (content.match(/!/g) || []).length;
  if (excl > 1) issues.push('Exclamation marks: ' + excl);

  // Tone data collection
  const gueCount = (content.match(/\bgue\b/gi) || []).length;
  const kitaCount = (content.match(/\bkita\b/gi) || []).length;
  const kamuCount = (content.match(/\bkamu\b/gi) || []).length;
  const sayaCount = (content.match(/\bsaya\b/gi) || []).length;
  const hasRecap = content.includes('Sebelumnya di');
  const hasTeaser = content.includes('Selanjutnya di');
  
  toneData.push({
    part: i + 1,
    gue: gueCount,
    kita: kitaCount,
    kamu: kamuCount,
    saya: sayaCount,
    personal: personal,
    hasRecap: i >= 1 ? hasRecap : true,
    hasTeaser: i <= 10 ? hasTeaser : true,
  });

  if (issues.length > 0) {
    allClean = false;
    console.log(`Part ${i + 1}: FAIL`);
    issues.forEach(iss => console.log(`  - ${iss}`));
  } else {
    console.log(`Part ${i + 1}: CLEAN`);
  }
}

// Tone consistency check
console.log('\n=== TONE CONSISTENCY ===\n');
console.log('Part | gue | kita | kamu | saya | recap | teaser | personal');
console.log('-----|-----|------|------|------|-------|--------|----------');
for (const t of toneData) {
  console.log(`  ${String(t.part).padStart(2)}  | ${String(t.gue).padStart(3)} | ${String(t.kita).padStart(4)} | ${String(t.kamu).padStart(4)} | ${String(t.saya).padStart(4)} | ${t.hasRecap ? '  Y' : '  N'}   |  ${t.hasTeaser ? 'Y' : 'N'}    | ${String(t.personal).padStart(8)}`);
}

// Check consistency
const gueParts = toneData.filter(t => t.gue > 0).map(t => t.part);
const noGueParts = toneData.filter(t => t.gue === 0).map(t => t.part);
console.log(`\nGue usage: Parts ${gueParts.join(', ')} use "gue", Parts ${noGueParts.join(', ')} don't`);

const recapIssues = toneData.filter(t => !t.hasRecap).map(t => t.part);
const teaserIssues = toneData.filter(t => !t.hasTeaser).map(t => t.part);
if (recapIssues.length) console.log(`Recap missing: Parts ${recapIssues.join(', ')}`);
if (teaserIssues.length) console.log(`Teaser missing: Parts ${teaserIssues.join(', ')}`);

const weakSignature = toneData.filter(t => t.personal < 3).map(t => t.part);
if (weakSignature.length) console.log(`Weak human signature: Parts ${weakSignature.join(', ')}`);

console.log(`\n=== ${allClean ? 'ALL 12 PARTS CLEAN ===' : 'HAS ISSUES ==='}`);
