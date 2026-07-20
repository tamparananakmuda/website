import { randomUUID } from 'crypto';

const RESEND_API_URL = 'https://api.resend.com/emails';
const SENDER_NAME = 'TAMPARAN ANAK MUDA';
const SENDER_EMAIL = process.env.RESEND_SENDER_EMAIL || 'onboarding@resend.dev';
const MAX_RETRIES = 2;

export interface SendEmailParams {
  to: string;
  subject: string;
  htmlContent: string;
  replyTo?: string;
  tags?: string[];
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

async function sendViaResend(params: SendEmailParams): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[email] RESEND_API_KEY not configured');
    return { success: false, error: 'Email service not configured' };
  }

  const body: Record<string, unknown> = {
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    to: [params.to],
    subject: params.subject,
    html: params.htmlContent,
  };

  if (params.replyTo) {
    body.reply_to = params.replyTo;
  }

  if (params.tags && params.tags.length > 0) {
    body.tags = params.tags.map((name) => ({ name, value: 'true' }));
  }

  const res = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`[email] Resend API error ${res.status}:`, errText);
    return { success: false, error: `Resend API error: ${res.status}` };
  }

  const data = await res.json();
  return { success: true, messageId: data.id };
}

export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  let lastError: string | undefined;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await sendViaResend(params);
      if (result.success) {
        console.log(`[email] Sent to ${params.to} (attempt ${attempt + 1})`);
        return result;
      }
      lastError = result.error;

      if (attempt < MAX_RETRIES) {
        const delayMs = 1000 * (attempt + 1);
        console.warn(`[email] Retry ${attempt + 1}/${MAX_RETRIES} in ${delayMs}ms for ${params.to}`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    } catch (err) {
      lastError = err instanceof Error ? err.message : 'Unknown error';
      console.error(`[email] Attempt ${attempt + 1} failed:`, lastError);

      if (attempt < MAX_RETRIES) {
        const delayMs = 1000 * (attempt + 1);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  return { success: false, error: lastError };
}

export function generateUnsubscribeToken(): string {
  return randomUUID();
}
