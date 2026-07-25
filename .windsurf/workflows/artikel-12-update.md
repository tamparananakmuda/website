---
description: Artikel step 12 - Refresh konten, update data, tambah insight
---

# 12-update

Refresh konten, update data, dan tambah insight.

## Monthly

- Cek apakah data di artikel masih relevan
- Update jika ada survei baru yang relevan
- Cek internal links masih aktif
- Refresh SEO jika ranking turun

## Quarterly

- Review artikel di cluster topik yang sama
- Identifikasi artikel untuk update vs archive
- Plan seri konten baru berdasarkan performa

## Rollback (jika perlu hapus artikel)

```bash
rm content/articles/SLUG.md
npx tsx -e "const { readFileSync } = require('fs'); const { join } = require('path'); const envPath = join(process.cwd(), '.env.local'); const envContent = readFileSync(envPath, 'utf8'); envContent.split('\n').forEach((line) => { const t = line.trim(); if (!t || t.startsWith('#')) return; const i = t.indexOf('='); if (i === -1) return; const k = t.substring(0, i).trim(); const v = t.substring(i + 1).trim(); if (!process.env[k]) process.env[k] = v; }); const { db } = require('./lib/db'); const { postMetadata } = require('./lib/db/schema'); const { eq } = require('drizzle-orm'); db.delete(postMetadata).where(eq(postMetadata.slug, 'SLUG')).then(() => console.log('post_metadata deleted: SLUG')).catch(console.error);"
```

## Checklist

- [ ] Data masih relevan (monthly check)
- [ ] Internal links masih aktif (monthly check)
- [ ] SEO ranking stabil atau naik (monthly check)
- [ ] Cluster review dilakukan (quarterly)
