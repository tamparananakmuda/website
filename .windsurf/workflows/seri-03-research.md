---
description: Seri step 03 - Keyword research, competitor analysis, data pendukung untuk seluruh seri
---

# 03-research

Keyword research, competitor analysis, data pendukung, dan referensi untuk seluruh seri.

## Prev

Dari `/seri-02-strategy`

## Keyword Research (tanpa paid tools)

### Google Suggest + PAA + Related Searches

1. Buka Google (incognito), ketik keyword utama seri
2. Catat Google Suggest (autocomplete dropdown)
3. Scroll ke bawah, catat "People Also Ask" (PAA)
4. Scroll ke bawah, catat "Related Searches"
5. Ulangi untuk setiap part

### Google Trends

1. Buka `trends.google.com`
2. Masukkan keyword utama seri
3. Cek: tren naik/turun/stabil, region tertinggi (Indonesia), related queries
4. Catat related queries yang relevan untuk tiap part

### Target keyword per part

- 3-8 keyword long-tail per part, Bahasa Indonesia
- Identifikasi keyword yang bisa dipakai di multiple parts

## Cross-Part Keyword Mapping

Buat tabel keyword mapping untuk hindari kanibalisme SEO:

| Keyword | Part 1 | Part 2 | Part 3 | Part 4 |
|---------|--------|--------|--------|--------|
| "detoks dopamin" | Primary | Secondary | - | - |
| "dopamine detox cara" | - | Primary | - | - |
| "efek dopamin otak" | Secondary | - | Primary | - |

Aturan:
- 1 keyword hanya boleh jadi **Primary** di 1 part
- Bisa jadi **Secondary** di part lain (disebut sekilas)
- Jangan ada 2 part targeting keyword yang sama sebagai Primary

## Competitor Analysis

Cek apakah ada seri serupa dari media lain:

| Aspek | Cari |
|-------|------|
| Topik serupa | Google: `site:medium.com "TOPIK"` atau `site:kompas.com "TOPIK"` |
| Format | Artikel tunggal atau seri? Berapa part? |
| Angle | Angle mereka apa? Kontra-narasi atau konvensional? |
| Data | Sumber data mereka apa? BPS, survei, opini? |
| Depth | Surface-level atau deep-dive? |
| Gap | Apa yang mereka TIDAK bahas? (ini peluang TAM) |

## AI SEO/AEO Research

Pastikan seri mudah di-cite oleh AI search engines (ChatGPT, Perplexity, Google AI Overviews):

1. **Cek kompetitor di AI search:** Query keyword utama di ChatGPT/Perplexity, lihat sumber mana yang di-cite
2. **Identifikasi format yang AI-friendly:** Struktur Q&A, definisi jelas di paragraf pertama, data spesifik dengan sumber
3. **Plan untuk setiap part:** Setiap part harus punya minimal 1 paragraf yang bisa di-cite AI (definisi, data, atau jawaban langsung)
4. **Structured data:** Plan FAQPage schema untuk part yang punya Q&A section

## Data Pendukung

- Kumpulkan data sources untuk seluruh seri
- Pastikan data cukup untuk semua part
- Setiap part minimal 2 data points dengan sumber

## Command cek HTTP status semua source references

```bash
# Cek semua URL di research output
echo "https://sumber1.com" >> /tmp/urls.txt
echo "https://sumber2.com" >> /tmp/urls.txt
while read url; do
  status=$(curl -s -o /dev/null -w "%{http_code}" -L "$url")
  echo "$status | $url"
done < /tmp/urls.txt
rm /tmp/urls.txt
```

## Template Output Research

```
SERI: [nama seri]

KEYWORD MAP:
| Keyword | Part | Role | Volume est. |
|---------|------|------|-------------|
| ... | ... | Primary/Secondary | ... |

COMPETITOR ANALYSIS:
- Kompetitor 1: [nama media] - [angle] - [gap yang TAM bisa isi]
- Kompetitor 2: ...

AI SEO/AEO:
- Query AI search: [hasil query, sumber yang di-cite]
- Format AI-friendly: [Q&A / definisi / data]
- FAQ schema plan: [part mana yang butuh FAQPage]

DATA PENDUKUNG PER PART:
- Part 1: [data point 1 (sumber)], [data point 2 (sumber)]
- Part 2: [data point 1 (sumber)], [data point 2 (sumber)]
...

SOURCE REFERENCES:
- [URL] - [label] - [HTTP status]
```

