import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  try {
    const now = new Date().toISOString();

    const { data: scheduled, error: fetchError } = await supabase
      .from('posts')
      .select('id, slug, title')
      .eq('status', 'scheduled')
      .lte('published_at', now);

    if (fetchError) throw fetchError;

    if (!scheduled || scheduled.length === 0) {
      return NextResponse.json({ published: 0, slugs: [] });
    }

    const ids = scheduled.map((p) => p.id);
    const { error: updateError } = await supabase
      .from('posts')
      .update({ status: 'published' })
      .in('id', ids);

    if (updateError) throw updateError;

    const slugs = scheduled.map((p) => p.slug);
    console.log(`[cron] Published ${scheduled.length} scheduled articles:`, slugs);

    return NextResponse.json({
      published: scheduled.length,
      slugs,
    });
  } catch (error) {
    console.error('[cron] publish-scheduled error:', error);
    return NextResponse.json(
      { error: 'Failed to publish scheduled articles' },
      { status: 500 }
    );
  }
}
