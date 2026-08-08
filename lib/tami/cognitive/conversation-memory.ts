/**
 * Conversation Memory: Multi-turn context management with summary compression.
 * 
 * Instead of passing full history to LLM (expensive + token-heavy), this module:
 * 1. Keeps recent messages verbatim (last N messages)
 * 2. Compresses older messages into a concise LLM-generated summary
 * 3. Tracks user emotional patterns and recurring topics across sessions
 * 4. Manages context window budget to prevent token overflow
 */

import { mistral } from '../mistral/client';
import { trackTokenUsage, estimateTokens } from '../observability/cost-tracker';

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  emotion?: string;
  crisisFlag?: boolean;
}

interface SessionMemory {
  sessionId: string;
  messages: ConversationMessage[];
  summary: string;
  summaryUpToIndex: number; // Messages before this index are summarized
  emotionalPattern: {
    dominantEmotion: string;
    emotionHistory: { emotion: string; timestamp: number }[];
    severityTrend: 'improving' | 'stable' | 'worsening';
  };
  recurringTopics: string[];
  lastActiveAt: number;
  createdAt: number;
}

// In-memory store (production: replace with DB/Redis)
const sessionStore = new Map<string, SessionMemory>();
const MAX_SESSIONS = 100;
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes
const RECENT_MESSAGE_COUNT = 6; // Keep last 6 messages verbatim
const SUMMARY_TRIGGER = 10; // Summarize when history exceeds 10 messages
const MAX_SUMMARY_TOKENS = 300;
const MAX_CONTEXT_TOKENS = 4000; // Budget for history in LLM prompt

/**
 * Get or create session memory.
 */
export function getSessionMemory(sessionId: string): SessionMemory {
  const now = Date.now();
  
  // Cleanup expired sessions
  if (sessionStore.size >= MAX_SESSIONS) {
    cleanupExpiredSessions();
  }

  let session = sessionStore.get(sessionId);
  if (!session) {
    session = {
      sessionId,
      messages: [],
      summary: '',
      summaryUpToIndex: 0,
      emotionalPattern: {
        dominantEmotion: 'neutral',
        emotionHistory: [],
        severityTrend: 'stable',
      },
      recurringTopics: [],
      lastActiveAt: now,
      createdAt: now,
    };
    sessionStore.set(sessionId, session);
  }
  
  session.lastActiveAt = now;
  return session;
}

/**
 * Add a message to session memory.
 */
export function addMessage(
  sessionId: string,
  role: 'user' | 'assistant',
  content: string,
  metadata?: { emotion?: string; crisisFlag?: boolean },
): void {
  const session = getSessionMemory(sessionId);
  
  const msg: ConversationMessage = {
    role,
    content,
    timestamp: Date.now(),
    emotion: metadata?.emotion,
    crisisFlag: metadata?.crisisFlag,
  };
  
  session.messages.push(msg);

  // Track emotional pattern
  if (metadata?.emotion) {
    session.emotionalPattern.emotionHistory.push({
      emotion: metadata.emotion,
      timestamp: Date.now(),
    });
    updateEmotionalPattern(session);
  }
}

/**
 * Get context for LLM prompt: summary + recent messages, within token budget.
 */
export function getContextForLLM(sessionId: string): { role: 'user' | 'assistant'; content: string }[] {
  const session = getSessionMemory(sessionId);
  const context: { role: 'user' | 'assistant'; content: string }[] = [];
  let tokenCount = 0;

  // Add summary first if exists
  if (session.summary) {
    const summaryTokens = estimateTokens(session.summary);
    if (tokenCount + summaryTokens <= MAX_CONTEXT_TOKENS) {
      context.push({
        role: 'assistant',
        content: `[Ringkasan percakapan sebelumnya: ${session.summary}]`,
      });
      tokenCount += summaryTokens;
    }
  }

  // Add recent messages (from summaryUpToIndex onwards)
  const recentMessages = session.messages.slice(session.summaryUpToIndex);
  for (const msg of recentMessages) {
    const msgTokens = estimateTokens(msg.content);
    if (tokenCount + msgTokens > MAX_CONTEXT_TOKENS) {
      // Skip older messages that don't fit, prioritize most recent
      break;
    }
    context.push({ role: msg.role, content: msg.content });
    tokenCount += msgTokens;
  }

  // If we hit token limit, ensure we include at least last 2 messages
  if (context.length < 2 && recentMessages.length >= 2) {
    const last2 = recentMessages.slice(-2);
    context.length = 0; // Clear and just use last 2
    if (session.summary) {
      context.push({
        role: 'assistant',
        content: `[Ringkasan: ${session.summary.slice(0, 200)}...]`,
      });
    }
    for (const msg of last2) {
      context.push({ role: msg.role, content: msg.content });
    }
  }

  return context;
}

/**
 * Compress older messages into a summary using LLM.
 * Called when message count exceeds SUMMARY_TRIGGER.
 */
