import { z } from 'zod';

export const bookmarkSchema = z.object({
  post_id: z.string().uuid(),
});

export type BookmarkInput = z.infer<typeof bookmarkSchema>;
