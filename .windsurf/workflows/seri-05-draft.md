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
[Episode Hook formula dari outline, pilih dari 30 Hook formula system]
[Wajib: tulis nomor + nama formula di comment untuk tracking]

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
[Episode Foreshadow formula dari outline untuk tease part berikutnya, pilih dari 20 Foreshadow formula system]

## [Next Tease / Bridge ke part berikutnya, HANYA jika ada part selanjutnya]
[Next Tease formula dari outline, pilih dari 5 Next Tease formula atau 20 Foreshadow formula]
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

## Interactive Chart System (recharts)

Seri TAM mendukung interactive chart yang di-render langsung dari markdown. Sama seperti artikel dan whitepaper, tulis `chart:type` code block di body part.

### Syntax

````markdown
```chart:TYPE
{"title":"...","subtitle":"...","source":"...","data":[...]}
```
````

Tipe chart: `bar`, `line`, `pie`, `stacked-bar`, `radar`, `area`, `grouped-bar`, `scatter`, `funnel`, `treemap`. Lihat `/artikel-04-draft` atau `/whitepaper-05-draft` untuk contoh lengkap JSON config.

### Aturan Chart di Seri

- **Tidak wajib.** Chart hanya jika data punya 3+ points yang lebih jelas divisualisasi
- Max 1-2 chart per part (jangan over-visual)
- Data di chart HARUS juga disebut di narasi
- Setiap chart harus punya title, subtitle, dan source
- Gunakan TAM color palette: `#f4a825` (amber), `#ef4444` (red), `#3b82f6` (blue), `#22c55e` (green), `#a855f7` (purple)
- Chart di-render oleh `MarkdownContent` component (sama untuk artikel dan seri)
- **Cross-part consistency:** Jika part 1 pakai chart dengan data X, part 3 yang refer data X harus konsisten
- Component: `components/markdown-content.tsx` + `components/charts/chart-renderer.tsx`

## Interactive Components (Calculator, Comparison Table, Nerd Box)

Seri TAM juga mendukung 3 komponen interaktif lain selain chart, di-parse dari markdown code blocks oleh `MarkdownContent`:

### Interactive Calculator

````markdown
```calc:inflation-impact
{"title":"...","subtitle":"...","source":"..."}
```
````

Tipe: `calc:inflation-impact`, `calc:farmer-share`. Hanya jika ada variabel yang reader bisa input. Max 1 per part.

### Comparison Table

````markdown
```comparison
{"title":"...","columns":["A","B","C"],"rows":[{"metric":"...","values":[1,2,3],"lowerIsBetter":false}],"highlightColumn":"B"}
```
````

Color-coded otomatis (green=best, red=worst). Max 1 per part.

### Nerd Box (Collapsible)

````markdown
```nerd
{"title":"Detail Teknis","content":"Konten markdown...\\n\\nSupport **bold**, *italic*, list."}
```
````

Detail teknis yang TIDAK esensial untuk argumen utama. Default collapsed. Max 1 per part.

### Aturan Komponen Interaktif di Seri

- **Tidak wajib.** Hanya jika menambah value untuk reader
- Max 1-2 komponen interaktif total per part (chart + calculator + comparison + nerd box)
- Reading Progress Bar otomatis tampil di semua part (component `ReadingProgress` di artikel page layout)
- Syntax dan JSON config sama persis seperti whitepaper, lihat `/whitepaper-05-draft` untuk detail lengkap
- **Cross-part consistency:** Jika part 1 pakai calculator/comparison dengan data X, part 3 yang refer data X harus konsisten

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

## Hook & Foreshadow Implementation Requirements (per part)

### Episode Hook Implementation

- Episode Hook formula yang dipilih di step 04-outline WAJIB diimplementasi di paragraf pembuka setiap part
- Hook harus sesuai template formula, diisi dengan konten spesifik part tersebut
- Hook progression: part 1 broad, part tengah deep, part terakhir provokatif (payoff series promise)
- Jangan repetisi formula di part berurutan
- Hook max 2 paragraf, max 150 kata per part

### Episode Foreshadow Implementation

- Episode Foreshadow formula WAJIB diimplementasi di:
  - **Transition antar section dalam part:** 1-2 Foreshadow di akhir section untuk tease section berikutnya
  - **Conclusion part:** 1 Foreshadow untuk tease part berikutnya atau series payoff
