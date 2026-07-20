import { z } from 'zod';

export const donasiSchema = z.object({
  amount: z
    .number()
    .int()
    .positive('Nominal donasi harus positif'),
  payment_type: z.enum(
    ['qris', 'bni_va', 'bri_va', 'permata_va', 'cimb_niaga_va'],
    { error: 'Metode pembayaran tidak valid' }
  ),
  customer_name: z
    .string()
    .trim()
    .max(100, 'Nama maksimal 100 karakter')
    .optional()
    .default('Donatur TAM'),
  customer_email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Format email tidak valid')
    .max(255, 'Email maksimal 255 karakter')
    .optional()
    .default(''),
  is_anonymous: z.boolean().optional().default(false),
  message: z
    .string()
    .trim()
    .max(280, 'Pesan maksimal 280 karakter')
    .optional()
    .default(''),
  is_recurring: z.boolean().optional().default(false),
  turnstile_token: z.string().optional(),
});

export type DonasiInput = z.infer<typeof donasiSchema>;

export function getMinAmount(paymentType: string): number {
  return paymentType === 'qris' ? 1500 : 1000;
}

export const donasiStatusSchema = z.object({
  transaction_id: z
    .string()
    .trim()
    .min(1, 'Transaction ID wajib diisi')
    .max(255, 'Transaction ID tidak valid'),
});

export type DonasiStatusInput = z.infer<typeof donasiStatusSchema>;
