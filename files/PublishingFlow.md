# Publishing & Scheduling Flow

Dokumentasi ini menjelaskan siapa yang melakukan scheduling, siapa yang melakukan publishing, dan bagaimana alurnya bekerja end-to-end.

---

## Overview

TAM punya dua cara untuk publish artikel:

1. **Direct Publish** - artikel langsung live saat insert
2. **Scheduled Publish** - artikel dijadwalkan, auto-publish oleh cron job

---

## Flow Diagram

```
[Author/Cascade]
      │
      ├── Direct Publish ──────────────────────────────┐
      │   status = "published"                         │
      │   published_at = now()                         │
      │                                                ▼
      │                                        [Artikel live di website]
      │                                                ▲
      ├── Scheduled Publish ───────────────────────────┤
      │   status = "scheduled"                         │
      │   published_at = "2026-07-16T08:00:00Z"        │
      │                                                │
      │   [Database: status=scheduled, published_at    │
      │    di masa depan]                              │
      │           │                                    │
      │           │  Cron job jalan every 5 min        │
      │           │  (GitHub Actions)                  │
      │           ▼                                    │
      │   [/api/cron/publish-scheduled]                │
      │   - Query: status=scheduled                    │
      │     AND published_at <= now()                  │
      │   - Update: status -> "published"              │
      │   - Auto-generate OG images (R2 CDN)           │
      │           │                                    │
      │           └────────────────────────────────────┘
      │
      └── Draft (tidak publish)
          status = "draft" | "review" | "fact-check"
          published_at = null
          [Artikel tidak muncul di website]
```

---

## Siapa Apa?

### Yang Melakukan Scheduling

**Actor: Author/Cascade (saat insert artikel via workflow)**

Saat insert artikel ke database, author (atau Cascade via `/post-article-execution` workflow) menentukan:

| Field | Direct Publish | Scheduled Publish | Draft |
|-------|---------------|-------------------|-------|
| `status` | `"published"` | `"scheduled"` | `"draft"` |
| `published_at` | `now()` (waktu insert) | waktu publish di masa depan (ISO 8601) | `null` |

**Contoh scheduled publish:**
```json
{
  "status": "scheduled",
  "published_at": "2026-07-16T08:00:00.000Z"
}
```

Artikel dengan konfigurasi di atas akan:
- TIDAK muncul di website sampai waktu publish tiba
- Muncul di admin dashboard dengan status "scheduled"
- Auto-publish oleh cron job saat `published_at <= now()`

### Yang Melakukan Publishing (Auto)

**Actor: GitHub Actions Cron Job (`/api/cron/publish-scheduled`)**

GitHub Actions menjalankan cron job setiap 5 menit (schedule: `*/5 * * * *`).

**Cron job melakukan:**
1. Cek semua posts dengan `status = 'scheduled'` DAN `published_at <= now()`
2. Update status semua posts yang match menjadi `'published'`
3. Auto-generate OG images (card + feature WebP) untuk setiap artikel yang di-publish, upload ke R2 CDN
4. Return jumlah artikel yang di-publish

**File:** `app/api/cron/publish-scheduled/route.ts`
**Config:** `.github/workflows/publish-scheduled.yml` -> `schedule: */5 * * * *`
**Auth:** Header `Authorization: Bearer $CRON_SECRET` (env var `CRON_SECRET`)

**Respon cron job:**
```json
{
  "published": 2,
  "slugs": ["artikel-1", "artikel-2"]
}
```

### Yang Melakukan Publishing (Manual)

**Actor: Admin via dashboard `/admin`**

Admin bisa login ke dashboard dan manual publish artikel:
1. Buka artikel dengan status draft/review/fact-check
2. Klik "Publish"
3. Status berubah menjadi `published`, `published_at` di-set ke `now()`

---

## Frontend Filtering (Kenapa Scheduled Tidak Muncul)

Semua query frontend (homepage, artikel page, kategori, search, sitemap) memfilter dengan DUA kondisi via Drizzle ORM:

```typescript
.where(and(eq(posts.status, 'published'), lte(posts.publishedAt, new Date().toISOString())))
```

Artinya:
- `status = 'published'` -> hanya artikel yang sudah di-publish
- `published_at <= now()` -> hanya artikel yang waktu publish-nya sudah lewat

**Dua lapis filter ini memastikan:**
1. Artikel `scheduled` tidak muncul (status belum `published`)
2. Artikel `published` dengan `published_at` di masa depan juga tidak muncul (safety net)

---

## Status Lifecycle

```
draft ──> review ──> fact-check ──> published
                                   │
                          ┌────────┴────────┐
                          │                 │
                    direct publish    scheduled publish
                    (published_at     (published_at
                     = now())          = future date)
                                          │
                                     cron job
                                     publishes at
                                     published_at time
                                          │
                                          ▼
                                     published
```

### Status Values

| Status | Arti | Muncul di website? | Muncul di admin? |
|--------|------|-------------------|-----------------|
| `draft` | Artikel baru, belum siap | Tidak | Ya |
| `review` | Menunggu review editor | Tidak | Ya |
| `fact-check` | Menunggu fact-check | Tidak | Ya |
| `scheduled` | Siap publish, menunggu waktu | Tidak | Ya |
| `published` | Live di website | Ya | Ya |

