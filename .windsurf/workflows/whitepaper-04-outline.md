---
description: Whitepaper step 04 - Outline: Executive Summary, Background, Analysis, Recommendation, Conclusion
---

# 04-outline

Executive Summary, Background, Analysis, Recommendation, Conclusion.

## Prev

Dari `/whitepaper-03-strategy`

## Pyramid Principle in Outline (wajib)

Outline harus mengikuti Pyramid Principle dari 03-strategy:

1. **Governing thought** = Executive Summary (page 1, front-loaded thesis)
2. **Supporting arguments** = Analysis sections (3-5, MECE)
3. **Evidence base** = Data + sources per argument

SCQA pembuka di Executive Summary:
- **Situation:** Konteks yang reader sudah setuju (status quo)
- **Complication:** Apa yang berubah/ salah (anomaly, data counter-intuitive)
- **Question:** Pertanyaan yang muncul dari complication
- **Answer:** Thesis (governing thought)

## Layered Reading Design in Outline

Setiap section di outline harus ditandai untuk layer mana:

| Layer | Section yang serve | Design requirement di outline |
|-------|-------------------|-------------------------------|
| **Skim (5 min)** | Executive Summary, bolded key findings, charts, pull quotes, Conclusion | Key insights accessible tanpa baca body |
| **Strategic (20-30 min)** | Section headings + first paragraph per section + charts + Recommendations | Conclusion-first opening per section |
| **Deep (1-2 hours)** | Full read + Methodology + Limitations + references | Detail tersedia untuk verify |

Test: apakah 80% value bisa didapat dari Layer 1 saja? Jika tidak, restructure outline.

## Heading Structure (CRITICAL untuk Table of Contents)

- `##` (h2) untuk section utama, `###` (h3) untuk sub-section
- JANGAN gunakan `#` (h1) di body
- Minimal 5 heading h2 untuk TOC berfungsi (whitepaper lebih panjang)

## Detail Struktur Per Section

### 1. Executive Summary (200-300 kata)

```
## Executive Summary

[1 kalimat hook: data paling striking]
[2-3 kalimat konteks masalah]
[1-2 kalimat key finding dari analysis]
[1-2 kalimat rekomendasi utama]
[1 kalimat CTA: "Baca selengkapnya..."]
```

### 2. Background/Konteks (500-1.000 kata)

```
## Background

### [Sub-konteks 1: status quo]
[Apa yang terjadi sekarang, data kontekstual]

### [Sub-konteks 2: kenapa ini penting]
[Kenapa pembaca harus peduli, urgency]

### [Sub-konteks 3: metodologi singkat]
[Bagaimana data dikumpulkan dan dianalisis, dari step 03]
```

### 3. Analysis (1.500-6.000 kata, section terbesar)

```
## Analysis

### [Supporting Argument 1]
[Data + interpretasi + TAM angle]

### [Supporting Argument 2]
[Data + interpretasi + TAM angle]

### [Supporting Argument 3]
[Data + interpretasi + TAM angle]

### [Counter-arguments dan Rebuttal]
[Bantahan argumen lawan dengan data]

### [Cross-analysis / Synthesis]
[Hubungan antar argument, pattern yang muncul]
```

#### Toulmin Argument Layout per Section

Setiap supporting argument di outline harus punya 6 komponen Toulmin:

| Komponen | Apa | Di outline |
|----------|-----|------------|
| **Claim** | What you argue | Section heading = claim |
| **Ground** | Evidence | Data source dari 02-research |
| **Warrant** | Logic bridge | "Karena [logic], maka evidence mendukung claim" |
| **Backing** | Authority | Expert credential, institutional source |
| **Qualifier** | Degree of certainty | "menunjukkan", "kemungkinan", "cenderung" |
| **Rebuttal** | Conditions where claim tidak hold | Counter-argument untuk section ini |

#### Citable Passage Design per Section

Setiap section di outline harus ditandai: passage mana yang self-contained extractable untuk AI/RAG. Test: jika AI copy paragraph ini tanpa context, apakah masih make sense?

#### Cognitive Load per Section

