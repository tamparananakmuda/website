import { z } from 'zod';

export const premiumUnlockSchema = z.object({
  post_slug: z.string().trim().min(1, 'Post slug wajib diisi'),
});

export type PremiumUnlockInput = z.infer<typeof premiumUnlockSchema>;
