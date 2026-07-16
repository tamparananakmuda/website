import { db } from '@/lib/db';
import { newsletterSubscribers, newsletterIssues } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { NewsletterSubscriber, NewsletterIssue } from '@/lib/db/schema';

export async function subscribeNewsletter(email: string, source = 'website'): Promise<NewsletterSubscriber> {
  const existing = await db.select().from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.email, email))
    .limit(1);
  if (existing[0]) return existing[0];
  const result = await db.insert(newsletterSubscribers).values({ email, source }).returning();
  return result[0];
}

export async function upsertNewsletterSubscriber(email: string): Promise<void> {
  const existing = await db.select().from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.email, email))
    .limit(1);

  if (existing[0]) {
    await db.update(newsletterSubscribers)
      .set({
        status: 'active',
        updatedAt: new Date().toISOString(),
      })
      .where(eq(newsletterSubscribers.email, email));
  } else {
    await db.insert(newsletterSubscribers).values({
      email,
      status: 'active',
      source: 'website',
    });
  }
}

export async function unsubscribeNewsletter(email: string): Promise<void> {
  await db.update(newsletterSubscribers)
    .set({ status: 'unsubscribed', updatedAt: new Date().toISOString() })
    .where(eq(newsletterSubscribers.email, email));
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
