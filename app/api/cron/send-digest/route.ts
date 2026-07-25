import { NextRequest, NextResponse } from 'next/server';
import { getPostWithRelationsBySlug } from '@/lib/db/queries/posts';
import { getActiveSubscribers } from '@/lib/db/queries/newsletter';
import { sendEmail } from '@/lib/email/client';
import { renderDigestEmail, DigestArticle } from '@/lib/email/templates/article-notification';
import { getPostsPublishedThisWeek } from '@/lib/articles/loader';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const weekPosts = await getPostsPublishedThisWeek();

    if (weekPosts.length === 0) {
      return NextResponse.json({ sent: false, reason: 'No articles published this week' });
    }

    console.log(`[digest] Found ${weekPosts.length} articles published this week`);

    const articles: DigestArticle[] = [];
    for (const fullPost of weekPosts) {
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
        tags: ['weekly-digest'],
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