## Chart Planning per Part (jika ada data yang bisa divisualisasi)

Saat research, identifikasi data per part yang punya potensi untuk chart. Tidak semua part butuh chart, tapi kalau ada 3+ data points yang lebih jelas divisualisasi, rencanakan dari sini.

### Chart Selection Guide

| Data type | Chart type | Syntax | Contoh TAM |
|-----------|-----------|--------|------------|
| Perbandingan kategori | Bar | `chart:bar` | TPT per jenjang |
| Trend temporal | Line | `chart:line` | Gaji 2020-2025 |
| Trend dengan magnitude | Area | `chart:area` | Utang konsumer naik |
| Proporsi/komposisi | Pie | `chart:pie` | Komposisi PT |
| Before/after multi-kategori | Grouped Bar | `chart:grouped-bar` | TPT 2020 vs 2025 per jenjang |
| Multi-series stacked | Stacked Bar | `chart:stacked-bar` | Komposisi belanja per kategori |
| Korelasi 2 variabel | Scatter | `chart:scatter` | Jam kerja vs kepuasan |
| Conversion/dropout | Funnel | `chart:funnel` | SMA ke kuliah ke lulus ke kerja |
| Hierarchical proportion | Treemap | `chart:treemap` | Alokasi APBN |
| Multi-dimension comparison | Radar | `chart:radar` | KKNI vs MQF |

### Aturan

- **Tidak wajib.** Chart hanya jika data 3+ points dan lebih jelas divisualisasi daripada di narasi
- Max 1-2 chart per part
- Data untuk chart harus dari source yang sudah terverifikasi (T1/T2)
- **Cross-part consistency:** Jika part 1 pakai data X di chart, part 3 yang refer data X harus konsisten
- Catat per part: data apa, chart type apa, di section mana nanti masuk
- Lihat `/seri-05-draft` untuk syntax dan contoh JSON config

### Chart Planning Template per Part

```markdown
### Chart Plan per Part
- Part 1: type=bar, data=TPT per jenjang (BPS 2024), section "Data/Analysis"
- Part 3: type=line, data=gaji trend 2020-2025 (BPS 2025), section "Data/Analysis"
- Part 5: type=funnel, data=funnel pendidikan (BPS 2024), section "Data/Analysis"
```

## Checklist

- [ ] Keyword research per part selesai (Google Suggest/PAA/Related/Trends)
- [ ] Cross-part keyword mapping dibuat (no kanibalisme)
- [ ] Competitor analysis selesai (6 aspek)
- [ ] AI SEO/AEO research selesai
- [ ] Data pendukung cukup untuk semua part (min 2 per part)
- [ ] Semua source URL aktif (HTTP 200)
- [ ] Template output research diisi
- [ ] Source Hierarchy: min 1 T1/T2 per part, no T4
- [ ] Data Freshness Protocol: semua data within max umur
- [ ] Cross-Part Data Overlap Audit: no kontradiksi
- [ ] AI Citation Opportunity Map per part
- [ ] Chart Planning: jika ada data 3+ points per part, chart type dan section sudah direncanakan (lihat `/artikel-02-research` untuk Chart Selection Guide)
- [ ] Series Research Quality Score: min 9 (dari 12)

## Source Hierarchy System

Setiap source dikategorikan berdasarkan kredibilitas:

