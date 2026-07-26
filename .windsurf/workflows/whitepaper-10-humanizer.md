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
- Hilangkan pola AI: staccato drama, rule-of-three abuse, negative_parallelisms
- Tambahkan contoh konkret: ganti klaim abstrak dengan contoh spesifik
- Natural tone: ganti kata formal AI dengan kata natural
- **Tetap menjaga kredibilitas:** whitepaper boleh lebih formal dari artikel, tapi tidak boleh terdengar seperti AI
- Human signature: minimal 1 paragraf pengalaman/observasi/opini spesifik

## Deep Humanizer Techniques (7 lapis perbaikan)

Humanizer whitepaper bukan sekadar ganti kata. 7 lapis perbaikan berurutan:

### Lapis 1: Paragraph Rhythm Audit

Baca whitepaper dengan mata tertutup. Dengarkan ritmenya.

| Pattern | Masalah | Fix |
|---------|---------|-----|
| **Monoton rhythm** | Semua paragraph panjang sama, semua kalimat panjang sama | Variasi: pendek, sedang, panjang. Short sentence untuk key claim. |
| **No breathing room** | Paragraph beruntun tanpa break | Sisipkan 1-sentence paragraph untuk emphasis setiap 500 kata |
| **Robotik opening** | Setiap section mulai dengan "Data menunjukkan..." | Variasi opening: pertanyaan, observasi, kontra-narasi, data |
| **Uniform structure** | Setiap section: claim, evidence, conclusion (sama persis) | Variasi: ada section yang mulai dengan story, ada yang mulai dengan data, ada yang mulai dengan question |

### Lapis 2: Concrete-to-Abstract Ratio

Hitung rasio kalimat konkret vs abstrak. Target: 60% konkret, 40% abstrak.

| Tipe | Contoh | Target |
|------|--------|--------|
| **Konkret** | "74% lulusan 2024 menganggur menurut BPS." | 60% |
| **Abstrak** | "Tingkat pengangguran lulusan menunjukkan tren yang memprihatinkan." | 40% |

Jika rasio abstrak > 60%, terlalu akademis. Tambahkan data, contoh, atau kasus konkret.

### Lapis 3: Jargon Translation Table

Setiap jargon teknis harus diterjemahkan untuk general reader:

| Jargon | Terjemahan TAM | Kapan pakai jargon asli |
|--------|---------------|----------------------|
| **Precaritas** | "Kondisi kerja yang tidak aman, tidak menentu, tidak berjaminan" | Hanya jika sudah dijelaskan sebelumnya |
| **Gig economy** | "Ekonomi platform, kerja lepas berbasis aplikasi" | Boleh jika konteks sudah clear |
| **Moral hazard** | "Situasi saat seseorang terlindungi dari risiko, jadi mereka ambil risiko lebih besar" | Jelaskan di kurung setelah first use |
| **Selection bias** | "Bias karena data hanya dari kelompok tertentu, tidak mewakili semua" | Hanya di Methodology section |
| **Confounding variable** | "Faktor lain yang mempengaruhi hasil tapi tidak diukur" | Hanya di Methodology section |
| **Effect size** | "Seberapa besar perbedaan yang ditemukan, bukan hanya apakah ada perbedaan" | Boleh dengan konteks |

Aturan: first use = jargon + terjemahan dalam kurung. Use berikutnya = jargon saja.

### Lapis 4: Transition Quality Audit

Transisi antar paragraph dan antar section. Hindari transisi robotik:

| Transisi robotik | Transisi natural |
|------------------|-----------------|
| "Selanjutnya, kita akan membahas..." | Hapus. Langsung mulai section baru. |
| "Seperti yang telah disebutkan..." | Hapus. Jika perlu referensi, "Data BPS di section sebelumnya menunjukkan..." |
| "Pada bagian ini..." | Hapus. Heading sudah jadi konteks. |
| "Menariknya..." | Hapus. Jika menarik, reader akan tahu. |
| "Lebih lanjut..." | Hapus. Atau ganti dengan connection logis: "Konsekuensi dari data ini..." |
| "Oleh karena itu..." | Boleh jika memang causal. Hapus jika hanya filler. |

