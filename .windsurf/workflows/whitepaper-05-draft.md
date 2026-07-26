---
description: Whitepaper step 05 - Menulis dokumen lengkap
---

# 05-draft

Menulis dokumen lengkap.

## Prev

Dari `/whitepaper-04-outline`

## Word Count (STANDAR TAM)

- Target: 3.000-10.000 kata (15-60 menit baca)
- Di bawah 3.000 kata = terlalu tipis, pertimbangkan jadi artikel (gunakan `/artikel-01-idea`)

## Markdown Rules

- Tidak ada raw HTML `<script>`, `<iframe>`, `<style>`
- Gunakan `![alt](url)` untuk gambar

## Punctuation

- Tidak pakai em dash atau en dash
- Maks 1 exclamation mark
- Tidak pakai ellipsis (...)

## Tone TAM

- Jujur, rasional, berani, tidak menggurui
- Human signature: minimal 1 paragraf pengalaman/observasi/opini spesifik
- Whitepaper boleh lebih formal dari artikel, tapi tidak boleh terdengar AI

## Writing Process Strategy (Flower & Hayes)

Writing = iterative problem-solving, bukan linear draft. Plan > translate > review > re-plan.

| Stage | Apa | TAM application |
|-------|-----|-----------------|
| **Planning** | Generate ideas, organize, goal setting | Outline dari 04, tapi boleh evolve |
| **Translating** | Conceptual plan into text | Draft writing per section |
| **Reviewing** | Read text produced, evaluate, revise | Self-check: TAM tone? Claim proportionate to evidence? |
| **Monitoring** | Metacognitive check | "Apakah ini masih aligned dengan thesis? Apakah cognitive load OK?" |

Key principles:
- **Recursive, bukan linear:** Bisa balik ke planning saat writing. Goals evolve.
- **Expert writers modify goals during writing:** Jangan terlalu committed to initial outline. Jika data membawa arah baru, ikuti.
- **Hayes 2012:** Composing on 3 levels: Resource (attention, working memory), Process (evaluation, reflection, text production), Context (social/collaborative)
- **Monitor check setiap section:** "Apakah claim masih proportionate to evidence? Apakah ini masih TAM tone?"

## Hedging Language Guide

Over-claiming damages credibility. Gunakan hedging proportionate to evidence strength:

| Evidence strength | Hedging language | Contoh |
|-------------------|-----------------|--------|
| **Strong** (multiple RCT, meta-analysis) | "menunjukkan", "membuktikan" | "Data menunjukkan 74% lulusan menganggur" |
| **Moderate** (single study, correlational) | "mengindikasikan", "cenderung" | "Studi ini mengindikasikan korelasi" |
| **Weak** (anecdotal, single source) | "kemungkinan", "berkaitan dengan" | "Kemungkinan ada hubungan antara" |
| **Speculative** (extrapolation) | "dapat diasumsikan", "mungkin" | "Dapat diasumsikan bahwa" |

Bayesian honesty: posterior proportionate to evidence strength. Jangan over-claim untuk effect kecil.

## Plain Language Mandate

Whitepaper TAM = accessible untuk professionals, bukan hanya akademisi.

| Section | Readability target | Rule |
|---------|-------------------|------|
| Executive Summary | Grade 9-10 | Accessible, short sentences, define jargon |
| Background | Grade 10-11 | Context building, familiar references |
| Analysis | Grade 11-12 | Informed but tidak akademis. Define jargon on first use |
| Methodology | Grade 11-12 | Technical but clear. "Nerd box" untuk detail |
| Recommendation | Grade 9-10 | Actionable, numbered, specific |
| Conclusion | Grade 9-10 | Restate + implication, emotional close |

Define jargon on first use. Short sentences untuk key claims. Jangan pakai passive voice untuk argument utama.

## Whitepaper Struktur Template (per section)

```
## Executive Summary (200-300 kata)
[Front-loaded thesis paragraph: "Thesis. Kenapa penting. Implikasi."]
[Hook data + konteks + key finding + rekomendasi + CTA]

## Background (500-1.000 kata)
### [Status quo]
### [Kenapa penting]
### [Metodologi singkat]

## Methodology (jika ada original research, 300-500 kata)
### Data Sources
### Analysis Framework
### Scope dan Limitations

## Analysis (1.500-6.000 kata, section terbesar)
### [Supporting Argument 1]
### [Supporting Argument 2]
### [Supporting Argument 3]
### [Counter-arguments dan Rebuttal]
### [Cross-analysis / Synthesis]

## Recommendation (500-1.500 kata)
### [Untuk individu]
### [Untuk organisasi]
### [Untuk pembuat kebijakan, jika relevan]

## Conclusion (300-500 kata)
[Restate thesis + implikasi + human signature + closing specific]

## Limitations (200-400 kata)
### Data gaps
### Methodological limitations
### Generalizability
### Confounders

## FAQ (opsional, jika ada pertanyaan umum)
```

