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
// === PUNCHY TITLE CHECKS (20 prinsip riset) ===
const titleWords = title.split(/\s+/).filter(w => w.length > 0);
if (titleWords.length > 10) issues.push('Title word count: ' + titleWords.length + ' (max 10, ideal 5-8)');
const formalWords = ['tidak','tidakkah','memberi','memberikan','alasan','kerugian','demikian','begini','beginilah','sedemikian'];
const foundFormal = formalWords.filter(w => title.toLowerCase().includes(w));
if (foundFormal.length) issues.push('Title formal words (#1): ' + foundFormal.join(', ') + ' -> pakai kata umum (Nggak, Rugi)');
const fearWords = ['bahaya','mengerikan','mengancam','menakutkan','menghantui','mematikan','fatal'];
const foundFear = fearWords.filter(w => title.toLowerCase().includes(w));
if (foundFear.length) issues.push('Title fear words (#16): ' + foundFear.join(', ') + ' -> fear = avoidance, pakai sadness/loss words');
const superlatives = ['terbaik','terhebat','terpercaya','hebat','amazing','best','luar biasa','fantastis','spektakuler'];
const foundSuper = superlatives.filter(w => title.toLowerCase().includes(w));
if (foundSuper.length) issues.push('Title positive superlatives (#19): ' + foundSuper.join(', ') + ' -> decrease CTR');
if (/\b(kita|kami)\b/i.test(title)) issues.push('Title uses "kita/kami" (#17): negatively associated, pakai "aku" atau "kamu"');
const clickbait = ['tidak akan percaya','wajib tahu','wajib baca','anda tidak','bocor rahasia','rahasia terungkap','simak ini'];
const foundClick = clickbait.filter(w => title.toLowerCase().includes(w));
if (foundClick.length) issues.push('Title clickbait pattern (#18): ' + foundClick.join(', ') + ' -> non-clickbait 2.22x more clicks');
const numberWordMatch = title.match(/\b(tujuh|delapan|sembilan|sepuluh|lima|enam|tiga|empat|satu|dua)\b/i);
if (numberWordMatch) issues.push('Title uses number word (#12): "' + numberWordMatch[0] + '" -> pakai digit');
const explicitFomo = ['jangan sampai','segera baca','sebelum terlambat','limited','terbatas'];
const foundFomo = explicitFomo.filter(w => title.toLowerCase().includes(w));
if (foundFomo.length) issues.push('Title explicit FOMO (#11): ' + foundFomo.join(', ') + ' -> NOT effective');
if (!a.series) issues.push('series: MISSING (required));
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
- [ ] `readingTime` di-set di frontmatter (bukan 1, sesuai word_count / 200)
- [ ] `seoMetaTitle` beda dari `title` per part
- [ ] `seoMetaDescription` beda dari `excerpt` per part
- [ ] `ogHeadline` beda dari `title`, max 50 chars per part
- [ ] `humanSignature: true` di-set per part
- [ ] Hook & Foreshadow formula audit per part: og_headline berbeda dari title + max 50 char, excerpt sebagai thumbnail caption max 160 char, meta description mengandung Hook + Foreshadow element max 160 char
- [ ] Punchy Title Audit per part (20 prinsip): no formal words, no fear words, no superlatives, no "kita/kami", no clickbait pattern, no number words, no explicit FOMO, max 10 kata, ada active verb
- [ ] Episode Hook formula terimplementasi per part (bukan generic hook)
- [ ] Episode Foreshadow formula terimplementasi per part (tease tidak spoiler)
- [ ] Next Tease/Bridge formula terimplementasi antar part (connect antar part)
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
| **S1: Critical** | Tidak boleh publish | WAJIB fix | Em dash, h1, word count < 1.000, dead link, series/seriesOrder missing, readingTime missing/= 1, seoMetaTitle = title, seoMetaDescription = excerpt |
| **S2: Major** | Kualitas terganggu | WAJIB fix | AI vocab > 3, internal links < 2, ogHeadline missing/sama dengan title, recap/teaser missing, humanSignature missing |
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
