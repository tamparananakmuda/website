import { z } from 'zod';

export const premiumUnlockSchema = z.object({
  post_id: z.string().uuid(),
});

export type PremiumUnlockInput = z.infer<typeof premiumUnlockSchema>;
