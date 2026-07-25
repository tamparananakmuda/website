---
description: Whitepaper step 10 - Membuat bahasa lebih natural tanpa mengurangi kredibilitas
---

# 10-humanizer

Membuat bahasa lebih natural tanpa mengurangi kredibilitas.

## Prev

Dari `/whitepaper-09-qc`

## Humanizer rules lengkap

Lihat `files/HumanizerRules.md` (single source of truth, 15 kategori).

## Yang diperbaiki di step ini

- Flow kalimat: perbaiki transisi yang terlalu formal/robotik
- Hilangkan pola AI: staccato drama, rule-of-three abuse, negative parallelisms
- Tambahkan contoh konkret: ganti klaim abstrak dengan contoh spesifik
- Natural tone: ganti kata formal AI dengan kata natural
- **Tetap menjaga kredibilitas:** whitepaper boleh lebih formal dari artikel, tapi tidak boleh terdengar seperti AI
- Human signature: minimal 1 paragraf pengalaman/observasi/opini spesifik

## Tabel Pengganti Kata AI

Lihat tabel lengkap di `/artikel-08-humanizer` (tabel pengganti kata AI ID dan EN).

## Before/After Examples

### Staccato drama
**Before:** "Data menunjukkan. Angka berbicara. Sistem gagal."
**After:** "Data menunjukkan sistem ini gagal, dan angkanya tidak berbohong."

### Rule of three abuse
**Before:** "Whitepaper ini menganalisis, mengevaluasi, dan merekomendasikan solusi."
**After:** "Whitepaper ini menganalisis data dan merekomendasikan solusi berdasarkan temuan."

### Negative parallelisms
**Before:** "Bukan hanya tentang data, melainkan tentang implikasi nyata."
**After:** "Ini soal implikasi nyata. Data cuma titik awal."

### Formal AI tone
**Before:** "Penting untuk dicatat bahwa temuan ini memiliki implikasi yang signifikan."
**After:** "Temuan ini punya implikasi besar."

## Teknik Human Signature (3 tipe, min 1 per whitepaper)

| Tipe | Contoh (whitepaper tone, lebih formal dari artikel) |
|------|-----------------------------------------------------|
| **Pengalaman personal** | "Saya berbicara dengan 20 freelancer Jakarta bulan lalu. Hampir semua tidak tahu bahwa mereka sebenarnya tidak punya perlindungan hukum." |
| **Observasi spesifik** | "Dari data yang kami kumpulkan, pola yang muncul konsisten: generasi muda urban punya ekspektasi tinggi tapi proteksi minimal." |
| **Opini tajam** | "Menurut analisis kami, gig economy di Indonesia saat ini lebih menguntungkan platform daripada pekerjanya. Ini bukan kebebasan, ini precaritas yang dikemas ulang." |

Whitepaper human signature boleh pakai "saya" (lebih formal) atau "kami" (tim riset), tidak harus "gue" seperti artikel.

## Command auto-check pola AI

```bash
npx tsx -e "
const fs = require('fs');
const a = JSON.parse(fs.readFileSync(process.env.ARTICLE_JSON || '/tmp/tam-article.json', 'utf8'));
const body = a.body || '';
const issues = [];
if (body.includes('\u2014') || body.includes('\u2013')) issues.push('Em/en dash');
if (body.includes('\u201c') || body.includes('\u201d')) issues.push('Curly quotes');
const aiId = ['signifikan','krusial','esensial','vital','mendalam','memperhatikan','pada dasarnya','secara fundamental','pada intinya','pada akhirnya','menariknya','perlu dicatat','perlu diingat','tidak dapat dipungkiri'];
const found = aiId.filter(w => body.toLowerCase().includes(w));
if (found.length) issues.push('AI vocab ID: ' + found.join(', '));
const aiEn = ['crucial','pivotal','vibrant','tapestry','delve','showcase','underscore','testament','foster','garner','intricate','landscape','additionally','enduring','enhance','highlight','interplay','multifaceted','nuanced','robust','holistic','paradigm','leverage','realm','seamless','empower','transform','unlock','unleash'];
const foundEn = aiEn.filter(w => body.toLowerCase().includes(w));
if (foundEn.length) issues.push('AI vocab EN: ' + foundEn.join(', '));
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
const personal = (body.match(/\bkita\b|\bkamu\b|\bsaya\b|\bkami\b/gi) || []).length;
if (personal < 3) issues.push('Human signature weak (need 3+)');
if (issues.length) { console.log('FAIL (' + issues.length + '):'); issues.forEach(i => console.log('  - ' + i)); }
else console.log('CLEAN');
"
```

## Formal vs Natural Balance (whitepaper-specific)

Whitepaper boleh lebih formal dari artikel, tapi tetap tidak boleh AI-sounding:

| Aspek | Artikel | Whitepaper |
|-------|---------|------------|
| Pronoun | "gue"/"kita"/"kamu" | "saya"/"kami"/"kita" (boleh "gue" di human signature) |
| Tone | Conversational, provokatif | Analytical, tetap berani |
| Sentence length | Variasi pendek-panjang | cenderung lebih panjang, tapi variasi tetap |
| Vocabulary | Kasual, slang | Semi-formal, precise, tapi tidak stiff |
| Emosi | Lebih emosional | Lebih objektif, tapi ada human signature |
| Structure | Hook kuat, punchy | Executive summary, data-driven |

Threshold whitepaper: boleh lebih formal, tapi command auto-check harus tetap CLEAN.

## Setelah humanizer

1. Set `human_signature: true` di article JSON
2. **WAJIB re-run `/whitepaper-09-qc`** untuk verifikasi semua pola AI sudah hilang
3. Jika QC audit masih FAIL, kembali ke step ini, fix, re-run. Maksimal 5 round.

## Checklist

- [ ] No em dash, no en dash, no curly quotes
- [ ] No AI vocab EN/ID
- [ ] No staccato drama, rule-of-three abuse, negative parallelisms
- [ ] No promotional language, signposting, filler, generic conclusions
- [ ] Max 1 exclamation mark
- [ ] Human signature: minimal 1 paragraf pengalaman/observasi/opini
- [ ] Bahasa natural tapi tetap kredibel (formal vs natural balance applied)
- [ ] Command auto-check: CLEAN
- [ ] Re-run `/whitepaper-09-qc` dan hasil CLEAN

## Next

Lanjut ke `/whitepaper-11-publish`
