import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { historySchema } from '@/lib/validations/reading-history';
import { parseRequestBody } from '@/lib/validations/helpers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const limit = await rateLimit(request, {
      limit: 30,
      window: 60,
      identifier: 'reading-history',
    });
    if (!limit.success) {
      return rateLimitResponse(limit);
    }

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
      return NextResponse.json(
        { error: 'Masuk untuk menyimpan riwayat baca' },
        { status: 401 }
      );
    }

    const parsed = await parseRequestBody(request, historySchema);
    if (!parsed.success) return parsed.errorResponse;

    const { error } = await supabase
      .from('reading_history')
      .upsert(
        {
          reader_id: user.id,
          post_id: parsed.data.post_id,
          progress: parsed.data.progress,
          read_at: new Date().toISOString(),
        },
        { onConflict: 'reader_id,post_id' }
      );

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reading history error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}
