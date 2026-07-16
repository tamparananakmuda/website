import { NextResponse } from 'next/server';
import { getPublishedIssues } from '@/lib/db/queries/newsletter';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const issues = await getPublishedIssues();

    return NextResponse.json({ issues: issues || [] });
  } catch (error) {
    console.error('Newsletter issues fetch error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil arsip newsletter' },
      { status: 500 }
    );
  }
}
