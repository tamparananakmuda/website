---
description: Artikel step 01 - Menentukan topik, target audience, search intent, dan goal artikel
---

# 01-idea

Menentukan topik, target audience, search intent, dan goal artikel.

## Lifecycle

Dari step ini, artikel akan disimpan sebagai JSON di `$ARTICLE_JSON` (`/tmp/tam-article.json`). JSON ini akan dipakai dari step 04 sampai 06. Pastikan semua output dari step-step berikutnya konsisten dengan JSON.

## Untuk ide dari workflow `/content-ideation`

Langsung lanjut ke `/artikel-02-research` dengan ide yang sudah terpilih. Ide dari content-ideation sudah punya: topik, kategori, POV, angle, working title, seo_keywords.

## Untuk ide ad-hoc

Lakukan Angle Test (2 pertanyaan wajib):

1. "Apakah ada media lain yang akan menulis ini dengan cara yang sama?" Jika ya, rewrite angle.
2. "Kalau saya hapus nama TAM dari artikel ini, apakah pembaca tahu ini tulisan TAM?" Jika tidak, terlalu generik.

## POV Selection (wajib pilih salah satu)

- `kontra-narasi` - melawan narasi populer dengan dasar kuat
- `refleksi` - pengalaman/observasi personal yang spesifik
- `data` - data + interpretasi yang tidak obvious
- `framework` - kerangka berpikir original
- `tamparan` - statement tajam yang membongkar ilusi langsung
- `riset` - temuan riset/studi sebagai angle utama
- `opini` - sudut pandang yang berani dan spesifik
- `panduan` - guide praktis berbasis pengalaman nyata
- `inspirasi` - cerita inspiratif tanpa menjual harapan palsu

## Category Reference

| Slug | Title | Color |
|------|-------|-------|
| `mindset` | Mindset | #D13A3A |
| `karier` | Karier | #4080D9 |
| `kehidupan` | Kehidupan | #40B880 |
| `uang` | Uang | #D9A040 |
| `bisnis` | Bisnis | #A040D9 |
| `teknologi` | Teknologi | #6040D9 |

## Target Audience Framework

Wajib tentukan minimal 3 dari 5 aspek:

| Aspek | Contoh |
|-------|--------|
| Demografi | Usia 18-30, lulusan S1, urban |
| Psikografi | Ambisius tapi cemas, konsumen konten self-improvement |
| Pain point | Bingung masa depan, merasa tertinggal dari teman |
| Platform | Instagram, TikTok, LinkedIn |
| Awareness level | Problem-aware (tahu ada masalah, belum tahu solusi) |

## Search Intent Analysis

Tentukan search intent untuk keyword utama:

| Intent | Definisi | Contoh query | Format artikel |
|--------|----------|-------------|----------------|
| Informational | Cari info/edukasi | "kenapa gen Z sulit beli rumah" | Edukasi + data |
| Navigational | Cari situs/brand spesifik | "tamparan anak muda artikel karier" | Brand search |
| Transactional | Cari solusi/produk | "cara mulai side hustle 2026" | Panduan praktis |
| Commercial investigation | Compare sebelum decide | "freelance vs full time salary" | Perbandingan + rekomendasi |

## Content Cluster Awareness

Cek artikel existing di kategori yang sama sebelum tentukan ide:

```bash
# Cek artikel di kategori yang sama
grep -rl "category:.*\"KATEGORI\"" content/articles/*.md 2>/dev/null \
  | while read f; do echo "$(basename $f .md)"; done

# Cek artikel dengan keyword serupa
grep -rl "KEYWORD" content/articles/*.md 2>/dev/null \
  | while read f; do echo "$(basename $f .md)"; done
```

Pertanyaan cluster:
- Apakah sudah ada artikel di kategori/keyword yang sama?
- Jika ya: artikel baru ini melengkapi, melawan, atau update dari artikel lama?
- Jika belum: ini artikel pertama di cluster, plan untuk buat 2-3 artikel terkait dalam 30 hari

## Template Output Ide

Dokumentasi ide dalam format ini (simpan di notes, akan dipakai di step berikutnya):

```
Topik: [topik utama]
Kategori: [slug kategori]
POV: [pov tag]
Angle: [1-2 kalimat angle unik]
Working title: [judul sementara]
Target audience: [demografi + pain point]
Search intent: [informational/navigational/transactional/commercial]
Goal: [educate/provoke/convert]
Cluster: [artikel baru di cluster / melengkapi artikel X / melawan artikel Y]
Keyword utama: [1 keyword utama untuk SEO]
```

## Checklist

- [ ] Topik ditentukan
- [ ] Target audience jelas (min 3 dari 5 aspek)
- [ ] Search intent dianalisis (informational/navigational/transactional/commercial)
- [ ] Goal artikel didefinisikan (educate, provoke, convert)
- [ ] Angle test lolos (kedua pertanyaan)
- [ ] POV tag dipilih
- [ ] Category dipilih
- [ ] Content cluster dicek (artikel existing di kategori/keyword sama)
- [ ] Template output ide diisi

## Next

Lanjut ke `/artikel-02-research`
