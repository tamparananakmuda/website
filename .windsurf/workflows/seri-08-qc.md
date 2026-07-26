---
description: Seri step 08 - Grammar, fakta, dan konsistensi
---

# 08-qc

Grammar, fakta, dan konsistensi.

## Prev

Dari `/seri-07-build`

```bash
export ARTICLE_JSON="/tmp/tam-article.json"
```

## All-in-One QC Audit (jalankan sampai CLEAN)

```bash
npx tsx -e "
const fs = require('fs');
const a = JSON.parse(fs.readFileSync(process.env.ARTICLE_JSON || '/tmp/tam-article.json', 'utf8'));
const body = a.body || ''; const title = a.title || ''; const excerpt = a.excerpt || '';
const full = body + ' ' + title + ' ' + excerpt;
const issues = [];
if (full.includes('\u2014') || full.includes('\u2013')) issues.push('Em/en dash found');
if (body.includes('\u201c') || body.includes('\u201d')) issues.push('Curly quotes');
const exclCount = (body.match(/!/g) || []).length;
if (exclCount > 1) issues.push('Exclamation marks: ' + exclCount);
const aiEn = ['crucial','pivotal','vibrant','tapestry','delve','showcase','underscore','testament','foster','garner','intricate','landscape','additionally','enduring','enhance','highlight','interplay','multifaceted','nuanced','robust','holistic','paradigm','leverage','realm','seamless','empower','transform','unlock','unleash'];
const foundEn = aiEn.filter(w => body.toLowerCase().includes(w));
if (foundEn.length) issues.push('AI vocab EN: ' + foundEn.join(', '));
const aiId = ['signifikan','krusial','esensial','vital','mendalam','memperhatikan','pada dasarnya','secara fundamental','pada intinya','pada akhirnya','menariknya','perlu dicatat','perlu diingat','tidak dapat dipungkiri'];
const foundId = aiId.filter(w => body.toLowerCase().includes(w));
if (foundId.length) issues.push('AI vocab ID: ' + foundId.join(', '));
const sentences = body.split(/[.!?]\s+/);
let currentRun = 0, maxRun = 0;
for (const s of sentences) { if (s.split(/\s+/).length <= 6) { currentRun++; maxRun = Math.max(maxRun, currentRun); } else currentRun = 0; }
if (maxRun >= 3) issues.push('Staccato drama');
const triples = body.match(/(\w+,\s+\w+,\s+(?:dan|and)\s+\w+)/g) || [];
if (triples.length > 2) issues.push('Rule of three: ' + triples.length);
const neg = body.match(/(tidak hanya.*tapi juga|bukan hanya.*melainkan|not only.*but also)/gi) || [];
if (neg.length) issues.push('Negative parallelisms: ' + neg.length);
const promo = ['game-changing','revolutionary','groundbreaking','cutting-edge','seamless','empower','transform','unlock','unleash','supercharge','skyrocket'];
const foundPromo = promo.filter(w => body.toLowerCase().includes(w));
if (foundPromo.length) issues.push('Promotional: ' + foundPromo.join(', '));
const signs = ['let.s dive','here.s what you need','marilah kita','berikut adalah hal yang perlu','tanpa berpanjang lebar'];
if (signs.some(w => new RegExp(w, 'i').test(body))) issues.push('Signposting detected');
const fillers = ['in order to','due to the fact','at this point in time','it is important to note','perlu diketahui bahwa'];
const foundFillers = fillers.filter(w => body.toLowerCase().includes(w));
if (foundFillers.length) issues.push('Filler: ' + foundFillers.join(', '));
const generic = ['the future looks bright','exciting times','masa depan yang cerah','awal dari sesuatu yang besar','peluang tak terbatas'];
const foundGeneric = generic.filter(w => body.toLowerCase().includes(w));
if (foundGeneric.length) issues.push('Generic conclusion: ' + foundGeneric.join(', '));
const personal = (body.match(/\bkita\b|\bkamu\b|\bsaya\b/gi) || []).length;
if (personal < 3) issues.push('Human signature weak (need 3+)');
const lines = body.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith('## ') && i + 1 < lines.length) {
    const next = lines[i+1].trim() || (lines[i+2] ? lines[i+2].trim() : '');
    if (next) {
      const hw = new Set(lines[i].replace('## ','').toLowerCase().split(/\s+/));
      const nw = new Set(next.toLowerCase().split(/\s+/));
      if ([...hw].filter(w => nw.has(w)).length >= 2) issues.push('Fragmented header: \"' + lines[i].trim() + '\"');
    }
  }
}
const h1 = (body.match(/^# /gm) || []).length;
const h2 = (body.match(/^## /gm) || []).length;
if (h1 > 0) issues.push('h1 found: ' + h1);
if (h2 < 3) issues.push('h2 count: ' + h2 + ' (need min 3)');
const il = (body.match(/\]\(\/artikel\//g) || []).length;
if (il < 2) issues.push('Internal links: ' + il + ' (need min 2)');
const wc = body.split(/\s+/).filter(w => w.length > 0).length;
if (wc < 1000) issues.push('Word count: ' + wc + ' (need min 1.000)');
if (wc > 2500) issues.push('Word count: ' + wc + ' (max 2.500)');
const og = a.og_headline || '';
if (!og) issues.push('og_headline: MISSING');
else if (og === title) issues.push('og_headline == title');
else if (og.length > 50) issues.push('og_headline length: ' + og.length + ' (max 50)');
if (!a.series) issues.push('series: MISSING (required)');
if (!a.series_order) issues.push('series_order: MISSING (required)');
const refs = a.source_references || [];
if (!Array.isArray(refs)) issues.push('source_references: must be array');
if (excerpt.length > 160) issues.push('Excerpt > 160');
const seoDesc = a.seo_meta_description || '';
if (seoDesc.length > 160) issues.push('SEO desc > 160');
console.log('=== QC AUDIT (SERI) ===');
console.log('Word count:', wc, '| h2:', h2, '| internal links:', il, '| series:', a.series, '| order:', a.series_order);
if (issues.length) { console.log('\nFAIL (' + issues.length + '):'); issues.forEach(i => console.log('  - ' + i)); process.exit(1); }
else console.log('\nCLEAN: All checks passed.');
"
```

