---
description: Whitepaper step 14 - Revisi jika ada data atau temuan baru
---

# 14-update

Revisi jika ada data atau temuan baru.

## Prev

Dari `/whitepaper-13-monitor`

## Monthly

- Cek apakah data di whitepaper masih relevan
- Update jika ada survei/studi baru yang relevan
- Cek internal links masih aktif
- Refresh SEO jika ranking turun

## Quarterly

- Review whitepaper secara keseluruhan
- Identifikasi whitepaper untuk update vs archive
- Plan whitepaper baru berdasarkan performa

## Command cek internal links aktif

```bash
# Cek semua internal link di whitepaper
npx tsx -e "
const fs = require('fs'); const path = require('path');
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const t = line.trim(); if (!t || t.startsWith('#')) return;
    const i = t.indexOf('='); if (i === -1) return;
    process.env[t.substring(0, i).trim()] = t.substring(i + 1).trim();
  });
}
const { db } = require('./lib/db'); const { whitepapers } = require('./lib/db/schema'); const { eq } = require('drizzle-orm');
db.select().from(whitepapers).where(eq(whitepapers.slug, 'SLUG')).then(r => {
  const w = r[0]; if (!w) { console.error('NOT FOUND'); process.exit(1); }
  const links = [...w.body.matchAll(/\]\(\/(artikel|whitepaper)\/([^)]+)\)/g)].map(m => m[2]);
  const { existsSync } = require('fs');
  const { join } = require('path');
  links.forEach(slug => {
    const filePath = join(process.cwd(), 'content', 'articles', slug + '.md');
    console.log((existsSync(filePath) ? 'OK' : 'BROKEN') + ': ' + slug);
  });
});
"
```

## Update Process Step-by-Step

1. Update body di `$ARTICLE_JSON`
2. Jalankan ulang `/whitepaper-09-qc` untuk verifikasi
3. Jalankan ulang `/whitepaper-10-humanizer` untuk verifikasi
4. Update DB:
   ```bash
   npx tsx -e "
   const fs = require('fs'); const path = require('path');
   const envPath = path.join(process.cwd(), '.env.local');
   if (fs.existsSync(envPath)) {
     fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
       const t = line.trim(); if (!t || t.startsWith('#')) return;
       const i = t.indexOf('='); if (i === -1) return;
       process.env[t.substring(0, i).trim()] = t.substring(i + 1).trim();
     });
   }
   const { db } = require('./lib/db'); const { whitepapers } = require('./lib/db/schema'); const { eq } = require('drizzle-orm');
   const wp = JSON.parse(fs.readFileSync(process.env.ARTICLE_JSON || '/tmp/tam-article.json', 'utf8'));
   db.update(whitepapers).set({
     body: wp.body, summary: wp.summary, title: wp.title, subtitle: wp.subtitle || null,
     tags: wp.tags || [], readingTime: wp.reading_time || 10,
   }).where(eq(whitepapers.slug, wp.slug)).then(() => {
     console.log('Whitepaper updated:', wp.slug);
   }).catch(e => console.error('FATAL:', e.message));
   "
   ```
5. Regenerate OG image jika title berubah
6. Submit ulang URL ke Google Search Console

## Kapan Update vs Tulis Baru

| Kondisi | Action |
|---------|--------|
| Data outdated, angle masih relevan | Update whitepaper |
| Ranking turun, konten masih bagus | Update SEO + tambah konten baru |
| Topik butuh refresh total | Tulis whitepaper baru |
| Ada data baru yang signifikan | Update + tulis artikel baru jika insight berbeda |
| Whitepaper tidak relevan lagi | Archive (set status draft) atau hapus |

## Rollback (jika perlu hapus whitepaper)

```bash
npx tsx -e "
const fs = require('fs'); const path = require('path');
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const t = line.trim(); if (!t || t.startsWith('#')) return;
    const i = t.indexOf('='); if (i === -1) return;
    process.env[t.substring(0, i).trim()] = t.substring(i + 1).trim();
  });
}
const { db } = require('./lib/db'); const { whitepapers } = require('./lib/db/schema'); const { eq } = require('drizzle-orm');
db.delete(whitepapers).where(eq(whitepapers.slug, 'SLUG')).then(() => console.log('Whitepaper deleted: SLUG')).catch(e => console.error('FATAL:', e.message));
"
```

## Checklist

- [ ] Data masih relevan (monthly check)
- [ ] Internal links masih aktif (monthly check)
- [ ] SEO ranking stabil atau naik (monthly check)
- [ ] Whitepaper review dilakukan (quarterly)

## Next

Kembali ke `/whitepaper-01-idea` untuk whitepaper baru, atau `/content-ideation` untuk ide baru
