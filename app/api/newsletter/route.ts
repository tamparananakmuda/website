import { NextRequest, NextResponse } from 'next/server';
import { upsertNewsletterSubscriber } from '@/lib/db/queries/newsletter';
import { newsletterSchema } from '@/lib/validations/newsletter';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { parseRequestBody } from '@/lib/validations/helpers';

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

    const normalizedEmail = parsed.data.email;
    const topics = parsed.data.topics;

    await upsertNewsletterSubscriber(normalizedEmail);

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
        // 400 might mean duplicate contact, which is fine
        console.error('Brevo sync failed:', await res.text());
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
