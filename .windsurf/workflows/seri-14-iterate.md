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
- [ ] Series Iterate Quality Score: min 7 (dari 10)

## Series Iterate Quality Score (0-10)

Target: min 7.

| Factor | Weight | 0 | 1 | 2 |
|--------|--------|---|---|---|
| **Data analysis** | 2 | Tidak dianalisis | Sebagiane | Full analysis per part + seri |
| **Iteration decision** | 2 | Tidak ada | Vague | Clear: spin-off/sequel/merge/archive |
| **Part-level update** | 1 | Tidak ada | Sebagiane | Underperform parts updated |
| **Internal links** | 1 | Broken | Sebagiane | All fixed |
| **SEO ranking** | 1 | Drop > 5 | Stabil | Naik atau stabil |
| **QC re-run** | 1 | Tidak re-run | Re-run tapi FAIL | CLEAN |
| **Humanizer re-run** | 1 | Tidak re-run | Re-run tapi issues | CLEAN |
| **Roadmap update** | 1 | Tidak update | Vague | Clear next steps |

Jika score < 7: tambah analisis atau update sebelum close seri.

## Series-Level Iteration Decision Matrix

| Data dari 13-monitor | Decision | Action |
|----------------------|----------|--------|
| **Overall completion > 20%, engagement tinggi** | Spin-off atau sequel | Plan seri baru |
| **Part X drop-off tinggi** | Rewrite part X | Rewrite hook + tighten content |
| **Overall completion < 10%** | Merge parts atau restructure | Gabung part tipis, perbaiki arc |
| **Seri tidak ter-index > 50%** | SEO audit + resubmit | Fix technical SEO |
| **AI citation: 0** | Format ulang untuk AI | Tambah definisi, FAQ, data self-contained |
| **Part terakhir underperform** | Rewrite ending atau tambah part | Strengthen climax |
| **Seri overall underperform** | Archive atau refresh all | Set draft atau update semua part |
| **Data outdated di semua part** | Refresh all | Update + re-run QC + humanizer |

## Series Archive Protocol

Jika seri perlu di-archive:

| Step | Action | Note |
|------|--------|------|
| **1. Set status** | `status: "draft"` di frontmatter semua part | Tidak hilang dari file system |
| **2. Remove from featured** | `featured: false` semua part | Tidak di homepage |
| **3. Check incoming links** | `grep -rl "SERIES-SLUG" content/` | Fix atau redirect |
| **4. Keep URL live** | Jangan hapus file, hanya set draft | 404 buruk untuk SEO |
| **5. Series page** | Series page tetap ada tapi menampilkan "seri tidak lagi aktif" | Preserve link equity |
| **6. GSC** | Biarkan de-index natural | Jangan submit removal |
| **7. Note** | Catat kenapa di-archive di learning note | Future reference |

## Spin-off Planning Protocol

Jika data menunjukkan 1 part sangat perform dan punya depth untuk seri baru:

| Step | Action |
|------|--------|
| **1. Identify** | Part mana yang perform di atas average? |
| **2. Depth check** | Apakah topik part itu punya depth untuk 3-5 part baru? |
| **3. Angle** | Apakah angle spin-off berbeda dari seri original? |
| **4. Audience** | Apakah audience spin-off sama atau berbeda? |
| **5. Link** | Plan internal link dari spin-off ke seri original |
| **6. Schedule** | Kapan spin-off publish? Setelah seri original selesai? |
| **7. Workflow** | Mulai dari `/seri-01-idea` dengan ide spin-off |

## Next

Kembali ke `/seri-01-idea` untuk seri baru, atau `/content-ideation` untuk ide baru
