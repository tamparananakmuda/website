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
- Human signature: minimal 1 paragraf pengalaman/observasi/opini spesifik per part

## Seri JSON Template (simpan ke `$ARTICLE_JSON`)

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