Transisi terbaik = tidak ada transisi eksplisit. Connection logis antar paragraph sudah cukup.

### Lapis 5: Opening & Closing Line Quality

Setiap section: opening line dan closing line paling penting. Reader paling ingat ini.

| Section | Opening line check | Closing line check |
|---------|-------------------|-------------------|
| **Exec Summary** | Front-loaded thesis? Governing thought? | Transition ke body yang mengundang? |
| **Analysis sections** | Conclusion-first? Atau hook? | Lead ke section berikutnya? |
| **Recommendation** | Actionable? Specific? | Bukan generic "mulai sekarang"? |
| **Conclusion** | Summarize tanpa repeat? | Thought-provoking? Bukan "masa depan cerah"? |
| **Limitations** | Honest? Bukan defensive? | What next? Research gap? |

Opening line tidak boleh: "Pada section ini...", "Berikut adalah...", "Seperti yang kita ketahui..."
Closing line tidak boleh: "Dengan demikian...", "Oleh karena itu, dapat disimpulkan...", "Ini hanyalah awal..."

### Lapis 6: Metaphor & Analogy Quality

Whitepaper TAM boleh pakai metaphor untuk explain complex concepts. Tapi metaphor harus:

| Criterion | Check |
|-----------|-------|
| **Fresh** | Bukan cliche ("rumah kartu", "gunung es", "ujang tombak") |
| **Accurate** | Mapping metaphor ke concept tidak misleading |
| **Extended** | Jika metaphor dipakai, konsisten. Jangan campur metaphor. |
| **TAM tone** | Berani tapi tidak merendahkan. "Gig economy seperti kasino: rumah selalu menang." |
| **Limited** | Max 2-3 metaphor per whitepaper. Terlalu banyak = confusing. |

### Lapis 7: Data Storytelling Humanizer

Data dalam whitepaper bukan hanya angka. Data harus bercerita:

| Technique | Contoh |
|-----------|--------|
| **Anchor angka ke konteks** | "74% menganggur" bukan hanya angka. "74% berarti 3 dari 4 lulusan tidak punya kerja." |
| **Kontras expectation vs reality** | "Kita diasumsikan kerja keras = sukses. Data: 74% lulusan menganggur." |
| **Human scale** | "Rp 4,5 juta UMR Jakarta. Sewa kos 1,5 juta. Makan 1,5 juta. Sisa 1,5 juta untuk transport, komunikasi, sosial, tabungan." |
| **Timeline narrative** | "2020: pandemi. 2021: recovery. 2024: PHK massal. Pola: setiap krisis, yang paling rentan disingkirkan dulu." |
| **Comparison yang relatable** | "Indonesia punya 64 juta pekerja informal. Itu 3x populasi Australia." |

## Framework Humanizer Checks

### Writing Process Recursive Check (Flower & Hayes)
Setelah humanizer pass, verify bahwa writing process masih iterative:
- [ ] Apakah ada bagian yang terlalu linear/robotik? (semua section sama struktur)
- [ ] Apakah goals evolved during writing? (jika ada insight baru yang muncul saat draft, apakah di-akomodasi?)
- [ ] Monitor check: "Apakah ini masih aligned dengan thesis? Apakah claim masih proportionate to evidence?"

### Cognitive Dissonance yang Sehat (ELM)
Pastikan "tamparan" = central route, bukan emotional manipulation:
- [ ] Present data yang bertentangan dengan keyakinan reader? (dissonance trigger)
- [ ] Dissonance di-resolve via data, bukan via emotional appeal?
- [ ] Tidak spell out conclusion? Biarkan reader menarik sendiri?
- [ ] Bukan peripheral route (heuristic cues, emotional manipulation)?