| Section | Target load | Design |
|---------|------------|--------|
| Executive Summary | Low | 1 idea per paragraph, short sentences |
| Background | Medium | Context building, familiar references |
| Analysis (per argument) | High | Data dense, tapi 1 claim per section |
| Counter-arguments | Medium | Steel-man, clear structure |
| Recommendation | Low-Medium | Actionable, numbered, specific |
| Conclusion | Low | Restate + implication, emotional close |

### 4. Recommendation (500-1.500 kata)

```
## Recommendation

### [Rekomendasi 1: untuk individu]
[Actionable, specific, numbered steps]

### [Rekomendasi 2: untuk organisasi/perusahaan]
[Actionable, specific]

### [Rekomendasi 3: untuk pembuat kebijakan]
[Actionable, specific, jika relevan]
```

### 5. Conclusion (300-500 kata)

```
## Conclusion

[1 paragraf: restate thesis dengan data terkuat]
[1 paragraf: implikasi jangka panjang]
[1 paragraf: human signature, refleksi TAM]
[1 kalimat: tidak generic, tidak "masa depan cerah"]
```

### 6. Limitations (wajib, 200-400 kata)

```
## Limitations

### Data gaps
[Data apa yang tidak tersedia, kenapa]

### Methodological limitations
[Sample bias, temporal limitation, scope limitation]

### Generalizability
[Apa yang tidak bisa di-generalisasi dari finding]

### Confounders
[Confounding variables yang tidak dikontrol]
```

"Whitepaper tanpa limitations section = brochure dengan serif font."

## Bahasa Sederhana untuk Pembaca Muda (WAJIB DI OUTLINE)

Risetnya mendalam, tapi bahasanya sederhana. Outline harus sudah dirancang agar pembaca muda (18-35 tahun) ngerti. Ini bukan jurnal akademik. Ini tamparan yang bikin sadar.

### Aturan Bahasa di Outline

| Aturan | Cara | Contoh |
|--------|------|--------|
| **Bahasa sehari-hari** | Pakai kata yang orang muda pakai, bukan kata akademis | "Kamu" bukan "pembaca", "nggak" bukan "tidak" (di narasi non-formal) |
| **Jargon = terjemahin** | Setiap istilah teknis dikasih terjemahan sederhana di kurung | "Precaritas (kerja yang nggak aman, nggak menentu)" |
| **Kalimat pendek** | Max 25 kata per kalimat untuk claim utama | "74% lulusan kuliah nganggur. Itu data BPS 2025." |
| **Konkret > abstrak** | 60% kalimat konkret (ada angka, contoh, nama), 40% abstrak | "74% lulusan menganggur" bukan "tingkat pengangguran tinggi" |
| **Satu ide per paragraf** | Jangan campur banyak ide di 1 paragraf | 1 paragraf = 1 poin |
| **Mulai dari hal yang reader tahu** | New info connect ke hal yang familiar dulu | "Kamu pasti pernah dengar 'kerja keras = sukses'. Data bilang lain." |
| **Hindari kalimat pasif** | Pakai kalimat aktif, langsung | "Sistem mencetak pengangguran" bukan "pengangguran diciptakan oleh sistem" |
| **Data = cerita, bukan tabel** | Angka dikasih konteks dan artinya | "74% berarti 3 dari 4 lulusan nggak punya kerja" |

### Template Penerjemahan Riset → Bahasa Sederhana

| Riset akademik (input) | Bahasa TAM (output) |
|------------------------|---------------------|
| "Terdapat korelasi positif yang signifikan antara tingkat pendidikan dan pendapatan (r=0.45, p<0.001)" | "Makin tinggi sekolahmu, makin besar kemungkinan gajimu makin tinggi. Tapi hubungannya nggak sekuat yang kamu kira." |
| "Analisis regresi menunjukkan variabel pendidikan menjelaskan 20% varians pendapatan" | "Pendidikan cuma jelasin 20% kenapa gaji orang beda-beda. 80% sisanya? Faktor lain." |
| "Difference-in-Differences estimation menunjukkan efek kausal policy X terhadap Y" | "Saat kebijakan X diterapkan, Y berubah. Dan perubahannya bukan kebetulan." |
| "Survei dengan n=500 memiliki margin of error +/- 4.4% pada confidence level 95%" | "Survei ini cuma sampel 500 orang. Jadi angkanya bisa meleset +/- 4%. Tapi polanya tetap jelas." |
| "Hipotesis nol ditolak pada alpha 0.05" | "Kemungkinan hasil ini cuma kebetulan kurang dari 5%. Cukup kecil buat percaya." |