## Front-Loaded Thesis Paragraph (wajib)

Paragraf pertama Executive Summary = front-loaded thesis. Bukan hook dulu, thesis dulu.

Format: "[Thesis]. [Kenapa penting]. [Implikasi]."

Contoh: "Sistem pendidikan Indonesia sedang mencetak pengangguran terdidik dalam skala industri. Data BPS 2025 menunjukkan 74% lulusan kuliah menganggur. Kalau tidak diubah dalam 5 tahun, kita akan punya generasi dengan ijazah tapi tanpa masa depan."

AI engines lift this first. Reader yang berhenti di sini harus bisa repeat argument TAM ke orang lain.

## Citable Passage Design saat Menulis

Setiap section harus punya minimal 1 self-contained extractable claim:

| Principle | Application |
|-----------|-------------|
| **Self-contained** | Paragraph bisa di-copy tanpa context dan masih make sense |
| **Data in narasi** | Angka di text, bukan hanya di tabel/chart (AI extract dari text) |
| **Statistical formatting** | "74% (BPS, 2025)" bukan hanya "mayoritas" |
| **Conclusion-first** | Kalimat pertama = claim, kalimat berikutnya = evidence |
| **No vague references** | "Data menunjukkan X" bukan "Seperti disebutkan di atas" |

Test: copy paragraph random, paste ke AI chat, apakah AI bisa explain point-nya tanpa context whitepaper?

## Cognitive Load Management saat Menulis

| Technique | Application |
|-----------|-------------|
| **1 idea per paragraph** | Jangan stack multiple claims dalam 1 paragraph |
| **Short sentences untuk key claims** | Max 25 kata untuk claim utama |
| **Bold key findings** | Reader skim bisa dapat insight tanpa baca full |
| **Section breaks** | Visual breathing room setiap 300-500 kata |
| **Progressive disclosure** | Simple dulu, detail kemudian. Jangan front-load semua complexity |
| **Familiar anchors** | Mulai section dengan something reader sudah tahu, lalu introduce new |

## Data Journalism "Nerd Box" di Methodology

Jika whitepaper punya original data, Methodology section harus include "nerd box":

```markdown
## Methodology

### Data Sources
[Daftar sumber: BPS Sakernas 2024, OJK Survey 2024, TAM Survey n=500]

### Analysis Framework
[Method: descriptive statistics, trend analysis, regression. Software: Python/R.]

### Data Cleaning
[Steps: remove missing values, outlier detection, normalization]

### Reproducibility
[Data sources traceable (URL + akses tanggal). Analysis code available di [repo/appendix]. Work log documented.]

### Scope dan Limitations
[Sample bias, temporal limitation, generalizability constraints]
```

Open data practice: publish data sources, code, methods. Enable readers to verify. Reproducibility = TAM credibility (E-E-A-T).

## Meta-Analytic Evidence Presentation saat Menulis

Jika whitepaper reviews multiple studies/sources:

| Element | How to present |
|---------|---------------|
| **Effect size** | "Cohen's d = 0.45 (moderate effect)" bukan hanya "significant" |
| **Forest-plot thinking** | Tabel summary: study, effect size, CI, weight |
| **Heterogeneity** | "Studies menunjukkan variation (I-squared = 65%), kemungkinan karena perbedaan metodologi" |
| **Publication bias** | "Literature mungkin biased toward significant results. Funnel plot asymmetry terdeteksi." |
| **Sensitivity analysis** | "Jika kita exclude source X, conclusion tetap hold / berubah" |

Jangan cherry-pick. Show range across sources. Acknowledge variation.

## Prospect Theory Framing saat Menulis

Frame "tamparan" sebagai loss (apa yang reader hilang) bukan gain (apa yang reader dapat):

| Framing | Contoh | TAM rule |
|---------|--------|----------|
| **Loss framing** | "Setiap hari kamu menunda, kamu kehilangan X" | Accurate, bukan manipulative |
| **Gain framing** | "Jika kamu mulai sekarang, kamu dapat X" | OK untuk recommendations |
| **Reference point** | "Dibanding tahun lalu, kamu sudah kehilangan..." | Outcomes relative to current state |