## Checklist

- [ ] Grammar clean per part
- [ ] Fakta terverifikasi per part
- [ ] Konsistensi antar part dicek
- [ ] SEO metadata valid per part
- [ ] QC audit CLEAN per part
- [ ] Severity: 0 S1, 0 S2, max 3 S3 per part
- [ ] Cross-Part QC: no kontradiksi, no repetisi
- [ ] Series Navigation QC: prev/next/recap/teaser valid
- [ ] Citation Density: min 2 per 1.000 kata per part
- [ ] TAM Tone Compliance: min 7 per part
- [ ] Series QC Quality Score: min 9 (dari 12)

## Severity Level System

| Severity | Definisi | Action | Contoh |
|----------|----------|--------|--------|
| **S1: Critical** | Tidak boleh publish | WAJIB fix | Em dash, h1, word count < 1.000, dead link, series/seriesOrder missing |
| **S2: Major** | Kualitas terganggu | WAJIB fix | AI vocab > 3, internal links < 2, ogHeadline missing, recap/teaser missing |
| **S3: Minor** | Polish | Fix jika ada waktu | Excessive hedging, hyphenated overuse |
| **S4: Info** | Catatan untuk humanizer | Lanjut ke 09 | Tone shift, paragraph rhythm |

S1 dan S2 harus 0. S3 max 3. S4 tidak ada limit.

## Cross-Part QC Checks

| Check | Cara | Pass criteria |
|-------|------|---------------|
| **No kontradiksi** | Bandingkan data antar part | Tidak ada angka yang bertentangan |
| **No repetisi** | Cek paragraf yang sama persis | Tidak ada paragraf duplikat |
| **Recap accuracy** | Recap part N vs conclusion part N-1 | Match |
| **Teaser payoff** | Teaser part N vs konten part N+1 | Match |
| **Navigation links** | Prev/next link antar part | Semua aktif |
| **Tone consistency** | Voice part 1 vs part N | Konsisten |
| **SeriesOrder** | Urutan part di frontmatter | 1, 2, 3... tidak ada gap |

## Series QC Quality Score (0-12)

Target: min 9.

| Factor | Weight | 0 | 1 | 2 |
|--------|--------|---|---|---|
| **Audit CLEAN** | 2 | FAIL | Sebagiane | Fully CLEAN per part |
| **Cross-part** | 2 | Kontradiksi | Sebagiane | No kontradiksi + no repetisi |
| **Navigation** | 1 | Missing | Sebagiane | Full prev/next/recap/teaser |
| **Severity** | 1 | S1/S2 ada | S3 only | S4 atau 0 |
| **Citation density** | 1 | < 2 per 1.000 | 2-3 | 4+ per 1.000 |
| **TAM tone** | 2 | < 5 | 5-7 | 8+ per part |
| **SEO metadata** | 1 | > 2 fail | 1 fail | Semua pass |
| **SeriesOrder** | 1 | Gap atau salah | Sebagiane | 1, 2, 3... correct |
| **Re-run efficiency** | 1 | 5 rounds | 3-4 | 1-2 rounds |

Jika score < 9: fix sebelum lanjut ke humanizer.

## Next

Lanjut ke `/seri-09-humanizer`
