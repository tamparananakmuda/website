import { z } from 'zod';

export const historySchema = z.object({
  post_slug: z.string().trim().min(1, 'Post slug wajib diisi'),
  progress: z.number().int().min(0).max(100).optional().default(0),
});

export type ReadingHistoryInput = z.infer<typeof historySchema>;
