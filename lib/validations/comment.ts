import { z } from 'zod';

export const commentSchema = z.object({
  post_id: z.string().uuid(),
  body: z.string().trim().min(1, 'Komentar tidak boleh kosong').max(2000, 'Komentar maksimal 2000 karakter'),
  parent_id: z.string().uuid().optional(),
  turnstile_token: z.string().optional(),
});

export type CommentInput = z.infer<typeof commentSchema>;

export const commentLikeSchema = z.object({
  comment_id: z.string().uuid(),
  action: z.enum(['like', 'unlike']),
});

export type CommentLikeInput = z.infer<typeof commentLikeSchema>;

export const commentStatusSchema = z.object({
  status: z.enum(['approved', 'pending', 'rejected']),
});

export type CommentStatusInput = z.infer<typeof commentStatusSchema>;
