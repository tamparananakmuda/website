import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import { getPostWithRelationsBySlug } from '@/lib/db/queries/posts';
import { getActiveSubscribers } from '@/lib/db/queries/newsletter';
import { sendEmail } from '@/lib/email/client';
import { renderDigestEmail, DigestArticle } from '@/lib/email/templates/article-notification';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0).toISOString();
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59).toISOString();

    const todayPosts = await db.select({ id: posts.id, slug: posts.slug })
      .from(posts)
      .where(and(
        eq(posts.status, 'published'),
        gte(posts.publishedAt, startOfDay),
        lte(posts.publishedAt, endOfDay),
      ))
      .orderBy(posts.publishedAt);

    if (todayPosts.length === 0) {
      return NextResponse.json({ sent: false, reason: 'No articles published today' });
    }

    console.log(`[digest] Found ${todayPosts.length} articles published today`);

    const articles: DigestArticle[] = [];
    for (const post of todayPosts) {
      const fullPost = await getPostWithRelationsBySlug(post.slug);
      if (!fullPost) continue;

      const category = fullPost.category ?? null;
      const author = fullPost.author ?? null;

      articles.push({
        title: fullPost.title,
        slug: fullPost.slug,
        excerpt: fullPost.excerpt || '',
        categoryTitle: category?.title,
        categoryColor: category?.color ?? undefined,
        categorySlug: category?.slug ?? undefined,
        authorName: author?.name ?? undefined,
        readingTime: fullPost.readingTime ?? undefined,
        isPremium: fullPost.isPremium ?? undefined,
        isSponsored: fullPost.isSponsored ?? undefined,
      });
    }

    if (articles.length === 0) {
      return NextResponse.json({ sent: false, reason: 'No article data found' });
    }

    const subscribers = await getActiveSubscribers();
    console.log(`[digest] Sending to ${subscribers.length} subscribers`);

    let emailsSent = 0;
    let emailErrors = 0;

    for (const sub of subscribers) {
      if (!sub.unsubscribeToken) continue;
      const { subject, html } = renderDigestEmail({
        articles,
        unsubscribeToken: sub.unsubscribeToken,
      });
      const result = await sendEmail({
        to: sub.email,
        subject,
        htmlContent: html,
        tags: ['daily-digest'],
      });
      if (result.success) {
        emailsSent++;
      } else {
        emailErrors++;
      }
    }

    console.log(`[digest] Done: ${emailsSent} sent, ${emailErrors} errors`);

    return NextResponse.json({
      sent: true,
      articles: articles.length,
      subscribers: subscribers.length,
      emailsSent,
      emailErrors,
    });
  } catch (error) {
    console.error('[digest] error:', error);
    return NextResponse.json(
      { error: 'Failed to send digest' },
      { status: 500 }
    );
  }
}
