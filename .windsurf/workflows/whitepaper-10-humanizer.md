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

Setiap jargon teknis harus diterjemahkan untuk pembaca muda. Pembaca TAM = 18-35 tahun, smart tapi nggak mau baca jurnal.

| Jargon | Terjemahan TAM | Kapan pakai jargon asli |
|--------|---------------|----------------------|
| **Precaritas** | "Kerja yang nggak aman, nggak menentu, nggak berjaminan" | Hanya jika sudah dijelaskan sebelumnya |
| **Gig economy** | "Ekonomi platform, kerja lepas berbasis aplikasi" | Boleh jika konteks sudah clear |
| **Moral hazard** | "Situasi saat orang terlindungi dari risiko, jadi mereka ambil risiko lebih besar" | Jelaskan di kurung setelah first use |
| **Selection bias** | "Data cuma dari kelompok tertentu, nggak mewakili semua orang" | Hanya di Methodology section |
| **Confounding variable** | "Faktor lain yang pengaruhi hasil tapi nggak diukur" | Hanya di Methodology section |
| **Effect size** | "Seberapa besar perbedaannya, bukan cuma apakah ada perbedaan" | Boleh dengan konteks |
| **Korelasi signifikan** | "Hubungan yang bukan kebetulan" | Boleh setelah dijelaskan |
| **Regresi OLS** | "Cari tahu faktor apa yang paling pengaruhi sesuatu" | Hanya di nerd box |
| **Difference-in-Differences** | "Bandingkan sebelum dan sesudah, dengan kelompok pembanding" | Hanya di nerd box |
| **Power analysis** | "Hitung berapa minimal orang yang harus disurvei biar hasil valid" | Hanya di Methodology |
| **Cohen's d** | "Ukuran seberapa besar perbedaan antara 2 kelompok" | Hanya di nerd box |
| **p-value** | "Kemungkinan hasil ini cuma kebetulan" | Boleh dengan konteks singkat |
| **Confidence interval** | "Rentang nilai yang paling mungkin benar" | Boleh dengan konteks |
| **Bayesian inference** | "Update keyakinan berdasarkan evidence baru" | Hanya jika relevan dan dijelaskan |
| **Triangulasi** | "Cek dari 3 sumber berbeda, pastikan hasilnya konsisten" | Boleh setelah dijelaskan |
| **DAG (Directed Acyclic Graph)** | "Diagram yang nunjukin asumsi sebab-akibat" | Hanya di nerd box |
| **Robustness check** | "Tes ulang hasil pakai cara berbeda, pastikan tetap sama" | Hanya di nerd box |
| **Pre-registration** | "Daftarin rencana riset sebelum mulai, biar nggak ngakalin hasil" | Hanya di Methodology |
| **HARKing** | "Pura-pura hipotesis sudah ada dari awal, padahal dibuat setelah lihat hasil" | Jelaskan dengan contoh |
| **GRADE certainty** | "Tingkat keyakinan kita terhadap evidence (tinggi/sedang/rendah/sangat rendah)" | Boleh dengan konteks |

Aturan: first use = jargon + terjemahan dalam kurung. Use berikutnya = jargon saja. Nerd box = boleh full jargon. Narasi utama = minimal jargon, maksimal terjemahan.

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
| **Executive Summary** | Kelompok 9-10 (SMP-SMA) | Decision maker baca ini dulu. Harus accessible. |
| **Background** | Kelompok 10-11 (SMA) | Set context untuk pembaca muda. |
| **Analysis** | Kelompok 11-12 (SMA-S1) | Boleh lebih detail, tapi jargon wajib terjemahin. |
| **Methodology** | Kelompok 12+ (S1) | Boleh teknis. Nerd box untuk detail berat. |
| **Recommendation** | Kelompok 9-10 (SMP-SMA) | Actionable, bahasa sehari-hari. |
| **Conclusion** | Kelompok 9-10 (SMP-SMA) | Summary harus accessible, closing yang ngena. |
| **Limitations** | Kelompok 10-11 (SMA) | Jujur tentang kelemahan, bahasa simpel. |

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

## Section Hook/Foreshadow/Bridge Formula Preservation Rules

Saat humanizing, WAJIB jaga integritas formula yang sudah diimplementasi:

- **Jangan break Executive Hook formula:** Executive Hook dari step 01 harus tetap utuh di title dan Executive Summary opening. Boleh perbaiki bahasa, tapi pattern tidak boleh berubah.
- **Jangan break Section Hook formula:** Section Hook per section boleh di-humanize, tapi formula pattern harus tetap utuh. Contoh: jika Hook formula #3 (Data Counter-Intuitive), jangan ganti jadi generic hook.
- **Jangan break Section Foreshadow formula:** Foreshadow tease per section boleh di-natural-kan, tapi tease element harus tetap ada. Jangan hapus foreshadow karena "terlalu dramatis".
- **Jangan break Bridge formula:** Bridge antar section boleh di-perbaiki flow-nya, tapi connection antar section harus tetap ada. Jangan hapus Bridge dan ganti dengan generic transition.
- **Jangan ubah thumbnail text (og_headline):** og_headline sudah dirancang sebagai visual hook. Boleh perbaiki bahasa jika AI pattern terdeteksi, tapi tetap berbeda dari title dan max 50 char.
- **Jangan ubah thumbnail caption (excerpt):** Excerpt sudah dirancang sebagai visual foreshadow. Boleh perbaiki flow, tapi tetap max 160 char dan function sebagai tease.
- **Jangan ubah meta description:** Meta description sudah dirancang dengan Hook + Foreshadow element. Boleh perbaiki bahasa, tapi struktur Hook + Value + Foreshadow harus tetap.
- **Formula audit setelah humanize:** Setelah humanizer selesai, re-check bahwa semua formula (Executive Hook, Section Hook, Section Foreshadow, Bridge) masih utuh. Jika formula rusak, fix sebelum re-run QC.

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
- [ ] Lapis 3: Jargon translation (first use = jargon + terjemahan, narasi utama minimal jargon)
- [ ] Bahasa sederhana: "kamu" bukan "pembaca", kalimat pendek untuk claim utama (max 25 kata)
- [ ] Nerd box dipakai untuk detail teknis (regresi, p-value, effect size, DAG, dll)
- [ ] Narasi utama bebas dari bahasa akademik (cek tabel konversi di 05-draft)
- [ ] Angka dikasih artinya dalam bahasa sehari-hari ("74% = 3 dari 4 lulusan nganggur")
- [ ] Konkret 60% / abstrak 40%: mayoritas kalimat ada angka, contoh, atau nama spesifik
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
- [ ] Executive Hook formula masih utuh setelah humanizing
- [ ] Title tidak mengandung AI tells: no formal words ("Tidak" -> "Nggak"), no positive superlatives ("terbaik", "hebat"), no "kita/kami", no fear words, ada active verb, max 10 kata, still punchy berdasar 20 prinsip riset, no "Krisis X Indonesia:" default pattern
- [ ] Section Hook formula masih utuh per section setelah humanizing
- [ ] Section Foreshadow formula masih utuh per section setelah humanizing
- [ ] Bridge formula masih utuh antar section setelah humanizing
- [ ] Thumbnail text (og_headline) tetap berbeda dari title, max 50 char
- [ ] Thumbnail caption (excerpt) tetap max 160 char, function sebagai tease
- [ ] Meta description tetap mengandung Hook + Foreshadow element, max 160 char
- [ ] Re-run `/whitepaper-09-qc` dan hasil 0 FAIL, maksimal 3 WARNING

## Next

Lanjut ke `/whitepaper-11-publish`
