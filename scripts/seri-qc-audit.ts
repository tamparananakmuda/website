import { readFileSync } from 'fs';

const dir = '/tmp/tam-seri-drafts/';

const aiEn = ['crucial','pivotal','vibrant','tapestry','delve','showcase','underscore','testament','foster','garner','intricate','landscape','additionally','enduring','enhance','highlight','interplay','multifaceted','nuanced','robust','holistic','paradigm','leverage','realm','seamless','empower','transform','unlock','unleash'];
const aiId = ['signifikan','krusial','esensial','vital','mendalam','memperhatikan','pada dasarnya','secara fundamental','pada intinya','pada akhirnya','menariknya','perlu dicatat','perlu diingat','tidak dapat dipungkiri'];
const promo = ['game-changing','revolutionary','groundbreaking','cutting-edge','seamless','empower','transform','unlock','unleash','supercharge','skyrocket'];
const signs = ['let.s dive','here.s what you need','marilah kita','berikut adalah hal yang perlu','tanpa berpanjang lebar'];
const fillers = ['in order to','due to the fact','at this point in time','it is important to note','perlu diketahui bahwa'];
const generic = ['the future looks bright','exciting times','masa depan yang cerah','awal dari sesuatu yang besar','peluang tak terbatas'];

let allClean = true;

for (let i = 1; i <= 12; i++) {
  const a = JSON.parse(readFileSync(dir + 'part-' + String(i).padStart(2, '0') + '.json', 'utf-8'));
  const body = a.body || '';
  const title = a.title || '';
  const excerpt = a.excerpt || '';
  const full = body + ' ' + title + ' ' + excerpt;
  const issues: string[] = [];

  // Em/en dash
  if (full.includes('\u2014') || full.includes('\u2013')) issues.push('Em/en dash found');

  // Curly quotes
  if (body.includes('\u201c') || body.includes('\u201d')) issues.push('Curly quotes');

  // Exclamation marks
  const exclCount = (body.match(/!/g) || []).length;
  if (exclCount > 1) issues.push('Exclamation marks: ' + exclCount);

  // AI vocab EN
  const foundEn = aiEn.filter(w => body.toLowerCase().includes(w));
  if (foundEn.length) issues.push('AI vocab EN: ' + foundEn.join(', '));

  // AI vocab ID
  const foundId = aiId.filter(w => body.toLowerCase().includes(w));
  if (foundId.length) issues.push('AI vocab ID: ' + foundId.join(', '));

  // Staccato drama
  const sentences = body.split(/[.!?]\s+/);
  let currentRun = 0, maxRun = 0;
  for (const s of sentences) {
    if (s.split(/\s+/).length <= 6) { currentRun++; maxRun = Math.max(maxRun, currentRun); }
    else currentRun = 0;
  }
  if (maxRun >= 3) issues.push('Staccato drama');

  // Rule of three
  const triples = body.match(/(\w+,\s+\w+,\s+(?:dan|and)\s+\w+)/g) || [];
  if (triples.length > 2) issues.push('Rule of three: ' + triples.length);

  // Negative parallelisms
  const neg = body.match(/(tidak hanya.*tapi juga|bukan hanya.*melainkan|not only.*but also)/gi) || [];
  if (neg.length) issues.push('Negative parallelisms: ' + neg.length);

  // Promotional
  const foundPromo = promo.filter(w => body.toLowerCase().includes(w));
  if (foundPromo.length) issues.push('Promotional: ' + foundPromo.join(', '));

  // Signposting
  if (signs.some(w => new RegExp(w, 'i').test(body))) issues.push('Signposting detected');

  // Fillers
  const foundFillers = fillers.filter(w => body.toLowerCase().includes(w));
  if (foundFillers.length) issues.push('Filler: ' + foundFillers.join(', '));

  // Generic conclusion
  const foundGeneric = generic.filter(w => body.toLowerCase().includes(w));
  if (foundGeneric.length) issues.push('Generic conclusion: ' + foundGeneric.join(', '));

  // Human signature
  const personal = (body.match(/\bkita\b|\bkamu\b|\bsaya\b/gi) || []).length;
  if (personal < 3) issues.push('Human signature weak (need 3+, found ' + personal + ')');

  // Fragmented headers
  const lines = body.split('\n');
  for (let j = 0; j < lines.length; j++) {
    if (lines[j].startsWith('## ') && j + 1 < lines.length) {
      const next = lines[j+1].trim() || (lines[j+2] ? lines[j+2].trim() : '');
      if (next) {
        const hw = new Set(lines[j].replace('## ','').toLowerCase().split(/\s+/));
        const nw = new Set(next.toLowerCase().split(/\s+/));
        if ([...hw].filter(w => nw.has(w)).length >= 2) issues.push('Fragmented header: "' + lines[j].trim() + '"');
      }
    }
  }

  // h1/h2
  const h1 = (body.match(/^# /gm) || []).length;
  const h2 = (body.match(/^## /gm) || []).length;
  if (h1 > 0) issues.push('h1 found: ' + h1);
  if (h2 < 3) issues.push('h2 count: ' + h2 + ' (need min 3)');

  // Internal links
  const il = (body.match(/\]\(\/artikel\//g) || []).length;
  if (il < 2) issues.push('Internal links: ' + il + ' (need min 2)');

  // Word count
  const wc = body.split(/\s+/).filter(w => w.length > 0).length;
  if (wc < 1000) issues.push('Word count: ' + wc + ' (need min 1.000)');
  if (wc > 2500) issues.push('Word count: ' + wc + ' (max 2.500)');

  // OG headline
  const og = a.og_headline || '';
  if (!og) issues.push('og_headline: MISSING');
  else if (og === title) issues.push('og_headline == title');
  else if (og.length > 50) issues.push('og_headline length: ' + og.length + ' (max 50)');

  // Series
  if (!a.series) issues.push('series: MISSING');
  if (!a.series_order) issues.push('series_order: MISSING');

  // Source references
  const refs = a.source_references || [];
  if (!Array.isArray(refs)) issues.push('source_references: must be array');

  // Excerpt
  if (excerpt.length > 160) issues.push('Excerpt > 160');

  // SEO desc
  const seoDesc = a.seo_meta_description || '';
  if (seoDesc.length > 160) issues.push('SEO desc > 160');

  // Output
  if (issues.length > 0) {
    allClean = false;
    console.log(`Part ${i}: FAIL (${issues.length})`);
    issues.forEach(iss => console.log(`  - ${iss}`));
  } else {
    console.log(`Part ${i}: CLEAN (wc=${wc}, h2=${h2}, links=${il})`);
  }
}

console.log(`\n=== ${allClean ? 'ALL 12 PARTS CLEAN ===' : 'HAS ISSUES ==='}`);