Loss aversion: loss ~2x lebih impactful dari gain. Tapi TAM jujur: gunakan framing yang accurate, bukan fear-mongering.

## Nudge Theory di Recommendations

Recommendations = nudge, bukan mandate. "Kamu bebas pilih, tapi ini kenyataan."

| Principle | Application |
|-----------|-------------|
| **Options + consequences** | "Opsi A: [consequence]. Opsi B: [consequence]." |
| **No mandate** | TAM tidak menggurui. Present data, biarkan reader decide |
| **Default awareness** | "Banyak orang default ke [X] tanpa sadar. Ini kenyataan:" |
| **Choice architecture** | Present options dengan clear trade-offs, bukan hidden |

## Narrative Transportation di Case Studies

Case studies dengan story arc = lebih persuasif dari dry report:

| Element | Application |
|---------|-------------|
| **Protagonist** | Orang/organisasi konkret yang reader bisa identify |
| **Conflict** | Masalah yang protagonist hadapi (relevant ke thesis) |
| **Resolution** | Outcome (bukan always happy ending, TAM honest) |
| **Data embedded** | Story includes data, bukan just anecdote |

TAM tetap fact-based: transportation via structure, bukan fabrication. Setiap case study harus punya data yang bisa ditrace.

## Barthes Demystification Technique

Decode "natural truth" yang sebenarnya cultural construct:

| Step | Application |
|------|-------------|
| **Identify myth** | "Kerja keras = sukses" (myth disguised as natural truth) |
| **Show denotation** | Literal meaning: "bekerja keras menghasilkan kesuksesan" |
| **Show connotation** | Cultural meaning: "jika kamu tidak sukses, kamu tidak cukup keras" |
| **Deconstruct** | Show ideology behind myth: siapa yang benefit dari narrative ini? |
| **TAM angle** | "Kerja keras perlu, tapi tidak cukup. Capital, struktur, dan keberuntungan juga berperan." |

## Executive Summary Template (200-300 kata)

```markdown
## Executive Summary

[Data paling striking, 1 kalimat]. [Konteks masalah, 2-3 kalimat].

Analisis ini menemukan bahwa [key finding 1], [key finding 2], dan [key finding 3]. [Implikasi singkat].

Rekomendasi utama: [1 kalimat rekomendasi paling penting].

Baca selengkapnya untuk data lengkap, analisis, dan rekomendasi actionable.
```

## Recommendation Template (500-1.500 kata)

```markdown
## Recommendation

### Untuk Individu
1. [Action specific, bukan vague advice]
2. [Action specific]
3. [Action specific]

### Untuk Organisasi/Perusahaan
1. [Action specific]
2. [Action specific]

### Untuk Pembuat Kebijakan (jika relevan)
1. [Policy recommendation specific]
2. [Policy recommendation specific]
```

Setiap rekomendasi harus:
- **Actionable:** bisa dilakukan, bukan wishful thinking
- **Specific:** tidak "tingkatkan kesadaran" tapi "sisipkan modul literasi keuangan di kurikulum SMA"
- **Data-backed:** ada hubungan ke data di Analysis section

## Source Integration di Body Text

| Pola | Contoh |
|------|--------|
| Data + sumber langsung | "Data BPS 2025 menunjukkan 74% lulusan menganggur." |
| Atribusi di awal | "Menurut laporan OJK 2024, 78% freelancer tidak punya BPJS." |
| Atribusi di akhir | "...demikian hasil survei Jakpat terhadap 12.000 responden." |
| Kutipan langsung | "Kita tidak bisa terus menyalahkan generasi," kata Ketua OJK. |
| Data dari sumber sekunder | "Dilansir dari Katadata, data BPS menunjukkan..." |

Setiap angka di body HARUS punya sumber yang bisa ditrace.

## Citation Format Whitepaper (lebih formal dari artikel)

Whitepaper boleh pakai citation yang lebih formal:

| Format | Kapan dipakai | Contoh |
|--------|---------------|--------|
| **Inline** | Data umum, tidak perlu trace detail | "Data BPS 2025 menunjukkan..." |
| **Parenthetical** | Data spesifik perlu trace | "...tingkat pengangguran 74% (BPS, 2025)." |
| **Footnote-style** | Data kritis, perlu verifikasi | "Laporan OJK 2024 mencatat 78% freelancer tanpa BPJS[^1]." |
| **Direct quote** | Kutipan ahli/pejabat | "Menurut [Nama], '[kutipan]'" |

