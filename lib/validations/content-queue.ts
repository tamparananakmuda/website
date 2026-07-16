import { z } from 'zod';

export const contentQueueCreateSchema = z.object({
  title: z.string().trim().min(1, 'Judul wajib diisi').max(200, 'Judul maksimal 200 karakter'),
  pillar_id: z.string().uuid().optional(),
  pov_tag: z.enum(['reality_check', 'myth_buster', 'data_speaks', 'contrarian', 'comparative', 'how_to', 'listicle', 'deep_dive', 'first_person']).optional(),
  target_keyword: z.string().trim().max(100).optional(),
  status: z.enum(['idea', 'drafting', 'ready', 'scheduled', 'published']).optional().default('idea'),
  assigned_to: z.string().trim().max(100).optional(),
  notes: z.string().trim().max(2000).optional(),
  search_intent: z.enum(['informational', 'comparison', 'transactional']).optional(),
  fact_check_status: z.enum(['pending', 'verified', 'flagged']).optional(),
  review_status: z.enum(['pending', 'approved', 'needs_revision']).optional(),
  scheduled_date: z.string().datetime().optional(),
  due_date: z.string().datetime().optional(),
  publish_date: z.string().datetime().optional(),
  cta: z.string().trim().max(500).optional(),
  target_platforms: z.array(z.string().trim().max(50)).max(10).optional().default(['web']),
});

export type ContentQueueCreateInput = z.infer<typeof contentQueueCreateSchema>;

export const contentQueueUpdateSchema = contentQueueCreateSchema.partial();

export type ContentQueueUpdateInput = z.infer<typeof contentQueueUpdateSchema>;