### Outline Wajib Tandai: Bagian Teknis vs Bagian Pembaca

Di outline, tandai section mana yang:

| Tanda | Artinya | Contoh |
|-------|---------|--------|
| `[TEKNIS]` | Detail metodologi, untuk Methodology section atau nerd box | "[TEKNIS] Power analysis: d=0.5, alpha=0.05, power=0.80, n=64/group" |
| `[PEMBACA]` | Narasi utama yang dibaca pembaca muda | "[PEMBACA] 3 dari 4 lulusan nggak punya kerja. Ini bukan masalah malas." |
| `[NERD BOX]` | Box terpisah untuk yang mau lihat detail teknis | "[NERD BOX] Regresi OLS: Y = β0 + β1X1 + β2X2 + ε, R²=0.34" |

Prinsip: **pembaca muda baca `[PEMBACA]`, peneliti baca `[TEKNIS]` + `[NERD BOX]`**. Keduanya dapat apa yang mereka butuh.

Section headings = scent markers. Reader decide stay/leave berdasarkan heading.

| Principle | Application di outline |
|-----------|----------------------|
| **Conclusion-first headings** | "74% Lulusan Menganggur: Sistem Pendidikan Gagal" bukan "Analisis Pengangguran" |
| **Bolded key findings** | Tandai data mana yang di-bold di outline |
| **Pull quotes** | Tandai quote mana yang di-pull (1 per 500 kata) |
| **Reward frequency** | Key insight setiap 200-300 kata, tandai di outline |

## Data Visualization Placement Plan

Petakan chart/tabel di outline sebelum writing:

| Section | Chart/tabel | Tipe | Data source | Placement |
|---------|------------|------|-------------|-----------|
| Background | [chart 1] | [line/bar/pie] | [source] | After paragraph 2 |
| Analysis Arg 1 | [tabel 1] | [comparison] | [source] | After data presentation |
| Analysis Arg 2 | [chart 2] | [trend] | [source] | Opening visual |
| Recommendation | [summary tabel] | [action items] | [derived] | Closing |

Max 1 chart/tabel per 500 kata. Conclusion-titled charts: judul = insight, bukan "Chart 1".

## Content Atomization Extraction Points

Tandai di outline: passage mana yang bisa di-extract untuk derivative content:

| Derivative | Source section | Extraction point |
|-----------|---------------|-----------------|
| Quote card 1 | Executive Summary | [data paling striking] |
| Quote card 2 | Analysis Arg 1 | [kontra-narasi claim] |
| Carousel | Recommendation | [3-5 key steps] |
| Thread | Analysis | [narrative arc] |
| Infographic | Data viz plan | [key chart] |
| Newsletter | Executive Summary | [summary version] |

Pre-production atomization: extraction points marked di outline, bukan cari setelah draft selesai.

## Front-Loaded Thesis Paragraph Placement

1 paragraph di page 1 = claim + why it matters. AI engines lift this first. Reader yang berhenti di sini harus bisa repeat argument.

Placement: paragraf pertama Executive Summary, sebelum hook data.

Format: "[Thesis]. [Kenapa penting]. [Implikasi]."

## Section Hook & Foreshadow Formula Integration (dari step 03)

Referensi formula yang sudah dipilih di step 03-strategy, rinciakan implementasi per section:

### Executive Hook (dari step 01)

- Executive Hook formula nomor [X] dipilih di step 01-idea
- Executive Hook = hook untuk whitepaper secara keseluruhan, ditempatkan di title, Executive Summary opening, dan thumbnail
- Pastikan Executive Hook konsisten dengan thesis dan governing thought

### Section Hook Formula (dari step 03, per section)

