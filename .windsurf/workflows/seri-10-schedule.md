---
description: Seri step 10 - Jadwal rilis
---

# 10-schedule

Jadwal rilis.

## Prev

Dari `/seri-09-humanizer`

## Scheduling Strategy

- Setiap hari minimal 3 artikel di-publish
- Jam posting ideal: 08:00 WIB (01:00 UTC), 12:00 WIB (05:00 UTC), 17:00 WIB (10:00 UTC)
- **Publish langsung:** `status: "published"`, `published_at` di now/past
- **Scheduled:** `status: "scheduled"`, `published_at` di masa depan
  - Cron job every 5 min auto-publish + auto-generate OG images
  - Tidak perlu code deploy

## Verifikasi scheduling

```bash
npx tsx -e "
const { readFileSync } = require('fs');
const { join } = require('path');
const matter = require('gray-matter');
const filePath = join(process.cwd(), 'content', 'articles', 'SLUG' + '.md');
const { data: f } = matter(readFileSync(filePath, 'utf8'));
console.log('status:', f.status, '| publishedAt:', f.publishedAt);
if (f.status === 'scheduled') {
  const pubDate = new Date(f.publishedAt); const now = new Date();
  if (pubDate <= now) console.error('WARNING: publishedAt is past but status is scheduled!');
  else console.log('Will auto-publish in ~' + Math.ceil((pubDate.getTime() - now.getTime()) / 60000) + ' minutes');
}
"
```

## Seri scheduling tips

- Rilis part secara berurutan (part 1 dulu, lalu part 2, dst)
- Bisa schedule 1 part per hari atau 1 part per slot (08:00, 12:00, 17:00)
- Pastikan part 1 sudah live sebelum part 2 di-schedule (untuk internal linking)

## Checklist

- [ ] Jadwal rilis per part ditentukan
- [ ] `status` dan `publishedAt` benar per part
- [ ] `CRON_SECRET` set di Vercel dan GitHub Secrets (jika scheduled)
- [ ] GitHub Actions workflow deployed
- [ ] Part 1 publish/schedule sebelum part lain
- [ ] Gap antar part max 3 hari
- [ ] Schedule Verification: all pass
- [ ] Series Schedule Quality Score: min 8 (dari 10)

## Schedule Verification Protocol

| Check | Cara | Pass criteria |
|-------|------|---------------|
| **Part 1 first** | Cek publishedAt part 1 < part 2 | Ya |
| **No overlap** | Cek tidak ada 2 part di slot yang sama | Tidak ada |
| **Gap tolerance** | Cek gap antar part | Max 3 hari |
| **Slot consistency** | Cek semua part di slot 08:00/12:00/17:00 | Konsisten |
| **Cron awareness** | Cek cron job akan auto-publish | Ya, every 5 min |
| **Future date valid** | Cek publishedAt di masa depan untuk scheduled | Ya, > now |

## Series Schedule Quality Score (0-10)

Target: min 8.

| Factor | Weight | 0 | 1 | 2 |
|--------|--------|---|---|---|
| **Part 1 first** | 2 | Tidak | Ya | Ya + slot optimal |
| **Gap** | 1 | > 3 hari | 2-3 hari | 1 hari atau all-at-once |
| **Slot** | 1 | Random | Sebagiane | Konsisten 08/12/17 |
| **Status** | 1 | Salah | Sebagiane | Semua benar |
| **Cron** | 1 | Tidak set | Set tapi tidak verified | Set + verified |
| **Verification** | 1 | Tidak di-run | Run tapi issues | All pass |
| **Cadence** | 2 | Tidak konsisten | Sebagiane | Konsisten |
| **Binge-read** | 1 | Tidak possible | Possible setelah selesai | Designed for binge |

Jika score < 8: revisi schedule.

## Next

Lanjut ke `/seri-11-publish`
