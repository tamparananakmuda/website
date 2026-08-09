/**
 * Safety & Compliance Layer
 * 
 * - Crisis audit log: permanent record of all crisis detection events
 * - Content moderation: filter hate speech, spam, exploitation attempts
 * - Per-IP rate limiting: sliding window to prevent abuse
 * - Conversation retention: TTL-based auto-expiry
 */

// ─── Crisis Audit Log ─────────────────────────────────────

interface CrisisAuditEntry {
  id: string;
  timestamp: string;
  sessionId: string;
  escalationLevel: 'immediate' | 'warning' | 'monitor';
  emotion: string;
  resilienceScore: number;
  querySnippet: string;
  actionTaken: string;
  webhookSent: boolean;
}

const crisisAuditLog: CrisisAuditEntry[] = [];
const MAX_AUDIT_LOG = 1000;

/**
 * Log a crisis event for compliance audit trail.
 */
export function logCrisisEvent(entry: Omit<CrisisAuditEntry, 'id' | 'timestamp'>): void {
  const auditEntry: CrisisAuditEntry = {
    ...entry,
    id: `crisis-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
  };
  
  crisisAuditLog.push(auditEntry);
  if (crisisAuditLog.length > MAX_AUDIT_LOG) {
    crisisAuditLog.shift();
  }
  
  console.error(`[TAMI CRISIS AUDIT] ${auditEntry.timestamp} | ${auditEntry.escalationLevel} | ${auditEntry.emotion} | session=${auditEntry.sessionId.slice(0, 8)} | webhook=${auditEntry.webhookSent}`);
}

/**
 * Get crisis audit log for admin dashboard.
 */
export function getCrisisAuditLog(limit = 50): CrisisAuditEntry[] {
  return crisisAuditLog.slice(-limit).reverse();
}

/**
 * Get crisis audit statistics.
 */
export function getCrisisAuditStats(): {
  total: number;
  byLevel: Record<string, number>;
  last24h: number;
} {
  const now = Date.now();
  const yesterday = now - 24 * 60 * 60 * 1000;
  
  const byLevel: Record<string, number> = { immediate: 0, warning: 0, monitor: 0 };
  let last24h = 0;
  
  for (const entry of crisisAuditLog) {
    byLevel[entry.escalationLevel] = (byLevel[entry.escalationLevel] || 0) + 1;
    if (new Date(entry.timestamp).getTime() > yesterday) {
      last24h++;
    }
  }
  
  return { total: crisisAuditLog.length, byLevel, last24h };
}

// ─── Content Moderation ───────────────────────────────────

interface ModerationResult {
  allowed: boolean;
  reason: string;
  category: 'safe' | 'spam' | 'hate' | 'exploitation' | 'self_harm_glamorization' | 'too_short';
}

const SPAM_PATTERNS = [
  /(.)\1{30,}/,
  /[A-Z]{50,}/,
  /(https?:\/\/\S+\s+){5,}/,
  /\b(viagra|casino|lottery|crypto giveaway|free money)\b/i,
];

const HATE_PATTERNS = [
  /\b(bangsat|anjing|kontol|memek|jembut|pantek)\b/i,
  /\b(kafir|infidel)\b.*\b(mati|bunuh|kill)\b/i,
  /\b(rasis|racist)\b.*\b(bunuh|kill|attack)\b/i,
];

const EXPLOITATION_PATTERNS = [
  /\b(jual|beli|jual beli)\b.*\b(anak|child|minor|underage)\b/i,
  /\b(sex|sexually)\b.*\b(exploit|abuse|minor)\b/i,
];

// ─── Prompt Injection Detection ───────────────────────────

const INJECTION_PATTERNS = [
  // English injection attempts
  /ignor(e|re)\s+(all\s+)?previous\s+instructions?/i,
  /disregard\s+(all\s+)?(previous|prior)\s+instructions?/i,
  /you\s+are\s+now\s+(in\s+)?developer\s+mode/i,
  /act\s+as\s+if\s+you\s+have\s+no\s+restrictions/i,
  /reveal\s+(your\s+)?(system\s+)?prompt/i,
  /show\s+me\s+your\s+(system\s+)?prompt/i,
  /what\s+(is|are)\s+your\s+(system\s+)?instructions?/i,
  /bypass\s+(safety|content|all)\s+(filter|guard|restriction)/i,
  /override\s+(your|the)\s+(system|safety|content)\s+(prompt|filter|guard)/i,
  /you\s+are\s+now\s+(a\s+)?(different|new)\s+(ai|assistant|model)/i,
  /pretend\s+you\s+are\s+(not|a\s+different)/i,
  /enter\s+(jailbreak|dan|developer|root)\s+mode/i,
  /do\s+anything\s+now/i,
  // Indonesian injection attempts
  /lupakan\s+(semua\s+)?instruksi/i,
  /lupakan\s+(semua\s+)?aturan/i,
  /abaikan\s+(semua\s+)?instruksi/i,
  /abaikan\s+(semua\s+)?aturan/i,
  /jangan\s+ikuti\s+aturan/i,
  /tunjukkan?\s+(system\s+)?prompt/i,
  /tunjukkan?\s+instruksi/i,
  /apa\s+instruksi\s+(lo|kamu|kau)\b/i,
  /ubah\s+persona/i,
  /jadi\s+(ai|chatgpt|gpt|asisten)\s+(lain)?/i,
  /mode\s+developer/i,
  /bypass\s+(keamanan|filter|safety)/i,
  /jailbreak/i,
];

/**
 * Detect prompt injection attempts in user input.
 * Returns true if injection pattern is matched.
 */
export function detectPromptInjection(input: string): boolean {
  const trimmed = input.trim();
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return true;
    }
  }
  return false;
}

/**
 * Moderate user input before processing.
 */
export function moderateInput(input: string): ModerationResult {
  const trimmed = input.trim();
  
  if (trimmed.length < 3) {
    return { allowed: false, reason: 'Pesan terlalu pendek', category: 'too_short' };
  }

  if (detectPromptInjection(trimmed)) {
    return { allowed: false, reason: 'Percobaan prompt injection terdeteksi', category: 'exploitation' };
  }
  
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { allowed: false, reason: 'Pesan terdeteksi sebagai spam', category: 'spam' };
    }
  }
  
  for (const pattern of HATE_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { allowed: false, reason: 'Pesan mengandung ujaran kebencian', category: 'hate' };
    }
  }
  
  for (const pattern of EXPLOITATION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { allowed: false, reason: 'Pesan terdeteksi sebagai konten eksploitasi', category: 'exploitation' };
    }
  }
  
  return { allowed: true, reason: '', category: 'safe' };
}

// ─── Per-IP Rate Limiting (Sliding Window) ────────────────

interface RateLimitEntry {
  timestamps: number[];
}

const ipRateLimits = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const MAX_IPS_TRACKED = 500;

/**
 * Check if IP is within rate limit.
 */
export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetInMs: number } {
  const now = Date.now();
  
  if (ipRateLimits.size >= MAX_IPS_TRACKED) {
    cleanupOldIps();
  }
  
  let entry = ipRateLimits.get(ip);
  if (!entry) {
    entry = { timestamps: [] };
    ipRateLimits.set(ip, entry);
  }
  
  entry.timestamps = entry.timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);
  
  if (entry.timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    const oldestInWindow = entry.timestamps[0];
    const resetInMs = RATE_LIMIT_WINDOW_MS - (now - oldestInWindow);
    return { allowed: false, remaining: 0, resetInMs: Math.max(resetInMs, 0) };
  }
  
  entry.timestamps.push(now);
  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX_REQUESTS - entry.timestamps.length,
    resetInMs: RATE_LIMIT_WINDOW_MS,
  };
}

function cleanupOldIps(): void {
  const now = Date.now();
  for (const [ip, entry] of Array.from(ipRateLimits.entries())) {
    const fresh = entry.timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);
    if (fresh.length === 0) {
      ipRateLimits.delete(ip);
    } else {
      entry.timestamps = fresh;
    }
  }
}

/**
 * Get rate limit stats for admin dashboard.
 */
export function getRateLimitStats(): { trackedIps: number; activeIps: number } {
  const now = Date.now();
  let active = 0;
  for (const entry of Array.from(ipRateLimits.values())) {
    if (entry.timestamps.some((ts: number) => now - ts < RATE_LIMIT_WINDOW_MS)) {
      active++;
    }
  }
  return { trackedIps: ipRateLimits.size, activeIps: active };
}

// ─── Conversation Retention Policy ────────────────────────

const RETENTION_DAYS = 7;
const conversationCreatedAt = new Map<string, number>();

/**
 * Track conversation creation time for retention.
 */
export function trackConversation(sessionId: string): void {
  if (!conversationCreatedAt.has(sessionId)) {
    conversationCreatedAt.set(sessionId, Date.now());
  }
}

/**
 * Check if a conversation has expired based on retention policy.
 */
export function isConversationExpired(sessionId: string): boolean {
  const createdAt = conversationCreatedAt.get(sessionId);
  if (!createdAt) return false;
  return Date.now() - createdAt > RETENTION_DAYS * 24 * 60 * 60 * 1000;
}

/**
 * Get retention stats.
 */
export function getRetentionStats(): { totalTracked: number; expired: number; retentionDays: number } {
  let expired = 0;
  for (const createdAt of Array.from(conversationCreatedAt.values())) {
    if (Date.now() - createdAt > RETENTION_DAYS * 24 * 60 * 60 * 1000) {
      expired++;
    }
  }
  return { totalTracked: conversationCreatedAt.size, expired, retentionDays: RETENTION_DAYS };
}
