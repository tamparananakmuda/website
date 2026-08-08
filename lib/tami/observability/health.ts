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
      conversationalReply: `Saya mendengar kamu sedang memikirkan tentang karir. Ini topik yang penting.

Beberapa hal yang bisa kamu pertimbangkan:
- **Dana darurat**: Pastikan punya 3-6 bulan pengeluaran sebelum mengambil keputusan besar seperti resign
- **Skill audit**: Identifikasi skill yang sudah kamu punya dan yang perlu dikembangkan
- **Market research**: Cek peluang di industri yang kamu tuju

Untuk analisis yang lebih mendalam, kamu bisa membaca artikel kami tentang karir. Atau konsultasi langsung dengan tim TAM via WhatsApp jika butuh diskusi lebih intensif.`,
      suggestions: [
        'Bagaimana cara negosiasi gaji?',
        'Apakah aku harus resign tanpa dana darurat?',
        'Gimana cara ngadepin burnout karir?',
      ],
      isDegraded: true,
    };
  }
  
  if (q.includes('uang') || q.includes('finansial') || q.includes('hutang') || q.includes('pinjol') || q.includes('tabungan')) {
    return {
      conversationalReply: `Masalah finansial memang bisa sangat menekan. Mari kita uraikan.

Langkah pertama yang bisa kamu lakukan:
- **Audit pengeluaran**: Catat semua pengeluaran bulanan, identifikasi yang bisa dipangkas
- **Prioritas hutang**: Lunasi hutang bunga tertinggi dulu (biasanya pinjol)
- **Dana darurat**: Targetkan minimal 3 bulan pengeluaran sebagai buffer

Kami punya banyak artikel tentang finansial yang bisa membantu. Kalau butuh diskusi lebih personal, tim TAM siap membantu via WhatsApp.`,
      suggestions: [
        'Berapa besar dana darurat yang wajib kupunya?',
        'Gimana cara stop jebakan konsumerisme?',
        'Bagaimana membagi gaji untuk sandwich generation?',
      ],
      isDegraded: true,
    };
  }
  
  if (q.includes('mental') || q.includes('stress') || q.includes('cemas') || q.includes('sedih') || q.includes('burnout')) {
    return {
      conversationalReply: `Terima kasih sudah berbagi. Yang kamu rasakan valid dan penting.

Beberapa hal yang bisa membantu saat ini:
- **Breathe**: Tarik napas dalam 4 detik, tahan 4 detik, hembus 6 detik. Ulangi 5 kali
- **Grounding**: Sebutkan 5 hal yang kamu lihat, 4 yang kamu dengar, 3 yang kamu sentuh
- **Small steps**: Fokus pada satu hal kecil yang bisa kamu lakukan hari ini

Jika yang kamu rasakan sangat berat, jangan ragu menghubungi **Healing119.id** atau **119 ext 8** untuk bicara dengan profesional. Anda tidak sendirian.`,
      suggestions: [
        'Gimana cara kelola kecemasan soal masa depan?',
        'Apa tanda-tanda burnout yang perlu saya waspadai?',
        'Bagaimana membangun ketahanan mental?',
      ],
      isDegraded: true,
    };
  }
  
  return {
    conversationalReply: `Terima kasih sudah bertanya. Saat ini saya sedang mengalami gangguan koneksi ke sistem analisis saya, tapi saya tetap di sini untuk mendengarkan.

Bisa kamu ceritakan lebih spesifik tentang situasi yang kamu hadapi? Sementara itu, kamu juga bisa menjelajahi artikel-artikel kami yang relevan atau menghubungi tim kami via WhatsApp untuk diskusi langsung.`,
    suggestions: [
      'Apa langkah pertama untuk benahi finansialku?',
      'Bagaimana menemukan arah karir yang rasional?',
      'Gimana cara bangun ketahanan mental di tengah tekanan?',
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
