import { NextResponse } from 'next/server';
import { getPublicDonors } from '@/lib/db/queries/donations';

export async function GET() {
  try {
    const donors = await getPublicDonors(20);

    return NextResponse.json({ donors });
  } catch (error) {
    console.error('Donor wall error:', error);
    return NextResponse.json(
      { donors: [] },
      { status: 200 }
    );
  }
}
