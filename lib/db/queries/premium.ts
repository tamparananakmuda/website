import { db } from '@/lib/db';
import { premiumUnlocks } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function isPremiumUnlocked(readerId: string, postId: string): Promise<boolean> {
  const result = await db.select().from(premiumUnlocks)
    .where(and(eq(premiumUnlocks.readerId, readerId), eq(premiumUnlocks.postId, postId)))
    .limit(1);
  return !!result[0];
}

export async function unlockPremium(readerId: string, postId: string): Promise<void> {
  await db.insert(premiumUnlocks).values({ readerId, postId });
}
