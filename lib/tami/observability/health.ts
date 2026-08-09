/**
 * Performance & Scalability
 * 
 * - Graceful degradation: fallback to rule-based responses when Mistral is down
 * - Cold start mitigation: warm-up RAG cache on server start
 * - Health check: verify all TAMI subsystems are operational
 * - Circuit breaker: prevent cascading failures when API is degraded
 */

import { knowledgeGraph } from '../rag/knowledge-graph';
import { tamiResponseCache } from '../cache/response-cache';
import { getActiveSessionCount } from '../cognitive/conversation-memory';

// ─── Circuit Breaker ──────────────────────────────────────

type CircuitState = 'closed' | 'open' | 'half_open';

interface CircuitBreaker {
  state: CircuitState;
  failureCount: number;
  lastFailureTime: number;
  failureThreshold: number;
  resetTimeoutMs: number;
}

const mistralCircuit: CircuitBreaker = {
  state: 'closed',
  failureCount: 0,
  lastFailureTime: 0,
  failureThreshold: 5,
  resetTimeoutMs: 30 * 1000,
};

export function isMistralAvailable(): boolean {
  if (mistralCircuit.state === 'open') {
    if (Date.now() - mistralCircuit.lastFailureTime > mistralCircuit.resetTimeoutMs) {
      mistralCircuit.state = 'half_open';
      console.log('[TAMI CIRCUIT] Mistral circuit breaker -> half_open');
      return true;
    }
    return false;
  }
  return true;
}

export function recordMistralSuccess(): void {
  if (mistralCircuit.state !== 'closed') {
    console.log('[TAMI CIRCUIT] Mistral circuit breaker -> closed (recovered)');
  }
  mistralCircuit.state = 'closed';
  mistralCircuit.failureCount = 0;
}

export function recordMistralFailure(): void {
  mistralCircuit.failureCount++;
  mistralCircuit.lastFailureTime = Date.now();
  
  if (mistralCircuit.failureCount >= mistralCircuit.failureThreshold) {
    mistralCircuit.state = 'open';
    console.error(`[TAMI CIRCUIT] Mistral circuit breaker -> open (${mistralCircuit.failureCount} failures)`);
  }
}

export function getCircuitStatus(): { state: CircuitState; failureCount: number; lastFailureTime: string | null } {
  return {
    state: mistralCircuit.state,
    failureCount: mistralCircuit.failureCount,
    lastFailureTime: mistralCircuit.lastFailureTime > 0 
      ? new Date(mistralCircuit.lastFailureTime).toISOString() 
      : null,
  };
}

// ─── Graceful Degradation ─────────────────────────────────