### Self-Validation Mechanism
- [ ] "Data menunjukkan X" bukan "Jadi kamu harus berpikir Y"?
- [ ] Reader yang validasi pikiran mereka sendiri tentang argument?
- [ ] Tidak ada mandate/instruksi langsung di Analysis section?

### Barthes Demystification Naturalization Check
- [ ] Myth di-identify sebagai cultural construct, bukan "natural truth"?
- [ ] Denotation (literal) vs connotation (cultural) dibedakan?
- [ ] Ideology behind myth di-expose (siapa yang benefit)?
- [ ] TAM angle: "keras perlu, tapi tidak cukup" (nuance, bukan反转 kosong)?

### Prospect Theory Framing Check
- [ ] Loss framing untuk "tamparan" (apa yang reader hilang)?
- [ ] Accurate, bukan fear-mongering?
- [ ] Reference point clear (outcomes relative to current state)?
- [ ] Gain framing untuk Recommendations (apa yang reader dapat)?

### Narrative Transportation di Case Studies
- [ ] Protagonist konkret (bukan abstract)?
- [ ] Conflict relevant ke thesis?
- [ ] Resolution honest (bukan always happy ending)?
- [ ] Data embedded dalam story (bukan just anecdote)?
- [ ] TAM tetap fact-based: transportation via structure, bukan fabrication?

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

## TAM Voice Calibration (whitepaper-specific)

Whitepaper TAM = TAM tone + academic rigor. Kalibrasi 7 karakter tone:

| Karakter | Whitepaper manifestation | Check |
|----------|-------------------------|-------|
| **Jujur** | Tidak melebih-lebihkan data. Tidak clickbait title. | [ ] Title tidak over-claim? |
| **Tajam** | Langsung ke inti. No filler opening. | [ ] Exec Summary front-loaded thesis? |
| **Rasional** | Argumen didukung data, bukan opini. | [ ] > 70% primary sources? |
| **Berani berbeda** | Kontra-narasi jika ada dasar kuat. | [ ] Counter-argument steel-manned? |
| **Mengajak berpikir** | Tidak memberi jawaban instan. | [ ] Self-validation mechanism ada? |
| **Tidak menggurui** | "Banyak dari kita...", bukan "Kamu harus..." | [ ] No mandate di Analysis? |
| **Optimis tanpa harapan palsu** | "Memahami kenyataan memberi peluang." | [ ] Conclusion realistic, bukan toxic positivity? |

## Paragraph-Level Humanizer Audit

Audit per paragraph, bukan per document. Untuk setiap paragraph, tanyakan:

| Question | Jika jawaban "tidak" |
|----------|---------------------|
| **Apakah paragraph ini punya 1 idea utama?** | Split jadi 2 paragraph |
| **Apakah kalimat pertama = topic sentence?** | Rewrite: conclusion-first |
| **Apakah ada data atau contoh konkret?** | Tambahkan. Jika tidak ada data, hapus paragraph. |
| **Apakah paragraph ini bisa berdiri sendiri?** | Jika tidak, merge dengan paragraph sebelumnya |
| **Apakah reader dapat insight baru?** | Jika tidak, hapus. Whitepaper bukan filler. |
| **Apakah ada jargon yang belum diterjemahkan?** | Tambahkan terjemahan |
| **Apakah kalimat terakhir mengundang ke paragraph berikutnya?** | Tambahkan connection logis |

## Readability Target Verification

Setiap section punya target readability berbeda:

| Section | Target readability | Rationale |
|---------|-------------------|-----------|
| **Executive Summary** | Grade 10-12 | Decision maker baca ini dulu. Harang accessible. |
| **Background** | Grade 10-12 | Set context untuk general reader. |
| **Analysis** | Grade 12-14 | Lebih teknis, tapi masih accessible. |
| **Methodology** | Grade 14+ | Boleh teknis. Hanya untuk reader yang peduli. |
| **Recommendation** | Grade 10-12 | Actionable untuk general reader. |
| **Conclusion** | Grade 10-12 | Summary harus accessible. |
| **Limitations** | Grade 12-14 | Boleh teknis. Honest disclosure. |

