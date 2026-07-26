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

## Update Quality Score (0-10)

Score update sebelum deploy. Target: minimal 7.

| Factor | Weight | 0 (fail) | 1 (ok) | 2 (strong) |
|--------|--------|----------|--------|------------|
| **Data freshness** | 2 | Data masih outdated | Sebagiane update | Semua data updated |
| **Source update** | 1 | Tidak tambah source | Tambah 1 | Tambah 2+ source baru |
| **Internal links** | 1 | Masih ada broken | Sebagiane fix | Semua fix + tambah baru |
| **SEO refresh** | 1 | Tidak update meta | Update sebagiane | Meta + slug + keywords update |
| **QC re-run** | 2 | Tidak re-run | Re-run tapi FAIL | Re-run CLEAN |
| **Humanizer re-run** | 1 | Tidak re-run | Re-run tapi ada issue | CLEAN |
| **OG regenerate** | 1 | Tidak regenerate | Regenerate | Regenerate + verify CDN |
| **GSC resubmit** | 1 | Tidak resubmit | Resubmit | Resubmit + verify |

Jika score < 7: update belum cukup, tambah depth atau fix issues.

## Content Refresh Protocol

Protocol untuk refresh artikel yang sudah publish:

| Step | Action | Check |
|------|--------|-------|
| **1. Audit** | Cek data freshness, internal links, SEO ranking | Decay signals teridentifikasi |
| **2. Research** | Cari data baru, source baru, insight baru | Min 1 new data point |
| **3. Update body** | Edit konten, tambah insight, fix data | Body updated |
| **4. Update frontmatter** | sourceReferences, seoMeta, tags | Frontmatter updated |
| **5. Re-run QC** | `/artikel-07-qc` | CLEAN |
| **6. Re-run humanizer** | `/artikel-08-humanizer` | CLEAN |
| **7. Regenerate OG** | Jika title/ogHeadline berubah | CDN 200 |
| **8. Deploy** | `git push` | Vercel success |
| **9. Resubmit GSC** | Submit URL ke Google Search Console | Submitted |
| **10. Verify** | H+1 check: HTTP 200, schema, sitemap | All pass |

## Update Triggers

| Trigger | Threshold | Action priority |
|---------|-----------|-----------------|
| **Data outdated** | > 2 tahun (ekonomi), > 1 tahun (teknologi) | High |
| **Traffic decline** | > 30% drop dalam 30 hari | High |
| **Ranking decline** | > 5 posisi di Google | Medium |
| **CTR decline** | < 1% di GSC | Medium |
| **Broken links** | Ada 404 internal | High |
| **New data available** | BPS/survei rilis data baru | Medium |
| **Cluster expansion** | Artikel baru di cluster, perlu link | Low |
| **AI citation decline** | Tidak di-cite lagi oleh AI | Low |

## Cluster Update Strategy

Saat update 1 artikel di cluster, cek artikel lain di cluster yang sama:

| Check | Cara | Action |
|-------|------|--------|
| **Cross-reference** | Cek artikel lain di kategori/pillar sama | Update jika data juga outdated |
| **Internal link network** | Cek semua link antar artikel di cluster | Fix broken, tambah new links |
| **Cluster performance** | Cek traffic semua artikel di cluster | Update yang underperform |
| **Series navigation** | Jika bagian seri, cek prev/next link | Fix jika ada yang hilang |

## Archive Protocol

Jika artikel perlu di-archive (tidak relevan lagi):

| Step | Action | Note |
|------|--------|------|
| **1. Set status** | `status: "draft"` di frontmatter | Tidak hilang dari file system |
| **2. Remove from featured** | `featured: false` | Tidak di homepage |
| **3. Check incoming links** | `grep -rl "/artikel/SLUG" content/articles/` | Fix atau redirect link |
| **4. Keep URL live** | Jangan hapus file, hanya set draft | 404 buruk untuk SEO |
| **5. GSC** | Jangan submit removal, biarkan de-index natural | Preserve link equity |
| **6. Note** | Catat kenapa di-archive di learning note | Future reference |

## Checklist

- [ ] Data masih relevan (monthly check)
- [ ] Internal links masih aktif (monthly check)
- [ ] SEO ranking stabil atau naik (monthly check)
- [ ] Update Triggers dicek (8 triggers)
- [ ] Content Refresh Protocol: 10 steps dijalankan jika ada trigger
- [ ] Cluster Update Strategy: cross-reference, link network, performance dicek
- [ ] QC re-run: CLEAN
- [ ] Humanizer re-run: CLEAN
- [ ] OG image regenerated jika title/ogHeadline berubah
- [ ] GSC resubmit setelah update
- [ ] Archive Protocol dijalankan jika perlu (status draft, bukan hapus)
- [ ] Update Quality Score: min 7 (dari 10)
- [ ] Cluster review dilakukan (quarterly)

## Next

Kembali ke `/artikel-01-idea` untuk artikel baru, atau `/content-ideation` untuk ide baru
