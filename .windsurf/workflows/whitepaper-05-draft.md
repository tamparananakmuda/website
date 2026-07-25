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

## Whitepaper Struktur Template (per section)

```
## Executive Summary (200-300 kata)
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

## FAQ (opsional, jika ada pertanyaan umum)
```

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
- [ ] Internal linking: min 3 link ke konten TAM
- [ ] JSON disimpan ke `$ARTICLE_JSON`

## Next

Lanjut ke `/whitepaper-06-review`