Tidak perlu bibliography formal, tapi setiap angka harus bisa ditrace ke sumber.

## Data Presentation Guidance

| Data type | Format | Kapan dipakai |
|-----------|--------|---------------|
| Single number | Narasi | "74% lulusan menganggur" |
| Comparison 2-3 items | Tabel | Freelancer vs karyawan tetap |
| Trend temporal | Line chart | 2020-2025 trend |
| Distribution | Bar chart | Per kategori/segment |
| Proportion | Pie chart (max 5 slice) | Komposisi |
| Relationship | Scatter plot | Korelasi 2 variabel |

Aturan:
- Setiap chart/tabel harus punya: title, source citation, label axis/legend
- Max 1 chart/tabel per 500 kata (jangan over-visual)
- Data di chart HARUS juga disebut di narasi (untai AI SEO)

## Tags Assignment

- Jumlah: 3-7 tags
- Format: kebab-case, Bahasa Indonesia
- Sumber: dari keyword research (02-research) + topic keywords
- Contoh: `["riset", "gen-z", "karier", "freelance", "bpjs"]`
- Tidak pakai brand tag, otomatis ditambahkan oleh sistem

## Draft Quality Gates (per section sebelum lanjut)

Setiap section harus pass 3 gates sebelum dianggap selesai:

| Gate | Check | Jika gagal |
|------|-------|-----------|
| **G1: Structure** | Heading = conclusion-first? Topic sentence = claim? | Rewrite heading dan opening |
| **G2: Evidence** | Setiap claim punya data? Data traceable? | Tambah evidence atau hapus claim |
| **G3: Tone** | TAM tone? No AI pattern? Human signature ada? | Re-humanize section |

Jika 1 gate gagal: fix section sebelum lanjut ke section berikutnya. Jangan stack unfinished sections.

## Section-by-Section Writing Protocol

Urutan writing yang optimal untuk whitepaper TAM:

| Order | Section | Kenapa urutan ini |
|-------|---------|------------------|
| **1** | Analysis (semua arguments) | Inti whitepaper. Semua bergantung pada ini. |
| **2** | Counter-arguments + Rebuttal | Setelah arguments jelas, counter lebih mudah di-steel-man |
| **3** | Synthesis/Cross-analysis | Setelah semua arguments + counter, pola muncul |
| **4** | Executive Summary | Summary dari body yang sudah jadi, bukan outline |
| **5** | Background | Setelah Analysis jelas, Background bisa di-trim agar relevan |
| **6** | Recommendation | Berdasarkan findings dari Analysis |
| **7** | Conclusion | Reflective close setelah semua selesai |
| **8** | Limitations | Setelah semua section, limitations lebih jelas |
| **9** | Methodology | Hanya jika original research, detail teknis |
| **10** | FAQ | Dari pertanyaan yang muncul saat writing |

**Jangan tulis linear (Exec Summary > Background > Analysis).** Exec Summary ditulis terakhir dari body, bukan pertama dari outline.

## Evidence-Claim Mapping Table

Sebelum writing, buat mapping table:

| Claim | Evidence | Source | Hedging | Toulmin |
|-------|----------|--------|---------|---------|
| "74% lulusan menganggur" | BPS Sakernas 2024 | BPS (A+) | Strong: "menunjukkan" | Claim + Ground + Backing |
| "Gig economy exploit pekerja" | OJK Survey 2024, n=2.000 | OJK (A+) | Moderate: "mengindikasikan" | Claim + Ground + Warrant |
| "Kerja keras tidak menjamin sukses" | Multi-study review | Various (A-A+) | Moderate: "cenderung" | Claim + Ground + Warrant + Backing |

Setiap claim di body HARUS ada di mapping table. Jika claim tidak ada di table: tambah atau hapus.

## Paragraph Construction Rules

Setiap paragraph di whitepaper mengikuti aturan:

| Rule | Cara | Kenapa |
|------|------|-------|
| **1 idea per paragraph** | 1 topic sentence + 2-5 supporting sentences | Cognitive load |
| **Topic sentence first** | Kalimat pertama = claim/conclusion. Berikutnya = evidence | Pyramid Principle |
| **Max 150 words** | Jika > 150, split | Cognitive load |
| **Data in paragraph** | Minimal 1 data point atau concrete example per paragraph | Credibility |
| **No orphan paragraphs** | 1-sentence paragraph hanya untuk emphasis, max 1 per 500 kata | Rhythm |
| **Transition logis** | Paragraph terakhir lead ke paragraph berikutnya | Flow |
| **No paragraph tanpa purpose** | Setiap paragraph harus advance argument | Density |

