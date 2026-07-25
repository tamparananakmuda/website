---
description: Whitepaper step 02 - Mengumpulkan data, jurnal, statistik, dan studi kasus
---

# 02-research

Mengumpulkan data, jurnal, statistik, dan studi kasus.

## Prev

Dari `/whitepaper-01-idea`

## Data Collection

- Minimal 5 sumber primer teridentifikasi
- Kumpulkan jurnal, statistik, studi kasus yang relevan
- Cek data tidak outdated (max 2 tahun untuk data ekonomi)
- Pastikan URL sumber aktif

## Primary vs Secondary Source Ratio (whitepaper-specific)

Whitepaper butuh lebih banyak primary sources dari pada artikel:

| Tipe | Definisi | Rasio ideal |
|------|----------|-------------|
| **Primary** | Publikasi asli: jurnal, laporan resmi, data BPS/OJK, studi asli | Min 70% |
| **Secondary** | Media yang mengutip primary source (Katadata, Kompas, dll.) | Max 30% |

Jika rasio primary < 50%, pertimbangkan: apakah topik ini cukup untuk whitepaper, atau lebih cocok jadi artikel?

## Data Sources Reference (sering dipakai TAM)

| Kategori | Sumber | URL/Tipe |
|----------|--------|----------|
| Ekonomi/makro | BPS | bps.go.id |
| Keuangan | OJK | ojk.go.id |
| Sosial/demografi | Jakpat | jakpat.com |
| Digital/medsos | We Are Social | wearesocial.com |
| Fintech/payment | Bank Indonesia | bi.go.id |
| Startup/bisnis | Katadata | katadata.co.id |
| Pendidikan/ketenagakerjaan | Kemnaker | kemnaker.go.id |
| Kesehatan mental | Kemenkes | kemkes.go.id |
| Global comparison | World Bank, ILO, OECD | worldbank.org, ilo.org, oecd.org |
| Akademik | Google Scholar | scholar.google.com |

## Keyword Research (tanpa paid tools)

1. **Google Suggest:** Ketik topik di Google, catat autocomplete suggestions
2. **People Also Ask:** Buka PAA section, catat semua pertanyaan
3. **Related Searches:** Scroll ke bawah Google, catat related searches
4. **Google Trends:** Cek tren topik (trends.google.com), bandingkan dengan topik terkait
5. **Answer The Public:** answerthepublic.com (free tier) untuk pertanyaan WH-questions

Catat 10-15 keyword utama + 5-10 long-tail keywords.

## Competitor Analysis Framework (6 aspek)

| Aspek | Yang dicari | Tool |
|-------|-------------|------|
| **Siapa** | Top 5 whitepaper/report di topik yang sama | Google: "topik + whitepaper/report/riset Indonesia" |
| **Sudut** | Angle mereka (pro/kontra/netral) | Baca executive summary |
| **Data** | Data apa yang mereka pakai | Cek sources/bibliography |
| **Gap** | Apa yang tidak mereka bahas | Bandingkan dengan daftar sub-topik |
| **Tone** | Formal/akademis/jurnalistik/populer | Baca 2-3 paragraf |
| **Distribution** | Di mana mereka publish | LinkedIn/Medium/website sendiri/journal |

Isi tabel ini untuk top 3 competitor. TAM angle harus berbeda dari semua 3.

## AI SEO/AEO Research

Cek apakah AI search engines (ChatGPT, Perplexity, Google AI Overviews) sudah cite sumber untuk topik ini:

1. Tanya ChatGPT: "Apa data terbaru tentang [topik] di Indonesia?"
2. Tanya Perplexity: "Riset terbaru tentang [topik] Indonesia"
3. Cek Google AI Overviews: search topik di Google (desktop, US/ID)

Catat: sumber mana yang AI cite? TAM perlu muncul di sumber-sumber itu atau menjadi sumber yang lebih authoritative.

## Source Verification

- **Tier 1:** Terverifikasi langsung dari publikasi asli
- **Tier 2:** Kutipan media sekunder, wajib label atribusi
- Hapus: dead link, sample terlalu kecil (n < 5.000), blog post tanpa data primer

## Command cek HTTP status inline links

```bash
node -e "
const fs = require('fs');
const a = JSON.parse(fs.readFileSync(process.env.ARTICLE_JSON || '/tmp/tam-article.json', 'utf8'));
const body = a.body || '';
const urls = [...body.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(m => m[1]);
(async () => {
  for (const url of urls) {
    try {
      const res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(10000) });
      console.log((res.status >= 200 && res.status < 400 ? 'OK' : 'DEAD') + ' [' + res.status + '] ' + url);
    } catch (e) { console.log('DEAD [ERR] ' + url); }
  }
})();
"
```

## Template Output Research

```markdown
## Riset Whitepaper: [Judul working]

### Keywords
**Utama (10-15):** [daftar keyword]
**Long-tail (5-10):** [daftar keyword]

### Data Sources
| # | Sumber | Tipe | URL | Tahun | Data utama | Tier |
|---|--------|------|-----|------|------------|------|
| 1 | BPS | Primary | bps.go.id/... | 2025 | Data X | 1 |
| 2 | OJK | Primary | ojk.go.id/... | 2024 | Data Y | 1 |
| 3 | Katadata | Secondary | katadata.co.id/... | 2025 | Data Z | 2 |

### Competitor Analysis
| Kompetitor | Angle | Data | Gap (TAM bisa isi) | Tone |
|------------|-------|------|---------------------|------|
| [Nama] | [Angle] | [Data] | [Gap] | [Tone] |

### AI SEO Check
- ChatGPT cite: [sumber mana yang AI cite]
- Perplexity cite: [sumber mana]
- Google AI Overviews: [ada/tidak]

### Primary/Secondary Ratio
- Primary: [N] sumber ([X]%)
- Secondary: [N] sumber ([Y]%)
```

## Checklist

- [ ] Minimal 5 sumber primer terkumpul
- [ ] Primary source ratio > 70%
- [ ] Data tidak outdated
- [ ] Semua source URL aktif (command HTTP check)
- [ ] Tidak ada dead link
- [ ] Keyword research selesai (10-15 utama + 5-10 long-tail)
- [ ] Competitor analysis top 3 selesai
- [ ] AI SEO check selesai
- [ ] Template output research diisi

## Next

Lanjut ke `/whitepaper-03-strategy`
