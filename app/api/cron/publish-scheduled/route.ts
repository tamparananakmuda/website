import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { eq, lte, inArray, and } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date().toISOString();

    const scheduled = await db.select({ id: posts.id, slug: posts.slug, title: posts.title })
      .from(posts)
      .where(and(eq(posts.status, 'scheduled'), lte(posts.publishedAt, now)));

    if (scheduled.length === 0) {
      return NextResponse.json({ published: 0, slugs: [] });
    }

    const ids = scheduled.map((p) => p.id);
    await db.update(posts)
      .set({ status: 'published', updatedAt: now })
      .where(inArray(posts.id, ids));

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
