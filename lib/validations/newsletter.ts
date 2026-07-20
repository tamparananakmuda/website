import { z } from 'zod';

export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Format email tidak valid')
    .max(255, 'Email maksimal 255 karakter'),
  topics: z
    .array(z.string().trim().toLowerCase().max(50))
    .max(10, 'Maksimal 10 topik')
    .optional()
    .default([]),
  turnstile_token: z.string().optional(),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
