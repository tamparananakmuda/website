import { db } from '@/lib/db';
import { donations, donationGoals } from '@/lib/db/schema';
import { eq, desc, and, sql, gte } from 'drizzle-orm';
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

export async function getDonationByLouvinIdAndEmail(louvinTransactionId: string, email: string): Promise<Donation | undefined> {
  const result = await db.select().from(donations)
    .where(and(eq(donations.louvinTransactionId, louvinTransactionId), eq(donations.customerEmail, email)))
    .limit(1);
  return result[0];
}

export async function getDonationByLouvinId(louvinTransactionId: string): Promise<Donation | undefined> {
  const result = await db.select().from(donations)
    .where(eq(donations.louvinTransactionId, louvinTransactionId))
    .limit(1);
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

export async function updateDonationStatusByLouvinId(louvinTransactionId: string, status: string): Promise<void> {
  await db.update(donations)
    .set({ status, updatedAt: new Date().toISOString() })
    .where(eq(donations.louvinTransactionId, louvinTransactionId));
}

export async function getActiveDonationGoal(): Promise<DonationGoal | undefined> {
  const result = await db.select().from(donationGoals)
    .where(eq(donationGoals.isActive, true))
    .limit(1);
  return result[0];
}

export async function getActiveDonationGoalByPeriod(month: number, year: number): Promise<DonationGoal | undefined> {
  const result = await db.select().from(donationGoals)
    .where(and(eq(donationGoals.isActive, true), eq(donationGoals.periodMonth, month), eq(donationGoals.periodYear, year)))
    .limit(1);
  return result[0];
}

export async function getDonors(limit = 20): Promise<Donation[]> {
  return db.select().from(donations)
    .where(eq(donations.status, 'settled'))
    .orderBy(desc(donations.createdAt))
    .limit(limit);
}

export async function getPublicDonors(limit = 20): Promise<Donation[]> {
  return db.select().from(donations)
    .where(and(eq(donations.status, 'settled'), eq(donations.isAnonymous, false)))
    .orderBy(desc(donations.updatedAt))
    .limit(limit);
}

export interface DonationAnalytics {
  totalGross: number;
  totalNet: number;
  totalFee: number;
  totalSettled: number;
  totalPending: number;
  totalFailed: number;
  successRate: number;
  avgAmount: number;
  byPaymentType: { paymentType: string; count: number; total: number }[];
  byMonth: { month: string; count: number; total: number }[];
  recent: Donation[];
}

export async function getDonationAnalytics(): Promise<DonationAnalytics> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [allSettled, allPending, allFailed, recent] = await Promise.all([
    db.select({
      gross: sql<number>`sum(${donations.amount})`,
      net: sql<number>`sum(${donations.netAmount})`,
      fee: sql<number>`sum(${donations.fee})`,
      count: sql<number>`count(*)`,
    }).from(donations).where(eq(donations.status, 'settled')),

    db.select({ count: sql<number>`count(*)` }).from(donations).where(eq(donations.status, 'pending')),

    db.select({ count: sql<number>`count(*)` }).from(donations).where(eq(donations.status, 'failed')),

    db.select().from(donations)
      .where(gte(donations.createdAt, thirtyDaysAgo.toISOString()))
      .orderBy(desc(donations.createdAt))
      .limit(20),
  ]);

  const byPaymentTypeRaw = await db
    .select({
      paymentType: donations.paymentType,
      count: sql<number>`count(*)`,
      total: sql<number>`sum(${donations.amount})`,
    })
    .from(donations)
    .where(eq(donations.status, 'settled'))
    .groupBy(donations.paymentType)
    .orderBy(desc(sql`count(*)`));

  const byMonthRaw = await db
    .select({
      month: sql<string>`to_char(${donations.createdAt}, 'YYYY-MM')`,
      count: sql<number>`count(*)`,
      total: sql<number>`sum(${donations.amount})`,
    })
    .from(donations)
    .where(eq(donations.status, 'settled'))
    .groupBy(sql`to_char(${donations.createdAt}, 'YYYY-MM')`)
    .orderBy(sql`to_char(${donations.createdAt}, 'YYYY-MM')`);

  const settled = allSettled[0];
  const totalSettled = Number(settled?.count ?? 0);
  const totalPending = Number(allPending[0]?.count ?? 0);
  const totalFailed = Number(allFailed[0]?.count ?? 0);
  const totalTransactions = totalSettled + totalPending + totalFailed;
  const totalGross = Number(settled?.gross ?? 0);
  const totalNet = Number(settled?.net ?? 0);
  const totalFee = Number(settled?.fee ?? 0);

  return {
    totalGross,
    totalNet,
    totalFee,
    totalSettled,
    totalPending,
    totalFailed,
    successRate: totalTransactions > 0 ? (totalSettled / totalTransactions) * 100 : 0,
    avgAmount: totalSettled > 0 ? totalGross / totalSettled : 0,
    byPaymentType: byPaymentTypeRaw.map((r) => ({
      paymentType: r.paymentType,
      count: Number(r.count),
      total: Number(r.total),
    })),
    byMonth: byMonthRaw.map((r) => ({
      month: r.month,
      count: Number(r.count),
      total: Number(r.total),
    })),
    recent,
  };
}
