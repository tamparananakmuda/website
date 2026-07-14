import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const historySchema = z.object({
  post_id: z.number().int().positive(),
  progress: z.number().int().min(0).max(100).optional().default(0),
});

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

    const body = await request.json();
    const parsed = historySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Input tidak valid' },
        { status: 400 }
      );
    }

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
