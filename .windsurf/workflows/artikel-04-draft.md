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

- Tidak pakai em dash atau en dash (garis pemisah panjang)
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

## Draft Quality Gates (per section sebelum lanjut)

Setiap section harus pass 3 gates sebelum dianggap selesai:

| Gate | Check | Jika gagal |
|------|-------|-----------|
| **G1: Structure** | Heading = conclusion-first? Topic sentence = claim? | Rewrite heading dan opening |
| **G2: Evidence** | Setiap claim punya data atau concrete example? | Tambah evidence atau hapus claim |
| **G3: Tone** | TAM tone? No AI pattern? Human signature ada? | Re-humanize section |

Jika 1 gate gagal: fix section sebelum lanjut ke section berikutnya.

## Paragraph Construction Rules

Setiap paragraph di artikel mengikuti aturan:

| Rule | Cara | Kenapa |
|------|------|-------|
| **1 idea per paragraph** | 1 topic sentence + 2-4 supporting sentences | Cognitive load |
| **Topic sentence first** | Kalimat pertama = claim/point. Berikutnya = evidence | Pyramid Principle |
| **Max 120 words** | Jika > 120, split | Cognitive load (artikel lebih pendek dari whitepaper) |
| **Data in paragraph** | Minimal 1 data point atau concrete example per paragraph di Data section | Credibility |
| **No orphan paragraphs** | 1-sentence paragraph hanya untuk emphasis, max 1 per 300 kata | Rhythm |
| **Transition logis** | Paragraph terakhir lead ke paragraph berikutnya | Flow |
| **No paragraph tanpa purpose** | Setiap paragraph harus advance argument atau add context | Density |

## Data Integration Standards

Cara integrate data ke narasi artikel:

| Standard | Cara | Contoh |
|----------|------|--------|
| **Inline attribution** | Source di kalimat yang sama dengan data | "Data BPS 2025 menunjukkan 74% lulusan menganggur." |
| **Context framing** | Data tidak berdiri sendiri, ada context | "74% lulusan menganggur, naik dari 65% tahun sebelumnya." |
| **Interpretation** | Data + apa artinya untuk reader | "74% berarti 3 dari 4 lulusan tidak punya kerja." |
| **Comparison** | Data dibandingkan dengan something | "74% vs 26% yang employed. Gap ini tertinggi dalam 10 tahun." |
| **Trend direction** | Arah perubahan disebut | "Naik dari 65% ke 74% dalam 2 tahun." |
| **Sample size** | Jika < 1.000, sebutkan n | "Survei Jakpat (n=500) menemukan..." |

Jangan: data tanpa context, data tanpa source, data tanpa interpretasi.

## Hedging Language Guide

Sesuaikan bahasa dengan kekuatan evidence:

| Evidence strength | Hedging | Contoh |
|-------------------|---------|--------|
| **Strong** (data primer, sample besar) | Tidak perlu hedge | "Data BPS menunjukkan 74% menganggur." |
| **Moderate** (survei, data sekunder) | Light hedge | "Survei ini mengindikasikan bahwa..." |
| **Weak** (observasi, n kecil) | Clear hedge | "Berdasarkan observasi terbatas, terlihat bahwa..." |
| **No data** (opini) | Full disclosure | "Dalam pengalaman saya,..." |

TAM tidak menjual opini sebagai fakta. Tapi juga tidak menunduk jika data kuat.

## Human Signature Placement

Human signature = paragraf yang menunjukkan ini ditulis oleh manusia, bukan AI:

| Type | Contoh | Min per artikel |
|------|--------|-----------------|
| **Observasi personal** | "Saya perhatikan dari 10 teman saya, hanya 2 yang..." | 1 |
| **Pengalaman spesifik** | "Saat saya pertama kali freelance di 2019,..." | 0-1 |
| **Opini berani** | "Jujur, saya tidak setuju dengan narasi bahwa..." | 0-1 |
| **Anecdote** | "Ada teman saya, sebut saja R, yang..." | 0-1 |

Tempatkan human signature di Insight section atau di tengah Data section untuk maximum impact.

## Self-Review Checklist per Section

Setelah selesai writing setiap section, self-review:

| Question | Jika "tidak" |
|----------|-------------|
| Apakah section ini advance thesis/angle? | Hapus atau revisi |
| Apakah setiap claim punya evidence? | Tambah evidence atau hapus claim |
| Apakah hedging proportionate? | Adjust hedging language |
| Apakah ada jargon yang belum diterjemahkan? | Tambah terjemahan |
| Apakah paragraph > 120 kata? | Split |
| Apakah ada transisi robotik? | Hapus atau rewrite |
| Apakah ada AI pattern? | Fix di humanizer step |
| Apakah ada human signature? | Tambah jika belum |
| Apakah conclusion-first? | Rewrite opening |
| Apakah section ini bisa di-skim? | Tambah bold untuk key findings |

## Draft Completion Score (0-12)

Sebelum simpan ke JSON, score draft:

| Factor | Weight | 0 | 1 | 2 |
|--------|--------|---|---|---|
| **Word count** | 1 | < 1.000 | 1.000-2.500 | 1.500-2.000 (sweet spot) |
| **Section completeness** | 2 | < 3 sections | 3-4 sections | 5+ sections |
| **Evidence density** | 2 | < 3 data points | 3-7 data points | 8+ data points |
| **Citation count** | 1 | < 2 | 2-4 | 5+ |
| **Human signature** | 1 | 0 | 1 | 2+ |
| **Hook strength** | 1 | Weak/generic | OK | Data/provokasi/sharp |
| **Conclusion** | 1 | Generic | OK | Anti-generic + specific |
| **Internal links** | 1 | < 2 | 2-3 | 4+ |
| **FAQ** | 0.5 | No | - | Yes, 3+ Q&A |
| **OG headline** | 0.5 | Missing | Same as title | Different + punchy |

Target: minimal 8. Jika < 8, revisi sebelum simpan.

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
- [ ] Draft Quality Gates: G1 Structure, G2 Evidence, G3 Tone passed per section
- [ ] Paragraph Construction: 1 idea, topic sentence first, max 120 words, data per paragraph
- [ ] Data Integration: inline attribution, context, interpretation, comparison, trend
- [ ] Hedging Language: proportionate to evidence strength
- [ ] Human Signature: minimal 1 observasi/pengalaman/opini spesifik
- [ ] Self-Review per Section: 10 questions answered
- [ ] Internal linking: min 2 link ke artikel TAM
- [ ] `sourceReferences`: array `{type, url, label}`
- [ ] `excerpt`: max 160 karakter
- [ ] `ogHeadline`: berbeda dari title, max 50 karakter
- [ ] `reading_time`: di-set di JSON (estimasi: word_count / 200)
- [ ] `published_at`: format "YYYY-MM-DD HH:MM:SS+00"
- [ ] Draft Completion Score: > 8 (dari 12)
- [ ] JSON disimpan ke `$ARTICLE_JSON`

## Next

Lanjut ke `/artikel-05-review`
