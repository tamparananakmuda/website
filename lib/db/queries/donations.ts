import { db } from '@/lib/db';
import { donations, donationGoals } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import type { Donation, DonationGoal } from '@/lib/db/schema';

export async function getDonationsByEmail(email: string, limit = 5): Promise<Donation[]> {
  return db.select().from(donations)
    .where(eq(donations.customerEmail, email))
    .orderBy(desc(donations.createdAt))
    .limit(limit);
}

export async function getDonationByReference(reference: string): Promise<Donation | undefined> {
  const result = await db.select().from(donations).where(eq(donations.reference, reference)).limit(1);
  return result[0];
}

export async function createDonation(data: typeof donations.$inferInsert): Promise<Donation> {
  const result = await db.insert(donations).values(data).returning();
  return result[0];
}

export async function updateDonationStatus(reference: string, status: string, extra?: Partial<typeof donations.$inferInsert>): Promise<void> {
  await db.update(donations)
    .set({ status, ...extra, updatedAt: new Date().toISOString() })
    .where(eq(donations.reference, reference));
}

export async function getActiveDonationGoal(): Promise<DonationGoal | undefined> {
  const result = await db.select().from(donationGoals)
    .where(eq(donationGoals.isActive, true))
    .limit(1);
  return result[0];
}

export async function getDonors(limit = 20): Promise<Donation[]> {
  return db.select().from(donations)
    .where(eq(donations.status, 'settled'))
    .orderBy(desc(donations.createdAt))
    .limit(limit);
}
