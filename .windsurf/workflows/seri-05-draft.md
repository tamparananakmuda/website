---
description: Seri step 05 - Menulis seluruh episode
---

# 05-draft

Menulis seluruh episode.

## Prev

Dari `/seri-04-outline`

## Word Count (STANDAR TAM)

- Target: 1.000-2.500 kata per part (5-12 menit baca per part)
- Referensi: `files/templates/article-template.md`, `files/ContentStrategy.md`

## Markdown Rules

- Tidak ada raw HTML `<script>`, `<iframe>`, `<style>`
- Gunakan `![alt](url)` untuk gambar
- Jangan tambahkan CTA "Dukung TAM" manual

## Punctuation

- Tidak pakai em dash atau en dash
- Maks 1 exclamation mark per part
- Tidak pakai ellipsis (...)

## Tone TAM

- Jujur, rasional, berani, tidak menggurui
- "Mengatakan hal yang perlu didengar, bukan yang ingin didengar"
- Human signature: minimal 1 paragraf pengalaman/observasi/opini spesifik per part

## Artikel Struktur Template (per part)

```
## [Recap singkat 1-2 kalimat, HANYA untuk part 2+]

## Hook (1-2 paragraf)
[Hook formula dari outline]

## Konteks (2-3 paragraf)
[Background masalah, kenapa relevan sekarang]

## Data/Analysis (3-5 section, tiap section h2)
### [Sub-topic 1]
### [Sub-topic 2]
### [Sub-topic 3]

## Insight (1-2 paragraf)
[Interpretasi data, TAM angle, human signature]

## Conclusion (1-2 paragraf)
[Conclusion formula dari outline, tidak generic]

## [Teaser ke part berikutnya, HANYA jika ada part selanjutnya]
```

## Recap Format (untuk Part 2+)

Di awal part 2 dan seterusnya, tambahkan recap singkat:

```markdown
> **Sebelumnya di [Nama Seri]:** [1-2 kalimat ringkasan part sebelumnya]. Baca part sebelumnya: [link](/artikel/series-slug-part-N-1-slug)
```

## Teaser Format (untuk Part 1 sampai N-1)

Di akhir part, tambahkan teaser:

```markdown
---
**Selanjutnya di [Nama Seri]:** [Hook 1 kalimat untuk part berikutnya]. [Link](/artikel/series-slug-part-N-1-slug)
```

## Subcategory Reference

Subcategory optional (bisa null). Contoh subcategory valid:
- `mindset-realita`, `mindset-mental-health`
- `karier-freelance`, `karier-korporat`, `karier-transisi`
- `kehidupan-relasi`, `kehidupan-keluarga`
- `uang-finansial`, `uang-investasi`
- `bisnis-startup`, `bisnis-side-hustle`
- `teknologi-ai`, `teknologi-produktivitas`

Jika tidak yakin, set `subcategory: null`. Tidak wajib.

## Tags Assignment

- Jumlah: 3-7 tags per part
- Format: kebab-case, Bahasa Indonesia
- Sumber: dari `seo_keywords` + topic keywords
- Contoh: `["gen-z", "phk", "karier", "kerja-keras", "ilusi"]`
- Tidak pakai brand tag, otomatis ditambahkan oleh sistem

## Source Integration di Body Text

| Pola | Contoh |
|------|--------|
| Data + sumber langsung | "Data BPS 2025 menunjukkan 74% lulusan menganggur." |
| Atribusi di awal | "Menurut laporan We Are Social 2025, ..." |
| Atribusi di akhir | "...demikian hasil survei Jakpat 2025." |
| Kutipan langsung | "Kita tidak bisa terus menyalahkan generasi," kata Ketua OJK. |
| Data dari sumber sekunder | "Dilansir dari Katadata, data BPS menunjukkan..." |

Setiap angka di body HARUS punya sumber yang bisa ditrace ke `sourceReferences`.

## Featured Criteria

`featured: true` berarti part muncul di homepage hero. Kriteria:
- Part dengan angle paling tajam / paling kontra-narasi (biasanya part 1)
- Max 3-6 artikel featured di homepage pada satu waktu
- Jika ragu, set `featured: false`. Bisa di-update nanti.

## Simpan draft ke `$ARTICLE_JSON`

```bash
export ARTICLE_JSON="/tmp/tam-article.json"
```

```json
{
  "title": "Judul Part 1",
  "slug": "series-slug-part-1-artikel-slug",
  "excerpt": "Excerpt max 160 karakter",
  "body": "## Heading 1\n\nKonten...\n\n## Heading 2\n\nKonten...",
  "category": "kehidupan",
  "subcategory": "mindset-realita",
  "author": "yovie-setiawan",
  "status": "published",
  "seo_keywords": ["keyword 1", "keyword 2", "keyword 3"],
  "pov_tag": "data",
  "human_signature": true,
  "source_references": [
    {"type": "link", "url": "https://sumber.com", "label": "Nama Sumber"}
  ],
  "featured": false,
  "seo_meta_title": "SEO Title max 70",
  "seo_meta_description": "SEO desc max 160",
  "og_headline": "OG headline max 50",
  "published_at": "2026-01-01T00:00:00.000Z",
  "series": "slug-seri-dari-config",
  "series_order": 1
}
```

## Checklist

- [ ] Semua part ditulis lengkap
- [ ] Word count per part: 1.000-2.500 kata
- [ ] Heading: h2/h3 only, min 3 h2 per part
- [ ] Internal linking: min 2 link + link antar part
- [ ] `series` dan `series_order` diisi di JSON
- [ ] JSON disimpan ke `$ARTICLE_JSON`

## Next

Lanjut ke `/seri-06-review`
