import { z } from 'zod';

export const ogGenerateSchema = z.object({
  slug: z.string().trim().min(1, 'Slug wajib diisi').max(300),
});

export type OGGenerateInput = z.infer<typeof ogGenerateSchema>;