export function generateFallbackResponse(query: string): {
  conversationalReply: string;
  suggestions: string[];
  isDegraded: boolean;
} {
  const q = query.toLowerCase();
  
  if (q.includes('karir') || q.includes('kerja') || q.includes('resign') || q.includes('gaji')) {
    return {
      conversationalReply: `Lo lagi mikirin soal karir ya. Gue lagi gangguan koneksi nih, tapi ini yang bisa lo pertimbangin:

- **Dana darurat**: Pastikan punya 3-6 bulan pengeluaran sebelum ambil keputusan besar kayak resign
- **Skill audit**: Identifikasi skill yang lo udah punya dan yang perlu dikembangin
- **Market research**: Cek peluang di industri yang lo tuju

Buat analisis lebih dalem, lo bisa baca artikel TAM soal karir. Atau ngobrol langsung sama tim TAM via WhatsApp kalau butuh diskusi lebih intensif.`,
      suggestions: [
        'Gimana cara negosiasi gaji?',
        'Apakah gue harus resign tanpa dana darurat?',
        'Gimana cara ngadepin burnout karir?',
      ],
      isDegraded: true,
    };
  }
  
  if (q.includes('uang') || q.includes('finansial') || q.includes('hutang') || q.includes('pinjol') || q.includes('tabungan')) {
    return {
      conversationalReply: `Masalah finansial emang berat. Gue lagi gangguan koneksi nih, tapi ini yang bisa lo lakuin sekarang:

- **Audit pengeluaran**: Catat semua pengeluaran bulanan, bedah mana yang bisa dipangkas
- **Prioritas hutang**: Lunasi hutang bunga tertinggi dulu (biasanya pinjol)
- **Dana darurat**: Target minimal 3 bulan pengeluaran sebagai buffer

Gue punya banyak artikel soal finansial yang bisa bantu lo. Kalau butuh diskusi lebih personal, tim TAM siap via WhatsApp.`,
      suggestions: [
        'Berapa besar dana darurat yang wajib gue punya?',
        'Gimana cara stop jebakan konsumerisme?',
        'Gimana membagi gaji buat sandwich generation?',
      ],
      isDegraded: true,
    };
  }
  
  if (q.includes('mental') || q.includes('stress') || q.includes('cemas') || q.includes('sedih') || q.includes('burnout')) {
    return {
      conversationalReply: `Lo nggak sendirian. Yang lo rasakan itu valid, dan penting buat diakui.

Gue lagi gangguan koneksi nih, tapi ini yang bisa lo lakuin sekarang:
- **Breathe**: Tarik napas dalam 4 detik, tahan 4 detik, hembus 6 detik. Ulangi 5 kali
- **Grounding**: Sebutin 5 hal yang lo lihat, 4 yang lo dengar, 3 yang lo sentuh
- **Small steps**: Fokus satu hal kecil yang bisa lo lakuin hari ini

Kalau yang lo rasain berat banget, jangan ragu hubungi **Healing119.id** atau **119 ext 8** buat ngobrol sama profesional. Lo worth it buat dapet bantuan.`,
      suggestions: [
        'Gimana cara kelola kecemasan soal masa depan?',
        'Apa tanda-tanda burnout yang perlu gue waspadai?',
        'Gimana bangun ketahanan mental?',
      ],
      isDegraded: true,
    };
  }
  
  return {
    conversationalReply: `Lo, gue lagi gangguan koneksi nih. Tapi gue tetap di sini, nggak kemana.

Cerita aja lebih spesifik, situasi lo lagi gimana? Sementara itu, lo juga bisa baca-baca artikel kami yang relevan atau ngobrol langsung sama tim TAM via WhatsApp.`,
    suggestions: [
      'Langkah pertama benahin finansial gue gimana?',
      'Gimana nemuin arah karir yang rasional?',
      'Cara bangun ketahanan mental di tengah tekanan?',
    ],
    isDegraded: true,
  };
}

// ─── Cold Start Mitigation ────────────────────────────────

let warmupComplete = false;
let warmupInProgress = false;

export async function warmupTami(): Promise<void> {
  if (warmupComplete || warmupInProgress) return;
  
  warmupInProgress = true;
  const start = Date.now();
  
  try {
    knowledgeGraph.reload();
    console.log(`[TAMI WARMUP] RAG cache loaded: ${knowledgeGraph.chunkCount} chunks`);
    console.log(`[TAMI WARMUP] Response cache size: ${tamiResponseCache.size}`);
    
    warmupComplete = true;
    console.log(`[TAMI WARMUP] Complete in ${Date.now() - start}ms`);
  } catch (error) {
    console.error(`[TAMI WARMUP] Failed:`, (error as Error).message);
  } finally {
    warmupInProgress = false;
  }
}

export function isTamiWarmedUp(): boolean {
  return warmupComplete;
}

// ─── Health Check ─────────────────────────────────────────

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  components: {
    rag: { loaded: boolean; chunkCount: number };
    cache: { size: number };
    mistral: { circuitState: CircuitState };
    sessions: { activeCount: number };
  };
  timestamp: string;
}

export function getHealthStatus(): HealthStatus {
  const circuit = getCircuitStatus();
  
  const ragLoaded = knowledgeGraph.chunkCount > 0;
  const mistralAvailable = circuit.state !== 'open';
  
  let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
  if (!ragLoaded || !mistralAvailable) {
    status = mistralAvailable ? 'degraded' : 'unhealthy';
  }
  
  return {
    status,
    components: {
      rag: { loaded: ragLoaded, chunkCount: knowledgeGraph.chunkCount },
      cache: { size: tamiResponseCache.size },
      mistral: { circuitState: circuit.state },
      sessions: { activeCount: getActiveSessionCount() },
    },
    timestamp: new Date().toISOString(),
  };
}
