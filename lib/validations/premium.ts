import { z } from 'zod';

export const premiumUnlockSchema = z.object({
  post_id: z.number().int().positive(),
});

export type PremiumUnlockInput = z.infer<typeof premiumUnlockSchema>;
