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
   - Fetch all published posts from Supabase
   - Delete old PNG/WebP OG images from R2 per post
   - Generate 2 WebP images per post (card 800x450 + feature 1600x900) via @vercel/og + sharp
   - Upload to R2 at `og/{slug}-card.webp` and `og/{slug}-feature.webp`
   - Update DB columns: `og_card_url`, `og_feature_url`, `og_image_url`
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
