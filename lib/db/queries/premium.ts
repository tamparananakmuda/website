import { db } from '@/lib/db';
import { premiumUnlocks } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function isPremiumUnlocked(readerId: string, postSlug: string): Promise<boolean> {
  const result = await db.select().from(premiumUnlocks)
    .where(and(eq(premiumUnlocks.readerId, readerId), eq(premiumUnlocks.postSlug, postSlug)))
    .limit(1);
  return !!result[0];
}

export async function unlockPremium(readerId: string, postSlug: string): Promise<void> {
  await db.insert(premiumUnlocks).values({ readerId, postSlug });
}
