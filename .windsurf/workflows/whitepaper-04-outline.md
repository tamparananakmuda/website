---
description: Whitepaper step 04 - Outline: Executive Summary, Background, Analysis, Recommendation, Conclusion
---

# 04-outline

Executive Summary, Background, Analysis, Recommendation, Conclusion.

## Prev

Dari `/whitepaper-03-strategy`

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

## Hook Formulas Whitepaper (data-driven, berbeda dari artikel)

| Formula | Contoh |
|---------|--------|
| **Data shocking** | "74% lulusan kuliah Indonesia menganggur. Sistem pendidikan kita sedang mencetak pengangguran terdidik." |
| **Kontra-narasi** | "Semua bilang freelance itu kebebasan. Data bilang 78% freelancer Indonesia tidak punya BPJS." |
| **Trend reversal** | "Selama 10 tahun kita percaya ekonomi digital = kesempatan. 2025, data menunjukkan sebaliknya." |
| **Question provocation** | "Kalau kerja keras = sukses, kenapa 65% Gen Z yang kerja 45+ jam seminggu ingin resign?" |

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

## Command cek artikel/whitepaper existing untuk internal linking

```bash
# Cek artikel existing di folder
find content/articles/ -name "*.md" | xargs grep -li "KEYWORD"

# Cek whitepaper existing di DB
npx tsx -e "
const fs = require('fs'); const path = require('path');
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const t = line.trim(); if (!t || t.startsWith('#')) return;
    const i = t.indexOf('='); if (i === -1) return;
    process.env[t.substring(0, i).trim()] = t.substring(i + 1).trim();
  });
}
const { db } = require('./lib/db'); const { whitepapers } = require('./lib/db/schema');
db.select().from(whitepapers).then(r => {
  r.forEach(w => console.log(w.slug, '|', w.title));
}).catch(e => console.error('FATAL:', e.message));
"
```

## Checklist

- [ ] Outline lengkap: Executive Summary, Background, Analysis, Recommendation, Conclusion
- [ ] Detail struktur per section diisi
- [ ] Methodology section (jika ada original research)
- [ ] Min 5 h2
- [ ] Hook formula dipilih
- [ ] Conclusion formula diisi (anti-generic)
- [ ] Data presentation plan selesai
- [ ] SEO metadata plan: slug, summary, tags
- [ ] Schema markup planning
- [ ] AI SEO considerations applied
- [ ] Internal linking plan: min 3 link
- [ ] Command cek existing articles/whitepapers dijalankan
- [ ] FAQ section (jika relevan)

## Next

Lanjut ke `/whitepaper-05-draft`