- Setiap section punya Section Hook (dipilih di step 03 dari 30 Hook formula)
- Section Hook = hook untuk section tersebut, ditempatkan di first paragraph section
- Hook progression: Executive Summary = Executive Hook, Analysis sections = data-driven hooks, Conclusion = synthesis hook

### Section Foreshadow Formula (dari step 03, per section)

- Setiap section punya Section Foreshadow (dipilih di step 03 dari 20 Foreshadow formula)
- Section Foreshadow = tease untuk section berikutnya, ditempatkan di last paragraph section
- Foreshadow progression: setiap section tease section berikutnya, Conclusion tease derivative content

### Bridge Formula (dari step 03, antar section)

- Bridge antar section dipilih di step 03 dari 5 Bridge formula
- Bridge = transition yang connect antar section, bukan generic transition
- Setiap transition antar section harus menggunakan Bridge formula yang dipilih

### Thumbnail Text, Thumbnail Caption & Meta Description (per whitepaper)

| Field | Rule | Formula |
|-------|------|---------|
| **Thumbnail text (og_headline)** | Max 50 char, berbeda dari title, function sebagai visual hook | Executive Hook formula |
| **Thumbnail caption (excerpt)** | Max 160 char, function sebagai visual foreshadow | Foreshadow formula |
| **Meta description (seo_meta_description)** | Max 160 char, mengandung Hook + Foreshadow element | Hook + Value + Foreshadow |

## Conclusion Formula (anti-generic, whitepaper versi)

```
[Restate thesis dengan data terkuat]. [Implikasi: apa artinya untuk pembaca].
[Human signature: refleksi/opini spesifik TAM]. [Closing: specific, tidak "masa depan cerah"].
```

Contoh baik: "Sistem pendidikan kita sedang mencetak pengangguran terdidik dalam skala industri. Kalau tidak diubah dalam 5 tahun, kita akan punya generasi dengan ijazah tapi tanpa masa depan. Gue melihat teman-teman yang lulus S1 akhirnya balik kerja di startup dengan gaji UMR, setara dengan lulusan SMA. Sesuatu perlu dirombak, bukan dioptimalkan."

Contoh buruk: "Masa depan pendidikan Indonesia yang cerah menanti kita. Mari bersama-sama membangun generasi yang lebih baik."

## Methodology Section (whitepaper-specific)

Jika whitepaper punya original research atau analisis khusus, tambahkan section methodology:

```
## Methodology

### Data Sources
[Daftar sumber data dari 02-research]

### Analysis Framework
[Bagaimana data dianalisis, dari 03-strategy]

### Scope dan Limitations
[Batasan analisis, apa yang tidak termasuk]
```

## Data Presentation Plan

Petakan data mana jadi apa di body:

| Data | Format | Alasan |
|------|--------|--------|
| BPS: 74% lulusan menganggur | Narasi + angka | Data tunggal, cukup di kalimat |
| OJK: 78% freelancer tanpa BPJS | Tabel perbandingan | Bandingkan dengan karyawan tetap |
| Jakpat: trend resign 2020-2025 | Line chart | Tren temporal, visual lebih impactful |
| We Are Social: media sosial usage | Bar chart | Perbandingan antar platform |

## SEO Metadata Plan

| Field | Value | Rule |
|-------|-------|------|
| `slug` | `slug-whitepaper-kebab-case` | Kebab-case, max 60 char, no stop words |
| `summary` | [max 300 karakter] | Hook + key finding + CTA implied |
| `tags` | 3-7 tags | Kebab-case, Bahasa Indonesia, dari keywords |

## Schema Markup Planning

Whitepaper menggunakan Article schema (bukan BlogPosting). Pastikan:
- `headline` = title
- `description` = summary
- `author` = TAMPARAN ANAK MUDA
- `datePublished` = publishedAt
- `wordCount` = estimasi

## AI SEO/AEO Considerations

- Setiap h2 harus bisa berdiri sendiri sebagai jawaban (AI sering cite per-section)
- Data angka di narasi (bukan hanya di tabel) agar AI bisa extract
- Summary di Executive Summary harus padat dan cite-able
- Sertakan FAQ section jika ada pertanyaan umum (AI suka FAQ)

