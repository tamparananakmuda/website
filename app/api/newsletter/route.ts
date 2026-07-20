import { NextRequest, NextResponse } from 'next/server';
import { upsertNewsletterSubscriber } from '@/lib/db/queries/newsletter';
import { newsletterSchema } from '@/lib/validations/newsletter';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { parseRequestBody } from '@/lib/validations/helpers';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { sendEmail } from '@/lib/email/client';
import { renderWelcomeEmail } from '@/lib/email/templates/welcome';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const limit = await rateLimit(request, {
      limit: 3,
      window: 60,
      identifier: 'newsletter',
    });
    if (!limit.success) {
      return rateLimitResponse(limit);
    }

    const parsed = await parseRequestBody(request, newsletterSchema);
    if (!parsed.success) return parsed.errorResponse;

    const valid = await verifyTurnstileToken(parsed.data.turnstile_token, request);
    if (!valid) {
      return NextResponse.json(
        { error: 'Verifikasi keamanan gagal. Coba lagi.' },
        { status: 403 }
      );
    }

    const normalizedEmail = parsed.data.email;
    const topics = parsed.data.topics;

    const subscriber = await upsertNewsletterSubscriber(normalizedEmail, topics);

    // Sync to Brevo if API key exists
    if (process.env.BREVO_API_KEY && process.env.BREVO_LIST_ID) {
      const res = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
        },
        body: JSON.stringify({
          email: normalizedEmail,
          listIds: [parseInt(process.env.BREVO_LIST_ID, 10)],
          updateEnabled: true,
          attributes: {
            TOPICS: topics.join(','),
          },
        }),
      });

      if (!res.ok && res.status !== 400) {
        console.error('Brevo sync failed:', await res.text());
      }
    }

    // Send welcome email if subscriber has unsubscribe token
    if (subscriber.unsubscribeToken) {
      const { subject, html } = renderWelcomeEmail({
        email: normalizedEmail,
        unsubscribeToken: subscriber.unsubscribeToken,
        topics,
      });
      const result = await sendEmail({
        to: normalizedEmail,
        subject,
        htmlContent: html,
        tags: ['newsletter-welcome'],
      });
      if (!result.success) {
        console.error('[newsletter] Welcome email failed:', result.error);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan. Coba lagi nanti.' },
      { status: 500 }
    );
  }
}
