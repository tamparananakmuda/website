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

## Research Quality Score (0-12)

Score research sebelum lanjut ke 03-outline. Target: minimal 8.

| Factor | Weight | 0 (weak) | 1 (ok) | 2 (strong) |
|--------|--------|----------|--------|------------|
| **Keyword coverage** | 2 | < 3 keyword | 3-5 keyword | 6-8 long-tail keyword |
| **Competitor depth** | 2 | Hanya baca judul | Baca 3 artikel tapi surface | 3 artikel dianalisis dengan framework |
| **Data quality** | 2 | 0-1 source, tier 2 | 2 sources, mix tier 1-2 | 3+ sources, mayoritas tier 1 |
| **Data freshness** | 1 | Data > 3 tahun | Data 2-3 tahun | Data < 2 tahun |
| **Gap identification** | 1 | Tidak ada gap | Gap ada tapi vague | 2+ gap spesifik yang TAM bisa isi |
| **AI citation check** | 1 | Tidak dicek | Dicek tapi tidak actionable | AI opportunity teridentifikasi |
| **Source verification** | 1 | Tidak verify | Sebagiane verify | Semua URL aktif + tier labeled |
| **Insight uniqueness** | 2 | Tidak ada insight unik | Insight ada tapi lemah | 1-2 insight yang tidak ada di kompetitor |

Jika score < 8: tambah research atau revisi ide di 01-idea.

## Source Hierarchy System

Klasifikasi setiap source berdasarkan kredibilitas:

| Tier | Definisi | Max pemakaian | Contoh |
|------|----------|---------------|--------|
| **T1: Primary** | Data asli dari lembaga yang mengumpulkan | Tidak ada limit | BPS, OJK, Kemenaker, World Bank, OECD |
| **T2: Secondary** | Media yang melaporkan data primer dengan atribusi jelas | < 30% | Katadata, Kompas, Tempo (dengan link ke sumber asli) |
| **T3: Tertiary** | Blog, opinion piece, media tanpa link ke sumber asli | < 10% | Medium, LinkedIn article, opini |
| **T4: Unverified** | Social media, forum, word of mouth | 0% | Twitter thread, Reddit, Quora |

Aturan:
- Minimal 1 source T1 atau T2 per artikel
- T4 tidak boleh dipakai sebagai data source
- Jika hanya ada T3: tingkatkan research atau revisi ide

## Data Freshness Protocol

| Data type | Max umur | Exception |
|-----------|----------|-----------|
| **Ekonomi/makro** (GDP, inflasi, pengangguran) | 2 tahun | Jika tren historis 5+ tahun |
| **Demografi** (sensus, populasi) | 5 tahun | Sensus hanya tiap 10 tahun |
| **Teknologi** (pengguna internet, social media) | 1 tahun | Perubahan cepat |
| **Survei/opini** (Jakpat, We Are Social) | 2 tahun | Jika konteks belum berubah |
| **Kebijakan/regulasi** | 1 tahun | Jika regulasi belum berubah |

Jika data > max umur: cari data lebih baru atau tambah caveat "data terbaru yang tersedia adalah [tahun]".

## SERP Feature Analysis

Cek apa yang muncul di SERP untuk keyword target:

| Feature | Ada? | TAM strategy |
|---------|------|--------------|
| **Featured snippet** | Ya/tidak | Format section pertama untuk snippet: definisi jelas di 1 kalimat |
| **People Also Ask** | Ya/tidak | Pertanyaan di PAA = FAQ section material |
| **Video carousel** | Ya/tidak | Jika ada, pertimbangkan video di artikel |
| **Image pack** | Ya/tidak | Pastikan alt text dan image SEO |
| **News box** | Ya/tidak | Jika ada, hook ke berita terkini |
| **AI Overview** | Ya/tidak | Format data self-contained untuk AI citation |

Jika AI Overview ada: baca apa yang AI rangkum. TAM artikel harus lebih lengkap dari AI Overview.

## Competitor Content Depth Score

Untuk setiap 3 artikel kompetitor di Google, score depth:

| Factor | 0 (shallow) | 1 (medium) | 2 (deep) |
|--------|-------------|------------|----------|
| **Word count** | < 500 | 500-1.500 | > 1.500 |
| **Data sources** | 0-1 | 2-3 | 4+ |
| **Expert quotes** | 0 | 1 | 2+ |
| **Original analysis** | Tidak ada | Sebagiane | Full interpretation |
| **FAQ** | Tidak ada | Ada tapi < 3 | 3+ Q&A |
| **Visual data** | 0 | 1 chart/tabel | 2+ chart/tabel |

TAM target: beat kompetitor di minimal 4 dari 6 factors. Jika kompetitor sudah deep di semua, TAM harus unggul di angle dan tone.

## AI Citation Opportunity Map

Identifikasi bagian artikel yang AI engines akan cite:

| Opportunity | Format yang AI suka | TAM implementation |
|-------------|---------------------|-------------------|
| **Definisi** | "X adalah [definisi]." di awal section | 1 kalimat definisi jelas per konsep |
| **Statistik** | "74% lulusan menganggur (BPS, 2025)." | Data self-contained dengan source inline |
| **Q&A** | Pertanyaan + jawaban langsung di bawah | FAQ section dengan jawaban 2-3 kalimat |
| **Comparison** | "X vs Y: [perbedaan]." | Tabel comparison dengan conclusion |
| **List** | "3 cara untuk [action]." | Numbered list dengan 1 kalimat per item |
| **Timeline** | "2020: X. 2023: Y. 2025: Z." | Tabel atau list kronologis |

Tandai di research: bagian mana yang akan di-format untuk AI citation.

## Checklist

- [ ] Keyword research selesai (3-8 long-tail keyword, via Google Suggest/PAA/Related)
- [ ] Competitor analysis selesai (3 artikel Google diperiksa, framework di atas)
- [ ] Competitor Content Depth Score: TAM beat kompetitor di min 4 dari 6 factors
- [ ] Minimal 1 insight unik teridentifikasi
- [ ] Data pendukung terkumpul (min 2 sources, tier 1 atau 2)
- [ ] Source Hierarchy: minimal 1 T1 atau T2, 0 T4
- [ ] Data Freshness: semua data dalam max umur sesuai tipe
- [ ] Semua source URL aktif (HTTP 200-399)
- [ ] Tidak ada dead link
- [ ] SERP Feature Analysis: 6 features dicek
- [ ] AI SEO/AEO check: kompetitor cited di AI search?
- [ ] AI Citation Opportunity Map: 2+ opportunity teridentifikasi
- [ ] Research Quality Score: > 8 (dari 12)
- [ ] Template output research diisi

## Next

Lanjut ke `/artikel-03-outline`
