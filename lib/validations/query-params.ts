import { z } from 'zod';

export const commentsQuerySchema = z.object({
  post_id: z.coerce.number().int().positive().optional(),
  id: z.string().uuid().optional(),
});

export type CommentsQuery = z.infer<typeof commentsQuerySchema>;

export const contentQueueQuerySchema = z.object({
  status: z.enum(['idea', 'drafting', 'ready', 'scheduled', 'published', 'all']).optional(),
  pillar: z.string().uuid().optional(),
});

export type ContentQueueQuery = z.infer<typeof contentQueueQuerySchema>;

export const searchQuerySchema = z.object({
  q: z.string().trim().min(1, 'Query pencarian wajib diisi').max(100),
  category: z.string().trim().max(100).optional(),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;

export const socialPostsQuerySchema = z.object({
  status: z.enum(['draft', 'published', 'archived', 'all']).optional().default('published'),
  platform: z.string().trim().max(50).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
  id: z.coerce.number().int().positive().optional(),
});

export type SocialPostsQuery = z.infer<typeof socialPostsQuerySchema>;

export const bookmarksQuerySchema = z.object({
  post_id: z.coerce.number().int().positive().optional(),
});

export type BookmarksQuery = z.infer<typeof bookmarksQuerySchema>;

export const donasiStatusQuerySchema = z.object({
  transaction_id: z.string().trim().min(1).max(255),
});

export type DonasiStatusQuery = z.infer<typeof donasiStatusQuerySchema>;