export async function compressHistory(sessionId: string): Promise<void> {
  const session = getSessionMemory(sessionId);
  
  const unsummarizedCount = session.messages.length - session.summaryUpToIndex;
  if (unsummarizedCount < SUMMARY_TRIGGER) return;

  // Messages to summarize (keep last RECENT_MESSAGE_COUNT verbatim)
  const toSummarize = session.messages.slice(
    session.summaryUpToIndex,
    session.messages.length - RECENT_MESSAGE_COUNT,
  );

  if (toSummarize.length === 0) return;

  const existingSummary = session.summary;
  const messagesText = toSummarize
    .map(m => `${m.role === 'user' ? 'User' : 'TAMI'}: ${m.content.slice(0, 300)}`)
    .join('\n');

  try {
    const response = await mistral.chat({
      model: 'mistral-small-latest',
      temperature: 0.3,
      maxTokens: MAX_SUMMARY_TOKENS,
      timeoutMs: 5000,
      promptCacheKey: 'tami-memory-summary',
      messages: [
        {
          role: 'system',
          content: 'Anda adalah kompresor memori percakapan. Ringkas percakapan menjadi 3-5 kalimat yang mencakup: topik utama, emosi user, saran yang diberikan TAMI, dan hal yang belum tuntas. Bahasa Indonesia, singkat dan padat.',
        },
        {
          role: 'user',
          content: `${existingSummary ? `Ringkasan sebelumnya: ${existingSummary}\n\n` : ''}Percakapan baru:\n${messagesText}\n\nRingkas menjadi update memori yang mencakup semua informasi penting.`,
        },
      ],
    });

    const newSummary = response.choices[0].message.content.trim();
    const tokensUsed = estimateTokens(messagesText) + MAX_SUMMARY_TOKENS;
    trackTokenUsage('memory-compression', tokensUsed, 'mistral-small-latest');

    session.summary = newSummary;
    session.summaryUpToIndex = session.messages.length - RECENT_MESSAGE_COUNT;
    
    console.log(`[TAMI MEMORY] Compressed ${toSummarize.length} messages for session ${sessionId.slice(0, 8)}`);
  } catch (error) {
    console.error('[TAMI MEMORY] Compression failed:', (error as Error).message);
    // Fallback: simple truncation summary
    const fallbackSummary = toSummarize
      .filter(m => m.role === 'user')
      .map(m => m.content.slice(0, 80))
      .join(' | ');
    session.summary = existingSummary
      ? `${existingSummary} | Lanjutan: ${fallbackSummary.slice(0, 200)}`
      : `Topik dibahas: ${fallbackSummary.slice(0, 300)}`;
    session.summaryUpToIndex = session.messages.length - RECENT_MESSAGE_COUNT;
  }
}

/**
 * Update emotional pattern analysis from emotion history.
 */
function updateEmotionalPattern(session: SessionMemory): void {
  const { emotionHistory } = session.emotionalPattern;
  if (emotionHistory.length === 0) return;

  // Dominant emotion: most frequent in recent history
  const recent = emotionHistory.slice(-10);
  const emotionCounts: Record<string, number> = {};
  for (const e of recent) {
    emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + 1;
  }
  session.emotionalPattern.dominantEmotion = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';

  // Severity trend: compare first half vs second half
  if (recent.length >= 4) {
    const firstHalf = recent.slice(0, Math.floor(recent.length / 2));
    const secondHalf = recent.slice(Math.floor(recent.length / 2));
    
    const negativeEmotions = ['cemas', 'frustrasi', 'sedih', 'marah', 'putus asa', 'capek'];
    const firstNegCount = firstHalf.filter(e => negativeEmotions.includes(e.emotion.toLowerCase())).length;
    const secondNegCount = secondHalf.filter(e => negativeEmotions.includes(e.emotion.toLowerCase())).length;
    
    if (secondNegCount > firstNegCount) {
      session.emotionalPattern.severityTrend = 'worsening';
    } else if (secondNegCount < firstNegCount) {
      session.emotionalPattern.severityTrend = 'improving';
    } else {
      session.emotionalPattern.severityTrend = 'stable';
    }
  }
}

/**
 * Get emotional pattern summary for a session.
 */
export function getEmotionalPattern(sessionId: string): SessionMemory['emotionalPattern'] {
  return getSessionMemory(sessionId).emotionalPattern;
}

/**
 * Track recurring topics from user queries.
 */
export function trackTopic(sessionId: string, topic: string): void {
  const session = getSessionMemory(sessionId);
  if (!session.recurringTopics.includes(topic)) {
    session.recurringTopics.push(topic);
    // Keep only top 5 topics
    if (session.recurringTopics.length > 5) {
      session.recurringTopics.shift();
    }
  }
}

/**
 * Get session metadata for proactive engine.
 */
export function getSessionMetadata(sessionId: string): {
  messageCount: number;
  dominantEmotion: string;
  severityTrend: string;
  recurringTopics: string[];
  lastActiveAt: number;
  hasSummary: boolean;
} | null {
  const session = sessionStore.get(sessionId);
  if (!session) return null;
  return {
    messageCount: session.messages.length,
    dominantEmotion: session.emotionalPattern.dominantEmotion,
    severityTrend: session.emotionalPattern.severityTrend,
    recurringTopics: session.recurringTopics,
    lastActiveAt: session.lastActiveAt,
    hasSummary: !!session.summary,
  };
}

/**
 * Cleanup expired sessions.
 */
function cleanupExpiredSessions(): void {
  const now = Date.now();
  let cleaned = 0;
  for (const [sid, session] of Array.from(sessionStore.entries())) {
    if (now - session.lastActiveAt > SESSION_TTL_MS) {
      sessionStore.delete(sid);
      cleaned++;
    }
  }
  if (cleaned > 0) {
    console.log(`[TAMI MEMORY] Cleaned up ${cleaned} expired sessions (${sessionStore.size} active)`);
  }
}

/**
 * Clear a specific session.
 */
export function clearSession(sessionId: string): void {
  sessionStore.delete(sessionId);
}

/**
 * Get all active session count (for monitoring).
 */
export function getActiveSessionCount(): number {
  return sessionStore.size;
}
