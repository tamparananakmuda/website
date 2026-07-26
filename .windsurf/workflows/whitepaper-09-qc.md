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
const warnings = [];

// === CHARACTER-LEVEL CHECKS ===
if (full.includes('\u2014') || full.includes('\u2013')) issues.push('CRITICAL: Em/en dash found');
if (body.includes('\u201c') || body.includes('\u201d')) issues.push('CRITICAL: Curly quotes');
if (body.includes('\u2018') || body.includes('\u2019')) issues.push('CRITICAL: Curly single quotes');
const exclCount = (body.match(/!/g) || []).length;
if (exclCount > 1) issues.push('Exclamation marks: ' + exclCount + ' (max 1)');

// === AI VOCABULARY ===
const aiEn = ['crucial','pivotal','vibrant','tapestry','delve','showcase','underscore','testament','foster','garner','intricate','landscape','additionally','enduring','enhance','highlight','interplay','multifaceted','nuanced','robust','holistic','paradigm','leverage','realm','seamless','empower','transform','unlock','unleash','comprehensive','facilitate','optimize','streamline','navigate','harness','cultivate','spearhead','bolster','amidst','ever-evolving','fast-paced','in today.s world','in the modern era','it.s worth noting','it.s important to note'];
const foundEn = aiEn.filter(w => body.toLowerCase().includes(w));
if (foundEn.length) issues.push('AI vocab EN: ' + foundEn.join(', '));

const aiId = ['signifikan','krusial','esensial','vital','mendalam','memperhatikan','pada dasarnya','secara fundamental','pada intinya','pada akhirnya','menariknya','perlu dicatat','perlu diingat','tidak dapat dipungkiri','perlu diketahui bahwa','sangat penting untuk','tidak diragukan lagi','sebagai catatan','seperti yang kita ketahui','tentu saja','sudah barang tentu'];
const foundId = aiId.filter(w => body.toLowerCase().includes(w));
if (foundId.length) issues.push('AI vocab ID: ' + foundId.join(', '));

// === SENTENCE-LEVEL CHECKS ===
const sentences = body.split(/[.!?]\s+/);
let currentRun = 0, maxRun = 0;
for (const s of sentences) { if (s.split(/\s+/).length <= 6) { currentRun++; maxRun = Math.max(maxRun, currentRun); } else currentRun = 0; }
if (maxRun >= 3) issues.push('Staccato drama: ' + maxRun + ' consecutive short sentences');

const triples = body.match(/(\w+,\s+\w+,\s+(?:dan|and)\s+\w+)/g) || [];
if (triples.length > 2) issues.push('Rule of three: ' + triples.length + ' (max 2)');

const neg = body.match(/(tidak hanya.*tapi juga|bukan hanya.*melainkan|not only.*but also)/gi) || [];
if (neg.length) issues.push('Negative parallelisms: ' + neg.length);

// === PROMOTIONAL LANGUAGE ===
const promo = ['game-changing','revolutionary','groundbreaking','cutting-edge','seamless','empower','transform','unlock','unleash','supercharge','skyrocket','disruptive','next-generation','world-class','best-in-class','state-of-the-art','innovative','seamlessly','effortlessly'];
const foundPromo = promo.filter(w => body.toLowerCase().includes(w));
if (foundPromo.length) issues.push('Promotional: ' + foundPromo.join(', '));

// === SIGNPOSTING & FILLERS ===
const signs = ['let.s dive','here.s what you need','marilah kita','berikut adalah hal yang perlu','tanpa berpanjang lebar','sebelum kita mulai','pertama-tama','pertama sekali','tanpa basa-basi','pada bagian ini','di section ini','selanjutnya kita akan','di bagian berikutnya'];
if (signs.some(w => new RegExp(w, 'i').test(body))) issues.push('Signposting detected');

