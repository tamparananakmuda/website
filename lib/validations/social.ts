import { z } from 'zod';

export const socialImportSchema = z.object({
  url: z
    .string()
    .trim()
    .url('URL tidak valid')
    .refine((url) => {
      try {
        const u = new URL(url);
        return ['x.com', 'twitter.com', 'instagram.com', 'tiktok.com', 'youtube.com', 'youtu.be'].some(
          (d) => u.hostname.includes(d)
        );
      } catch {
        return false;
      }
    }, 'Platform tidak didukung. Gunakan X, Instagram, TikTok, atau YouTube'),
});

export type SocialImportInput = z.infer<typeof socialImportSchema>;

export const socialPostUpdateSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().trim().max(200).optional(),
  excerpt: z.string().trim().max(500).optional(),
  content_text: z.string().trim().max(5000).optional(),
  transcript: z.string().trim().max(10000).optional(),
  tags: z.array(z.string().trim().toLowerCase().max(50)).max(10).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
});

export type SocialPostUpdateInput = z.infer<typeof socialPostUpdateSchema>;