## Data Integration Standards

Cara integrate data ke narasi:

| Standard | Cara | Contoh |
|----------|------|--------|
| **Inline attribution** | Source di kalimat yang sama dengan data | "Data BPS 2025 menunjukkan 74% lulusan menganggur." |
| **Context framing** | Data tidak berdiri sendiri, ada context | "74% lulusan menganggur, naik dari 65% tahun sebelumnya." |
| **Interpretation** | Data + apa artinya | "74% berarti 3 dari 4 lulusan tidak punya kerja." |
| **Comparison** | Data dibandingkan dengan something | "74% vs 26% yang employed. Gap ini tertinggi dalam 10 tahun." |
| **Trend direction** | Arah perubahan disebut | "Naik dari 65% ke 74% dalam 2 tahun." |
| **Sample size** | Jika < 1.000, sebutkan n | "Survei Jakpat (n=500) menemukan..." |
| **Limitation inline** | Jika data punya caveat, sebut | "Data ini hanya mencakup lulusan S1, tidak termasuk diploma." |

Jangan: data tanpa context, data tanpa source, data tanpa interpretasi.

## Counter-Argument Writing Protocol

Cara menulis counter-argument yang berkualitas:

| Step | Cara | Contoh |
|------|------|--------|
| **1: Steel-man** | Presentasi counter-argument versi terkuat | "Kritik akan mengatakan: gig economy memberi fleksibilitas yang pekerja tradisional tidak punya." |
| **2: Acknowledge** | Akui apa yang valid dari counter-argument | "Benar, fleksibilitas ini nyata. Sebagian pekerja memilih gig economy karena alasan ini." |
| **3: Data rebuttal** | Rebuttal dengan data, bukan opini | "Tapi data OJK menunjukkan 78% tidak punya BPJS. Fleksibilitas tanpa proteksi = precaritas." |
| **4: Nuance** | Akui uncertainty jika ada | "Fleksibilitas bermanfaat untuk sebagian. Tapi untuk mayoritas, trade-off tidak sepadan." |
| **5: TAM close** | Tutup dengan TAM angle | "Pertanyaannya bukan fleksibilitas vs keamanan. Pertanyaannya: kenapa kita harus pilih salah satu?" |

Jangan: strawman, dismiss tanpa data, "tapi itu salah" tanpa evidence.

## Recommendation Writing Protocol

Setiap rekomendasi harus mengikuti struktur:

```
### [Rekomendasi N: untuk siapa]

**Apa:** [Action specific, 1 kalimat]

**Kenapa:** [Hubungan ke data di Analysis, 1-2 kalimat]

**Cara:** [2-3 langkah konkret, numbered]

**Trade-off:** [Apa yang reader korbankan, 1 kalimat]
```

Contoh:
```
### 1. Untuk Individu: Audit Finansial Tahunan

**Apa:** Lakukan audit finansial pribadi setiap tahun.

**Kenapa:** Data OJK menunjukkan 78% freelancer tidak punya BPJS. Tanpa audit, blind spot finansial tidak terlihat sampai terlambat.

**Cara:**
1. Catat semua pemasukan dan pengeluaran bulanan selama 3 bulan
2. Hitung rasio tabungan, utang, dan darurat
3. Identifikasi gap: BPJS, asuransi, dana darurat

**Trade-off:** Waktu 2-3 jam per tahun. Kebocoran finansial bisa jauh lebih mahal.
```

Tidak boleh: "tingkatkan kesadaran", "perkuat mindset", "fokus pada growth". Harus specific dan actionable.

## Self-Review Checklist per Section

Setelah selesai writing setiap section, self-review:

| Question | Jika "tidak" |
|----------|-------------|
| Apakah section ini advance thesis? | Hapus atau revisi |
| Apakah setiap claim punya evidence? | Tambah evidence atau hapus claim |
| Apakah hedging proportionate? | Adjust hedging language |
| Apakah ada jargon yang belum diterjemahkan? | Tambah terjemahan |
| Apakah paragraph > 150 kata? | Split |
| Apakah ada transisi robotik? | Hapus atau rewrite |
| Apakah ada AI pattern? | Fix di humanizer step |
| Apakah ada human signature? | Tambah jika belum |
| Apakah conclusion-first? | Rewrite opening |
| Apakah section ini bisa di-skim? | Tambah bold + pull quote |

