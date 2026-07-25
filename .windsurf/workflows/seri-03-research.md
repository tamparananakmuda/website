---
description: Seri step 03 - Keyword research, competitor analysis, data pendukung untuk seluruh seri
---

# 03-research

Keyword research, competitor analysis, data pendukung, dan referensi untuk seluruh seri.

## Prev

Dari `/seri-02-strategy`

## Keyword Research (tanpa paid tools)

### Google Suggest + PAA + Related Searches

1. Buka Google (incognito), ketik keyword utama seri
2. Catat Google Suggest (autocomplete dropdown)
3. Scroll ke bawah, catat "People Also Ask" (PAA)
4. Scroll ke bawah, catat "Related Searches"
5. Ulangi untuk setiap part

### Google Trends

1. Buka `trends.google.com`
2. Masukkan keyword utama seri
3. Cek: tren naik/turun/stabil, region tertinggi (Indonesia), related queries
4. Catat related queries yang relevan untuk tiap part

### Target keyword per part

- 3-8 keyword long-tail per part, Bahasa Indonesia
- Identifikasi keyword yang bisa dipakai di multiple parts

## Cross-Part Keyword Mapping

Buat tabel keyword mapping untuk hindari kanibalisme SEO:

| Keyword | Part 1 | Part 2 | Part 3 | Part 4 |
|---------|--------|--------|--------|--------|
| "detoks dopamin" | Primary | Secondary | - | - |
| "dopamine detox cara" | - | Primary | - | - |
| "efek dopamin otak" | Secondary | - | Primary | - |

Aturan:
- 1 keyword hanya boleh jadi **Primary** di 1 part
- Bisa jadi **Secondary** di part lain (disebut sekilas)
- Jangan ada 2 part targeting keyword yang sama sebagai Primary

## Competitor Analysis

Cek apakah ada seri serupa dari media lain:

| Aspek | Cari |
|-------|------|
| Topik serupa | Google: `site:medium.com "TOPIK"` atau `site:kompas.com "TOPIK"` |
| Format | Artikel tunggal atau seri? Berapa part? |
| Angle | Angle mereka apa? Kontra-narasi atau konvensional? |
| Data | Sumber data mereka apa? BPS, survei, opini? |
| Depth | Surface-level atau deep-dive? |
| Gap | Apa yang mereka TIDAK bahas? (ini peluang TAM) |

## AI SEO/AEO Research

Pastikan seri mudah di-cite oleh AI search engines (ChatGPT, Perplexity, Google AI Overviews):

1. **Cek kompetitor di AI search:** Query keyword utama di ChatGPT/Perplexity, lihat sumber mana yang di-cite
2. **Identifikasi format yang AI-friendly:** Struktur Q&A, definisi jelas di paragraf pertama, data spesifik dengan sumber
3. **Plan untuk setiap part:** Setiap part harus punya minimal 1 paragraf yang bisa di-cite AI (definisi, data, atau jawaban langsung)
4. **Structured data:** Plan FAQPage schema untuk part yang punya Q&A section

## Data Pendukung

- Kumpulkan data sources untuk seluruh seri
- Pastikan data cukup untuk semua part
- Setiap part minimal 2 data points dengan sumber

## Command cek HTTP status semua source references

```bash
# Cek semua URL di research output
echo "https://sumber1.com" >> /tmp/urls.txt
echo "https://sumber2.com" >> /tmp/urls.txt
while read url; do
  status=$(curl -s -o /dev/null -w "%{http_code}" -L "$url")
  echo "$status | $url"
done < /tmp/urls.txt
rm /tmp/urls.txt
```

## Template Output Research

```
SERI: [nama seri]

KEYWORD MAP:
| Keyword | Part | Role | Volume est. |
|---------|------|------|-------------|
| ... | ... | Primary/Secondary | ... |

COMPETITOR ANALYSIS:
- Kompetitor 1: [nama media] - [angle] - [gap yang TAM bisa isi]
- Kompetitor 2: ...

AI SEO/AEO:
- Query AI search: [hasil query, sumber yang di-cite]
- Format AI-friendly: [Q&A / definisi / data]
- FAQ schema plan: [part mana yang butuh FAQPage]

DATA PENDUKUNG PER PART:
- Part 1: [data point 1 (sumber)], [data point 2 (sumber)]
- Part 2: [data point 1 (sumber)], [data point 2 (sumber)]
...

SOURCE REFERENCES:
- [URL] - [label] - [HTTP status]
```

## Checklist

- [ ] Keyword research per part selesai (Google Suggest/PAA/Related/Trends)
- [ ] Cross-part keyword mapping dibuat (no kanibalisme)
- [ ] Competitor analysis selesai (6 aspek)
- [ ] AI SEO/AEO research selesai
- [ ] Data pendukung cukup untuk semua part (min 2 per part)
- [ ] Semua source URL aktif (HTTP 200)
- [ ] Template output research diisi

## Next

Lanjut ke `/seri-04-outline`
