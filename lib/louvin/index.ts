/**
 * Louvin Payment Gateway client.
 *
 * SETUP:
 *   1. Daftar di https://louvin.dev
 *   2. Buat project dengan slug 'tamparananakmuda'
 *   3. Copy API key (format: lv_...) ke LOUVIN_API_KEY di .env.local
 *   4. Set LOUVIN_WEBHOOK_SECRET dari dashboard Louvin ke .env.local
 *   5. Set NEXT_PUBLIC_LOUVIN_ENABLED=true saat siap production
 *
 * SECURITY:
 *   - API key JANGAN di-prefix NEXT_PUBLIC_ (server-only)
 *   - Webhook endpoint: POST /api/donasi/webhook
 *   - Signature verification: x-louvin-signature header (HMAC-SHA256)
 */

const LOUVIN_BASE_URL = 'https://api.louvin.dev/v1';

function getLouvinApiKey(): string {
  const key = process.env.LOUVIN_API_KEY;

  if (!key) {
    throw new Error('[Louvin] LOUVIN_API_KEY is not set. Add it to .env.local (server-only).');
  }

  if (!key.startsWith('lv_')) {
    throw new Error(
      `[Louvin] LOUVIN_API_KEY has invalid format. Expected prefix "lv_", got: "${key.slice(0, 6)}..."`
    );
  }

  return key;
}

export function isLouvinEnabled(): boolean {
  return process.env.NEXT_PUBLIC_LOUVIN_ENABLED === 'true';
}

export interface LouvinCreateTransactionInput {
  amount: number;
  payment_type: string;
  order_id: string;
  customer_name?: string;
  customer_email?: string;
  description?: string;
  callback_url?: string;
}

export interface LouvinTransaction {
  transaction_id: string;
  order_id: string;
  amount: number;
  fee: number;
  net_amount: number;
  payment_type: string;
  status: 'pending' | 'settled' | 'failed' | 'expired';
  payment_data: Record<string, unknown>;
  expires_at: string;
  created_at: string;
}

export async function createLouvinTransaction(
  input: LouvinCreateTransactionInput
): Promise<LouvinTransaction> {
  const apiKey = getLouvinApiKey();
  const projectSlug = process.env.LOUVIN_PROJECT_SLUG || 'tamparananakmuda';

  const response = await fetch(`${LOUVIN_BASE_URL}/projects/${projectSlug}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`[Louvin] Create transaction failed: ${response.status} — ${JSON.stringify(error)}`);
  }

  return response.json();
}

export async function getLouvinTransactionStatus(transactionId: string): Promise<LouvinTransaction> {
  const apiKey = getLouvinApiKey();
  const projectSlug = process.env.LOUVIN_PROJECT_SLUG || 'tamparananakmuda';

  const response = await fetch(
    `${LOUVIN_BASE_URL}/projects/${projectSlug}/transactions/${transactionId}`,
    {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error(`[Louvin] Get transaction status failed: ${response.status}`);
  }

  return response.json();
}
