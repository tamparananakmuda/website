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
- [ ] Section Weight Balance per part
- [ ] Cross-Part Flow Audit: all pass
- [ ] Recap-Teaser Accuracy Pre-check: all pass
- [ ] AI Extractability Check per part
- [ ] Chart Placement: jika ada chart plan dari research, posisi chart sudah ditentukan per part (lihat `/artikel-03-outline` untuk aturan penempatan)
- [ ] Series Outline Quality Score: min 9 (dari 12)

## Section Weight Balance

Cek distribusi panjang per section di setiap part:

| Section | Target % | Min kata | Max kata |
|---------|----------|----------|----------|
| **Recap** | 5% | 30 | 80 |
| **Hook** | 10% | 100 | 250 |
| **Konteks** | 15% | 150 | 400 |
| **Data/Analysis** | 40% | 400 | 1.000 |
| **Insight** | 15% | 150 | 400 |
| **Conclusion** | 10% | 100 | 250 |
| **Teaser** | 5% | 30 | 80 |

Jika 1 section > 50% atau < 5%: rebalance outline.

## Cross-Part Flow Audit

| Check | Pertanyaan | Pass criteria |
|-------|------------|---------------|
| **Hook progression** | Apakah hook setiap part berbeda dan semakin tajam? | No repetisi, escalation |
| **Data escalation** | Apakah data di part N lebih surprising dari part N-1? | Ada escalation |
| **Insight deepening** | Apakah insight semakin dalam per part? | Part 1 surface, part N profound |
| **Conclusion arc** | Apakah conclusion setiap part terhubung? | Conclusion part N -> hook part N+1 |
| **Recap accuracy** | Apakah recap di part N akurat mewakili part N-1? | Ya, 1-2 kalimat tepat |
| **Teaser payoff** | Apakah teaser part N dipenuhi di part N+1? | Ya, tidak clickbait |
| **Tone consistency** | Apakah tone outline konsisten antar part? | Voice sama, depth berbeda |

## Recap-Teaser Accuracy Pre-check

Sebelum draft, verifikasi recap dan teaser sudah akurat:

| Part | Recap refers to | Teaser refers to | Check |
|------|----------------|------------------|-------|
| Part 1 | N/A | Part 2 hook | Teaser match part 2 outline? |
| Part 2 | Part 1 conclusion | Part 3 hook | Recap match part 1? Teaser match part 3? |
| Part 3 | Part 2 conclusion | Part 4 hook | Recap match part 2? Teaser match part 4? |
| Part N | Part N-1 conclusion | N/A | Recap match part N-1? |

Jika ada mismatch: fix outline sebelum draft.

## AI Extractability Check per Part

| Check | Pertanyaan | Pass criteria |
|-------|------------|---------------|
| **Definisi jelas** | Apakah ada 1 kalimat definisi di part ini? | Ya, di paragraf pertama section terkait |
| **Data self-contained** | Apakah angka + source di kalimat yang sama? | Ya, bisa di-quote tanpa konteks tambahan |
| **Heading = answer** | Apakah heading bisa berdiri sebagai jawaban? | Ya, descriptive dan specific |
| **FAQ format** | Apakah ada Q&A section? | Ya, min 3 Q&A (jika relevan) |
| **Conclusion extractable** | Apakah conclusion bisa di-extract sebagai summary? | Ya, 1-2 kalimat inti |

## Series Outline Quality Score (0-12)

Score outline sebelum lanjut ke 05-draft. Target: minimal 9.

| Factor | Weight | 0 (fail) | 1 (ok) | 2 (strong) |
|--------|--------|----------|--------|------------|
| **Section completeness** | 2 | < 3 h2 per part | 3 h2 per part | 4+ h2 per part |
| **Hook quality** | 1 | Generic | OK tapi lemah | Provokatif per part |
| **Conclusion quality** | 1 | Generic | OK | Anti-generic per part |
| **Recap-teaser** | 1 | Tidak planned | Planned tapi not checked | Accuracy pre-checked |
| **Internal links** | 1 | < 2 per part | 2 per part | 3+ per part + antar part |
| **SEO metadata** | 1 | Tidak direncanakan | Sebagiane | Lengkap per part |
| **OG headline** | 1 | Tidak direncanakan | = title | Unique + punchy per part |
| **Cross-part flow** | 2 | > 2 fail | 1-2 fail | All pass |
| **Section balance** | 1 | > 50% atau < 5% | Sebagiane balanced | Semua balanced |
| **AI extractability** | 1 | Tidak dicek | Sebagiane | Setiap part pass |

Jika score < 9: revisi outline sebelum lanjut ke draft.

## Next

Lanjut ke `/seri-05-draft`
