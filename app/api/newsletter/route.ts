import { NextRequest, NextResponse } from 'next/server';
import { upsertNewsletterSubscriber } from '@/lib/db/queries/newsletter';
import { newsletterSchema } from '@/lib/validations/newsletter';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { parseRequestBody } from '@/lib/validations/helpers';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { sendEmail } from '@/lib/email/client';
import { renderConfirmationEmail } from '@/lib/email/templates/confirmation';

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

    const { subscriber, wasActive } = await upsertNewsletterSubscriber(normalizedEmail, topics);

    if (wasActive) {
      return NextResponse.json({ success: true, alreadyActive: true });
    }

    if (subscriber.unsubscribeToken) {
      const { subject, html } = renderConfirmationEmail({
        email: normalizedEmail,
        confirmToken: subscriber.unsubscribeToken,
        topics,
      });
      const result = await sendEmail({
        to: normalizedEmail,
        subject,
        htmlContent: html,
        tags: ['newsletter-confirmation'],
      });
      if (!result.success) {
        console.error('[newsletter] Confirmation email failed:', result.error);
      }
    }

    return NextResponse.json({ success: true, requiresConfirmation: true });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan. Coba lagi nanti.' },
      { status: 500 }
    );
  }
}
