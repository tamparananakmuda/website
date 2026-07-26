import { NextRequest, NextResponse } from 'next/server';
import { confirmSubscription } from '@/lib/db/queries/newsletter';
import { sendEmail } from '@/lib/email/client';
import { renderWelcomeEmail } from '@/lib/email/templates/welcome';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(
      new URL('/newsletter/confirm?error=invalid', request.url)
    );
  }

  const subscriber = await confirmSubscription(token);

  if (!subscriber) {
    return NextResponse.redirect(
      new URL('/newsletter/confirm?error=invalid', request.url)
    );
  }

  if (subscriber.unsubscribeToken) {
    const { subject, html } = renderWelcomeEmail({
      email: subscriber.email,
      unsubscribeToken: subscriber.unsubscribeToken,
      topics: subscriber.topics ?? undefined,
    });
    const result = await sendEmail({
      to: subscriber.email,
      subject,
      htmlContent: html,
      tags: ['newsletter-welcome'],
    });
    if (!result.success) {
      console.error('[newsletter] Welcome email failed:', result.error);
    }
  }

  return NextResponse.redirect(
    new URL('/newsletter/confirm?success=true', request.url)
  );
}
