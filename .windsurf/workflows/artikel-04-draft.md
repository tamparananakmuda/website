---
description: Artikel step 04 - Menulis artikel lengkap mengikuti outline
---

# 04-draft

Menulis artikel lengkap mengikuti outline dari `/artikel-03-outline`.

## Prev

Dari `/artikel-03-outline`

## Artikel Struktur Template

```
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
```

## Word Count (STANDAR TAM)

- Target: 1.000-2.500 kata (5-12 menit baca)
- Referensi: `files/templates/article-template.md`, `files/ContentStrategy.md`
- Di bawah 1.000 kata = perlu expand depth
- Di atas 2.500 kata = perlu trim atau pecah jadi seri (gunakan workflow `/seri-01-idea`)

## Markdown Rules

- Tidak ada raw HTML `<script>`, `<iframe>`, `<style>` di body
- Gunakan `![alt](url)` untuk gambar, bukan `<img>`
- Link eksternal pakai `[text](url)`, tidak perlu `target="_blank"`
- Jangan tambahkan CTA "Dukung TAM" manual di body. CTA otomatis muncul di article page.

## Punctuation

- Tidak pakai em dash (—) atau en dash (–)
- Maks 1 exclamation mark per artikel
- Tidak pakai ellipsis (...) sebagai desain

## Tone TAM

- Jujur, rasional, berani, tidak menggurui
- "Mengatakan hal yang perlu didengar, bukan yang ingin didengar"
- Human signature: minimal 1 paragraf pengalaman/observasi/opini spesifik

## Subcategory Reference

Subcategory optional (bisa null). Kalau dipakai, pilih dari `content/config.ts`. Contoh subcategory yang valid:
- `mindset-realita`, `mindset-mental-health`
- `karier-freelance`, `karier-korporat`, `karier-transisi`
- `kehidupan-relasi`, `kehidupan-keluarga`
- `uang-finansial`, `uang-investasi`
- `bisnis-startup`, `bisnis-side-hustle`
- `teknologi-ai`, `teknologi-produktivitas`

Jika tidak yakin, set `subcategory: null`. Tidak wajib.

## Tags Assignment

- Jumlah: 3-7 tags per artikel
- Format: kebab-case, Bahasa Indonesia
- Sumber: dari `seo_keywords` + topic keywords
- Contoh: `["gen-z", "phk", "karier", "kerja-keras", "ilusi"]`
- Tidak pakai brand tag ("tamparan-anak-muda"), otomatis ditambahkan oleh sistem

## Source Integration di Body Text

Format kalimat saat kutip data dari source:

| Pola | Contoh |
|------|--------|
| Data + sumber langsung | "Data BPS 2025 menunjukkan 74% lulusan menganggur." |
| Atribusi di awal | "Menurut laporan We Are Social 2025, ..." |
| Atribusi di akhir | "...demikian hasil survei Jakpat 2025." |
| Kutipan langsung | "Kita tidak bisa terus menyalahkan generasi," kata Ketua OJK. |
| Data dari sumber sekunder | "Dilansir dari Katadata, data BPS menunjukkan..." |

Setiap angka di body HARUS punya sumber yang bisa ditrace ke `sourceReferences`.

## Featured Criteria

`featured: true` berarti artikel muncul di homepage hero. Kriteria:
- Artikel dengan angle paling tajam / paling kontra-narasi
- Max 3-6 artikel featured di homepage pada satu waktu
- Artikel featured harus punya OG image yang menarik
- Jika ragu, set `featured: false`. Bisa di-update nanti.

## Simpan draft ke `$ARTICLE_JSON`

```bash
export ARTICLE_JSON="/tmp/tam-article.json"
```

```json
{
  "title": "Judul Artikel",
  "slug": "slug-artikel-kebab-case",
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
  "featured": true,
  "reading_time": 6,
  "seo_meta_title": "SEO Title max 70",
  "seo_meta_description": "SEO desc max 160",
  "og_headline": "OG headline max 50",
  "published_at": "2026-01-01 01:00:00+00",
  "series": null,
  "series_order": null
}
```

## Command cek heading + internal links + word count

```bash
node -e "
const fs = require('fs');
const a = JSON.parse(fs.readFileSync('$ARTICLE_JSON', 'utf8'));
const b = a.body;
const h1 = (b.match(/^# /gm) || []).length;
const h2 = (b.match(/^## /gm) || []).length;
const h3 = (b.match(/^### /gm) || []).length;
console.log('h1:', h1, h1 > 0 ? 'WARNING: jangan pakai h1' : 'OK');
console.log('h2:', h2, h2 < 3 ? 'WARNING: butuh min 3' : 'OK');
console.log('h3:', h3);
const il = (b.match(/\]\(\/artikel\//g) || []).length;
console.log('internal links:', il, il < 2 ? 'WARNING: butuh min 2' : 'OK');
const og = a.og_headline || '';
console.log('og_headline:', og ? og : 'MISSING');
console.log('og_headline == title?', og === a.title ? 'WARNING: harus berbeda!' : 'OK');
console.log('og_headline length:', og.length, og.length > 50 ? 'WARNING: max 50' : 'OK');
const wc = b.split(/\s+/).length;
console.log('word count:', wc, wc < 1000 ? 'WARNING: butuh min 1.000' : wc > 2500 ? 'WARNING: max 2.500' : 'OK');
"
```

## Checklist

- [ ] Artikel lengkap ditulis mengikuti outline
- [ ] Word count: 1.000-2.500 kata
- [ ] Heading: h2/h3 only, min 3 h2, tidak ada h1
- [ ] Internal linking: min 2 link ke artikel TAM
- [ ] `sourceReferences`: array `{type, url, label}`
- [ ] `excerpt`: max 160 karakter
- [ ] `ogHeadline`: berbeda dari title, max 50 karakter
- [ ] `reading_time`: di-set di JSON (estimasi: word_count / 200)
- [ ] `published_at`: format "YYYY-MM-DD HH:MM:SS+00"
- [ ] JSON disimpan ke `$ARTICLE_JSON`

## Next

Lanjut ke `/artikel-05-review`
