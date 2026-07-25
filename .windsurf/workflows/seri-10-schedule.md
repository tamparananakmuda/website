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

## Next

Lanjut ke `/seri-11-publish`
