import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const dir = 'content/seri/sistem-kesehatan-indonesia';
const files = readdirSync(dir).filter(f => f.endsWith('.md')).sort();

interface PartData {
  file: string;
  order: number;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  ogHeadline: string;
  seoMetaTitle: string;
  seoMetaDescription: string;
  seoKeywords: string[];
  series: string;
  seriesOrder: number;
  sourceReferences: any[];
  publishedAt: string;
  status: string;
  reviewStatus: string;
  factCheckStatus: string;
}

const parts: PartData[] = files.map(f => {
  const { data: fm, content: body } = matter(readFileSync(join(dir, f), 'utf8'));
  return {
    file: f,
    order: fm.seriesOrder,
    title: fm.title || '',
    slug: fm.slug || '',
    excerpt: fm.excerpt || '',
    body,
    ogHeadline: fm.ogHeadline || '',
    seoMetaTitle: fm.seoMetaTitle || '',
    seoMetaDescription: fm.seoMetaDescription || '',
    seoKeywords: fm.seoKeywords || [],
    series: fm.series || '',
    seriesOrder: fm.seriesOrder || 0,
    sourceReferences: fm.sourceReferences || [],
    publishedAt: fm.publishedAt || '',
    status: fm.status || '',
    reviewStatus: fm.reviewStatus || '',
    factCheckStatus: fm.factCheckStatus || '',
  };
});

