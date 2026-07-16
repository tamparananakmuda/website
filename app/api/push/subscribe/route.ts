import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPushSubscription, createPushSubscription, updatePushSubscription, deletePushSubscription } from '@/lib/db/queries/push';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { pushSubscribeSchema } from '@/lib/validations/push';
import { parseRequestBody } from '@/lib/validations/helpers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const limit = await rateLimit(request, {
      limit: 5,
      window: 60,
      identifier: 'push-subscribe',
    });
    if (!limit.success) {
      return rateLimitResponse(limit);
    }

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
      return NextResponse.json(
        { error: 'Login dulu untuk berlangganan notifikasi' },
        { status: 401 }
      );
    }

    const parsed = await parseRequestBody(request, pushSubscribeSchema);
    if (!parsed.success) return parsed.errorResponse;

    const { subscription } = parsed.data;

    if (!subscription || !(subscription as { endpoint?: string }).endpoint) {
      return NextResponse.json(
        { error: 'Subscription tidak valid' },
        { status: 400 }
      );
    }

    const existing = await getPushSubscription(user.id);
    if (existing) {
      await updatePushSubscription(user.id, subscription);
    } else {
      await createPushSubscription(user.id, subscription);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Push subscribe error:', error);
    return NextResponse.json(
      { error: 'Gagal berlangganan notifikasi' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
      return NextResponse.json(
        { error: 'Tidak terautentikasi' },
        { status: 401 }
      );
    }

    await deletePushSubscription(user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Push unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Gagal berhenti berlangganan' },
      { status: 500 }
    );
  }
}
