import { z } from 'zod';

export const aiKeywordsSchema = z.object({
  topic: z.string().trim().min(1, 'Topik wajib diisi').max(200),
  pillar: z.string().trim().max(100).optional(),
});

export type AIKeywordsInput = z.infer<typeof aiKeywordsSchema>;

export const aiOutlineSchema = z.object({
  title: z.string().trim().min(1, 'Judul wajib diisi').max(200),
  pillar: z.string().trim().max(100).optional(),
  pov_tag: z.string().trim().max(50).optional(),
  target_keyword: z.string().trim().max(100).optional(),
});

export type AIOutlineInput = z.infer<typeof aiOutlineSchema>;

export const aiIdeasSchema = z.object({
  pillar: z.string().trim().max(100).optional(),
  keyword: z.string().trim().max(200).optional(),
  pov_tag: z.string().trim().max(50).optional(),
  count: z.number().int().min(1).max(20).optional().default(5),
});

export type AIIdeasInput = z.infer<typeof aiIdeasSchema>;

export const aiRepurposeSchema = z.object({
  post_id: z.string().uuid(),
  platforms: z.array(z.string().trim().max(50)).max(10).optional(),
});

export type AIRepurposeInput = z.infer<typeof aiRepurposeSchema>;