| Tier | Definisi | Contoh | Max umur |
|------|----------|--------|----------|
| **T1: Primary** | Data resmi, laporan langsung | BPS, OJK, WHO, Bank Indonesia | 2 tahun (ekonomi), 5 tahun (kesehatan) |
| **T2: Secondary** | Media kredibel yang cite T1 | Katadata, Kontan, Kompas (data section) | 1 tahun |
| **T3: Tertiary** | Opini ahli, blog kredibel, buku | LinkedIn article oleh expert, buku terbitan | Tidak ada, tapi label sebagai opini |
| **T4: Weak** | Reddit, forum, anonim | Tidak boleh dipakai sebagai source utama | - |

Aturan TAM seri: min 1 T1 atau T2 source per part. T4 tidak boleh jadi source utama.

## Data Freshness Protocol

| Data type | Max umur | Check |
|-----------|----------|-------|
| **Ekonomi/makro** | 2 tahun | BPS, Bank Indonesia, OJK |
| **Teknologi** | 1 tahun | Gartner, IDC, vendor report |
| **Kesehatan** | 5 tahun | WHO, NIH, jurnal peer-reviewed |
| **Sosial/budaya** | 3 tahun | Survei nasional, lembaga riset |
| **Demografi** | 5 tahun | Sensus, BPS |
| **Trend/viral** | 6 bulan | Google Trends, social listening |

Jika data older than max umur: cari update terbaru atau label sebagai "data terakhir tersedia" dengan tanggal.

## Cross-Part Data Overlap Audit

Cek apakah ada data yang muncul di multiple part:

| Check | Pertanyaan | Action |
|-------|------------|--------|
| **Same data, different part** | Apakah angka yang sama muncul di part 1 dan part 3? | Pastikan tidak kontradiksi, atau refer part 1 |
| **Data progression** | Apakah data di part 2 lebih advanced dari part 1? | Ya, ada progression |
| **No data dump** | Apakah tidak ada part yang hanya "data dump"? | Setiap data punya interpretasi |
| **Source diversity** | Apakah tidak semua part pakai source yang sama? | Min 2 unique source per part |
| **Data conflict** | Apakah ada 2 source yang kontradiksi? | Address konflik atau pilih 1 yang lebih kredibel |

## AI Citation Opportunity Map

Identifikasi peluang AI citation per part:

| Part | AI-citable content | Format | Query yang mungkin cite |
|------|-------------------|--------|-------------------------|
| Part 1 | Definisi + data utama | Definisi di 1 kalimat + angka | "apa itu [topik]" |
| Part 2 | Data + interpretasi | Data self-contained | "[topik] data [tahun]" |
| Part 3 | FAQ | Q&A format | "[pertanyaan spesifik]" |
| Part N | Conclusion/synthesis | Extractable summary | "[topik] kesimpulan" |

Target: setiap part punya min 1 AI-citable paragraph yang bisa di-quote langsung oleh Perplexity/ChatGPT.

## Series Research Quality Score (0-12)

Score research sebelum lanjut ke 04-outline. Target: minimal 9.

| Factor | Weight | 0 (fail) | 1 (ok) | 2 (strong) |
|--------|--------|----------|--------|------------|
| **Keyword mapping** | 2 | Tidak ada | Ada tapi kanibalisme | No kanibalisme, 3-8 per part |
| **Source tier** | 2 | T4 only | T2-T3 | Min 1 T1/T2 per part |
| **Data freshness** | 1 | > max umur | Sebagiane fresh | Semua within max umur |
| **Data per part** | 1 | < 2 per part | 2 per part | 3+ per part |
| **Competitor analysis** | 1 | Tidak ada | Ada tapi surface | Deep + gap identified |
| **AI SEO** | 1 | Tidak dicek | Dicek tapi no plan | Plan per part |
| **Cross-part consistency** | 1 | Kontradiksi | Sebagiane konsisten | Fully konsisten |
| **Source diversity** | 1 | 1 source untuk semua | 2-3 source | 4+ unique source |
| **AI citation map** | 1 | Tidak ada | Sebagiane | Setiap part punya AI-citable content |
| **URL verification** | 1 | Tidak dicek | Sebagiane | Semua 200 |

Jika score < 9: tambah research sebelum lanjut ke outline.

## Next

Lanjut ke `/seri-04-outline`
