import { NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/auth/admin-check';
import { getPillars } from '@/lib/db/queries/content-queue';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await checkAdminAuth();
  if (!auth.isAdmin) return auth.response;

  try {
    const pillars = await getPillars();

    return NextResponse.json({ pillars });
  } catch (error) {
    console.error('Pillars fetch error:', error);
    return NextResponse.json({ pillars: [] }, { status: 500 });
  }
}
