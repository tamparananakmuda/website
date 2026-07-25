---
description: Artikel step 07 - Grammar, SEO, broken link, formatting, dan readability
---

# 07-qc

Grammar, SEO, broken link, formatting, dan readability.

```bash
export ARTICLE_JSON="/tmp/tam-article.json"
```

## SEO Metadata Validation

```bash
npx tsx -e "
const fs = require('fs');
const a = JSON.parse(fs.readFileSync(process.env.ARTICLE_JSON || '/tmp/tam-article.json', 'utf8'));
console.log('SEO title:', (a.seo_meta_title||'').length, 'chars (max 70)');
console.log('SEO desc:', (a.seo_meta_description||'').length, 'chars (max 160)');
console.log('Slug:', (a.slug||'').length, 'chars (max 60)');
console.log('Excerpt:', (a.excerpt||'').length, 'chars (max 160)');
console.log('Keywords:', (a.seo_keywords||[]).length, '(target 3-8)');
const issues = [];
if ((a.seo_meta_title||'').length > 70) issues.push('SEO title > 70');
if ((a.seo_meta_description||'').length > 160) issues.push('SEO desc > 160');
if ((a.excerpt||'').length > 160) issues.push('Excerpt > 160');
if ((a.slug||'').length > 60) issues.push('Slug > 60');
if (!a.seo_keywords || a.seo_keywords.length < 3) issues.push('Keywords < 3');
if (issues.length) { console.log('\nFAIL:', issues.join(', ')); process.exit(1); }
else console.log('\nCLEAN: SEO metadata OK.');
"
```

## All-in-One QC Audit (grammar, pola AI, heading, metadata)

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
if (exclCount > 1) issues.push('Exclamation marks: ' + exclCount + ' (max 1)');
const aiEn = ['crucial','pivotal','vibrant','tapestry','delve','showcase','underscore','testament','foster','garner','intricate','landscape','additionally','enduring','enhance','highlight','interplay','multifaceted','nuanced','robust','holistic','paradigm','leverage','realm','seamless','empower','transform','unlock','unleash'];
const foundEn = aiEn.filter(w => body.toLowerCase().includes(w));
if (foundEn.length) issues.push('AI vocab EN: ' + foundEn.join(', '));
const aiId = ['signifikan','krusial','esensial','vital','mendalam','memperhatikan','pada dasarnya','secara fundamental','pada intinya','pada akhirnya','menariknya','perlu dicatat','perlu diingat','tidak dapat dipungkiri'];
const foundId = aiId.filter(w => body.toLowerCase().includes(w));
if (foundId.length) issues.push('AI vocab ID: ' + foundId.join(', '));
const sentences = body.split(/[.!?]\s+/);
let currentRun = 0, maxRun = 0;
for (const s of sentences) { if (s.split(/\s+/).length <= 6) { currentRun++; maxRun = Math.max(maxRun, currentRun); } else currentRun = 0; }
if (maxRun >= 3) issues.push('Staccato drama (max run: ' + maxRun + ')');
const triples = body.match(/(\w+,\s+\w+,\s+(?:dan|and)\s+\w+)/g) || [];
if (triples.length > 2) issues.push('Rule of three: ' + triples.length + ' (max 2)');
const neg = body.match(/(tidak hanya.*tapi juga|bukan hanya.*melainkan|not only.*but also|it.s not just.*it.s)/gi) || [];
if (neg.length) issues.push('Negative parallelisms: ' + neg.length);
const promo = ['game-changing','revolutionary','groundbreaking','cutting-edge','state-of-the-art','world-class','seamless','empower','transform','unlock','unleash','supercharge','skyrocket'];
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
if (personal < 3) issues.push('Human signature weak (kita/kamu/saya: ' + personal + ', need 3+)');
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
else if (og === title) issues.push('og_headline == title: must be different');
else if (og.length > 50) issues.push('og_headline length: ' + og.length + ' (max 50)');
const refs = a.source_references || [];
if (!Array.isArray(refs)) issues.push('source_references: must be array');
const numberSentences = sentences.filter(s => /\d+%|\d+\s*(triliun|miliar|juta|ribu)|Rp[\d.,]+|\d+\s*(persen|%)/i.test(s));
const unattributed = numberSentences.filter(s => !/(menurut|berdasarkan|data|catatan|mencatat|riset|survei|studi|OJK|BPS|We Are Social|Kemenkop|Jakpat)/i.test(s));
if (unattributed.length > 0) issues.push('Unattributed numbers: ' + unattributed.length);
if (excerpt.length > 160) issues.push('Excerpt: ' + excerpt.length + ' chars (max 160)');
const seoDesc = a.seo_meta_description || '';
if (seoDesc.length > 160) issues.push('SEO description: ' + seoDesc.length + ' chars (max 160)');
console.log('=== QC AUDIT ===');
console.log('Word count:', wc, '| h2:', h2, '| internal links:', il, '| sources:', refs.length);
if (issues.length) { console.log('\nFAIL (' + issues.length + '):'); issues.forEach(i => console.log('  - ' + i)); process.exit(1); }
else console.log('\nCLEAN: All checks passed.');
"
```

## Aturan

Jalankan sampai CLEAN, fix semua FAIL, re-run. Maksimal 5 round.

## Checklist

- [ ] Grammar clean
- [ ] SEO metadata valid (title max 70, desc max 160, slug max 60, keywords 3-8)
- [ ] Tidak ada broken link
- [ ] Formatting markdown benar (h2/h3, no h1, min 3 h2)
- [ ] Readability OK (word count 1.000-2.500)
- [ ] QC audit CLEAN

## Next

Lanjut ke `/artikel-08-humanizer`
