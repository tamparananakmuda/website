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

## Outline Quality Score (0-12)

Score outline sebelum lanjut ke 04-draft. Target: minimal 8.

| Factor | Weight | 0 (weak) | 1 (ok) | 2 (strong) |
|--------|--------|----------|--------|------------|
| **Hook strength** | 2 | No hook / generic | Hook ada tapi lemah | Data/provokasi/kontra-narasi yang sharp |
| **Structure logic** | 1 | Random flow | Hook > Konteks > Data > Insight > Conclusion | Clear progression |
| **Heading quality** | 1 | Generic ("Analisis") | Sebagiane descriptive | Conclusion-first headings |
| **Data integration** | 1 | Data tidak di-plan | Data disebut tapi tidak spesifik | Data point + source per section |
| **FAQ relevance** | 1 | No FAQ atau irrelevant | FAQ ada tapi dari PAA tidak | FAQ dari PAA + search intent |
| **Internal linking** | 1 | < 2 links | 2-3 links tapi generic anchor | 3+ links dengan descriptive anchor |
| **Conclusion** | 1 | Generic | Ada tapi vague | Anti-generic, specific, human signature |
| **AI extractability** | 1 | Tidak di-plan | Sebagiane self-contained | Setiap section punya 1 extractable claim |
| **SEO metadata** | 1 | Tidak di-plan | Sebagiane ada | Meta title + desc + slug + OG headline |
| **CTA** | 1 | Tidak ada | Ada tapi generic | Specific, relevant, non-pushy |

Jika score < 8: revisi outline sebelum lanjut ke 04-draft.

## Section Weight Balance (artikel)

Distribusi word count per section untuk artikel 1.000-2.500 kata:

| Section | Target % | Target words (1.500 total) | Check |
|---------|----------|---------------------------|-------|
| **Hook** | 5-10% | 75-150 | Tidak > 15% |
| **Konteks** | 10-15% | 150-225 | Tidak > 20% |
| **Data/Analysis** | 50-65% | 750-975 | Harus section terbesar |
| **Insight** | 10-15% | 150-225 | Tidak > 20% |
| **Conclusion** | 5-10% | 75-150 | Tidak > 15% |
| **FAQ** | 5-10% | 75-150 | Opsional |

Jika Data/Analysis < 50%: artikel terlalu tipis pada argument. Tambah depth.
Jika Hook > 15%: hook terlalu panjang, reader belum dapat value.

## Hook-Conclusion Alignment Check

Hook dan conclusion harus saling berkaitan:

| Check | Pertanyaan | Pass criteria |
|-------|------------|---------------|
| **Thesis consistency** | Apakah conclusion menjawab pertanyaan dari hook? | Conclusion address hook secara langsung |
| **Tone consistency** | Apakah tone hook sama dengan tone conclusion? | Tidak ada tone shift janggal |
| **Data callback** | Apakah conclusion refer data dari hook? | Minimal 1 data point dari hook di-reference |
| **Emotional arc** | Hook = surprise/tension, Conclusion = resolve/reflection? | Ada emotional arc, bukan flat |

Jika hook dan conclusion tidak align: rewrite salah satu.

## Reading Flow Map

Petakan alur baca untuk reader:

| Section | Reader state | Goal section | Transition ke section berikutnya |
|---------|-------------|--------------|----------------------------------|
| **Hook** | "Menarik, lanjut baca" | Capture attention | Hook > Konteks: "Kenapa ini penting?" |
| **Konteks** | "Oh, saya relate" | Build relevance | Konteks > Data: "Ini datanya" |
| **Data 1** | "Wow, tidak tahu ini" | Surprise dengan data | Data 1 > Data 2: "Dan itu belum semua" |
| **Data 2** | "Makin dalam" | Deepen argument | Data 2 > Data 3: "Ada pola yang muncul" |
| **Data 3** | "Saya mulai melihat" | Synthesis | Data 3 > Insight: "Apa artinya semua ini?" |
| **Insight** | "Ini mengubah pikiran saya" | TAM angle landing | Insight > Conclusion: "Jadi apa?" |
| **Conclusion** | "Saya akan bertindak" | Resolve + reflect | Conclusion > CTA |

