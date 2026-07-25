---
description: Seri step 14 - Perbaikan roadmap berdasarkan data
---

# 14-iterate

Perbaikan roadmap berdasarkan data.

## Prev

Dari `/seri-13-monitor`

## Berdasarkan data dari 13-monitor

- Jika part tertentu underperform: analisis kenapa, update content
- Jika completion rate rendah di part X: pertimbangkan rewrite atau merge
- Jika seri overall perform baik: plan seri lanjutan atau spin-off
- Update data jika ada survei baru yang relevan

## Rollback (jika perlu hapus part)

```bash
rm content/articles/SLUG.md
npx tsx -e "const { readFileSync } = require('fs'); const { join } = require('path'); const envPath = join(process.cwd(), '.env.local'); const envContent = readFileSync(envPath, 'utf8'); envContent.split('\n').forEach((line) => { const t = line.trim(); if (!t || t.startsWith('#')) return; const i = t.indexOf('='); if (i === -1) return; const k = t.substring(0, i).trim(); const v = t.substring(i + 1).trim(); if (!process.env[k]) process.env[k] = v; }); const { db } = require('./lib/db'); const { postMetadata } = require('./lib/db/schema'); const { eq } = require('drizzle-orm'); db.delete(postMetadata).where(eq(postMetadata.slug, 'SLUG')).then(() => console.log('deleted: SLUG')).catch(console.error);"
```

## Checklist

- [ ] Data performa seri dianalisis
- [ ] Part underperform diidentifikasi
- [ ] Update/rewrite dilakukan jika perlu
- [ ] Roadmap seri diadjust berdasarkan data

## Next

Kembali ke `/seri-01-idea` untuk seri baru, atau `/content-ideation` untuk ide baru
