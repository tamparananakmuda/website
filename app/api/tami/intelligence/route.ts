import { NextRequest, NextResponse } from 'next/server';
import { processTamiIntelligence } from '@/lib/tami/agent/orchestrator';

export const maxDuration = 60; // Allow long-running multi-agent reasoning (Mistral Large)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, history } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required.' }, { status: 400 });
    }

    const response = await processTamiIntelligence(query, history || []);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('[TAMI API] Intelligence route failed:', error);
    return NextResponse.json(
      { error: 'Gagal memproses kecerdasan TAMI. Silakan coba beberapa saat lagi.' },
      { status: 500 }
    );
  }
}
