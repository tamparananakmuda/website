import { NextRequest } from 'next/server';
import { z } from 'zod';
import { processTamiIntelligence, streamTamiReply } from '@/lib/tami/agent/orchestrator';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { moderateInput, checkRateLimit as checkSafetyRateLimit, trackConversation } from '@/lib/tami/guardrails/safety';

export const maxDuration = 60;

const tamiRequestSchema = z.object({
  query: z.string().trim().min(1, 'Query wajib diisi').max(2000, 'Query terlalu panjang'),
  history: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string().max(5000),
    })
  ).max(20).optional().default([]),
});

export async function POST(req: NextRequest) {
  try {
    const rlResult = await rateLimit(req, {
      limit: 15,
      window: 60,
      identifier: 'tami-stream',
      authenticatedLimit: 30,
      burstLimit: 3,
      burstWindow: 10,
    });
    if (!rlResult.success) {
      return rateLimitResponse(rlResult);
    }

    const body = await req.json();
    const parsed = tamiRequestSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return new Response(
        JSON.stringify({ error: firstError?.message || 'Input tidak valid.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { query, history } = parsed.data;

    // T7-5: Content moderation check
    const moderation = moderateInput(query);
    if (!moderation.allowed) {
      return new Response(
        JSON.stringify({ error: moderation.reason }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // T7-5: Per-IP safety rate limiting (sliding window)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const safetyLimit = checkSafetyRateLimit(ip);
    if (!safetyLimit.allowed) {
      return new Response(
        JSON.stringify({ error: 'Terlalu banyak permintaan. Coba lagi dalam beberapa saat.' }),
        { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': String(Math.ceil(safetyLimit.resetInMs / 1000)) } }
      );
    }

    // T7-5: Track conversation for retention policy
    const conversationId = `conv-${Date.now()}-${ip.slice(-6)}`;
    trackConversation(conversationId);

    // Step 2: Create SSE stream — send initial event immediately to prevent gateway timeout
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        // Send heartbeat immediately so Cloudflare/Vercel doesn't 504 while pipeline runs
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'processing' })}\n\n`)
        );

        // Step 1: Run full pipeline to get cognitive data (diagnosis, action plan, citations, etc.)
        let cognitiveResponse;
        try {
          cognitiveResponse = await processTamiIntelligence(query, history, { streaming: true });
        } catch (err) {
          console.error('[TAMI SSE] Pipeline failed:', err);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'token', content: 'Maaf, TAMI lagi ada kendala teknis. Coba lagi ya.' })}\n\n`)
          );
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
          );
          controller.close();
          return;
        }

        // Extract cognitive data without conversationalReply for streaming
        const { conversationalReply, ...cognitiveData } = cognitiveResponse;

        // Fast path: for greetings/simple queries, skip expensive streamTamiReply() LLM call
        // Exclude degraded responses (circuit breaker fallback) — those need streaming for context
        const isQuickChat = 'isQuickChat' in cognitiveData && cognitiveData.isQuickChat;
        const isGreetingResponse = cognitiveData.severityLevel === 'ringan' 
          && !('isDegraded' in cognitiveData && cognitiveData.isDegraded)
          && (!cognitiveData.actionPlan || cognitiveData.actionPlan.length === 0)
          && (!cognitiveData.citations || cognitiveData.citations.length === 0);

        // Event 1: Send cognitive data (skip for quick-chat to avoid rendering cards)
        if (!isQuickChat) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'cognitive', data: cognitiveData })}\n\n`)
          );
        }

        // Fast path: send pre-computed reply directly for greetings and quick-chat
        if ((isGreetingResponse || isQuickChat) && conversationalReply) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'token', content: conversationalReply })}\n\n`)
          );
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
          );
          controller.close();
          return;
        }

        // Event 2: Stream conversational reply token-by-token
        try {
          const mistralStream = await streamTamiReply(query, history, cognitiveData);
          const reader = mistralStream.getReader();
          const decoder = new TextDecoder();
          let sseBuffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            sseBuffer += decoder.decode(value, { stream: true });
            // Split by newlines but keep remainder in buffer
            const lines = sseBuffer.split('\n');
            sseBuffer = lines.pop() || ''; // Keep last incomplete line in buffer

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith('data: ')) continue;
              const jsonStr = trimmed.slice(6).trim();
              if (jsonStr === '[DONE]') continue;
              try {
                const parsed = JSON.parse(jsonStr);
                const delta = parsed.choices?.[0]?.delta?.content;
                if (delta) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ type: 'token', content: delta })}\n\n`)
                  );
                }
              } catch {
                // Skip unparseable lines (likely partial JSON in buffer)
              }
            }
          }

          // Process any remaining buffer content
          if (sseBuffer.trim().startsWith('data: ')) {
            const jsonStr = sseBuffer.trim().slice(6).trim();
            if (jsonStr && jsonStr !== '[DONE]') {
              try {
                const parsed = JSON.parse(jsonStr);
                const delta = parsed.choices?.[0]?.delta?.content;
                if (delta) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ type: 'token', content: delta })}\n\n`)
                  );
                }
              } catch {
                // Ignore unparseable remainder
              }
            }
          }
        } catch (error) {
          console.error('[TAMI SSE] Stream failed, sending cached reply as fallback:', error);
          // Fallback: send the pre-computed conversational reply as a single chunk
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'token', content: conversationalReply })}\n\n`)
          );
        }

        // Event 3: Done signal
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
        );
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('[TAMI SSE] Route failed:', error);
    return new Response(
      JSON.stringify({ error: 'Gagal memproses streaming TAMI. Silakan coba beberapa saat lagi.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
