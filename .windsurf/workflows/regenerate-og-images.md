---
description: Regenerate OG images (card + feature WebP) for all published posts and upload to R2 CDN
---

## Regenerate All OG Images

1. Ensure `.env.local` has R2 credentials (R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT, R2_BUCKET_NAME, CDN_BASE_URL)
2. Run the batch script:
   ```bash
   npx tsx scripts/generate-all-og.ts
   ```
3. Script will:
   - Fetch all published posts from DB via Drizzle ORM
   - Delete old PNG/WebP OG images from R2 per post
   - Generate 2 WebP images per post (card 800x450 + feature 1600x900) via @vercel/og + sharp
   - Upload to R2 at `og/{slug}-card.webp` and `og/{slug}-feature.webp`
   - Update DB columns via Drizzle ORM: `ogCardUrl`, `ogFeatureUrl`, `ogImageUrl`
4. Verify output shows success count matching post count
5. Verify images accessible at `https://cdn.tamparananakmuda.com/og/{slug}-card.webp`

## Regenerate Single Post OG Images

1. Via admin API (requires admin auth):
   ```bash
   curl -X POST https://tamparananakmuda.com/api/og/generate \
     -H "Content-Type: application/json" \
     -H "Cookie: <admin-session>" \
     -d '{"slug":"<post-slug>"}'
   ```
2. Or via admin UI: go to admin planner detail page and click "Regenerate OG Images"

## Notes

- `template.tsx` requires `import React` for tsx standalone execution
- WebP quality is set to 85 in `lib/cdn/generate.tsx`
- Old PNG files (`-card.png`, `-feature.png`, `-og.png`) and single `.webp` are cleaned up automatically
- CDN domain: `https://cdn.tamparananakmuda.com`
- R2 bucket: `cdn-tam`
- Script uses Drizzle ORM (`lib/db`) untuk semua DB operations, bukan Supabase REST API
- **Cron auto-generate:** Untuk artikel scheduled, OG images di-auto-generate oleh cron job (`app/api/cron/publish-scheduled/route.ts`) saat artikel di-publish. Script batch ini hanya perlu untuk artikel yang sudah published tapi belum punya OG images.
- **JSX fix:** Jika script error `React is not defined`, jalankan dengan custom tsconfig: `npx tsx --tsconfig tsconfig.scripts.json scripts/generate-all-og.ts` (lihat troubleshooting di bawah)

## Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| `React is not defined` | `template.tsx` missing React import atau tsx tidak handle JSX dengan `jsx: preserve` | 1. Ensure `import React` at top of `lib/og/template.tsx`. 2. Buat `tsconfig.scripts.json` dengan `{ "extends": "./tsconfig.json", "compilerOptions": { "jsx": "react-jsx" } }` dan jalankan: `npx tsx --tsconfig tsconfig.scripts.json scripts/generate-all-og.ts` |
| `S3Client connection refused` | R2 env vars not loaded | Check `.env.local` has R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT |
| `sharp: libvips duplicate` | Multiple sharp versions installed | Run `pnpm dedupe sharp` or delete `node_modules/.pnpm/@img+sharp-*` duplicates |
| `z-index is currently not supported` | Warning from @vercel/og | Safe to ignore, does not affect output |
| Image HTTP 404 di CDN | Upload failed or wrong key | Check R2 bucket for `og/{slug}-card.webp` and `og/{slug}-feature.webp` |
| Image looks distorted | Wrong template size used | Verify `SIZE_MAP` in `generate.tsx`: card=800x450, feature=1600x900 |
| DB URLs not updated | Drizzle ORM tidak connect ke DB | Check `.env.local` has `DATABASE_URL` dengan PostgreSQL connection string yang valid |
| Script hangs on specific post | Cover image URL unreachable | Check `cover_image_url` in DB, null or broken URLs may cause timeout |
