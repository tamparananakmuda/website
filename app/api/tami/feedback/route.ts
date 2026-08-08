import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';

const feedbackSchema = z.object({
  messageId: z.string().max(100),
  feedback: z.enum(['up', 'down']),
  query: z.string().max(500).optional(),
  reply: z.string().max(1000).optional(),
});

// In-memory self-improvement log (resets on cold start)
interface ImprovementEntry {
  messageId: string;
  query: string;
  reply: string;
  timestamp: string;
}

const negativeFeedbackLog: ImprovementEntry[] = [];
const MAX_LOG_ENTRIES = 50;

export async function POST(req: NextRequest) {
  const rlResult = await rateLimit(req, { limit: 30, window: 60, identifier: 'tami-feedback' });
  if (!rlResult.success) {
    return NextResponse.json({ error: 'Rate limited' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const parsed = feedbackSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid feedback data' }, { status: 400 });
    }

    const { messageId, feedback, query, reply } = parsed.data;

    console.log(`[TAMI FEEDBACK] ${feedback} | msg=${messageId} | query="${query?.slice(0, 80)}"`);

    // Log negative feedback for self-improvement review
    if (feedback === 'down' && query && reply) {
      negativeFeedbackLog.push({
        messageId,
        query: query.slice(0, 300),
        reply: reply.slice(0, 500),
        timestamp: new Date().toISOString(),
      });
      if (negativeFeedbackLog.length > MAX_LOG_ENTRIES) {
        negativeFeedbackLog.shift();
      }
    }

    return NextResponse.json({ ok: true, feedback });
  } catch {
    return NextResponse.json({ error: 'Failed to store feedback' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    negativeFeedback: negativeFeedbackLog,
    totalNegative: negativeFeedbackLog.length,
  });
}
