import { NextRequest, NextResponse } from 'next/server';
import { generateProactiveSuggestions, generatePersonalizedGreeting, shouldOfferEscalation } from '@/lib/tami/cognitive/proactive-engine';
import { checkAdminAuth } from '@/lib/auth/admin-check';

export const maxDuration = 10;

/**
 * T7-2: Proactive conversation engine endpoint.
 * Returns proactive suggestions, personalized greeting, and escalation offer
 * based on session metadata (returning users, mood trends, topic continuation).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId } = body;

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json(
        { error: 'sessionId wajib diisi' },
        { status: 400 }
      );
    }

    const suggestions = generateProactiveSuggestions(sessionId);
    const greeting = generatePersonalizedGreeting(sessionId);
    const escalation = shouldOfferEscalation(sessionId);

    return NextResponse.json({
      suggestions,
      greeting,
      escalation,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[TAMI PROACTIVE] Route failed:', error);
    return NextResponse.json(
      { error: 'Gagal menghasilkan saran proaktif.' },
      { status: 500 }
    );
  }
}

/**
 * Admin-only: Get proactive stats for dashboard.
 */
export async function GET() {
  const authResult = await checkAdminAuth();
  if (!authResult.isAdmin) {
    return authResult.response;
  }

  return NextResponse.json({
    endpoint: 'proactive',
    description: 'Proactive conversation engine for re-engagement, mood alerts, and topic continuation',
    timestamp: new Date().toISOString(),
  });
}
