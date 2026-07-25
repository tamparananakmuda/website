---
description: Whitepaper step 05 - Menulis dokumen lengkap
---

# 05-draft

Menulis dokumen lengkap.

## Prev

Dari `/whitepaper-04-outline`

## Word Count (STANDAR TAM)

- Target: 3.000-10.000 kata (15-60 menit baca)
- Di bawah 3.000 kata = terlalu tipis, pertimbangkan jadi artikel (gunakan `/artikel-01-idea`)

## Markdown Rules

- Tidak ada raw HTML `<script>`, `<iframe>`, `<style>`
- Gunakan `![alt](url)` untuk gambar

## Punctuation

- Tidak pakai em dash atau en dash
- Maks 1 exclamation mark
- Tidak pakai ellipsis (...)

## Tone TAM

- Jujur, rasional, berani, tidak menggurui
- Human signature: minimal 1 paragraf pengalaman/observasi/opini spesifik

## Simpan draft ke `$ARTICLE_JSON`

```bash
export ARTICLE_JSON="/tmp/tam-article.json"
```

```json
{
  "title": "Judul Whitepaper",
  "slug": "slug-whitepaper-kebab-case",
  "subtitle": "Subtitle whitepaper (opsional)",
  "summary": "Summary untuk SEO dan card display (max 300 karakter)",
  "body": "## Section 1\n\nKonten...\n\n## Section 2\n\nKonten...",
  "author": "TAMPARAN ANAK MUDA",
  "download_url": null,
  "reading_time": 15,
  "tags": ["riset", "gen z", "data"],
  "status": "published",
  "published_at": "2026-01-01T00:00:00.000Z"
}
```

## Checklist

- [ ] Dokumen lengkap ditulis
- [ ] Word count: 3.000-10.000 kata
- [ ] Heading: h2/h3 only, min 5 h2, tidak ada h1
- [ ] Internal linking: min 3 link ke konten TAM
- [ ] JSON disimpan ke `$ARTICLE_JSON`

## Next

Lanjut ke `/whitepaper-06-review`
