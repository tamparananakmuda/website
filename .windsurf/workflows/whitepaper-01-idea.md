---
description: Whitepaper step 01 - Identifikasi masalah utama
---

# 01-idea

Identifikasi masalah utama.

## Prev

Dari workflow `/content-ideation` atau ide ad-hoc

## Untuk ide dari workflow `/content-ideation`

Langsung lanjut ke `/whitepaper-02-research`.

## Untuk ide ad-hoc

Lakukan Angle Test (2 pertanyaan wajib):

1. "Apakah ada media lain yang akan menulis whitepaper ini dengan cara yang sama?" Jika ya, rewrite angle.
2. "Kalau saya hapus nama TAM, apakah pembaca tahu ini tulisan TAM?" Jika tidak, terlalu generik.

## POV Selection (wajib pilih salah satu)

- `kontra-narasi`, `refleksi`, `data`, `framework`, `tamparan`, `riset`, `opini`, `panduan`, `inspirasi`

## Whitepaper vs Artikel vs Seri

| Kondisi | Pilih |
|---------|-------|
| Topik butuh depth > 2.500 kata, data primer, analisis mendalam | Whitepaper |
| Topik bisa diselesaikan dalam 1.000-2.500 kata | Artikel tunggal |
| Topik butuh alur bertahap, multiple sub-topic | Seri |
| Target: professionals, decision makers, researchers | Whitepaper |
| Target: general audience, gen Z | Artikel/Seri |
| Goal: lead generation, authority building, influence policy | Whitepaper |
| Goal: traffic, awareness, engagement | Artikel/Seri |
| Ada data primer/original research | Whitepaper |
| Data sekunder dari publikasi existing | Artikel/Seri |

## Target Audience Framework (5 aspek)

| Aspek | Pertanyaan | Contoh |
|-------|------------|--------|
| **Demografi** | Siapa mereka? Usia, pekerjaan, lokasi | Profesional 25-35, urban, middle management |
| **Konteks** | Kapan mereka baca whitepaper? | Saat riset untuk decision making, weekend reading |
| **Pain point** | Masalah apa yang mereka cari solusi? | Kurang data untuk justify strategic decision |
| **Goal baca** | Apa yang mereka cari dari whitepaper? | Data, framework, rekomendasi actionable |
| **Action setelah baca** | Apa yang mereka lakukan? | Share ke tim, implement rekomendasi, cite di proposal |

Whitepaper target audience berbeda dari artikel:
- **Artikel:** Gen Z umum, 18-30, cari awareness/refleksi
- **Whitepaper:** Professionals, decision makers, 25-40, cari data + rekomendasi

## Search Intent Analysis (4 tipe)

| Intent | Pertanyaan user | Whitepaper cocok? |
|--------|----------------|-------------------|
| **Informational** | "Apa itu X?" "Bagaimana X bekerja?" | Ya, jika topik kompleks butuh depth |
| **Investigational** | "Data terbaru tentang X" "Riset X Indonesia" | Ya, whitepaper ideal untuk ini |
| **Comparative** | "X vs Y" "Alternatif Z" | Ya, jika perbandingan butuh data mendalam |
| **Decisional** | "Harus gimana untuk X?" | Ya, recommendation section menjawab ini |

## Content Cluster Awareness

Cek whitepaper dan artikel existing yang topiknya berdekatan:

```bash
# Cek whitepaper existing di folder
ls content/whitepaper/*.md 2>/dev/null | while read f; do
  slug=$(basename "$f" .md)
  title=$(grep -m1 '^title:' "$f" | sed 's/title: //; s/"//g')
  status=$(grep -m1 '^status:' "$f" | sed 's/status: //; s/"//g')
  echo "$slug | $title | $status"
done

# Cek artikel existing yang topiknya mirip
grep -ril "KEYWORD" content/articles/ --include="*.md" | head -10
```

Tujuan: pastikan whitepaper baru tidak overlap dengan existing, dan bisa di-link satu sama lain.

## Template Output Ide

```markdown
## Ide Whitepaper

**Judul working:** [Judul sementara]
**Slug:** slug-whitepaper-kebab-case
**Masalah utama:** [1-2 kalimat masalah yang diangkat]
**Thesis awal:** [1 kalimat argumen utama, akan difinalisasi di step 03]
**POV tag:** [pilih salah satu dari list]
**Target audience:** [Profesional/decision maker/researcher + detail dari framework]
**Search intent:** [Informational/Investigational/Comparative/Decisional]
**Goal:** [Educate/influence/convert/lead-gen]
**Angle test 1:** [Jawaban: apakah media lain akan tulis ini?]
**Angle test 2:** [Jawaban: kalau hapus nama TAM, pembaca tahu ini TAM?]
**Cluster:** [Whitepaper/artikel existing yang relevan untuk internal linking]
**Estimasi word count:** [3.000-10.000 kata]
```

## ARTICLE_JSON Lifecycle

| Step | Artikel JSON status |
|------|---------------------|
| 01-idea | Belum dibuat |
| 02-research | Belum dibuat (data riset di notes terpisah) |
| 03-strategy | Belum dibuat (thesis di notes terpisah) |
| 04-outline | Belum dibuat (outline di notes terpisah) |
| 05-draft | **DIBUAT** - JSON pertama kali diisi dengan title, slug, body, dll. |
| 06-review | JSON di-update jika ada revisi editorial |
| 07-design | JSON di-update jika ada coverImageUrl/downloadUrl |
| 08-build | **TERAKHIR DIPAKAI** - JSON dibaca untuk write file Markdown |
| 09-qc | JSON dibaca untuk audit (read-only) |
| 10-humanizer | JSON di-update jika ada perubahan body |
| 11+ | JSON tidak dipakai lagi (sudah di file) |

## Lifecycle

Whitepaper disimpan sebagai file Markdown di `content/whitepaper/` dengan frontmatter. Tidak ada DB insert untuk whitepaper.

Draft disimpan ke `$ARTICLE_JSON` (`/tmp/tam-article.json`) dari step 05 sampai 08.

## Env Var Reference

| Env Var | Fungsi | Scope |
|---------|--------|-------|
| `DATABASE_URL` | PostgreSQL connection string untuk Drizzle | Server only |
| `NEXT_PUBLIC_SITE_URL` | URL production | Public |
| `BREVO_API_KEY` | Newsletter | Server only |
| `R2_ACCESS_KEY_ID` | Cloudflare R2 S3 access key | Server only |
| `R2_SECRET_ACCESS_KEY` | Cloudflare R2 S3 secret | Server only |
| `R2_ENDPOINT` | R2 S3 endpoint URL | Server only |
| `R2_BUCKET_NAME` | R2 bucket name (`cdn-tam`) | Server only |
| `CDN_BASE_URL` | CDN domain (`https://cdn.tamparananakmuda.com`) | Public |

## Checklist

- [ ] Masalah utama teridentifikasi
- [ ] Whitepaper vs artikel vs seri decision dibuat
- [ ] Target audience jelas (professionals, decision makers, researchers)
- [ ] Search intent dianalisis
- [ ] Goal whitepaper didefinisikan (educate, influence, convert)
- [ ] Angle test lolos
- [ ] POV tag dipilih

## Next

Lanjut ke `/whitepaper-02-research`
