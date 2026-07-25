import { z } from 'zod';

export const bookmarkSchema = z.object({
  post_slug: z.string().trim().min(1, 'Post slug wajib diisi'),
});

export type BookmarkInput = z.infer<typeof bookmarkSchema>;
