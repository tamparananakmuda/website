---
description: Artikel step 02 - Keyword research, competitor analysis, data pendukung, dan referensi
---

# 02-research

Keyword research, competitor analysis, data pendukung, dan referensi.

## Prev

Dari `/artikel-01-idea`

## Keyword Research

- Target: 3-8 keyword long-tail, Bahasa Indonesia
- Prioritas: search volume medium + difficulty low
- Cek 3 artikel pertama Google untuk keyword target

### Cara keyword research tanpa paid tools

1. **Google Suggest:** Ketik keyword utama di Google, catat auto-suggest
2. **People Also Ask:** Scroll ke "People Also Ask" section, catat 3-5 pertanyaan
3. **Related Searches:** Scroll ke bawah Google, catat related searches
4. **Google Trends:** Cek tren keyword (tamparananakmuda.com tidak punya akses paid tools)

## Competitor Analysis

- Baca 3 artikel pertama Google untuk keyword target
- Identifikasi gap: apa yang mereka tidak bahas?
- Minimal 1 insight unik yang tidak ada di 3 artikel tersebut

### Framework competitor analysis

| Aspek | Yang dicari |
|-------|-------------|
| Structure | Heading structure, panjang artikel, ada FAQ? |
| Depth | Seberapa dalam datanya? Ada sumber primer? |
| Data | Angka apa yang mereka pakai? Sumbernya kredibel? |
| Angle | Angle mereka apa? Kontra-narasi? Edukasi? |
| Tone | Formal/casual/akademis? |
| Gap | Apa yang TIDAK mereka bahas? (ini peluang TAM) |

## AI SEO / AEO Research

TAM sudah punya `llms.txt` dan robots.txt yang allow AI bots (GPTBot, ClaudeBot, PerplexityBot, Google-Extended). Cek apakah topik ini bisa dicited oleh AI search engines:

- Cek apakah artikel kompetitor sudah dicited di Perplexity/ChatGPT untuk query terkait
- Identifikasi format yang mudah di-extract AI: definisi jelas, data self-contained, Q&A format
- Target: artikel TAM harus lebih mudah di-cite dari kompetitor karena struktur heading jelas + data terverifikasi

## Data Pendukung

- Kumpulkan minimal 2 data sources per artikel
- Cek data tidak outdated (max 2 tahun untuk data ekonomi)
- Pastikan URL sumber aktif

## Source Verification (Tier System)

- **Tier 1:** Terverifikasi langsung dari publikasi asli (URL aktif, data bisa dikonfirmasi)
- **Tier 2:** Tidak terverifikasi langsung (kutipan media sekunder, wajib label atribusi)
- **Yang harus dihapus:** Dead link, sample terlalu kecil (n < 5.000), blog post tanpa data primer

## Command cek HTTP status semua source references

```bash
export ARTICLE_JSON="/tmp/tam-article.json"
node -e "
const fs = require('fs');
const a = JSON.parse(fs.readFileSync(process.env.ARTICLE_JSON || '/tmp/tam-article.json', 'utf8'));
const refs = a.source_references || [];
(async () => {
  for (const ref of refs) {
    try {
      const res = await fetch(ref.url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(10000) });
      console.log((res.status >= 200 && res.status < 400 ? 'OK' : 'DEAD') + ' [' + res.status + '] ' + ref.url);
    } catch (e) {
      try {
        const res = await fetch(ref.url, { redirect: 'follow', signal: AbortSignal.timeout(10000) });
        console.log((res.status >= 200 && res.status < 400 ? 'OK' : 'DEAD') + ' [' + res.status + '] ' + ref.url);
      } catch (e2) {
        console.log('DEAD [ERR] ' + ref.url);
      }
    }
  }
})();
"
```

## Template Output Research

Dokumentasi research dalam format ini (dipakai di step berikutnya):

```
Keywords:
- [keyword 1] (search intent: informational, volume: medium)
- [keyword 2] (search intent: transactional, volume: low)
- [keyword 3] (search intent: informational, volume: medium)
...

Competitor gaps:
- Kompetitor 1: [judul] - tidak bahas [gap]
- Kompetitor 2: [judul] - tidak punya data [gap]
- Kompetitor 3: [judul] - angle terlalu generik

Data sources:
- [Sumber 1]: [URL], [data utama], [tier 1/2]
- [Sumber 2]: [URL], [data utama], [tier 1/2]

AI SEO check:
- Kompetitor cited di AI search: ya/tidak
- Format yang mudah di-extract: [definisi/data/Q&A]

Insight unik TAM:
- [1-2 kalimat insight yang tidak ada di kompetitor]
```

## Checklist

- [ ] Keyword research selesai (3-8 long-tail keyword, via Google Suggest/PAA/Related)
- [ ] Competitor analysis selesai (3 artikel Google diperiksa, framework di atas)
- [ ] Minimal 1 insight unik teridentifikasi
- [ ] Data pendukung terkumpul (min 2 sources, tier 1 atau 2)
- [ ] Semua source URL aktif (HTTP 200-399)
- [ ] Tidak ada dead link
- [ ] AI SEO/AEO check: kompetitor cited di AI search?
- [ ] Template output research diisi

## Next

Lanjut ke `/artikel-03-outline`
