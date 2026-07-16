import { z } from 'zod';

export const historySchema = z.object({
  post_id: z.number().int().positive(),
  progress: z.number().int().min(0).max(100).optional().default(0),
});

export type ReadingHistoryInput = z.infer<typeof historySchema>;