Jika reader stuck di section (tidak ada transition yang jelas): tambah bridge.

## FAQ Relevance Score

Untuk setiap Q&A di FAQ, score relevance:

| Criterion | 0 (irrelevant) | 1 (ok) | 2 (relevant) |
|-----------|----------------|--------|--------------|
| **Dari PAA?** | Tidak ada di PAA | Sebagiane dari PAA | Langsung dari PAA |
| **Search intent match?** | Tidak match intent | Sebagiane match | Match dengan keyword target |
| **Self-contained?** | Perlu konteks body | Sebagiane self-contained | Jawaban bisa berdiri sendiri |
| **AI extractable?** | Tidak bisa di-extract | Sebagiane | Format Q+A langsung, AI-friendly |

Target: minimal 3 Q&A dengan score > 2 di minimal 3 criteria. Jika < 3: revisi FAQ atau hapus.

## Internal Link Anchor Text Plan

Setiap internal link harus punya anchor text yang descriptive:

| Link | Anchor text | Target artikel | Relevansi |
|------|-------------|----------------|-----------|
| 1 | [descriptive, bukan "baca ini"] | /artikel/slug-1 | [kenapa relevan] |
| 2 | [descriptive] | /artikel/slug-2 | [kenapa relevan] |
| 3 | [descriptive] | /artikel/slug-3 | [kenapa relevan] |

**Dilarang:** "baca selengkapnya", "di sini", "klik link", "artikel ini".

## AI Extractability Check per Section

Untuk setiap section di outline, cek:

| Check | Pertanyaan | Pass criteria |
|-------|------------|---------------|
| **Self-contained** | Bisa di-copy tanpa context dan masih make sense? | Ya |
| **Data inline** | Data di kalimat, bukan hanya di chart? | Ya |
| **Definisi jelas** | Konsep utama didefinisikan di 1 kalimat? | Ya |
| **Heading = answer** | Heading bisa berdiri sebagai jawaban AI? | Ya |

Jika section tidak pass: tambah definisi, pindah data ke narasi, atau rewrite heading.

## Checklist

- [ ] Struktur H2-H4 lengkap (min 3 h2)
- [ ] Artikel struktur template diisi (Hook > Konteks > Data > Insight > Conclusion)
- [ ] Hook formula dipilih
- [ ] Conclusion formula dipilih (tidak generic)
- [ ] Hook-Conclusion Alignment: 4 checks passed
- [ ] Section Weight Balance: Data/Analysis 50-65%, Hook < 15%
- [ ] Reading Flow Map: 7 section dengan transition jelas
- [ ] FAQ section direncanakan (jika relevan, 3-5 Q&A)
- [ ] FAQ Relevance Score: min 3 Q&A dengan score > 2 di 3 criteria
- [ ] CTA direncanakan (link ke `/dukung` atau artikel terkait)
- [ ] Internal linking plan: min 2 link ke artikel TAM (dicek via command)
- [ ] Internal Link Anchor Text Plan: descriptive anchor, no generic
- [ ] SEO meta title direncanakan (max 70 chars)
- [ ] SEO meta description direncanakan (max 160 chars)
- [ ] Slug direncanakan (kebab-case, max 60 chars)
- [ ] OG headline direncanakan (max 50 chars, berbeda dari title)
- [ ] Schema markup direncanakan (Article + FAQ jika ada)
- [ ] AI SEO/AEO consideration dicek
- [ ] AI Extractability Check: setiap section pass 4 checks
- [ ] Outline Quality Score: > 8 (dari 12)

## Next

Lanjut ke `/artikel-04-draft`
