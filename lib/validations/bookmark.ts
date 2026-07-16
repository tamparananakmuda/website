import { z } from 'zod';

export const bookmarkSchema = z.object({
  post_id: z.number().int().positive(),
});

export type BookmarkInput = z.infer<typeof bookmarkSchema>;
