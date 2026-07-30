import { NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/auth/admin-check';
import { getDonationAnalytics } from '@/lib/db/queries/donations';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await checkAdminAuth();
  if (!auth.isAdmin) return auth.response;

  try {
    const data = await getDonationAnalytics();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[analytics/donations] Error:', error);
    return NextResponse.json({ error: 'Gagal memuat donation analytics' }, { status: 500 });
  }
}
