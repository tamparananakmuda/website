'use client';

/**
 * Track user mood across TAMI conversations.
 * Stores emotion + resilience score per session in localStorage.
 */

interface MoodEntry {
  date: string;
  emotion: string;
  resilience: number;
  severity: string;
}

const MOOD_KEY = 'tami_mood_history';
const MAX_ENTRIES = 50;

export function saveMoodEntry(emotion: string, resilience: number, severity: string): void {
  if (typeof window === 'undefined') return;

  const entry: MoodEntry = {
    date: new Date().toISOString(),
    emotion,
    resilience,
    severity,
  };

  const existing = getMoodHistory();
  existing.push(entry);

  // Keep only last N entries
  if (existing.length > MAX_ENTRIES) {
    existing.shift();
  }

  localStorage.setItem(MOOD_KEY, JSON.stringify(existing));
}

export function getMoodHistory(): MoodEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(MOOD_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getMoodTrend(): {
  trend: 'improving' | 'stable' | 'declining';
  avgResilience: number;
  entries: MoodEntry[];
} {
  const history = getMoodHistory();
  if (history.length === 0) {
    return { trend: 'stable', avgResilience: 0, entries: [] };
  }

  const avgResilience = history.reduce((sum, e) => sum + e.resilience, 0) / history.length;

  // Compare last 3 vs previous 3
  const recent = history.slice(-3);
  const previous = history.slice(-6, -3);

  if (previous.length === 0) {
    return { trend: 'stable', avgResilience, entries: history };
  }

  const recentAvg = recent.reduce((sum, e) => sum + e.resilience, 0) / recent.length;
  const prevAvg = previous.reduce((sum, e) => sum + e.resilience, 0) / previous.length;

  const diff = recentAvg - prevAvg;
  const trend = diff > 0.5 ? 'improving' : diff < -0.5 ? 'declining' : 'stable';

  return { trend, avgResilience, entries: history };
}