Cek readability dengan: kalimat panjang rata-rata, jargon density, abstract vs concrete ratio.

## Question Quality Check

Whitepaper TAM boleh pakai pertanyaan untuk mengajak berpikir. Tapi pertanyaan harus berkualitas:

| Pattern | Masalah | Fix |
|---------|---------|-----|
| **Rhetorical question kosong** | "Apakah ini yang kita inginkan?" | Hapus. Atau ganti dengan data-driven question. |
| **Question dengan jawaban obvious** | "Apakah kerja keras penting?" | Hapus. Reader tahu jawabannya. |
| **Question tanpa follow-up** | Pertanyaan tidak dijawab di paragraph berikutnya | Jawab dengan data, atau hapus pertanyaan. |
| **Terlalu banyak question** | > 3 pertanyaan per section | Maksimal 1-2 per section. Pertanyaan = emphasis, bukan filler. |
| **Question yang menggurui** | "Sudahkah kamu berpikir tentang..." | Ganti: "Data ini memunculkan pertanyaan: ..." |

Pertanyaan terbaik TAM: datang dari data, bukan dari moral high ground. "74% lulusan menganggur. Apakah kerja keras saja cukup?"

## Setelah humanizer

1. Set `human_signature: true` di article JSON
2. **WAJIB re-run `/whitepaper-09-qc`** untuk verifikasi semua pola AI sudah hilang
3. Jika QC audit masih FAIL, kembali ke step ini, fix, re-run. Maksimal 5 round.
4. Jika QC audit PASS with warnings, review setiap warning. Fix jika relevant.
5. Jika 5 round masih belum CLEAN, kembali ke 05-draft untuk revisi major.

## Checklist

- [ ] No em dash, no en dash, no curly quotes, no curly single quotes
- [ ] No AI vocab EN/ID (expanded list)
- [ ] No staccato drama, rule-of-three abuse, negative parallelisms
- [ ] No promotional language, signposting, filler, generic conclusions (expanded list)
- [ ] Max 1 exclamation mark
- [ ] Human signature: minimal 1 paragraf pengalaman/observasi/opini
- [ ] Bahasa natural tapi tetap kredibel (formal vs natural balance applied)
- [ ] Lapis 1: Paragraph rhythm audit (variasi panjang, breathing room, opening variasi)
- [ ] Lapis 2: Concrete-to-abstract ratio (60% konkret, 40% abstrak)
- [ ] Lapis 3: Jargon translation (first use = jargon + terjemahan)
- [ ] Lapis 4: Transition quality (no robotik transisi, connection logis)
- [ ] Lapis 5: Opening & closing line quality (no filler, no generic conclusion)
- [ ] Lapis 6: Metaphor & analogy quality (fresh, accurate, max 2-3 per whitepaper)
- [ ] Lapis 7: Data storytelling (anchor ke konteks, human scale, kontras expectation vs reality)
- [ ] Writing process recursive check: tidak terlalu linear/robotik
- [ ] Cognitive dissonance yang sehat: central route, bukan emotional manipulation
- [ ] Self-validation mechanism: "Data menunjukkan X" bukan "Kamu harus berpikir Y"
- [ ] Barthes demystification: myth sebagai cultural construct, ideology exposed
- [ ] Prospect theory framing: loss framing accurate, gain framing untuk recommendations
- [ ] Narrative transportation: case studies dengan protagonist, conflict, data embedded
- [ ] TAM voice calibration: 7 karakter tone checked
- [ ] Paragraph-level audit: setiap paragraph punya 1 idea, topic sentence, data konkret
- [ ] Readability target: Exec Summary/Background/Recommendation/Conclusion = Grade 10-12
- [ ] Question quality: no rhetorical kosong, no obvious answer, max 1-2 per section
- [ ] Command auto-check: CLEAN
- [ ] Re-run `/whitepaper-09-qc` dan hasil 0 FAIL, maksimal 3 WARNING

## Next

Lanjut ke `/whitepaper-11-publish`
