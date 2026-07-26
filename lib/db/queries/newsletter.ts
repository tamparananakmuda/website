import { db } from '@/lib/db';
import { newsletterSubscribers, newsletterIssues } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { NewsletterSubscriber, NewsletterIssue } from '@/lib/db/schema';
import { generateUnsubscribeToken } from '@/lib/email/client';

export async function subscribeNewsletter(email: string, source = 'website'): Promise<NewsletterSubscriber> {
  const existing = await db.select().from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.email, email))
    .limit(1);
  if (existing[0]) return existing[0];
  const result = await db.insert(newsletterSubscribers).values({
    email,
    source,
    unsubscribeToken: generateUnsubscribeToken(),
  }).returning();
  return result[0];
}

export async function upsertNewsletterSubscriber(email: string, topics: string[] = []): Promise<{ subscriber: NewsletterSubscriber; isNew: boolean; wasActive: boolean }> {
  const existing = await db.select().from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.email, email))
    .limit(1);

  if (existing[0]) {
    if (existing[0].status === 'active') {
      if (topics.length > 0) {
        await db.update(newsletterSubscribers)
          .set({
            topics,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(newsletterSubscribers.email, email));
      }
      return { subscriber: { ...existing[0], topics: topics.length > 0 ? topics : existing[0].topics }, isNew: false, wasActive: true };
    }

    const newToken = generateUnsubscribeToken();
    await db.update(newsletterSubscribers)
      .set({
        status: 'pending',
        topics: topics.length > 0 ? topics : existing[0].topics,
        unsubscribeToken: newToken,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(newsletterSubscribers.email, email));
    return { subscriber: { ...existing[0], status: 'pending', topics: topics.length > 0 ? topics : existing[0].topics, unsubscribeToken: newToken }, isNew: false, wasActive: false };
  }

  const result = await db.insert(newsletterSubscribers).values({
    email,
    status: 'pending',
    source: 'website',
    topics,
    unsubscribeToken: generateUnsubscribeToken(),
  }).returning();
  return { subscriber: result[0], isNew: true, wasActive: false };
}

export async function confirmSubscription(token: string): Promise<NewsletterSubscriber | null> {
  const existing = await db.select().from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.unsubscribeToken, token))
    .limit(1);

  if (!existing[0]) return null;

  if (existing[0].status === 'active') return existing[0];

  const result = await db.update(newsletterSubscribers)
    .set({
      status: 'active',
      updatedAt: new Date().toISOString(),
    })
    .where(eq(newsletterSubscribers.unsubscribeToken, token))
    .returning();
  return result[0] || null;
}

export async function unsubscribeNewsletter(email: string): Promise<void> {
  await db.update(newsletterSubscribers)
    .set({ status: 'unsubscribed', updatedAt: new Date().toISOString() })
    .where(eq(newsletterSubscribers.email, email));
}

export async function unsubscribeByToken(token: string): Promise<boolean> {
  const result = await db.update(newsletterSubscribers)
    .set({ status: 'unsubscribed', updatedAt: new Date().toISOString() })
    .where(eq(newsletterSubscribers.unsubscribeToken, token))
    .returning();
  return result.length > 0;
}

export async function getSubscriberByToken(token: string): Promise<NewsletterSubscriber | undefined> {
  const result = await db.select().from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.unsubscribeToken, token))
    .limit(1);
  return result[0];
}

export async function getActiveSubscribers(): Promise<NewsletterSubscriber[]> {
  return db.select().from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.status, 'active'));
}

export async function getPublishedIssues(limit = 20): Promise<NewsletterIssue[]> {
  return db.select().from(newsletterIssues)
    .where(eq(newsletterIssues.isPublished, true))
    .orderBy(desc(newsletterIssues.sentAt))
    .limit(limit);
}

export async function getIssueById(id: string): Promise<NewsletterIssue | undefined> {
  const result = await db.select().from(newsletterIssues).where(eq(newsletterIssues.id, BigInt(id))).limit(1);
  return result[0];
}
