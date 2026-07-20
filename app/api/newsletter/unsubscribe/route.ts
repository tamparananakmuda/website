import { NextRequest, NextResponse } from 'next/server';
import { unsubscribeByToken } from '@/lib/db/queries/newsletter';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(
      new URL('/newsletter/unsubscribe?error=invalid', request.url)
    );
  }

  const success = await unsubscribeByToken(token);

  if (!success) {
    return NextResponse.redirect(
      new URL('/newsletter/unsubscribe?error=invalid', request.url)
    );
  }

  return NextResponse.redirect(
    new URL('/newsletter/unsubscribe?success=true', request.url)
  );
}
