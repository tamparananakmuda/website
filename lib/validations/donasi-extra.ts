import { z } from 'zod';

export const donasiReceiptSchema = z.object({
  transaction_id: z.string().trim().min(1, 'Transaction ID wajib diisi').max(255),
  email: z.string().trim().toLowerCase().email('Format email tidak valid').max(255),
});

export type DonasiReceiptInput = z.infer<typeof donasiReceiptSchema>;

export const donasiWebhookSchema = z.object({
  transaction_status: z.string(),
  order_id: z.string(),
  payment_type: z.string().optional(),
  transaction_id: z.string().optional(),
  fraud_status: z.string().optional(),
  settlement_time: z.string().optional(),
  gross_amount: z.string().optional(),
  status_code: z.string().optional(),
  signature_key: z.string().optional(),
});

export type DonasiWebhookInput = z.infer<typeof donasiWebhookSchema>;
