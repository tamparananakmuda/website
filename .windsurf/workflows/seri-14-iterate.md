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

## Command cek internal links antar part masih aktif

```bash
# Cek semua internal link di semua part seri
for slug in SERIES-SLUG-PART-1 SERIES-SLUG-PART-2 SERIES-SLUG-PART-3; do
  echo "=== $slug ==="
  grep -oP '\]\(/artikel/[^)]+\)' "content/seri/SERIES-SLUG/$slug.md" \
    | while read link; do
      target=$(echo "$link" | grep -oP '/artikel/\K[^)]+')
      if [ -f "content/seri/SERIES-SLUG/$target.md" ] || [ -f "content/articles/*/$target.md" ]; then
        echo "OK: $target"
      else
        echo "BROKEN: $target"
      fi
    done
done

# Cek link dari artikel lain ke seri ini (reverse)
grep -rl "SERIES-SLUG" content/ --include="*.md" \
  | while read f; do echo "Linked from: $(basename $f)"; done
```

## Command cek SEO ranking via Google Search Console

1. Buka Google Search Console
2. Pilih property `tamparananakmuda.com`
3. Search: `SERIES-SLUG-PART` (query partial untuk catch semua part)
4. Cek per part: impressions, clicks, CTR, average position
5. Bandingkan dengan 30 hari sebelumnya
6. Jika ranking turun > 5 posisi: perlu update

## Update Process Step-by-Step (per part)

1. Edit file `content/seri/SERIES-SLUG/SLUG.md` (update data, tambah insight, fix link)
2. Update `sourceReferences` di frontmatter jika ada sumber baru
3. Update `publishedAt` tetap tanggal asli (jangan reset)
4. Jalankan ulang `/seri-08-qc` untuk verifikasi
5. Jalankan ulang `/seri-09-humanizer` untuk verifikasi
6. Regenerate OG image jika title/ogHeadline berubah:
   ```bash
   curl -s -X POST "https://tamparananakmuda.com/api/og/generate" \
     -H "Content-Type: application/json" -H "Cookie: <admin-session-cookie>" \
     -d '{"slug":"SLUG"}'
   ```
7. Deploy: `git add -A && git commit -m "update: refresh seri part SLUG" && git push origin main`
8. Submit ulang URL ke Google Search Console

## Kapan Update vs Tulis Baru (seri-specific)

| Kondisi | Action |
|---------|--------|
| Data outdated di 1 part, angle masih relevan | Update part tersebut |
| Ranking turun di 1 part, konten masih bagus | Update SEO + tambah konten baru di part itu |
| Completion rate rendah di part X | Rewrite part X atau merge dengan part sebelumnya |
| Seri overall underperform | Evaluasi: rewrite semua atau archive seri |
| Seri perform baik, ada topik turunan | Bikin spin-off seri atau artikel tunggal |
| Ada data baru yang signifikan | Update part terkait + tulis artikel baru jika insight berbeda |
| Part terakhir underperform tapi seri awal bagus | Pertimbangkan: rewrite ending atau buat part tambahan |

## Series-Level Iteration Options

| Opsi | Kapan | Cara |
|------|-------|------|
| **Spin-off** | Topik di 1 part menarik untuk di-dalam lebih | Bikin seri baru yang fokus ke topik itu |
| **Sequel** | Seri sukses, ada lanjutan logis | Bikin seri "Season 2" dengan topik advance |
| **Merge parts** | 2 part terlalu tipis/overlapping | Gabung jadi 1 part, update seriesOrder |
| **Split part** | 1 part terlalu padat | Pecah jadi 2 part, update seriesOrder |
| **Archive seri** | Seri tidak relevan lagi | Set semua part status draft, atau hapus |
| **Refresh all** | Data outdated di semua part | Update semua part sekaligus, re-run QC + humanizer |

## Rollback (jika perlu hapus part)

```bash
rm content/seri/SERIES-SLUG/SLUG.md
npx tsx -e "const { readFileSync } = require('fs'); const { join } = require('path'); const envPath = join(process.cwd(), '.env.local'); const envContent = readFileSync(envPath, 'utf8'); envContent.split('\n').forEach((line) => { const t = line.trim(); if (!t || t.startsWith('#')) return; const i = t.indexOf('='); if (i === -1) return; const k = t.substring(0, i).trim(); const v = t.substring(i + 1).trim(); if (!process.env[k]) process.env[k] = v; }); const { db } = require('./lib/db'); const { postMetadata } = require('./lib/db/schema'); const { eq } = require('drizzle-orm'); db.delete(postMetadata).where(eq(postMetadata.slug, 'SLUG')).then(() => console.log('deleted: SLUG')).catch(console.error);"
```

Jika hapus part di tengah seri, **WAJIB update seriesOrder** part setelahnya.

## Checklist

- [ ] Data performa seri dianalisis (dari 13-monitor)
- [ ] Command cek internal links antar part: no broken
- [ ] Command cek SEO ranking: tidak ada drop > 5 posisi
- [ ] Part underperform diidentifikasi
- [ ] Update/rewrite dilakukan jika perlu
- [ ] Series-level iteration decision dibuat (spin-off/sequel/merge/split/archive/refresh)
- [ ] Roadmap seri diadjust berdasarkan data

## Next

Kembali ke `/seri-01-idea` untuk seri baru, atau `/content-ideation` untuk ide baru
