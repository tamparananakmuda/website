import { db } from '@/lib/db';
import { pushSubscriptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getPushSubscription(userId: string) {
  const result = await db.select().from(pushSubscriptions)
    .where(eq(pushSubscriptions.userId, userId))
    .limit(1);
  return result[0];
}

export async function createPushSubscription(userId: string, subscription: object): Promise<void> {
  await db.insert(pushSubscriptions).values({ userId, subscription });
}

export async function updatePushSubscription(userId: string, subscription: object): Promise<void> {
  await db.update(pushSubscriptions)
    .set({ subscription, updatedAt: new Date().toISOString() })
    .where(eq(pushSubscriptions.userId, userId));
}

export async function deletePushSubscription(userId: string): Promise<void> {
  await db.delete(pushSubscriptions).where(eq(pushSubscriptions.userId, userId));
}