const fillers = ['in order to','due to the fact','at this point in time','it is important to note','perlu diketahui bahwa','sebagai tambahan','perlu ditekankan bahwa','sudah menjadi rahasia umum','tidak dapat dipungkiri lagi'];
const foundFillers = fillers.filter(w => body.toLowerCase().includes(w));
if (foundFillers.length) issues.push('Filler: ' + foundFillers.join(', '));

// === GENERIC CONCLUSIONS ===
const generic = ['the future looks bright','exciting times','masa depan yang cerah','awal dari sesuatu yang besar','peluang tak terbatas','langkah menuju masa depan','membuka jalan menuju','hanya waktu yang akan menentukan','hanya waktu yang bisa menjawab','sisa adalah sejarah'];
const foundGeneric = generic.filter(w => body.toLowerCase().includes(w));
if (foundGeneric.length) issues.push('Generic conclusion: ' + foundGeneric.join(', '));

// === HUMAN SIGNATURE ===
const personal = (body.match(/\bkita\b|\bkamu\b|\bsaya\b|\bkami\b/gi) || []).length;
if (personal < 3) issues.push('Human signature weak: ' + personal + ' (need 3+)');

// === HEADING STRUCTURE ===
const h1 = (body.match(/^# /gm) || []).length;
const h2 = (body.match(/^## /gm) || []).length;
const h3 = (body.match(/^### /gm) || []).length;
if (h1 > 0) issues.push('CRITICAL: h1 found: ' + h1 + ' (use h2/h3 only)');
if (h2 < 5) issues.push('h2 count: ' + h2 + ' (need min 5)');

// === HEADING QUALITY (conclusion-first check) ===
const h2s = (body.match(/^## (.+)$/gm) || []).map(h => h.replace(/^## /, ''));
const genericHeadings = h2s.filter(h => /^(analisis|background|latar belakang|pendahuluan|kesimpulan|rekomendasi|metodologi|data|temuan|diskusi)$/i.test(h.trim()));
if (genericHeadings.length > 2) warnings.push('Generic headings: ' + genericHeadings.join(', ') + ' (should be conclusion-first)');

// === INTERNAL LINKS ===
const ilArtikel = (body.match(/\]\(\/artikel\//g) || []).length;
const ilWp = (body.match(/\]\(\/whitepaper\//g) || []).length;
const il = ilArtikel + ilWp;
if (il < 3) issues.push('Internal links: ' + il + ' (need min 3)');

// === WORD COUNT ===
const wc = body.split(/\s+/).filter(w => w.length > 0).length;
if (wc < 3000) issues.push('Word count: ' + wc + ' (need min 3.000)');
if (wc > 10000) issues.push('Word count: ' + wc + ' (max 10.000)');

// === UNATTRIBUTED NUMBERS ===
const numberSentences = sentences.filter(s => /\d+%|\d+\s*(triliun|miliar|juta|ribu)|Rp[\d.,]+|\d+\s*(persen|%)/i.test(s));
const unattributed = numberSentences.filter(s => !/(menurut|berdasarkan|data|catatan|mencatat|riset|survei|studi|OJK|BPS|We Are Social|Kemenkop|Jakpat|Katadata|Litbang|lembaga|institut|kementerian|world bank|imf|oecd|un|unesco|who|iLO|McKinsey|Deloitte|PwC|EY|KPMG|Gartner|Forrester|IDC|Statista|app Annie|datareportal|global web index|good stats)/i.test(s));
if (unattributed.length > 0) issues.push('Unattributed numbers: ' + unattributed.length);

// === CITATION DENSITY ===
const citations = (body.match(/\((?:[A-Z][a-z]+(?:\s+(?:et\s+al\.?|&|dan)\s+[A-Z][a-z]+)?),?\s*\d{4}\)/g) || []).length;
const citationDensity = citations / (wc / 1000);
if (citationDensity < 1) warnings.push('Citation density low: ' + citations + ' citations / ' + wc + ' words (' + citationDensity.toFixed(1) + ' per 1.000 words, target > 1)');

// === PARAGRAPH LENGTH (cognitive load) ===
const paragraphs = body.split(/\n\n+/).filter(p => p.trim().length > 0);
const longParagraphs = paragraphs.filter(p => p.split(/\s+/).length > 150);
if (longParagraphs.length > 0) warnings.push('Long paragraphs (> 150 words): ' + longParagraphs.length + ' (cognitive load risk)');

// === SENTENCE LENGTH DISTRIBUTION ===
const sentenceLengths = sentences.map(s => s.split(/\s+/).length).filter(l => l > 0);
const avgSentLen = sentenceLengths.reduce((a,b) => a+b, 0) / sentenceLengths.length;
const longSentences = sentenceLengths.filter(l => l > 40).length;
if (avgSentLen > 30) warnings.push('Avg sentence length: ' + avgSentLen.toFixed(1) + ' words (target < 30)');
if (longSentences > sentences.length * 0.15) warnings.push('Long sentences (> 40 words): ' + longSentences + ' (' + (longSentences/sentences.length*100).toFixed(0) + '%, target < 15%)');

// === HEDGING LANGUAGE CHECK ===
const strongHedging = (body.match(/\b(menunjukkan|membuktikan|mengkonfirmasi)\b/gi) || []).length;
const weakHedging = (body.match(/\b(mungkin|kemungkinan|cenderung|berpotensi|mengindikasikan)\b/gi) || []).length;
if (strongHedging > 0 && weakHedging === 0 && citations < 5) warnings.push('Strong hedging tanpa weak hedging: mungkin over-claiming (strong: ' + strongHedging + ', weak: 0)');

// === PULL QUOTE CHECK ===
const pullQuotes = (body.match(/^> .+/gm) || []).length;
const expectedPullQuotes = Math.floor(wc / 500);
if (pullQuotes < expectedPullQuotes) warnings.push('Pull quotes: ' + pullQuotes + ' / expected ~' + expectedPullQuotes + ' (1 per 500 words)');

// === BOLD KEY FINDINGS (information foraging) ===
const boldTexts = (body.match(/\*\*[^*]+\*\*/g) || []).length;
if (boldTexts < Math.floor(wc / 300)) warnings.push('Bold key findings: ' + boldTexts + ' / expected ~' + Math.floor(wc/300) + ' (1 per 300 words for skim reader)');

// === LIMITATIONS SECTION CHECK ===
const hasLimitations = /limitation|keterbatasan|batasan|caveat|keterbatasan data/i.test(body);
if (!hasLimitations) warnings.push('No limitations section detected');

// === METHODOLOGY SECTION CHECK ===
const hasMethodology = /metodologi|methodology|metode penelitian|cara kami mengumpulkan/i.test(body);
const hasOriginalData = /survei kami|data yang kami kumpulkan|original data|primary research/i.test(body);
if (hasOriginalData && !hasMethodology) issues.push('Original data detected tapi no methodology section');

// === EXECUTIVE SUMMARY CHECK ===
const hasExecSummary = /executive summary|ringkasan eksekutif/i.test(body);
if (!hasExecSummary) warnings.push('No Executive Summary heading detected');

// === COUNTER-ARGUMENT CHECK ===
const hasCounterArg = /counter|lawan|bertentangan|kritik|namun|tetapi|di sisi lain|sebaliknya|kritik terhadap|kelemahan dari pendapat/i.test(body);
if (!hasCounterArg) warnings.push('No counter-argument detected (Toulmin rebuttal missing)');

// === SECTION WORD COUNT DISTRIBUTION ===
const sections = body.split(/^## /m).filter(s => s.trim().length > 0);
const sectionWordCounts = sections.map(s => {
  const heading = s.split(/\n/)[0].trim();
  const wc = s.split(/\s+/).filter(w => w.length > 0).length;
  return { heading, wc };
});
const analysisSections = sectionWordCounts.filter(s => /argument|analisis|argumen/i.test(s.heading));
const execSection = sectionWordCounts.find(s => /executive summary|ringkasan eksekutif/i.test(s.heading));
const recSection = sectionWordCounts.find(s => /recommendation|rekomendasi/i.test(s.heading));
const conclusionSection = sectionWordCounts.find(s => /conclusion|kesimpulan/i.test(s.heading));
const limitationsSection = sectionWordCounts.find(s => /limitation|keterbatasan/i.test(s.heading));

if (execSection && execSection.wc > 400) warnings.push('Executive Summary too long: ' + execSection.wc + ' words (target 200-300)');
if (execSection && execSection.wc < 150) warnings.push('Executive Summary too short: ' + execSection.wc + ' words (target 200-300)');
if (recSection && recSection.wc < 300) warnings.push('Recommendation too short: ' + recSection.wc + ' words (target 500-1.500)');
if (conclusionSection && conclusionSection.wc > 700) warnings.push('Conclusion too long: ' + conclusionSection.wc + ' words (target 300-500)');
if (!limitationsSection) warnings.push('No Limitations section detected (word count scan)');

// === RECOMMENDATION SPECIFICITY CHECK ===
if (recSection) {
  const recText = sections.find(s => /recommendation|rekomendasi/i.test(s.heading.split(/\n/)[0])) || '';
  const vagueRecs = (recText.match(/\b(tingkatkan|perkuat|perbaiki|optimalkan|dukung|promosikan|fokus pada|perhatikan|pertimbangkan)\b/gi) || []).length;
  if (vagueRecs > 3) warnings.push('Vague recommendations: ' + vagueRecs + ' generic verbs (tingkatkan/perkuat/perbaiki/etc). Need specific actions.');
}

// === DUPLICATE SENTENCE DETECTION ===
const normalizedSentences = sentences.map(s => s.toLowerCase().trim().replace(/[^\w\s]/g, '')).filter(s => s.length > 20);
const duplicates = normalizedSentences.filter((s, i) => normalizedSentences.indexOf(s) !== i);
if (duplicates.length > 0) issues.push('Duplicate sentences: ' + duplicates.length + ' (exact or near-duplicate)');

// === HEADING HIERARCHY DEPTH ===
const maxDepth = h3 > 0 ? 3 : 2;
if (h3 > 15) warnings.push('Deep heading hierarchy: ' + h3 + ' h3 headings (may indicate over-fragmentation)');

// === LINK ANCHOR TEXT QUALITY ===
const linkAnchors = (body.match(/\[([^\]]+)\]\(\/(?:artikel|whitepaper)\/[^)]+\)/g) || []).map(l => l.match(/\[([^\]]+)\]/)[1]);
const genericAnchors = linkAnchors.filter(a => /^(baca|selengkapnya|di sini|here|link|klik|lihat)$/i.test(a.trim()));
if (genericAnchors.length > 0) warnings.push('Generic link anchor text: ' + genericAnchors.join(', ') + ' (use descriptive anchor)');

// === SECTION OPENING QUALITY (first sentence per h2 section) ===
const sectionFirstSentences = sections.map(s => {
  const lines = s.split(/\n/).filter(l => l.trim().length > 0 && !l.startsWith('#'));
  return lines[0] ? lines[0].trim().substring(0, 100) : '';
}).filter(s => s.length > 0);
const robotikOpenings = sectionFirstSentences.filter(s => /^(pada bagian|berikut adalah|seperti yang|sebelumnya|selanjutnya|di section|pada chapter)/i.test(s));
if (robotikOpenings.length > 2) warnings.push('Robotik section openings: ' + robotikOpenings.length + ' sections start with filler/signposting');

// === EXECUTIVE SUMMARY THESIS CHECK ===
if (execSection) {
  const execText = sections.find(s => /executive summary|ringkasan eksekutif/i.test(s.heading.split(/\n/)[0])) || '';
  const execParagraphs = execText.split(/\n\n+/).filter(p => p.trim().length > 0);
  if (execParagraphs.length > 0) {
    const firstPara = execParagraphs[0];
    const hasDataInFirst = /\d+%|\d+\s*(juta|miliar|ribu|triliun)|Rp[\d.,]+/i.test(firstPara);
    if (!hasDataInFirst) warnings.push('Executive Summary first paragraph: no data/numbers detected (should front-load thesis with data)');
  }
}

// === FAQ SECTION CHECK (AI citation booster) ===
const hasFAQ = /faq|frequently asked|pertanyaan umum/i.test(body);
if (!hasFAQ) warnings.push('No FAQ section (AI engines prefer FAQ for citation)');

// === REPORT ===
console.log('=== QC AUDIT (WHITEPAPER) ===');
console.log('Word count:', wc, '| h2:', h2, '| h3:', h3, '| internal links:', il);
console.log('Citations:', citations, '| density:', citationDensity.toFixed(1), '/1k words');
console.log('Avg sentence length:', avgSentLen.toFixed(1), '| long sentences:', longSentences);
console.log('Pull quotes:', pullQuotes, '| bold findings:', boldTexts);
console.log('Paragraphs:', paragraphs.length, '| long (>150w):', longParagraphs.length);
if (warnings.length) { console.log('\nWARNINGS (' + warnings.length + '):'); warnings.forEach(w => console.log('  [W] ' + w)); }
if (issues.length) { console.log('\nFAIL (' + issues.length + '):'); issues.forEach(i => console.log('  [F] ' + i)); process.exit(1); }
else if (warnings.length === 0) console.log('\nCLEAN: All checks passed, no warnings.');
else console.log('\nPASS with warnings. Review warnings above before proceeding.');
"
```

## Framework QC Checks (manual verification)

### Pyramid Principle Structure
- [ ] Paragraf pertama Executive Summary = governing thought (thesis)
- [ ] 3-5 supporting arguments MECE
- [ ] SCQA pembuka ada di Executive Summary
- [ ] Setiap section: conclusion dulu, lalu evidence

### Bayesian Claim Proportionality
- [ ] Setiap key claim: evidence strength match dengan claim strength
- [ ] Tidak ada over-claiming (strong claim, weak evidence)
- [ ] Hedging language proportionate (strong evidence = "menunjukkan", weak = "kemungkinan")

### E-E-A-T Signals
- [ ] Named author dengan verifiable credentials
- [ ] First-person markers (minimal 1 paragraf pengalaman/observasi)
- [ ] Primary sources > 70%
- [ ] Expert quotes dengan attribution (minimal 2)
- [ ] Methodology section (jika original research)
- [ ] Limitations section explicit

### Cognitive Load Validation
- [ ] 1 idea per paragraph (no stacking)
- [ ] Short sentences untuk key claims (max 25 kata)
- [ ] Bold key findings untuk skim reader
- [ ] Section breaks setiap 300-500 kata
- [ ] Max 5-7 data components per chart

### Citable Passage Verification
- [ ] Minimal 1 self-contained extractable claim per section
- [ ] Data dalam narasi (bukan hanya di tabel/chart)
- [ ] Statistical formatting: "74% (BPS, 2025)"
- [ ] No vague references ("seperti disebutkan di atas")

### Information Foraging Audit
- [ ] Conclusion-first headings (bukan generic "Analisis")
- [ ] Bolded key findings sebagai scent markers
- [ ] Pull quotes (1 per 500 kata)
- [ ] Key insight setiap 200-300 kata (reward frequency)

### Limitations Section
- [ ] Data gaps diakui
- [ ] Methodological limitations explicit
- [ ] Generalizability constraints stated
- [ ] Confounders acknowledged

### Meta-Analytic Evidence (jika review multiple studies)
- [ ] Effect sizes dilaporkan (bukan hanya p-values)
- [ ] Heterogeneity acknowledged (I-squared)
- [ ] Publication bias check disebut
- [ ] Sensitivity analysis disebut

## QC Severity Levels

| Level | Label | Artinya | Action |
|-------|-------|---------|--------|
| **F** | FAIL (Critical) | Hard block. Tidak boleh lanjut. | Fix sebelum lanjut |
| **W** | WARNING | Soft flag. Bisa lanjut tapi harus review. | Review manual, fix jika perlu |

**Aturan:** 0 FAIL untuk lanjut ke 10-humanizer. WARNING boleh maksimal 3, semua harus di-review manual dan di-acknowledge.

## Source Quality Audit (manual)

Klasifikasi setiap source di whitepaper:

| Level | Definisi | Target |
|-------|----------|--------|
| **A+** | Peer-reviewed journal, government data (BPS, OJK), international org (World Bank, OECD) | > 40% |
| **A** | Established research institute, reputable think tank, industry report dari major firm | > 30% |
| **B** | News article dari reputable outlet, industry blog dengan editorial standards | < 20% |
| **C** | Opinion piece, anecdotal, unverified | < 10% |
| **D** | Social media, forum, unattributed | 0% |

Jika > 20% source level B atau lebih rendah, perku research atau tambah primary sources.

## Cross-Reference Consistency Check

Pastikan claims konsisten across sections:

| Check | Cara |
|-------|------|
| **Exec Summary vs Body** | Setiap claim di Exec Summary punya evidence di body? |
| **Body vs Recommendation** | Recommendation berdasarkan findings di body, bukan claim baru? |
| **Body vs Conclusion** | Conclusion summarize body, bukan introduce claim baru? |
| **Data vs Narrative** | Angka di text cocok dengan angka di chart/tabel? |
| **Hedging consistency** | Claim strength sama di semua section yang mention claim tersebut? |

Jika ada inconsistency: fix di body, bukan di Exec Summary. Exec Summary = summary of body, bukan independent claim.

## Counter-Argument Quality Check

Tidak cukup hanya ada counter-argument. Cek kualitasnya:

| Criterion | Check |
|-----------|-------|
| **Steel-manned?** | Counter-argument versi terkuat, bukan strawman? |
| **Data-backed?** | Counter-argument punya evidence, bukan hanya opini? |
| **Rebuttal proportional?** | Rebuttal sekuat counter-argument? |
| **Acknowledged uncertainty?** | Jika counter-argument valid sebagian, diakui? |
| **TAM tone?** | Counter-argument tidak merendahkan, tapi mengajak berpikir? |

## Data Interpretation Overreach Check

Untuk setiap data point, cek apakah interpretasi di whitepaper proportionate:

| Pattern | Contoh overreach | Fix |
|---------|-------------------|-----|
| **Causal claim dari correlational data** | "Data menunjukkan X menyebabkan Y" (padahal hanya korelasi) | "Data menunjukkan korelasi antara X dan Y" |
| **Generalisasi dari sample kecil** | "Generasi muda Indonesia..." (dari survei 100 orang Jakarta) | "Responden survei kami di Jakarta..." |
| **Ekstrapolasi dari single study** | "Riset membuktikan..." (dari 1 study) | "Satu studi menemukan..." |
| **Cherry-picking** | Hanya cite data yang mendukung, abaikan yang menentang | Include counter-evidence |
| **Absolute claim dari probabilistic data** | "X selalu menyebabkan Y" (dari probabilistic finding) | "X cenderung berasosiasi dengan Y" |

## Re-Run Protocol

| Round | Trigger | Maksimal |
|-------|---------|----------|
| **1** | QC audit pertama | - |
| **2-3** | FAIL setelah fix | 3 round |
| **4-5** | WARNING yang perlu fix | 5 round total |
| **6+** | Jika masih FAIL/WARNING setelah 5 round, kembali ke 05-draft untuk revisi major | - |

Setiap round: catat apa yang di-fix, apa yang masih FAIL. Jangan blind re-run tanpa analisis.

## Pre-QC Gate (sebelum full audit)

Sebelum jalankan automated audit, pastikan pre-conditions:

| Gate | Check | Jika gagal |
|------|-------|-----------|
| **File exists** | `$ARTICLE_JSON` ada dan valid JSON? | Kembali ke 08-build |
| **Body not empty** | `body` field tidak kosong? | Kembali ke 05-draft |
| **Title exists** | `title` field ada? | Kembali ke 05-draft |
| **Frontmatter complete** | slug, publishedAt, tags, author ada? | Kembali ke 08-build |
| **No placeholder text** | Tidak ada TODO, FIXME, [placeholder], lorem ipsum? | Kembali ke 05-draft |

Jika pre-gate gagal, jangan jalankan full audit. Fix dulu.

## Citation Verification Protocol

Setiap citation di whitepaper harus bisa diverifikasi. 3 level verifikasi:

| Level | Cara | Target |
|-------|------|--------|
| **L1: Format check** | Apakah citation format konsisten? (BPS, 2025) atau (BPS 2025)? | 100% konsisten |
| **L2: Source existence** | Apakah source ada? URL accessible? Buku/jurnal terbit? | 100% verifiable |
| **L3: Claim accuracy** | Apakah source benar-benar mengatakan apa yang di-claim? | 100% accurate |

### L3 Verification Method
Untuk setiap key citation:
1. Buka source asli (URL, PDF, buku)
2. Cari claim yang di-cite
3. Apakah source mengatakan hal yang sama?
4. Apakah angka cocok? (tidak dibulat-bulat kecuali dijelaskan)
5. Apakah context tidak terpotong? (cherry-picking check)

Jika L3 gagal untuk 1 citation: fix atau hapus. Jika L3 gagal untuk > 3 citations: kembali ke 02-research.

## Statistical Claim Verification

Untuk setiap claim statistik (angka, persentase, korrelasi, causal claim):

| Check | Pertanyaan | Pass criteria |
|-------|------------|---------------|
| **Source traceable** | Dari mana angka ini? | Source disebutkan explicit |
| **Number accurate** | Apakah angka cocok dengan source? | Exact match atau explained rounding |
| **Context preserved** | Apakah context tidak terpotong? | Full context dari source |
| **Claim type correct** | Korelasi vs kausal? Sample vs populasi? | Claim type match evidence type |
| **Sample size adequate** | n = ? Apakah cukup? | n disebutkan jika < 1.000 |
| **Confidence interval** | Apakah CI disebutkan? | CI disebutkan jika claim kuantitatif |
| **Comparison baseline** | Dibandingkan dengan apa? | Baseline explicit |

## Toulmin Completeness Score

Untuk setiap supporting argument, score 6 komponen Toulmin:

| Komponen | 0 (missing) | 1 (weak) | 2 (strong) |
|----------|-------------|----------|------------|
| **Claim** | Tidak ada heading claim | Heading ada tapi vague | Heading = specific claim |
| **Ground** | Tidak ada evidence | Evidence ada tapi tidak traceable | Evidence traceable + specific |
| **Warrant** | Tidak ada logic bridge | Logic implicit | Logic explicit dalam text |
| **Backing** | Tidak ada authority | Authority disebut tapi tidak credible | Credible authority + credential |
| **Qualifier** | Tidak ada hedging | Hedging ada tapi tidak proportionate | Hedging proportionate to evidence |
| **Rebuttal** | Tidak ada counter-argument | Counter-argument ada tapi strawman | Steel-manned counter-argument |

Score per argument: 0-12. Target: minimal 8 per argument. Jika < 8, revisi argument.

## TAM Tone Compliance Score

Score 7 karakter tone TAM (0-2 per karakter, max 14):

| Karakter | 0 (missing) | 1 (partial) | 2 (strong) |
|----------|-------------|-------------|-------------|
| **Jujur** | Over-claiming | Sebagian accurate | Fully accurate, no exaggeration |
| **Tajam** | Filler opening | Langsung ke inti tapi bertele-tele | Front-loaded, no filler |
| **Rasional** | Opini tanpa data | Data ada tapi tipis | Data-backed, > 70% primary |
| **Berani berbeda** | Ikut narasi mainstream | Ada kontra-narasi tapi weak | Steel-manned kontra-narasi |
| **Mengajak berpikir** | Memberi jawaban instan | Sebagian self-validation | Full self-validation mechanism |
| **Tidak menggurui** | "Kamu harus..." | Sebagian mandate | Full nudge, no mandate |
| **Optimis tanpa harapan palsu** | "Masa depan cerah" | Realistic tapi vague | Realistic + specific implication |

Target: minimal 10 dari 14. Jika < 10, kembali ke 10-humanizer.

## AI Citation Readiness Score

Seberapa siap whitepaper ini untuk di-cite oleh AI engines? Score 0-10:

| Factor | Weight | Check |
|--------|--------|-------|
| **Front-loaded thesis** | 1 | Paragraf pertama = governing thought dengan data? |
| **Citable passages** | 2 | Minimal 1 self-contained extractable claim per section? |
| **Statistical formatting** | 1 | "74% (BPS, 2025)" dalam text? |
| **Semantic headings** | 1 | H2 = claim/conclusion, bukan generic? |
| **FAQ section** | 1 | Ada FAQ? |
| **Schema-ready** | 0.5 | Frontmatter lengkap? |
| **Limitations section** | 1 | Ada dan explicit? |
| **Methodology section** | 0.5 | Ada jika original research? |
| **Author attribution** | 1 | Named author dengan credentials? |
| **Data in narrative** | 1 | Angka di text, bukan hanya di chart? |

Score: sum of weights where check passes. Target: > 7. Jika < 5, whitepaper tidak siap untuk AI citation.

## Checklist

- [ ] Pre-QC gate: file valid, body tidak kosong, no placeholder
- [ ] Sitasi valid (semua angka punya sumber)
- [ ] Data akurat dan tidak outdated
- [ ] Tata bahasa clean
- [ ] Konsistensi visual (grafik, tabel, layout)
- [ ] QC audit: 0 FAIL, maksimal 3 WARNING (semua acknowledged)
- [ ] Pyramid Principle structure check (4 items)
- [ ] Bayesian claim proportionality check (3 items)
- [ ] E-E-A-T signals verified (6 signals)
- [ ] Cognitive load validation (5 checks)
- [ ] Citable passage verification (4 checks)
- [ ] Information foraging audit (4 checks)
- [ ] Limitations section verified (4 items)
- [ ] Meta-analytic evidence check (jika relevan)
- [ ] Source quality audit: > 70% level A+ atau A
- [ ] Cross-reference consistency: Exec Summary vs Body vs Recommendation vs Conclusion
- [ ] Counter-argument quality: steel-manned, data-backed, proportional, TAM tone
- [ ] Data interpretation overreach: 0 overreach patterns found
- [ ] Heading quality: conclusion-first, bukan generic
- [ ] Citation density: > 1 per 1.000 words
- [ ] Paragraph length: 0 paragraph > 150 words
- [ ] Sentence length: avg < 30 words, < 15% long sentences
- [ ] Pull quotes: 1 per 500 words
- [ ] Bold key findings: 1 per 300 words
- [ ] Section word count distribution: Exec 200-300, Rec 500-1.500, Conclusion 300-500
- [ ] Recommendation specificity: 0 vague verbs (tingkatkan/perkuat/perbaiki)
- [ ] Duplicate sentences: 0
- [ ] Link anchor text: descriptive, no generic (baca/selengkapnya/di sini)
- [ ] Section opening quality: no robotik openings
- [ ] Executive Summary first paragraph: front-loaded thesis with data
- [ ] Citation Verification: L1 format, L2 existence, L3 claim accuracy
- [ ] Statistical Claim Verification: 7 checks per statistical claim
- [ ] Toulmin Completeness Score: > 8 per argument (dari 12)
- [ ] TAM Tone Compliance Score: > 10 (dari 14)
- [ ] AI Citation Readiness Score: > 7 (dari 10)
- [ ] FAQ section ada (AI citation booster)

## Next

Lanjut ke `/whitepaper-10-humanizer`