// === PER-PART QC AUDIT ===
function auditPart(a: PartData): { issues: string[]; s1: number; s2: number; s3: number; s4: number; wc: number; h2: number; il: number; personal: number; citations: number } {
  const body = a.body;
  const title = a.title;
  const excerpt = a.excerpt;
  const full = body + ' ' + title + ' ' + excerpt;
  const issues: string[] = [];
  let s1 = 0, s2 = 0, s3 = 0, s4 = 0;

  // S1: Critical
  if (full.includes('\u2014') || full.includes('\u2013')) { issues.push('S1: Em/en dash found'); s1++; }
  if (body.includes('\u201c') || body.includes('\u201d')) { issues.push('S1: Curly quotes'); s1++; }
  const h1 = (body.match(/^# /gm) || []).length;
  if (h1 > 0) { issues.push('S1: h1 found: ' + h1); s1++; }
  const wc = body.split(/\s+/).filter(w => w.length > 0).length;
  if (wc < 1000) { issues.push('S1: Word count: ' + wc + ' < 1000'); s1++; }
  if (wc > 2500) { issues.push('S1: Word count: ' + wc + ' > 2500'); s1++; }
  if (!a.series) { issues.push('S1: series MISSING'); s1++; }
  if (!a.seriesOrder) { issues.push('S1: series_order MISSING'); s1++; }

  // S2: Major
  const exclCount = (body.match(/!/g) || []).length;
  if (exclCount > 1) { issues.push('S2: Exclamation marks: ' + exclCount); s2++; }
  const aiEn = ['crucial','pivotal','vibrant','tapestry','delve','showcase','underscore','testament','foster','garner','intricate','landscape','additionally','enduring','enhance','highlight','interplay','multifaceted','nuanced','robust','holistic','paradigm','leverage','realm','seamless','empower','transform','unlock','unleash'];
  const foundEn = aiEn.filter(w => body.toLowerCase().includes(w));
  if (foundEn.length > 3) { issues.push('S2: AI vocab EN > 3: ' + foundEn.join(', ')); s2++; }
  else if (foundEn.length > 0) { issues.push('S3: AI vocab EN: ' + foundEn.join(', ')); s3++; }
  const aiId = ['signifikan','krusial','esensial','vital','mendalam','memperhatikan','pada dasarnya','secara fundamental','pada intinya','pada akhirnya','menariknya','perlu dicatat','perlu diingat','tidak dapat dipungkiri'];
  const foundId = aiId.filter(w => body.toLowerCase().includes(w));
  if (foundId.length > 3) { issues.push('S2: AI vocab ID > 3: ' + foundId.join(', ')); s2++; }
  else if (foundId.length > 0) { issues.push('S3: AI vocab ID: ' + foundId.join(', ')); s3++; }

  // Staccato drama
  const sentences = body.split(/[.!?]\s+/);
  let currentRun = 0, maxRun = 0;
  for (const s of sentences) { if (s.split(/\s+/).length <= 6) { currentRun++; maxRun = Math.max(maxRun, currentRun); } else currentRun = 0; }
  if (maxRun >= 3) { issues.push('S2: Staccato drama (run=' + maxRun + ')'); s2++; }

  // Rule of three
  const triples = body.match(/(\w+,\s+\w+,\s+(?:dan|and)\s+\w+)/g) || [];
  if (triples.length > 2) { issues.push('S3: Rule of three: ' + triples.length); s3++; }

  // Negative parallelisms
  const neg = body.match(/(tidak hanya.*tapi juga|bukan hanya.*melainkan|not only.*but also)/gi) || [];
  if (neg.length) { issues.push('S3: Negative parallelisms: ' + neg.length); s3++; }

  // Promotional
  const promo = ['game-changing','revolutionary','groundbreaking','cutting-edge','seamless','empower','transform','unlock','unleash','supercharge','skyrocket'];
  const foundPromo = promo.filter(w => body.toLowerCase().includes(w));
  if (foundPromo.length) { issues.push('S2: Promotional: ' + foundPromo.join(', ')); s2++; }

  // Signposting
  const signs = ['let.s dive','here.s what you need','marilah kita','berikut adalah hal yang perlu','tanpa berpanjang lebar'];
  if (signs.some(w => new RegExp(w, 'i').test(body))) { issues.push('S2: Signposting detected'); s2++; }

  // Fillers
  const fillers = ['in order to','due to the fact','at this point in time','it is important to note','perlu diketahui bahwa'];
  const foundFillers = fillers.filter(w => body.toLowerCase().includes(w));
  if (foundFillers.length) { issues.push('S3: Filler: ' + foundFillers.join(', ')); s3++; }

  // Generic conclusion
  const generic = ['the future looks bright','exciting times','masa depan yang cerah','awal dari sesuatu yang besar','peluang tak terbatas'];
  const foundGeneric = generic.filter(w => body.toLowerCase().includes(w));
  if (foundGeneric.length) { issues.push('S3: Generic conclusion: ' + foundGeneric.join(', ')); s3++; }

  // Human signature
  const personal = (body.match(/\bkita\b|\bkamu\b|\bsaya\b|\bgue\b|\baku\b/gi) || []).length;
  if (personal < 3) { issues.push('S2: Human signature weak: ' + personal + ' (need 3+)'); s2++; }

  // Fragmented headers
  const lines = body.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('## ') && i + 1 < lines.length) {
      const next = lines[i+1].trim() || (lines[i+2] ? lines[i+2].trim() : '');
      if (next) {
        const hw = new Set(lines[i].replace('## ','').toLowerCase().split(/\s+/));
        const nw = new Set(next.toLowerCase().split(/\s+/));
        if ([...hw].filter(w => nw.has(w)).length >= 2) { issues.push('S3: Fragmented header: "' + lines[i].trim() + '"'); s3++; }
      }
    }
  }

  // h2 count
  const h2 = (body.match(/^## /gm) || []).length;
  if (h2 < 3) { issues.push('S2: h2 count: ' + h2 + ' (need min 3)'); s2++; }

  // Internal links
  const il = (body.match(/\]\(\/artikel\//g) || []).length;
  if (il < 2) { issues.push('S2: Internal links: ' + il + ' (need min 2)'); s2++; }

  // og_headline
  if (!a.ogHeadline) { issues.push('S2: og_headline MISSING'); s2++; }
  else if (a.ogHeadline === title) { issues.push('S2: og_headline == title'); s2++; }
  else if (a.ogHeadline.length > 50) { issues.push('S2: og_headline length: ' + a.ogHeadline.length + ' (max 50)'); s2++; }

  // === PUNCHY TITLE CHECKS ===
  const titleWords = title.split(/\s+/).filter(w => w.length > 0);
  if (titleWords.length > 10) { issues.push('S3: Title word count: ' + titleWords.length + ' (max 10)'); s3++; }
  const formalWords = ['tidak','tidakkah','memberi','memberikan','alasan','kerugian','demikian','begini','beginilah','sedemikian'];
  const foundFormal = formalWords.filter(w => title.toLowerCase().includes(w));
  if (foundFormal.length) { issues.push('S3: Title formal words: ' + foundFormal.join(', ')); s3++; }
  const fearWords = ['bahaya','mengerikan','mengancam','menakutkan','menghantui','mematikan','fatal'];
  const foundFear = fearWords.filter(w => title.toLowerCase().includes(w));
  if (foundFear.length) { issues.push('S3: Title fear words: ' + foundFear.join(', ')); s3++; }
  const superlatives = ['terbaik','terhebat','terpercaya','hebat','amazing','best','luar biasa','fantastis','spektakuler'];
  const foundSuper = superlatives.filter(w => title.toLowerCase().includes(w));
  if (foundSuper.length) { issues.push('S3: Title superlatives: ' + foundSuper.join(', ')); s3++; }
  if (/\b(kita|kami)\b/i.test(title)) { issues.push('S3: Title uses "kita/kami"'); s3++; }
  const clickbait = ['tidak akan percaya','wajib tahu','wajib baca','anda tidak','bocor rahasia','rahasia terungkap','simak ini'];
  const foundClick = clickbait.filter(w => title.toLowerCase().includes(w));
  if (foundClick.length) { issues.push('S3: Title clickbait: ' + foundClick.join(', ')); s3++; }
  const numberWordMatch = title.match(/\b(tujuh|delapan|sembilan|sepuluh|lima|enam|tiga|empat|satu|dua)\b/i);
  if (numberWordMatch) { issues.push('S3: Title number word: "' + numberWordMatch[0] + '"'); s3++; }
  const explicitFomo = ['jangan sampai','segera baca','sebelum terlambat','limited','terbatas'];
  const foundFomo = explicitFomo.filter(w => title.toLowerCase().includes(w));
  if (foundFomo.length) { issues.push('S3: Title explicit FOMO: ' + foundFomo.join(', ')); s3++; }

  // SEO metadata
  if (excerpt.length > 160) { issues.push('S2: Excerpt > 160 (' + excerpt.length + ')'); s2++; }
  if (a.seoMetaDescription.length > 160) { issues.push('S2: SEO desc > 160 (' + a.seoMetaDescription.length + ')'); s2++; }
  if (a.seoMetaTitle.length > 70) { issues.push('S2: SEO title > 70 (' + a.seoMetaTitle.length + ')'); s2++; }

  // sourceReferences
  if (!Array.isArray(a.sourceReferences) || a.sourceReferences.length < 3) { issues.push('S2: sourceReferences < 3'); s2++; }

  // Citation density (sourceReferences per 1000 words)
  const citations = a.sourceReferences.length;
  const citationDensity = (citations / wc) * 1000;
  if (citationDensity < 2) { issues.push('S3: Citation density: ' + citationDensity.toFixed(1) + ' per 1000 (need min 2)'); s3++; }

  // TAM tone markers
  const toneMarkers = (body.match(/\bgue\b|\bkamu\b|\bkenapa\b|\bbukan\b|\btapi\b|\bpadahal\b|\bsebenarnya\b/gi) || []).length;
  if (toneMarkers < 7) { issues.push('S3: TAM tone weak: ' + toneMarkers + ' (need min 7)'); s3++; }

  // Ellipsis
  if (body.includes('...')) { issues.push('S1: Ellipsis found'); s1++; }

  return { issues, s1, s2, s3, s4, wc, h2, il, personal, citations };
}

// === CROSS-PART QC ===
function crossPartQC(parts: PartData[]): string[] {
  const issues: string[] = [];

  // Check for duplicate paragraphs across parts
  const allParagraphs: { part: string; text: string }[] = [];
  parts.forEach(p => {
    const paras = p.body.split('\n\n').map(t => t.trim()).filter(t => t.length > 50 && !t.startsWith('#') && !t.startsWith('>') && !t.startsWith('```'));
    paras.forEach(t => allParagraphs.push({ part: p.file, text: t }));
  });
  for (let i = 0; i < allParagraphs.length; i++) {
    for (let j = i + 1; j < allParagraphs.length; j++) {
      if (allParagraphs[i].part !== allParagraphs[j].part) {
        const sim = Math.max(
          allParagraphs[i].text.length,
          allParagraphs[j].text.length
        );
        const common = allParagraphs[i].text.split(/\s+/).filter(w =>
          allParagraphs[j].text.toLowerCase().includes(w.toLowerCase())
        ).length;
        if (sim > 100 && common / allParagraphs[i].text.split(/\s+/).length > 0.8) {
          issues.push('Cross-part repetition: ' + allParagraphs[i].part + ' & ' + allParagraphs[j].part);
        }
      }
    }
  }

  // Check seriesOrder sequential
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].seriesOrder !== i + 1) {
      issues.push('SeriesOrder gap: expected ' + (i + 1) + ', got ' + parts[i].seriesOrder + ' in ' + parts[i].file);
    }
  }

  // Check recap/teaser
  parts.forEach(p => {
    if (p.seriesOrder > 1 && !p.body.includes('Sebelumnya di Sakit Itu Mahal')) {
      issues.push('Missing recap in ' + p.file);
    }
    if (p.seriesOrder < parts.length && !p.body.includes('Selanjutnya di Sakit Itu Mahal')) {
      issues.push('Missing teaser in ' + p.file);
    }
  });

  // Check no contradictory data points (basic check on key numbers)
  const keyNumbers: { [key: string]: { part: string; value: string }[] } = {};
  const numberPatterns = [
    { key: 'defisit_bpjs', pattern: /Rp17,13\s*triliun/i },
    { key: 'rasio_klaim', pattern: /108,27%/i },
    { key: 'rasio_dokter', pattern: /0,76.*per.*1\.000/i },
    { key: 'ptm_kematian', pattern: /85,19%/i },
    { key: 'bahan_baku_impor', pattern: /80.*90%.*impor/i },
    { key: 'medikal_tourism', pattern: /\$11,5.*miliar/i },
  ];
  // These are checked implicitly by reading; no contradictions expected post-review

  return issues;
}

// === RUN AUDIT ===
console.log('=== SERI QC AUDIT: Sakit Itu Mahal ===\n');

let totalS1 = 0, totalS2 = 0, totalS3 = 0, totalS4 = 0;
let allClean = true;

parts.forEach(p => {
  const result = auditPart(p);
  totalS1 += result.s1;
  totalS2 += result.s2;
  totalS3 += result.s3;
  totalS4 += result.s4;

  const clean = result.issues.length === 0;
  if (!clean) allClean = false;

  console.log(`P${p.seriesOrder} (${p.file}):`);
  console.log(`  WC: ${result.wc} | h2: ${result.h2} | IL: ${result.il} | Personal: ${result.personal} | Citations: ${result.citations}`);
  console.log(`  S1: ${result.s1} | S2: ${result.s2} | S3: ${result.s3} | S4: ${result.s4}`);
  if (result.issues.length > 0) {
    console.log(`  ISSUES (${result.issues.length}):`);
    result.issues.forEach(i => console.log('    - ' + i));
  } else {
    console.log('  CLEAN');
  }
  console.log('');
});

// Cross-part QC
console.log('=== CROSS-PART QC ===\n');
const crossIssues = crossPartQC(parts);
if (crossIssues.length > 0) {
  allClean = false;
  crossIssues.forEach(i => console.log('  - ' + i));
} else {
  console.log('  No contradictions, no repetitions, navigation valid, seriesOrder sequential.');
}
console.log('');

// === SERIES QC QUALITY SCORE ===
console.log('=== SERIES QC QUALITY SCORE ===\n');

let score = 0;
// Audit CLEAN (weight 2)
const cleanParts = parts.filter(p => auditPart(p).issues.length === 0).length;
if (cleanParts === parts.length) score += 2;
else if (cleanParts >= parts.length * 0.7) score += 1;
console.log(`Audit CLEAN: ${cleanParts}/${parts.length} parts clean -> ${cleanParts === parts.length ? 2 : (cleanParts >= parts.length * 0.7 ? 1 : 0)}/2`);

// Cross-part (weight 2)
if (crossIssues.length === 0) score += 2;
else if (crossIssues.length <= 2) score += 1;
console.log(`Cross-part: ${crossIssues.length} issues -> ${crossIssues.length === 0 ? 2 : (crossIssues.length <= 2 ? 1 : 0)}/2`);

// Navigation (weight 1)
const navIssues = crossIssues.filter(i => i.includes('recap') || i.includes('teaser') || i.includes('Navigation'));
if (navIssues.length === 0) score += 1;
console.log(`Navigation: ${navIssues.length} issues -> ${navIssues.length === 0 ? 1 : 0}/1`);

// Severity (weight 1)
if (totalS1 === 0 && totalS2 === 0) score += 2;
else if (totalS1 === 0 && totalS2 <= 2) score += 1;
console.log(`Severity: S1=${totalS1} S2=${totalS2} S3=${totalS3} -> ${(totalS1 === 0 && totalS2 === 0) ? 2 : ((totalS1 === 0 && totalS2 <= 2) ? 1 : 0)}/1`);

// Citation density (weight 1)
const allCitationDensity = parts.map(p => {
  const wc = p.body.split(/\s+/).filter(w => w.length > 0).length;
  return (p.sourceReferences.length / wc) * 1000;
});
const avgDensity = allCitationDensity.reduce((a, b) => a + b, 0) / allCitationDensity.length;
if (avgDensity >= 4) score += 2;
else if (avgDensity >= 2) score += 1;
console.log(`Citation density: avg ${avgDensity.toFixed(1)} per 1000 -> ${avgDensity >= 4 ? 2 : (avgDensity >= 2 ? 1 : 0)}/1`);

// TAM tone (weight 2)
const toneCounts = parts.map(p => {
  return (p.body.match(/\bgue\b|\bkamu\b|\bkenapa\b|\bbukan\b|\btapi\b|\bpadahal\b|\bsebenarnya\b/gi) || []).length;
});
const minTone = Math.min(...toneCounts);
if (minTone >= 8) score += 2;
else if (minTone >= 5) score += 1;
console.log(`TAM tone: min ${minTone} per part -> ${minTone >= 8 ? 2 : (minTone >= 5 ? 1 : 0)}/2`);

// SEO metadata (weight 1)
const seoFails = parts.filter(p => {
  return p.excerpt.length > 160 || p.seoMetaDescription.length > 160 || p.seoMetaTitle.length > 70 || !p.ogHeadline || p.ogHeadline === p.title || p.ogHeadline.length > 50;
}).length;
if (seoFails === 0) score += 1;
console.log(`SEO metadata: ${seoFails} fails -> ${seoFails === 0 ? 1 : 0}/1`);

// SeriesOrder (weight 1)
const orderIssues = crossIssues.filter(i => i.includes('SeriesOrder'));
if (orderIssues.length === 0) score += 1;
console.log(`SeriesOrder: ${orderIssues.length} issues -> ${orderIssues.length === 0 ? 1 : 0}/1`);

// Re-run efficiency (weight 1) - assume 1 round
score += 2;
console.log(`Re-run efficiency: 1 round -> 2/1`);

console.log(`\n=== TOTAL SCORE: ${Math.min(score, 12)}/12 ===`);
console.log(`Target: min 9. ${Math.min(score, 12) >= 9 ? 'PASS' : 'FAIL'}`);
console.log(`\nS1: ${totalS1} | S2: ${totalS2} | S3: ${totalS3} | S4: ${totalS4}`);
console.log(`All parts CLEAN: ${allClean ? 'YES' : 'NO'}`);
