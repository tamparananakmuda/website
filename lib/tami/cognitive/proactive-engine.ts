/**
 * Proactive Conversation Engine
 * 
 * - Session re-engagement: suggest follow-up when user returns after absence
 * - Mood trend alerts: notify if emotional state worsening across sessions
 * - Topic continuation: offer to resume unfinished conversations
 * - Smart greeting: personalized based on session history
 */

import { getSessionMetadata, getEmotionalPattern } from '../cognitive/conversation-memory';

interface ProactiveSuggestion {
  type: 'reengage' | 'mood_alert' | 'topic_continue' | 'welcome_back';
  message: string;
  suggestedQuery?: string;
  priority: 'low' | 'medium' | 'high';
}

const NEGATIVE_EMOTIONS = ['cemas', 'frustrasi', 'sedih', 'marah', 'putus asa', 'capek', 'lelah'];
const REENGAGE_THRESHOLD_MS = 24 * 60 * 60 * 1000; // 24 hours
const MOOD_ALERT_THRESHOLD = 3; // 3 consecutive negative emotions

/**
 * Generate proactive suggestions for a returning user.
 */
export function generateProactiveSuggestions(sessionId: string): ProactiveSuggestion[] {
  const suggestions: ProactiveSuggestion[] = [];
  const metadata = getSessionMetadata(sessionId);
  
  if (!metadata || metadata.messageCount === 0) {
    return suggestions;
  }

  const now = Date.now();
  const timeSinceLastActive = now - metadata.lastActiveAt;

  // 1. Welcome back after absence
  if (timeSinceLastActive > REENGAGE_THRESHOLD_MS) {
    const hours = Math.floor(timeSinceLastActive / (60 * 60 * 1000));
    const days = Math.floor(hours / 24);
    
    suggestions.push({
      type: 'welcome_back',
      message: days > 0 
        ? `Halo lagi! Sudah ${days} hari sejak percakapan terakhir kita. Gimana kabarmu sekarang?`
        : `Halo lagi! Sudah ${hours} jam sejak terakhir kita ngobrol. Ada yang berubah?`,
      priority: 'medium',
    });
  }

  // 2. Mood trend alert
  if (metadata.severityTrend === 'worsening') {
    const pattern = getEmotionalPattern(sessionId);
    const recentNegative = pattern.emotionHistory
      .slice(-MOOD_ALERT_THRESHOLD)
      .filter(e => NEGATIVE_EMOTIONS.includes(e.emotion.toLowerCase()));
    
    if (recentNegative.length >= MOOD_ALERT_THRESHOLD) {
      suggestions.push({
        type: 'mood_alert',
        message: `Saya perhatikan beberapa percakapan terakhir kamu terasa berat. Kalau mau bicara lebih dalam dengan tim profesional TAM, kamu bisa lho.`,
        suggestedQuery: 'Mau konsultasi lebih lanjut',
        priority: 'high',
      });
    }
  }

  // 3. Topic continuation
  if (metadata.recurringTopics.length > 0 && timeSinceLastActive > 60 * 60 * 1000) {
    const lastTopic = metadata.recurringTopics[metadata.recurringTopics.length - 1];
    suggestions.push({
      type: 'topic_continue',
      message: `Terakhir kita membahas tentang ${lastTopic}. Mau lanjutkan atau ada hal baru yang ingin dibahas?`,
      suggestedQuery: `Lanjutkan tentang ${lastTopic}`,
      priority: 'low',
    });
  }

  // 4. Re-engagement for users who had short sessions
  if (metadata.messageCount <= 2 && timeSinceLastActive > 3 * 60 * 60 * 1000) {
    suggestions.push({
      type: 'reengage',
      message: `Kelihatannya percakapan kita sebelumnya belum tuntas. Ada yang ingin kamu tanyakan lebih lanjut?`,
      priority: 'medium',
    });
  }

  return suggestions;
}

/**
 * Generate a personalized greeting based on session history.
 */
export function generatePersonalizedGreeting(sessionId: string): string | null {
  const metadata = getSessionMetadata(sessionId);
  
  if (!metadata || metadata.messageCount === 0) {
    return null; // New user, use default greeting
  }

  const timeSinceLastActive = Date.now() - metadata.lastActiveAt;
  const hours = timeSinceLastActive / (60 * 60 * 1000);

  if (hours < 1) {
    return null; // Very recent, no greeting needed
  } else if (hours < 24) {
    return `Halo lagi! Ada yang ingin dibahas hari ini?`;
  } else {
    const days = Math.floor(hours / 24);
    if (metadata.dominantEmotion !== 'neutral' && NEGATIVE_EMOTIONS.includes(metadata.dominantEmotion.toLowerCase())) {
      return `Halo, sudah ${days} hari. Gimana perasaanmu sekarang? Apakah ada perubahan sejak terakhir kita ngobrol?`;
    }
    return `Halo lagi! Sudah ${days} hari sejak terakhir kita ngobrol. Apa yang sedang kamu pikirkan hari ini?`;
  }
}

/**
 * Check if user should be offered escalation based on cross-session pattern.
 */
export function shouldOfferEscalation(sessionId: string): { should: boolean; reason: string } {
  const metadata = getSessionMetadata(sessionId);
  
  if (!metadata) return { should: false, reason: '' };

  // Worsening trend over multiple sessions
  if (metadata.severityTrend === 'worsening' && metadata.messageCount >= 4) {
    return {
      should: true,
      reason: 'Emotional state appears to be worsening across sessions. Professional support recommended.',
    };
  }

  // Persistent negative dominant emotion
  if (NEGATIVE_EMOTIONS.includes(metadata.dominantEmotion.toLowerCase()) && metadata.messageCount >= 6) {
    return {
      should: true,
      reason: 'Persistent negative emotional pattern detected across multiple conversations.',
    };
  }

  return { should: false, reason: '' };
}
