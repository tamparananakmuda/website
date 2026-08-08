import { readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const filePath = join(process.cwd(), 'content/articles/karier/shift-shock-gen-z-ekspektasi-vs-realitas-kerja.md');
const { data: a, content: body } = matter(readFileSync(filePath, 'utf8'));

const title = a.title || '';
const excerpt = a.excerpt || '';
const full = body + ' ' + title + ' ' + excerpt;
const issues = [];

// Em/en dash
if (full.includes('\u2014') || full.includes('\u2013')) issues.push('Em/en dash found');

// Curly quotes
if (body.includes('\u201c') || body.includes('\u201d')) issues.push('Curly quotes');

// Exclamation marks
const exclCount = (body.match(/!/g) || []).length;
if (exclCount > 1) issues.push('Exclamation marks: ' + exclCount + ' (max 1)');

// AI vocab EN
const aiEn = ['actually','additionally','align with','crucial','delve','emphasizing','enduring','enhance','fostering','garner','highlight','interplay','intricate','intricacies','key','landscape','pivotal','showcase','tapestry','testament','underscore','valuable','vibrant','multifaceted','nuanced','robust','holistic','paradigm','leverage','realm','beacon','bastion','quintessential','epitome','harbinger','catalyst','conduit','formidable','profound','resolute','steadfast','unwavering','seamless','empower','transform','unlock','unleash'];
const foundEn = aiEn.filter(w => body.toLowerCase().includes(w));
if (foundEn.length) issues.push('AI vocab EN: ' + foundEn.join(', '));

// AI vocab ID
const aiId = ['signifikan','krusial','esensial','vital','mendalam','memperhatikan','pada dasarnya','secara fundamental','pada intinya','pada akhirnya','menariknya','yang menarik','hal yang menarik','perlu dicatat','perlu diingat','penting untuk','penting untuk dicatat','tidak dapat dipungkiri','tidak diragukan lagi','sungguh-sungguh','sepenuhnya'];
const foundId = aiId.filter(w => body.toLowerCase().includes(w));
if (foundId.length) issues.push('AI vocab ID: ' + foundId.join(', '));

// Staccato drama (skip headings)
const bodyNoHeadings = body.replace(/^#{1,6}\s+.*$/gm, '');
const sentences = bodyNoHeadings.split(/[.!?]\s+/);
let currentRun = 0, maxRun = 0;
for (const s of sentences) {
  if (s.split(/\s+/).length <= 6) { currentRun++; maxRun = Math.max(maxRun, currentRun); }
  else currentRun = 0;
}
if (maxRun >= 3) issues.push('Staccato drama (max run: ' + maxRun + ')');

// Rule of three
const triples = body.match(/(\w+,\s+\w+,\s+(?:dan|and)\s+\w+)/g) || [];
if (triples.length > 2) issues.push('Rule of three: ' + triples.length + ' (max 2)');

// Negative parallelisms
const neg = body.match(/(tidak hanya.*tapi juga|bukan hanya.*melainkan|not only.*but also|it.s not just.*it.s)/gi) || [];
if (neg.length) issues.push('Negative parallelisms: ' + neg.length);

// Promotional
const promo = ['game-changing','game-changer','revolutionary','boasts','stunning','breathtaking','nestled','renowned','groundbreaking','cutting-edge','state-of-the-art','world-class','seamless','empower','transform','unlock','unleash','supercharge','skyrocket','rich','exemplifies','commitment to','natural beauty','in the heart of','must-visit'];
const foundPromo = promo.filter(w => body.toLowerCase().includes(w));
if (foundPromo.length) issues.push('Promotional: ' + foundPromo.join(', '));

// Signposting
const signs = ['let.s dive','let.s explore','let.s break this down','here.s what you need','now let.s look at','without further ado','marilah kita','berikut adalah hal yang perlu','tanpa berpanjang lebar'];
if (signs.some(w => new RegExp(w, 'i').test(body))) issues.push('Signposting detected');

// Fillers
const fillers = ['in order to','due to the fact','at this point in time','it is important to note','perlu diketahui bahwa'];
const foundFillers = fillers.filter(w => body.toLowerCase().includes(w));
if (foundFillers.length) issues.push('Filler: ' + foundFillers.join(', '));

// Generic conclusion
const generic = ['the future looks bright','exciting times','masa depan yang cerah','awal dari sesuatu yang besar','peluang tak terbatas'];
const foundGeneric = generic.filter(w => body.toLowerCase().includes(w));
if (foundGeneric.length) issues.push('Generic conclusion: ' + foundGeneric.join(', '));

// Human signature
const personal = (body.match(/\bkita\b|\bkamu\b|\bsaya\b/gi) || []).length;
if (personal < 3) issues.push('Human signature weak (kita/kamu/saya: ' + personal + ', need 3+)');

// H1 check
const h1 = (body.match(/^# /gm) || []).length;
if (h1 > 0) issues.push('h1 found: ' + h1);

// H2 count
const h2 = (body.match(/^## /gm) || []).length;
if (h2 < 3) issues.push('h2 count: ' + h2 + ' (need min 3)');

// Internal links
const il = (body.match(/\]\(\/artikel\//g) || []).length;
if (il < 2) issues.push('Internal links: ' + il + ' (need min 2)');

// Word count
const wc = body.split(/\s+/).filter(w => w.length > 0).length;
if (wc < 1000) issues.push('Word count: ' + wc + ' (need min 1.000)');
if (wc > 2500) issues.push('Word count: ' + wc + ' (max 2.500)');

// Reading time
const rt = a.readingTime || 0;
if (!rt) issues.push('readingTime: MISSING');
else if (rt < 1) issues.push('readingTime: invalid (' + rt + ')');

// OG headline
const og = a.ogHeadline || '';
if (!og) issues.push('og_headline: MISSING');
else if (og === title) issues.push('og_headline == title: must be different');
else if (og.length > 50) issues.push('og_headline length: ' + og.length + ' (max 50)');

// Source references
const refs = a.sourceReferences || [];
if (!Array.isArray(refs)) issues.push('source_references: must be array');

// Unattributed numbers (check paragraph context)
const paragraphs = bodyNoHeadings.split('\n\n');
const numberSentences = [];
const unattributed = [];
for (const para of paragraphs) {
  const paraSentences = para.split(/[.!?]\s+/);
  const paraHasAttribution = /(menurut|berdasarkan|data|catatan|mencatat|riset|survei|studi|OJK|BPS|We Are Social|Kemenkop|Jakpat|Kompas|CELIOS|JobStreet|Robert Walters|Gateway|Harvard|World Economic Forum|BMC|UGM|JSSR|IJSM|The Muse|Jakpat|Fast Company|IEEE|Kathryn Minshew|Kompas\.id|Springer|We Forum|Walton|Gallup)/i.test(para);
  for (const s of paraSentences) {
    if (/\d+%|\d+\s*(triliun|miliar|juta|ribu)|Rp[\d.,]+|\d+\s*(persen|%)/i.test(s)) {
      numberSentences.push(s);
      const sentHasAttribution = /(menurut|berdasarkan|data|catatan|mencatat|riset|survei|studi|OJK|BPS|We Are Social|Kemenkop|Jakpat|Kompas|CELIOS|JobStreet|Robert Walters|Gateway|Harvard|World Economic Forum|BMC|UGM|JSSR|IJSM|The Muse|Jakpat|Fast Company|IEEE|Kathryn Minshew|Kompas\.id|Springer|We Forum|Walton|Gallup)/i.test(s);
      if (!sentHasAttribution && !paraHasAttribution) {
        unattributed.push(s);
      }
    }
  }
}
if (unattributed.length > 0) {
  issues.push('Unattributed numbers: ' + unattributed.length);
  unattributed.forEach((s, i) => console.log('  [' + (i+1) + '] ' + s.trim().substring(0, 120)));
}

// Copula avoidance
const copula = ['serves as','stands as','represents a','acts as','functions as','boasts','features','offers','marks'];
const foundCopula = copula.filter(w => body.toLowerCase().includes(w));
if (foundCopula.length) issues.push('Copula: ' + foundCopula.join(', '));

// Authority tropes
const auth = ['the real question is','at its core','what really matters','fundamentally','yang sebenarnya','pada hakikatnya','inti permasalahannya'];
const foundAuth = auth.filter(w => body.toLowerCase().includes(w));
if (foundAuth.length) issues.push('Authority tropes: ' + foundAuth.join(', '));

// Rhetorical openers
const rhet = ['honestly?','look,','here.s the thing','the thing is','let.s be honest','real talk','jujur saja,','coba lihat,','begini'];
const foundRhet = rhet.filter(w => new RegExp(w, 'i').test(body));
if (foundRhet.length) issues.push('Rhetorical openers: ' + foundRhet.join(', '));

// SEO metadata
if ((a.seoMetaTitle || '').length > 70) issues.push('SEO title > 70: ' + (a.seoMetaTitle || '').length);
if ((a.seoMetaDescription || '').length > 160) issues.push('SEO desc > 160: ' + (a.seoMetaDescription || '').length);
if ((a.slug || '').length > 60) issues.push('Slug > 60: ' + (a.slug || '').length);
if ((a.excerpt || '').length > 160) issues.push('Excerpt > 160: ' + (a.excerpt || '').length);
const kwCount = (a.seoKeywords || []).length;
if (kwCount < 3) issues.push('Keywords < 3: ' + kwCount);

// Ellipsis
if (body.includes('...')) issues.push('Ellipsis found');

// Fragmented headers
const lines = body.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith('## ') && i + 1 < lines.length) {
    const next = lines[i+1].trim() || (lines[i+2] ? lines[i+2].trim() : '');
    if (next) {
      const hw = new Set(lines[i].replace('## ','').toLowerCase().split(/\s+/));
      const nw = new Set(next.toLowerCase().split(/\s+/));
      if ([...hw].filter(w => nw.has(w)).length >= 2) issues.push('Fragmented header: "' + lines[i].trim() + '"');
    }
  }
}

console.log('=== QC AUDIT ===');
console.log('Word count:', wc);
console.log('H2 count:', h2);
console.log('Internal links:', il);
console.log('Human signature (kita/kamu/saya):', personal);
console.log('Exclamation marks:', exclCount);
console.log('Source references:', refs.length);
console.log('Reading time:', rt);
console.log('OG headline:', og, '(' + og.length + ' chars)');
console.log('SEO title:', (a.seoMetaTitle||'').length, 'chars');
console.log('SEO desc:', (a.seoMetaDescription||'').length, 'chars');
console.log('Slug:', (a.slug||'').length, 'chars');
console.log('Excerpt:', (a.excerpt||'').length, 'chars');
console.log('Keywords:', kwCount);
console.log('Number sentences:', numberSentences.length, '| Unattributed:', unattributed.length);

if (issues.length) {
  console.log('\nFAIL (' + issues.length + '):');
  issues.forEach(i => console.log('  - ' + i));
  process.exit(1);
} else {
  console.log('\nCLEAN: All QC checks passed.');
}
