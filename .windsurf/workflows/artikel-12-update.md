---
description: Artikel step 12 - Refresh konten, update data, tambah insight
---

# 12-update

Refresh konten, update data, dan tambah insight.

## Prev

Dari `/artikel-11-monitor`

## Monthly

- Cek apakah data di artikel masih relevan
- Update jika ada survei baru yang relevan
- Cek internal links masih aktif
- Refresh SEO jika ranking turun

## Command cek internal links masih aktif

```bash
# Cek semua internal link di artikel
grep -oP '\]\(/artikel/[^)]+\)' content/articles/*/SLUG.md \
  | while read link; do
    slug=$(echo "$link" | grep -oP '/artikel/\K[^)]+')
    if find content/ -name "$slug.md" -print -quit | grep -q .; then
      echo "OK: $slug"
    else
      echo "BROKEN: $slug"
    fi
  done

# Cek link dari artikel lain ke artikel ini (reverse)
grep -rl "/artikel/SLUG" content/articles/ --include="*.md" \
  | while read f; do echo "Linked from: $(basename $f)"; done
```

## Command cek SEO ranking via Google Search Console

1. Buka Google Search Console
2. Pilih property `tamparananakmuda.com`
3. Search: `artikel/SLUG`
4. Cek: impressions, clicks, CTR, average position
5. Bandingkan dengan 30 hari sebelumnya
6. Jika ranking turun > 5 posisi: perlu update

## Update Process Step-by-Step

1. Edit file `content/articles/KATEGORI/SLUG.md` (update data, tambah insight, fix link)
2. Update `sourceReferences` di frontmatter jika ada sumber baru
3. Update `publishedAt` tetap tanggal asli (jangan reset)
4. Jalankan ulang `/artikel-07-qc` untuk verifikasi
5. Jalankan ulang `/artikel-08-humanizer` untuk verifikasi
6. Regenerate OG image jika title/ogHeadline berubah:
   ```bash
   curl -s -X POST "https://tamparananakmuda.com/api/og/generate" \
     -H "Content-Type: application/json" -H "Cookie: <admin-session-cookie>" \
     -d '{"slug":"SLUG"}'
   ```
7. Deploy: `git add -A && git commit -m "update: refresh article SLUG" && git push origin main`
8. Submit ulang URL ke Google Search Console

## Quarterly

- Review artikel di cluster topik yang sama
- Identifikasi artikel untuk update vs archive
- Plan seri konten baru berdasarkan performa

## Kapan Update vs Tulis Artikel Baru

| Kondisi | Action |
|---------|--------|
| Data outdated, angle masih relevan | Update artikel existing |
| Ranking turun, konten masih bagus | Update SEO + tambah konten baru |
| Topik masih relevan tapi angle sudah lemah | Tulis artikel baru dengan angle berbeda |
| Topik tidak relevan lagi | Archive (set status draft) atau biarkan |
| Traffic stabil, tidak ada data baru | Biarkan, fokus ke artikel baru |
| Ada data baru yang signifikan | Update artikel existing + tulis artikel baru jika insight berbeda |

## Rollback (jika perlu hapus artikel)

```bash
rm content/articles/KATEGORI/SLUG.md
npx tsx -e "const { readFileSync } = require('fs'); const { join } = require('path'); const envPath = join(process.cwd(), '.env.local'); const envContent = readFileSync(envPath, 'utf8'); envContent.split('\n').forEach((line) => { const t = line.trim(); if (!t || t.startsWith('#')) return; const i = t.indexOf('='); if (i === -1) return; const k = t.substring(0, i).trim(); const v = t.substring(i + 1).trim(); if (!process.env[k]) process.env[k] = v; }); const { db } = require('./lib/db'); const { postMetadata } = require('./lib/db/schema'); const { eq } = require('drizzle-orm'); db.delete(postMetadata).where(eq(postMetadata.slug, 'SLUG')).then(() => console.log('post_metadata deleted: SLUG')).catch(console.error);"
```

## Checklist

- [ ] Data masih relevan (monthly check)
- [ ] Internal links masih aktif (monthly check)
- [ ] SEO ranking stabil atau naik (monthly check)
- [ ] Cluster review dilakukan (quarterly)

## Next

Kembali ke `/artikel-01-idea` untuk artikel baru, atau `/content-ideation` untuk ide baru
