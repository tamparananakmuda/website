---
description: Artikel step 03 - Struktur H1-H4, FAQ, CTA, dan internal linking plan
---

# 03-outline

Struktur H1-H4, FAQ, CTA, dan internal linking plan.

## Prev

Dari `/artikel-02-research`

## Heading Structure (CRITICAL untuk Table of Contents)

- Gunakan `##` (h2) untuk section utama, `###` (h3) untuk sub-section
- JANGAN gunakan `#` (h1) di body, h1 sudah dipakai untuk title
- Minimal 3 heading h2 untuk TOC berfungsi

## Artikel Struktur Template

```
## Hook (1-2 paragraf)
[Hook formula pilih salah satu di bawah]

## Konteks (2-3 paragraf)
[Background masalah, kenapa relevan sekarang]

## Data/Analysis (3-5 section, tiap section h2)
### [Sub-topic 1]
### [Sub-topic 2]
### [Sub-topic 3]

## Insight (1-2 paragraf)
[Interpretasi data, TAM angle, human signature]

## Conclusion (1-2 paragraf)
[Conclusion formula, tidak generic]
```

## Hook Formulas TAM (pilih salah satu)

1. **Data mengejutkan:** "74% lulusan baru Indonesia menganggur menurut BPS 2025. Angka itu lebih tinggi dari tahun sebelumnya."
2. **Pertanyaan provokatif:** "Kapan terakhir kali kamu merasa cukup? Bukan lebih, bukan kurang. Cukup."
3. **Observasi personal:** "Saya perhatikan, dari 10 teman kuliah saya, hanya 2 yang kerja di bidang yang sesuai jurusan."
4. **Kontra-narasi:** "Semua bilang kerja keras = sukses. Tapi data PHK tech 2025 bilang sebaliknya."
5. **Tamparan langsung:** "Kamu tidak terlambat. Kamu cuma salah mulai."

## Conclusion Formula (TIDAK BOLEH generic)

Dilarang: "masa depan yang cerah", "peluang tak terbatas", "awal dari sesuatu yang besar".

Gunakan salah satu:
1. **Tamparan penutup:** Restate thesis dengan cara lebih tajam. "Jadi bukan kamu yang salah. Sistemnya yang tidak dirancang untuk kamu."
2. **Pertanyaan refleksi:** "Pertanyaannya bukan apakah kamu bisa. Tapi apakah kamu mau mulai sekarang."
3. **Call to reality:** "Tidak ada solusi instan. Tapi memahami masalah adalah langkah pertama yang nyata."
4. **Data penutup:** 1 angka terakhir yang mengejutkan atau memperkuat thesis.

## Internal Linking Plan

- Minimal 2 link ke artikel TAM lain di body
- Cek artikel relevan via `files/article-inventory.md`
- Kalau artikel di kategori yang relevan belum ada, link ke category page: `/kategori/[kategori-slug]`
- Format: `[judul](/artikel/slug-artikel)`

## Command cek artikel existing untuk internal linking

```bash
# Cek artikel dengan keyword serupa untuk internal linking
grep -rl "KEYWORD" content/articles/ --include="*.md" \
  | while read f; do echo "$(basename $f .md)"; done

# Cek artikel di kategori yang sama
grep -rl "category:.*KATEGORI" content/articles/ --include="*.md" \
  | while read f; do echo "$(basename $f .md)"; done
```

## SEO Metadata Plan

- Meta Title Formula: `[Keyword Utama] + [Hook] ` (max 60 karakter)
- Meta Description Formula: `[Konteks] + [Value Prop] + [CTA]` (max 160 karakter)
- Slug: kebab-case, keyword di awal, max 60 karakter, unique

## OG Headline Plan

- HARUS berbeda dari `title`. Jangan copy-paste
- Max 50 karakter, punchy, conversational
- Format: kalimat langsung, bukan judul formal
- Contoh: title "PHK Membongkar Ilusi: Kerja Keras Tidak Menjamin Aman" → ogHeadline "Kerja keras tidak menjamin kamu aman dari PHK"

## Schema Markup Planning

Rencanakan schema yang akan dipakai (diimplementasi di 06-build):

| Schema | Kapan dipakai | Field wajib |
|--------|---------------|-------------|
| Article | Semua artikel | headline, author, datePublished, image |
| FAQPage | Jika ada FAQ section | mainEntity (Q&A pairs) |
| BreadcrumbList | Otomatis oleh layout | itemListElement |

Jika artikel punya FAQ section, rencanakan 3-5 Q&A pairs yang relevan dengan search intent.

## AI SEO / AEO Consideration

TAM sudah punya `llms.txt` dan robots.txt yang allow AI bots. Pastikan artikel bisa dicited oleh AI search engines:

- Struktur heading jelas (h2/h3) untuk parsing AI
- Data dan angka di kalimat yang self-contained (bisa di-quote tanpa konteks tambahan)
- Definisi atau summary di awal section untuk featured snippet / AI overview
- Jawaban FAQ langsung di bawah pertanyaan (untuk AI extraction)

## Checklist

- [ ] Struktur H2-H4 lengkap (min 3 h2)
- [ ] Artikel struktur template diisi (Hook → Konteks → Data → Insight → Conclusion)
- [ ] Hook formula dipilih
- [ ] Conclusion formula dipilih (tidak generic)
- [ ] FAQ section direncanakan (jika relevan, 3-5 Q&A)
- [ ] CTA direncanakan (link ke `/dukung` atau artikel terkait)
- [ ] Internal linking plan: min 2 link ke artikel TAM (dicek via command)
- [ ] SEO meta title direncanakan (max 70 chars)
- [ ] SEO meta description direncanakan (max 160 chars)
- [ ] Slug direncanakan (kebab-case, max 60 chars)
- [ ] OG headline direncanakan (max 50 chars, berbeda dari title)
- [ ] Schema markup direncanakan (Article + FAQ jika ada)
- [ ] AI SEO/AEO consideration dicek

## Next

Lanjut ke `/artikel-04-draft`
