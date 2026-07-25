---
description: Seri step 04 - Outline setiap episode/part
---

# 04-outline

Outline setiap episode/part.

## Prev

Dari `/seri-03-research`

## Artikel Struktur Template (per part)

```
## [Recap singkat 1-2 kalimat, HANYA untuk part 2+]

## Hook (1-2 paragraf)
[Hook formula dari pilihan di bawah]

## Konteks (2-3 paragraf)
[Background masalah, kenapa relevan sekarang]

## Data/Analysis (3-5 section, tiap section h2)
### [Sub-topic 1]
### [Sub-topic 2]
### [Sub-topic 3]

## Insight (1-2 paragraf)
[Interpretasi data, TAM angle, human signature]

## Conclusion (1-2 paragraf)
[Conclusion formula dari pilihan di bawah]

## [Teaser ke part berikutnya, HANYA jika ada part selanjutnya]
```

## Hook Formulas TAM (pilih 1 per part)

| Formula | Contoh |
|---------|--------|
| **Kontra-narasi** | "Semua bilang kerja keras = sukses. Data bilang sebaliknya." |
| **Data shock** | "74% lulusan S1 menganggur menurut BPS 2025. Itu 3 dari 4 teman kamu." |
| **Pertanyaan provokatif** | "Kapan terakhir kali kamu bikin keputusan tanpa tanya media sosial dulu?" |
| **Observasi spesifik** | "Gue perhatikan temen-temen yang lahir 1997-2000 punya pola yang sama: semua nunggu 'momen yang tepat' yang nggak pernah datang." |
| **Refleksi personal** | "Gue dulu pikir investasi itu buat orang berduit. Sampai gue sadar, orang berduit itu karena investasi." |

## Conclusion Formulas (anti-generic, pilih 1 per part)

| Formula | Contoh |
|---------|--------|
| **Tamparan realita** | "Kerja keras bukan jaminan. Tapi nggak kerja keras itu jaminan pasti gagal." |
| **Pertanyaan refleksi** | "Jadi, kalau besok PHK datang, kamu sudah siap atau masih nunggu 'momen yang tepat'?" |
| **Insight kontra** | "Kita diajari takut gagal. Padahal yang harus ditakuti adalah nggak pernah mencoba." |
| **CTA tidak menggurui** | "Bukan tugas gue buat ngasih tahu kamu harus gimana. Tapi kalau artikel ini ngena, mungkin saatnya kamu mulai bertanya." |

## Heading Structure (CRITICAL untuk Table of Contents)

- `##` (h2) untuk section utama, `###` (h3) untuk sub-section
- JANGAN gunakan `#` (h1) di body
- Minimal 3 heading h2 per part

## Recap Format (untuk Part 2+)

Di awal part 2 dan seterusnya, tambahkan recap singkat:

```markdown
> **Sebelumnya di [Nama Seri]:** [1-2 kalimat ringkasan part sebelumnya]. Baca part sebelumnya: [link](/artikel/series-slug-part-N-1-slug)
```

## Teaser Format (untuk Part 1 sampai N-1)

Di akhir part (sebelum conclusion atau setelah conclusion), tambahkan teaser:

```markdown
---
**Selanjutnya di [Nama Seri]:** [Hook 1 kalimat untuk part berikutnya]. [Link](/artikel/series-slug-part-N-1-slug)
```

## Internal Linking Plan

- Minimal 2 link ke artikel TAM lain per part
- WAJIB link ke part sebelumnya dan sesudahnya dalam seri (jika ada)
- Format: `[judul](/artikel/slug-artikel)`

## Command cek artikel existing untuk internal linking

```bash
# Cek artikel di kategori yang sama
grep -rl "category:.*\"KATEGORI\"" content/articles/ --include="*.md" 2>/dev/null \
  | while read f; do echo "$(basename $f .md)"; done

# Cek artikel dengan keyword serupa
grep -rl "KEYWORD" content/articles/ --include="*.md" 2>/dev/null \
  | while read f; do echo "$(basename $f .md)"; done
```

## SEO Metadata Plan per part

- Meta Title: `[Keyword Utama] + [Hook] | TAM` (max 70 karakter)
- Meta Description: `[Konteks] + [Value Prop] + [CTA]` (max 160 karakter)
- Slug: `{series-slug}-part-{n}-{article-slug}`, max 60 karakter
- OG Headline: berbeda dari title, max 50 karakter, conversational

## Schema Markup Planning

Setiap part otomatis dapat Article schema. Tambahan:
- **FAQPage schema:** Untuk part yang punya Q&A section (plan di outline)
- **BreadcrumbList schema:** Otomatis dari layout
- Pastikan setiap part punya `og_headline` yang berbeda dari title

## AI SEO/AEO Consideration

- Setiap part harus punya minimal 1 paragraf "AI-citable" (definisi jelas, data spesifik, atau jawaban langsung ke pertanyaan)
- Struktur heading yang jelas membantu AI parse konten
- Definisi istilah di paragraf pertama section terkait

## Checklist

- [ ] Outline per part lengkap (min 3 h2 per part)
- [ ] Hook formula dipilih per part
- [ ] Conclusion formula dipilih per part
- [ ] Recap format planned untuk part 2+
- [ ] Teaser format planned untuk part 1 sampai N-1
- [ ] Internal linking plan: min 2 link + link antar part
- [ ] SEO metadata per part direncanakan
- [ ] OG headline per part direncanakan (beda dari title)
- [ ] Schema markup planned (FAQPage untuk part yang punya Q&A)
- [ ] AI SEO/AEO: minimal 1 AI-citable paragraf per part

## Next

Lanjut ke `/seri-05-draft`
