---
description: Artikel step 07 - Grammar, SEO, broken link, formatting, dan readability
---

# 07-qc

Grammar, SEO, broken link, formatting, dan readability.

## Prev

Dari `/artikel-06-build`

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
const aiEn = ['actually','additionally','align with','crucial','delve','emphasizing','enduring','enhance','fostering','garner','highlight','interplay','intricate','intricacies','key','landscape','pivotal','showcase','tapestry','testament','underscore','valuable','vibrant','multifaceted','nuanced','robust','holistic','paradigm','leverage','realm','beacon','bastion','quintessential','epitome','harbinger','catalyst','conduit','formidable','profound','resolute','steadfast','unwavering','seamless','empower','transform','unlock','unleash'];
const foundEn = aiEn.filter(w => body.toLowerCase().includes(w));
if (foundEn.length) issues.push('AI vocab EN: ' + foundEn.join(', '));
const aiId = ['signifikan','krusial','esensial','vital','mendalam','memperhatikan','pada dasarnya','secara fundamental','pada intinya','pada akhirnya','menariknya','yang menarik','hal yang menarik','perlu dicatat','perlu diingat','penting untuk','penting untuk dicatat','tidak dapat dipungkiri','tidak diragukan lagi','sungguh-sungguh','sepenuhnya','tidak hanya.*tapi juga','bukan hanya.*melainkan'];
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
const promo = ['game-changing','game-changer','revolutionary','boasts','stunning','breathtaking','nestled','renowned','groundbreaking','cutting-edge','state-of-the-art','world-class','seamless','empower','transform','unlock','unleash','supercharge','skyrocket','rich','exemplifies','commitment to','natural beauty','in the heart of','must-visit'];
const foundPromo = promo.filter(w => body.toLowerCase().includes(w));
if (foundPromo.length) issues.push('Promotional: ' + foundPromo.join(', '));
const signs = ['let.s dive','let.s explore','let.s break this down','here.s what you need','now let.s look at','without further ado','marilah kita','berikut adalah hal yang perlu','tanpa berpanjang lebar'];
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
const rt = a.reading_time || Math.ceil(wc / 200);
if (!a.reading_time) issues.push('readingTime: MISSING (set to ' + rt + ')');
else if (a.reading_time < 1) issues.push('readingTime: invalid (' + a.reading_time + ')');
const og = a.og_headline || '';
if (!og) issues.push('og_headline: MISSING');
else if (og === title) issues.push('og_headline == title: must be different');
else if (og.length > 50) issues.push('og_headline length: ' + og.length + ' (max 50)');
const refs = a.source_references || [];
if (!Array.isArray(refs)) issues.push('source_references: must be array');
const numberSentences = sentences.filter(s => /\d+%|\d+\s*(triliun|miliar|juta|ribu)|Rp[\d.,]+|\d+\s*(persen|%)/i.test(s));
const unattributed = numberSentences.filter(s => !/(menurut|berdasarkan|data|catatan|mencatat|riset|survei|studi|OJK|BPS|We Are Social|Kemenkop|Jakpat)/i.test(s));
if (unattributed.length > 0) issues.push('Unattributed numbers: ' + unattributed.length);
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
// Hyphenated overuse
const hyph = body.match(/(\w+-\w+)/g) || [];
const hyphCounts = {};
hyph.forEach(h => { hyphCounts[h] = (hyphCounts[h] || 0) + 1; });
const overusedHyph = Object.entries(hyphCounts).filter(([h, c]) => c > 2).map(([h]) => h);
if (overusedHyph.length) issues.push('Hyphenated overuse: ' + overusedHyph.join(', '));
// Significance emphasis
const sig = ['stands as','serves as','is a testament','is a reminder','setting the stage for','marking a','shaping the','represents a shift','key turning point','evolving landscape','focal point','indelible mark','deeply rooted','contributing to the','menjadi bukti','menjadi pengingat','menjadi titik balik','menandai perubahan','mencerminkan tren','berkontribusi terhadap','membuka jalan bagi','berakar dalam','menjadi catatan sejarah'];
const foundSig = sig.filter(w => body.toLowerCase().includes(w));
if (foundSig.length) issues.push('Significance emphasis: ' + foundSig.join(', '));
// Notability emphasis
const notab = ['independent coverage','media outlets','written by a leading expert','active social media presence','diliput media nasional','dikutip oleh berbagai media','ditulis oleh pakar terkemuka','kehadiran media sosial yang aktif','dikenal luas oleh masyarakat'];
const foundNotab = notab.filter(w => body.toLowerCase().includes(w));
if (foundNotab.length) issues.push('Notability emphasis: ' + foundNotab.join(', '));
// Challenges sections
const challenges = ['despite its','faces several challenges','despite these challenges','challenges and legacy','future outlook','menghadapi tantangan','di tengah tantangan','tantangan dan warisan','prospek masa depan','ke depannya diharapkan'];
const foundCh = challenges.filter(w => body.toLowerCase().includes(w));
if (foundCh.length) issues.push('Challenges section: ' + foundCh.join(', '));
// False ranges
const falseRanges = (body.match(/from \w+ to \w+/gi) || []);
if (falseRanges.length > 2) issues.push('False ranges: ' + falseRanges.length);
// Inline-header lists
const inlineHeaders = (body.match(/- \*\*[^*]+\*\*:/g) || []);
if (inlineHeaders.length > 3) issues.push('Inline-header lists: ' + inlineHeaders.length);
// Emojis
const emojiRe = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2700}-\u{27BF}]/u;
if (emojiRe.test(body)) issues.push('Emojis found');
// Collaborative artifacts
const collab = ['i hope this helps','of course!','certainly!','would you like','want me to','let me know','here is a','semoga membantu','tentu saja!','jika berminat','jika ingin tahu','beri tahu saya','berikut adalah'];
const foundCollab = collab.filter(w => body.toLowerCase().includes(w));
if (foundCollab.length) issues.push('Collaborative artifacts: ' + foundCollab.join(', '));
// Knowledge-cutoff
const cutoff = ['as of my last','up to my last training','while specific details are limited','while specific details are scarce','based on available information','not publicly available','maintains a low profile','keeps personal details private','it is believed that','berdasarkan informasi yang tersedia','tidak tersedia secara publik','menjaga profil rendah','detail pribadi dijaga privat','diduga bahwa','kemungkinan pernah'];
const foundCutoff = cutoff.filter(w => body.toLowerCase().includes(w));
if (foundCutoff.length) issues.push('Knowledge-cutoff: ' + foundCutoff.join(', '));
// Sycophantic
const sycoph = ['great question!','you\'re absolutely right!','that\'s an excellent point!','that\'s a great observation!','pertanyaan yang bagus!','anda benar sekali!','poin yang sangat tepat!','pengamatan yang bagus!'];
const foundSycoph = sycoph.filter(w => body.toLowerCase().includes(w));
if (foundSycoph.length) issues.push('Sycophantic: ' + foundSycoph.join(', '));
// Excessive hedging
const hedging = (body.match(/\b(could potentially|possibly be argued|might have some|may potentially|mungkin bisa dibilang|kemungkinan akan|mungkin saja|bisa jadi)\b/gi) || []);
if (hedging.length > 2) issues.push('Excessive hedging: ' + hedging.length);
// Tailing negations
const tailing = (body.match(/, no (\w+ing|\w+ed)\b|, tanpa perlu (\w+)|, tanpa harus (\w+)/gi) || []);
if (tailing.length) issues.push('Tailing negations: ' + tailing.length);
// Diff-anchored
const diffAnchored = ['was added to replace','was introduced to','this function was added','was changed from','was updated to','ditambahkan untuk mengganti','ditambahkan untuk','fungsi ini ditambahkan','diubah dari','diperbarui menjadi'];
const foundDiff = diffAnchored.filter(w => body.toLowerCase().includes(w));
if (foundDiff.length) issues.push('Diff-anchored: ' + foundDiff.join(', '));
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
- [ ] `readingTime` di-set di frontmatter (bukan 1)
- [ ] QC audit CLEAN

## Next

Lanjut ke `/artikel-08-humanizer`
