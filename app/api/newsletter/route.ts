import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { newsletterSchema } from '@/lib/validations/newsletter';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';

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

    const body = await request.json();

    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || 'Input tidak valid' },
        { status: 400 }
      );
    }

    const normalizedEmail = parsed.data.email;
    const topics = parsed.data.topics;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    // Store subscriber locally
    const { error: dbError } = await supabase
      .from('newsletter_subscribers')
      .upsert(
        {
          email: normalizedEmail,
          status: 'active',
          source: 'website',
          topics: topics.length > 0 ? topics : null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'email' }
      );

    if (dbError) {
      throw new Error(dbError.message);
    }

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