## Internal Linking Plan

- Minimal 3 link ke artikel atau whitepaper TAM lain
- Format: `[judul](/artikel/slug-artikel)` atau `[judul](/whitepaper/slug-whitepaper)`
- Cek via `files/article-inventory.md`

## Outline Quality Score (0-20)

Score outline sebelum lanjut ke 05-draft. Target: minimal 14.

| Factor | Weight | 0 (missing) | 1 (weak) | 2 (strong) |
|--------|--------|-------------|----------|------------|
| **Pyramid structure** | 2 | No governing thought | Thesis ada tapi tidak front-loaded | SCQA + front-loaded thesis |
| **MECE arguments** | 2 | Arguments overlap | Sebagian MECE | Fully MECE, 3-5 arguments |
| **Toulmin per argument** | 2 | No Toulmin layout | Sebagian komponen | 6 komponen per argument |
| **Layered reading** | 1 | No layer marking | Sebagian ditandai | Semua section ditandai skim/strategic/deep |
| **Data sufficiency** | 2 | Arguments tanpa data plan | Sebagian ada data plan | Setiap argument punya data source + chart plan |
| **Counter-argument** | 1 | No counter-argument | Counter-argument ada tapi strawman | Steel-manned + rebuttal |
| **Limitations section** | 1 | No limitations | Limitations ada tapi generic | 4 komponen: data gaps, method, generalizability, confounders |
| **Atomization points** | 1 | No extraction points | Sebagiane ditandai | 5+ derivative extraction points marked |
| **Heading quality** | 1 | Generic headings | Sebagian conclusion-first | Semua conclusion-first |
| **Information foraging** | 1 | No scent markers | Sebagiane ada | Bold findings + pull quotes + reward frequency marked |
| **Hook formula** | 1 | No hook | Hook ada tapi lemah | Data-driven hook dipilih |
| **Conclusion formula** | 1 | Generic conclusion | Conclusion ada tapi vague | Anti-generic, specific, human signature |
| **SEO metadata** | 1 | No SEO plan | Sebagiane ada | Slug + summary + tags + schema |
| **Internal linking** | 1 | No linking plan | < 3 links planned | 3+ links dengan descriptive anchor |

Jika score < 14: revisi outline sebelum lanjut ke 05-draft.

## MECE Verification Protocol

Arguments harus Mutually Exclusive, Collectively Exhaustive. Cara verifikasi:

| Step | Pertanyaan | Pass criteria |
|------|------------|---------------|
| **1: Mutually Exclusive** | Apakah ada overlap antar argument? | Tidak ada data point yang masuk ke 2 argument |
| **2: Collectively Exhaustive** | Apakah semua aspek thesis tercover? | Tidak ada angle penting yang missing |
| **3: Independence test** | Apakah argument A bisa benar tanpa argument B? | Arguments tidak dependent satu sama lain |
| **4: Redundancy check** | Apakah ada argument yang pada dasarnya mengatakan hal sama? | Tidak ada semantic duplicate |

Jika MECE gagal: restructure arguments. Merge yang overlap, split yang terlalu broad, tambah yang missing.

## Section Weight Balance

Distribusi word count per section harus seimbang:

| Section | Target % | Target words (5.000 total) | Check |
|---------|----------|---------------------------|-------|
| **Executive Summary** | 5-8% | 250-400 | Tidak > 10% |
| **Background** | 10-15% | 500-750 | Tidak > 20% |
| **Methodology** | 5-10% | 250-500 | Boleh > 10% jika original research |
| **Analysis** | 40-60% | 2.000-3.000 | Harus section terbesar |
| **Recommendation** | 10-20% | 500-1.000 | Tidak < 10% |
| **Conclusion** | 5-10% | 250-500 | Tidak > 15% |
| **Limitations** | 5-8% | 250-400 | Tidak < 4% |
| **FAQ** | 2-5% | 100-250 | Opsional |