---

## Cron Job Detail

### Konfigurasi

| Item | Value |
|------|-------|
| **Endpoint** | `/api/cron/publish-scheduled` |
| **Schedule** | `*/5 * * * *` (setiap 5 menit) |
| **Method** | `GET` |
| **Auth** | `Authorization: Bearer ${CRON_SECRET}` |
| **Max duration** | 60 detik |
| **File** | `app/api/cron/publish-scheduled/route.ts` |

### Cara Kerja

1. GitHub Actions hit endpoint setiap 5 menit
2. Endpoint cek auth header dengan `CRON_SECRET`
3. Query Drizzle ORM: `SELECT * FROM posts WHERE status = 'scheduled' AND published_at <= now()`
4. Jika ada hasil, update semua: `SET status = 'published'`
5. Auto-generate OG images (card 800x450 + feature 1600x900 WebP) via @vercel/og + sharp, upload ke R2 CDN
6. Return JSON dengan jumlah dan slug artikel yang di-publish

### Testing Cron Job Lokal

```bash
# Test manual (butuh server running)
curl -H "Authorization: Bearer $CRON_SECRET" \
  http://localhost:3000/api/cron/publish-scheduled

# Expected response jika ada artikel scheduled yang waktunya sudah tiba:
# {"published": 1, "slugs": ["pinjol-bukan-salah-kamu-sistem-didesain-menangkap"]}

# Expected response jika tidak ada:
# {"published": 0, "slugs": []}
```

### Env Var yang Dibutuhkan

| Env Var | Di mana | Fungsi |
|---------|---------|--------|
| `CRON_SECRET` | Vercel dashboard + GitHub Secrets | Auth token untuk cron job |
| `POSTGRES_URL` | Vercel + `.env.local` | PostgreSQL connection string untuk Drizzle ORM |
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel + `.env.local` | URL Supabase project (auth only) |
| `R2_ACCESS_KEY_ID` | Vercel + `.env.local` | Cloudflare R2 S3 access key |
| `R2_SECRET_ACCESS_KEY` | Vercel + `.env.local` | Cloudflare R2 S3 secret |
| `R2_ENDPOINT` | Vercel + `.env.local` | R2 S3 endpoint URL |
| `R2_BUCKET_NAME` | Vercel + `.env.local` | R2 bucket name (`cdn-tam`) |
| `CDN_BASE_URL` | Vercel + `.env.local` | CDN domain (`https://cdn.tamparananakmuda.com`) |

---

## Checklist Saat Insert Artikel

### Direct Publish (langsung live)

```json
{
  "status": "published",
  "published_at": "2026-07-15T08:00:00.000Z"
}
```

- [ ] `published_at` di-set ke `new Date().toISOString()`
- [ ] `status` = `"published"`
- [ ] Artikel langsung muncul di website

### Scheduled Publish (jadwalkan untuk nanti)

```json
{
  "status": "scheduled",
  "published_at": "2026-07-16T08:00:00.000Z"
}
```

- [ ] `published_at` di-set ke waktu publish di masa depan (format ISO 8601, timezone UTC)
- [ ] `status` = `"scheduled"`
- [ ] Artikel TIDAK muncul di website sampai cron job publish
- [ ] Cron job akan publish saat `published_at <= now()` (maksimal 5 menit setelah waktu yang di-set, karena cron jalan every 5 min)
- [ ] Pastikan `CRON_SECRET` sudah di-set di Vercel dashboard DAN GitHub Secrets (nilai harus sama)
- [ ] OG images akan auto-generate saat cron publish artikel (tidak perlu manual)

### Draft (simpan, belum publish)

```json
{
  "status": "draft",
  "published_at": null
}
```

- [ ] `published_at` = `null`
- [ ] `status` = `"draft"` (atau `"review"` / `"fact-check"`)
- [ ] Artikel tidak muncul di website
- [ ] Bisa di-publish manual via admin dashboard atau update database

---

## Troubleshooting

### Artikel scheduled tidak auto-publish

1. Cek `CRON_SECRET` sudah di-set di Vercel dashboard DAN GitHub Secrets (nilai harus sama)
2. Cek `.github/workflows/publish-scheduled.yml` ada dan ter-deploy
3. Cek `published_at` sudah lewat dari waktu sekarang
4. Cek GitHub Actions logs untuk error cron job
5. Cek Vercel function logs untuk error API route
6. Test manual: `curl -H "Authorization: Bearer $CRON_SECRET" https://tamparananakmuda.com/api/cron/publish-scheduled`

### Artikel published tapi tidak muncul di website

1. Cek `published_at` tidak null dan sudah lewat dari `now()`
2. Cek frontend query pakai Drizzle ORM filter `lte(posts.publishedAt, new Date().toISOString())`
3. Cek `status` = `"published"` (bukan `"scheduled"`)

### Artikel muncul sebelum waktunya

Ini seharusnya tidak terjadi karena ada dua lapis filter:
1. `status = 'published'` -> cron job belum publish jika waktu belum tiba
2. `published_at <= now()` -> frontend tidak tampilkan jika waktu belum tiba

Jika terjadi, cek apakah ada query yang tidak pakai filter `published_at`.
