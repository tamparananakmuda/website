---
description: Whitepaper step 09 - Sitasi, data, tata bahasa, dan konsistensi visual
---

# 09-qc

Sitasi, data, tata bahasa, dan konsistensi visual.

## Prev

Dari `/whitepaper-08-build`

```bash
export ARTICLE_JSON="/tmp/tam-article.json"
```

## All-in-One QC Audit (jalankan sampai CLEAN)

```bash
npx tsx -e "
const fs = require('fs');
const a = JSON.parse(fs.readFileSync(process.env.ARTICLE_JSON || '/tmp/tam-article.json', 'utf8'));
const body = a.body || ''; const title = a.title || '';
const full = body + ' ' + title;
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
if (neg.length) issues.push('Negative parallelisms');
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
const h1 = (body.match(/^# /gm) || []).length;
const h2 = (body.match(/^## /gm) || []).length;
if (h1 > 0) issues.push('h1 found: ' + h1);
if (h2 < 5) issues.push('h2 count: ' + h2 + ' (need min 5)');
const ilArtikel = (body.match(/\]\(\/artikel\//g) || []).length;
const ilWp = (body.match(/\]\(\/whitepaper\//g) || []).length;
const il = ilArtikel + ilWp;
if (il < 3) issues.push('Internal links: ' + il + ' (need min 3)');
const wc = body.split(/\s+/).filter(w => w.length > 0).length;
if (wc < 3000) issues.push('Word count: ' + wc + ' (need min 3.000)');
if (wc > 10000) issues.push('Word count: ' + wc + ' (max 10.000)');
const numberSentences = sentences.filter(s => /\d+%|\d+\s*(triliun|miliar|juta|ribu)|Rp[\d.,]+|\d+\s*(persen|%)/i.test(s));
const unattributed = numberSentences.filter(s => !/(menurut|berdasarkan|data|catatan|mencatat|riset|survei|studi|OJK|BPS|We Are Social|Kemenkop|Jakpat)/i.test(s));
if (unattributed.length > 0) issues.push('Unattributed numbers: ' + unattributed.length);
console.log('=== QC AUDIT (WHITEPAPER) ===');
console.log('Word count:', wc, '| h2:', h2, '| internal links:', il);
if (issues.length) { console.log('\nFAIL (' + issues.length + '):'); issues.forEach(i => console.log('  - ' + i)); process.exit(1); }
else console.log('\nCLEAN: All checks passed.');
"
```

## Checklist

- [ ] Sitasi valid (semua angka punya sumber)
- [ ] Data akurat dan tidak outdated
- [ ] Tata bahasa clean
- [ ] Konsistensi visual (grafik, tabel, layout)
- [ ] QC audit CLEAN

## Next

Lanjut ke `/whitepaper-10-humanizer`