Jika Analysis < 40%: whitepaper terlalu tipis pada argument. Tambah depth.
Jika Background > 20%: terlalu banyak context, kurangi.
Jika Recommendation < 10%: rekomendasi terlalu tipis, perku.

## Argument Dependency Map

Petakan dependency antar argument sebelum writing:

```
Argument 1 (independent) ──> Argument 3 (depends on 1)
Argument 2 (independent) ──> Argument 3 (depends on 2)
Argument 3 ──> Synthesis (depends on 1+2+3)
Counter-argument ──> Rebuttal (depends on counter-argument)
```

Aturan:
- Arguments independent boleh dibaca dalam urutan apapun
- Arguments dependent harus dibaca setelah dependency-nya
- Synthesis/Cross-analysis harus di akhir Analysis, setelah semua arguments
- Counter-argument bisa di akhir Analysis atau setelah argument yang di-counter

Jika circular dependency: restructure arguments.

## Reader Journey Map

Petakan pengalaman kognitif + emosional reader melalui whitepaper:

| Section | Kognitif | Emosional | Design implication |
|---------|----------|-----------|-------------------|
| **Exec Summary** | "Apa intinya?" | Surprise, curiosity | Front-loaded thesis, data shocking |
| **Background** | "Kenapa ini penting?" | Recognition, concern | Familiar anchors, context building |
| **Analysis Arg 1** | "Oh, saya tidak tahu ini" | Surprise, discomfort | Data dense, clear structure |
| **Analysis Arg 2** | "Ini makin dalam" | Engagement, tension | Progressive complexity |
| **Analysis Arg 3** | "Saya mulai melihat pola" | Insight, dawning | Cross-reference, synthesis |
| **Counter-argument** | "Tapi bagaimana dengan..." | Resistance, skepticism | Steel-man, honest |
| **Recommendation** | "Jadi apa yang harus saya lakukan?" | Agency, resolve | Actionable, specific, numbered |
| **Conclusion** | "Ini mengubah cara saya berpikir" | Resolve, reflection | Human signature, specific closing |
| **Limitations** | "Tapi ini belum sempurna" | Trust, respect | Honest, transparent |

Jika reader journey flat (tidak ada emotional arc): restructure untuk create tension dan release.

## Counter-Argument Placement Strategy

3 opsi placement counter-argument di outline:

| Strategy | Placement | Kapan dipakai | Pro | Kontra |
|----------|-----------|---------------|-----|--------|
| **Embedded** | Setelah setiap argument | Jika setiap argument punya counter yang spesifik | Rebuttal langsung, reader tidak menunggu | Bisa disrupt flow |
| **Dedicated section** | Akhir Analysis | Jika counter-arguments cross-cut multiple arguments | Flow lebih clean, counter-argument lebih kuat | Reader mungkin sudah committed |
| **Hybrid** | Embedded untuk minor + dedicated untuk major | Mixed | Best of both | Lebih kompleks |

TAM preference: **Hybrid**. Minor counter-arguments embedded, major counter-argument di dedicated section.

## Data Sufficiency Check per Argument

Untuk setiap supporting argument, cek apakah data cukup:

| Criterion | Min requirement | Target |
|-----------|----------------|--------|
| **Primary sources** | 1 per argument | 2+ per argument |
| **Data points** | 2 per argument | 3+ per argument |
| **Chart/tabel** | 0 (opsional) | 1 per argument |
| **Expert quote** | 0 (opsional) | 1 per argument |
| **Case study** | 0 (opsional) | 1 per argument jika relevan |

Jika argument punya < 2 data points: tambah research (kembali ke 02-research) atau merge dengan argument lain.

## Cross-Section Flow Audit

Cek flow antar section di outline:

| Transition | Check | Fix jika gagal |
|------------|-------|---------------|
| **Exec Summary > Background** | Exec Summary memberi pertanyaan, Background memberi konteks? | Tambah bridge paragraph |
| **Background > Analysis** | Background set up masalah, Analysis bongkar masalah? | Pastikan Background tidak analyze |
| **Analysis > Recommendation** | Analysis menemukan masalah, Recommendation beri solusi? | Pastikan Recommendation address findings |
| **Recommendation > Conclusion** | Recommendation beri action, Conclusion beri reflection? | Pastikan Conclusion tidak repeat Recommendation |
| **Conclusion > Limitations** | Conclusion beri resolve, Limitations beri caveat? | Pastikan Limitations tidak undermine Conclusion secara tidak fair |