## Draft Completion Score (0-15)

Sebelum simpan ke JSON, score draft:

| Factor | Weight | 0 | 1 | 2 |
|--------|--------|---|---|---|
| **Word count** | 1 | < 3.000 | 3.000-5.000 | 5.000-10.000 |
| **Section completeness** | 2 | < 4 sections | 4-5 sections | 6+ sections |
| **Evidence density** | 2 | < 5 data points | 5-15 data points | 15+ data points |
| **Citation count** | 1 | < 5 | 5-10 | 10+ |
| **Human signature** | 1 | 0 | 1 | 2+ |
| **Counter-argument** | 1 | None | Strawman | Steel-manned |
| **Limitations** | 1 | None | Generic | 4 komponen |
| **Recommendation specificity** | 2 | Vague | Sebagian specific | All specific + actionable |
| **Front-loaded thesis** | 1 | No | Yes tapi weak | Yes + data |
| **Internal links** | 1 | < 3 | 3-5 | 5+ |
| **FAQ** | 0.5 | No | - | Yes |
| **Pull quotes** | 1 | 0 | 1-3 | 4+ |

Target: minimal 11. Jika < 11, revisi sebelum simpan.

## Simpan draft ke `$ARTICLE_JSON`

```bash
export ARTICLE_JSON="/tmp/tam-article.json"
```

```json
{
  "title": "Judul Whitepaper",
  "slug": "slug-whitepaper-kebab-case",
  "subtitle": "Subtitle whitepaper (opsional)",
  "summary": "Summary untuk SEO dan card display (max 300 karakter)",
  "body": "## Section 1\n\nKonten...\n\n## Section 2\n\nKonten...",
  "author": "TAMPARAN ANAK MUDA",
  "download_url": null,
  "reading_time": 15,
  "tags": ["riset", "gen z", "data"],
  "status": "published",
  "published_at": "2026-01-01T00:00:00.000Z"
}
```

## Checklist

- [ ] Dokumen lengkap ditulis
- [ ] Word count: 3.000-10.000 kata
- [ ] Heading: h2/h3 only, min 5 h2, tidak ada h1
- [ ] Front-loaded thesis paragraph (paragraf pertama Executive Summary)
- [ ] Citable passage design: minimal 1 self-contained extractable claim per section
- [ ] Cognitive load management: 1 idea per paragraph, short sentences untuk key claims
- [ ] Hedging language: proportionate to evidence strength (Bayesian honesty)
- [ ] Plain language: readability target per section (Grade 9-12)
- [ ] Writing process: iterative, recursive, monitor check setiap section (Flower & Hayes)
- [ ] Data journalism "nerd box" di Methodology (jika ada original data)
- [ ] Meta-analytic evidence presentation (effect sizes, heterogeneity, sensitivity analysis)
- [ ] Prospect theory framing: loss framing untuk "tamparan", accurate not manipulative
- [ ] Nudge theory di recommendations: options + consequences, no mandate
- [ ] Narrative transportation di case studies: protagonist, conflict, resolution, data embedded
- [ ] Barthes demystification: decode myth, show cultural construct sebagai construct
- [ ] Limitations section: data gaps, methodological, generalizability, confounders
- [ ] Internal linking: min 3 link ke konten TAM
- [ ] JSON disimpan ke `$ARTICLE_JSON`
- [ ] Draft Quality Gates: G1 Structure, G2 Evidence, G3 Tone passed per section
- [ ] Section-by-Section Writing Protocol: Analysis first, Exec Summary setelah body
- [ ] Evidence-Claim Mapping Table: setiap claim ada di table
- [ ] Paragraph Construction: 1 idea, topic sentence first, max 150 words, data per paragraph
- [ ] Data Integration Standards: inline attribution, context, interpretation, comparison, trend
- [ ] Counter-Argument Writing Protocol: steel-man, acknowledge, data rebuttal, nuance, TAM close
- [ ] Recommendation Writing Protocol: Apa, Kenapa, Cara, Trade-off per rekomendasi
- [ ] Self-Review per Section: 10 questions answered
- [ ] Draft Completion Score: > 11 (dari 15)

## Next

Lanjut ke `/whitepaper-06-review`
