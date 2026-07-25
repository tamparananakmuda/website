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

## Checklist

- [ ] Minimal 5 sumber primer terkumpul
- [ ] Data tidak outdated
- [ ] Semua source URL aktif
- [ ] Tidak ada dead link

## Next

Lanjut ke `/whitepaper-03-strategy`