Setiap transition harus logis. Jika reader bingung "kok tiba-tiba bahas ini?", ada gap di flow.

## Command cek artikel/whitepaper existing untuk internal linking

```bash
# Cek artikel existing di folder
find content/articles/ -name "*.md" | xargs grep -li "KEYWORD"

# Cek whitepaper existing di folder
ls content/whitepaper/*.md 2>/dev/null | while read f; do
  slug=$(basename "$f" .md)
  title=$(grep -m1 '^title:' "$f" | sed 's/title: //; s/"//g')
  echo "$slug | $title"
done
```

## Checklist

- [ ] Outline lengkap: Executive Summary, Background, Analysis, Recommendation, Conclusion, Limitations
- [ ] Pyramid Principle: SCQA di Executive Summary, governing thought front-loaded
- [ ] Layered reading design: setiap section ditandai untuk skim/strategic/deep
- [ ] Detail struktur per section diisi
- [ ] Toulmin argument layout per supporting argument (claim, ground, warrant, backing, qualifier, rebuttal)
- [ ] Citable passage design: passage mana yang self-contained untuk AI/RAG ditandai
- [ ] Cognitive load per section di-plan (low/medium/high)
- [ ] Information foraging: conclusion-first headings, bolded findings, pull quotes, reward frequency
- [ ] Front-loaded thesis paragraph placement (page 1, sebelum hook)
- [ ] Methodology section (jika ada original research)
- [ ] Limitations section (wajib: data gaps, methodological, generalizability, confounders)
- [ ] Data visualization placement plan (chart/tabel per section, conclusion-titled)
- [ ] Content atomization extraction points (derivative content marked di outline)
- [ ] Min 5 h2
- [ ] Hook formula dipilih
- [ ] Executive Hook formula dari step 01 dirinci (konsisten dengan thesis)
- [ ] Section Hook formula per section dari step 03 dirinci (dari 30 Hook system)
- [ ] Section Foreshadow formula per section dari step 03 dirinci (dari 20 Foreshadow system)
- [ ] Bridge formula antar section dari step 03 dirinci (dari 5 Bridge formula)
- [ ] Thumbnail text (og_headline) direncanakan: max 50 char, berbeda dari title, visual hook
- [ ] Thumbnail caption (excerpt) direncanakan: max 160 char, visual foreshadow
- [ ] Meta description direncanakan: max 160 char, Hook + Foreshadow element
- [ ] Conclusion formula diisi (anti-generic)
- [ ] Data presentation plan selesai
- [ ] SEO metadata plan: slug, summary, tags
- [ ] Schema markup planning
- [ ] AI SEO considerations applied
- [ ] Internal linking plan: min 3 link
- [ ] Command cek existing articles/whitepapers dijalankan
- [ ] FAQ section (jika relevan)
- [ ] Outline Quality Score: > 14 (dari 20)
- [ ] MECE Verification: 4 checks passed (no overlap, no missing, independent, no redundancy)
- [ ] Section Weight Balance: Analysis 40-60%, Background < 20%, Recommendation > 10%
- [ ] Argument Dependency Map: no circular dependency
- [ ] Reader Journey Map: emotional arc ada (surprise > tension > insight > resolve)
- [ ] Counter-Argument Placement Strategy: hybrid (embedded minor + dedicated major)
- [ ] Data Sufficiency: setiap argument punya > 2 data points, > 1 primary source
- [ ] Cross-Section Flow Audit: 5 transitions logis, no gap
- [ ] Bahasa sederhana: outline ditandai [PEMBACA] vs [TEKNIS] vs [NERD BOX]
- [ ] Template penerjemahan riset → bahasa sederhana diisi untuk setiap argument
- [ ] Heading pakai bahasa yang dimengerti pembaca muda (bukan akademis)

## Next

Lanjut ke `/whitepaper-05-draft`
