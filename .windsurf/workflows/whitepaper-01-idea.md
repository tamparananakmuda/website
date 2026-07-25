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

## Lifecycle

Whitepaper disimpan langsung di DB (tabel `whitepapers`) via Drizzle ORM. Tidak ada file Markdown, tidak ada frontmatter. Pastikan `DATABASE_URL` di `.env.local`.

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
