---
description: Artikel step 02 - Keyword research, competitor analysis, data pendukung, dan referensi
---

# 02-research

Keyword research, competitor analysis, data pendukung, dan referensi.

## Keyword Research

- Target: 3-8 keyword long-tail, Bahasa Indonesia
- Prioritas: search volume medium + difficulty low
- Cek 3 artikel pertama Google untuk keyword target

## Competitor Analysis

- Baca 3 artikel pertama Google untuk keyword target
- Identifikasi gap: apa yang mereka tidak bahas?
- Minimal 1 insight unik yang tidak ada di 3 artikel tersebut

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

## Checklist

- [ ] Keyword research selesai (3-8 long-tail keyword)
- [ ] Competitor analysis selesai (3 artikel Google diperiksa)
- [ ] Minimal 1 insight unik teridentifikasi
- [ ] Data pendukung terkumpul (min 2 sources)
- [ ] Semua source URL aktif (HTTP 200-399)
- [ ] Tidak ada dead link

## Next

Lanjut ke `/artikel-03-outline`