- Foreshadow tidak boleh spoiler penuh, harus tease
- Foreshadow di transition: 1 kalimat di akhir section

### Next Tease / Bridge Implementation

- Next Tease WAJIB di akhir setiap part 1 sampai N-1
- Next Tease part N harus dipenuhi (payoff) di hook part N+1
- Next Tease tidak boleh spoiler penuh part berikutnya
- Format: 1 kalimat tease + link ke part berikutnya
- Part terakhir: tidak ada Next Tease, boleh pakai Resolution Tease untuk tease seri lain

### Thumbnail Text & Caption Implementation per Part

- **Thumbnail text (og_headline):** Max 50 karakter, HARUS berbeda dari title part. Function sebagai visual hook di OG image card. Tulis di field `og_headline`.
- **Thumbnail caption (excerpt):** Max 160 karakter. Function sebagai visual foreshadow di OG image feature. Tulis di field `excerpt`.
- **Meta description:** Max 160 karakter, mengandung Hook + Value + Foreshadow element. Tulis di field `seo_meta_description`.

## Draft Quality Gates (per part)

| Gate | Check | Pass criteria |
|------|-------|---------------|
| **G1: Structure** | Outline match, heading count, section balance | Min 3 h2, section balance OK |
| **G2: Evidence** | Data attribution, source traceable | 100% angka punya source |
| **G3: Tone** | TAM voice, human signature, no AI pattern | 5 karakter TAM + min 1 human signature |

Jika 1 gate fail: revisi part tersebut.

## Paragraph Construction Rules

- Max 120 kata per paragraph, min 30 (kecuali emphasis)
- Kalimat pertama = topic sentence
- Kalimat kedua = evidence/data
- Kalimat ketiga = interpretasi TAM
- Tidak ada orphan paragraph (1 kalimat tanpa konteks)

## Cross-Part Consistency Check

| Check | Pass criteria |
|-------|---------------|
| **Tone** | Voice sama di semua part |
| **Terminology** | Istilah konsisten antar part |
| **Data** | Tidak ada kontradiksi antar part |
| **Recap** | Akurat mewakili part sebelumnya |
| **Teaser** | Dipenuhi di part berikutnya |

## Series Draft Quality Score (0-12)

Target: min 9.

| Factor | Weight | 0 | 1 | 2 |
|--------|--------|---|---|---|
| **Structure** | 2 | < 3 h2 | 3 h2 | 4+ h2 |
| **Evidence** | 2 | Angka tanpa source | Sebagiane | 100% traceable |
| **Tone** | 2 | AI pattern | Sebagiane TAM | Full TAM + human signature |
| **Cross-part** | 2 | Kontradiksi | Sebagiane konsisten | Fully konsisten |
| **Word count** | 1 | < 1.000 atau > 2.500 | OK | Optimal 1.500-2.000 |
| **Internal links** | 1 | < 2 | 2 | 3+ |
| **Storytelling** | 1 | No hook/cliffhanger | Ada tapi lemah | Strong hook + cliffhanger |
| **Recap/teaser** | 1 | Tidak ada | Ada tapi mismatch | Accurate |

## Checklist

- [ ] Semua part ditulis lengkap
- [ ] Word count per part: 1.000-2.500 kata
- [ ] Heading: h2/h3 only, min 3 h2 per part
- [ ] Internal linking: min 2 link + link antar part
- [ ] `series` dan `series_order` diisi di JSON
- [ ] JSON disimpan ke `$ARTICLE_JSON`
- [ ] Draft Quality Gates: G1, G2, G3 pass per part
- [ ] Cross-Part Consistency: 5 checks pass
- [ ] `excerpt`: max 160 karakter (function sebagai thumbnail caption / visual foreshadow)
- [ ] `ogHeadline`: berbeda dari title, max 50 karakter (function sebagai thumbnail text / visual hook)
- [ ] Episode Hook formula diimplementasi di opening per part (nomor + nama dari 30 Hook system)
- [ ] Episode Foreshadow formula diimplementasi di transition/conclusion per part (nomor + nama dari 20 Foreshadow system)
- [ ] Next Tease / Bridge formula diimplementasi di akhir part 1 sampai N-1
- [ ] Meta description mengandung Hook + Foreshadow element per part (max 160 karakter)
- [ ] Series Draft Quality Score: min 9 (dari 12)

## Next

Lanjut ke `/seri-06-review`
