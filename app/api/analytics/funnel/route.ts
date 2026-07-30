import { NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/auth/admin-check';
import { db } from '@/lib/db';
import { newsletterSubscribers, donations } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { getAnalyticsOverview } from '@/lib/db/queries/posts';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await checkAdminAuth();
  if (!auth.isAdmin) return auth.response;

  try {
    const analyticsData = await getAnalyticsOverview();
    const publishedCount = analyticsData.publishedResult[0]?.count || 0;

    const [activeSubscribers, pendingSubscribers, totalDonations, settledDonations] = await Promise.all([
      db.select({ count: sql<number>`count(*)` })
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.status, 'active')),
      db.select({ count: sql<number>`count(*)` })
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.status, 'pending')),
      db.select({ count: sql<number>`count(*)` })
        .from(donations),
      db.select({ count: sql<number>`count(*)` })
        .from(donations)
        .where(eq(donations.status, 'settled')),
    ]);

    const stages = [
      {
        stage: 'Artikel Published',
        count: publishedCount,
        description: 'Total artikel yang sudah dipublikasi',
      },
      {
        stage: 'Newsletter Active',
        count: Number(activeSubscribers[0]?.count ?? 0),
        description: 'Subscriber newsletter aktif',
      },
      {
        stage: 'Newsletter Pending',
        count: Number(pendingSubscribers[0]?.count ?? 0),
        description: 'Subscriber menunggu konfirmasi',
      },
      {
        stage: 'Donation Attempts',
        count: Number(totalDonations[0]?.count ?? 0),
        description: 'Total percobaan donasi',
      },
      {
        stage: 'Donation Settled',
        count: Number(settledDonations[0]?.count ?? 0),
        description: 'Donasi berhasil (settled)',
      },
    ];

    const maxCount = Math.max(...stages.map((s) => s.count), 1);

    const funnel = stages.map((s, i) => {
      const prevCount = i > 0 ? stages[i - 1].count : s.count;
      const conversionRate = prevCount > 0 ? (s.count / prevCount) * 100 : 0;
      const overallRate = publishedCount > 0 ? (s.count / publishedCount) * 100 : 0;
      return {
        ...s,
        widthPercent: (s.count / maxCount) * 100,
        conversionRate: i > 0 ? Math.round(conversionRate * 10) / 10 : 100,
        overallRate: Math.round(overallRate * 10) / 10,
      };
    });

    return NextResponse.json({ funnel });
  } catch (error) {
    console.error('Analytics funnel error:', error);
    return NextResponse.json({ error: 'Gagal mengambil funnel data' }, { status: 500 });
  }
}
