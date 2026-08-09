/**
 * TAMI Domain Filter — Multi-layer off-topic detection
 *
 * Layer 1: Hardcoded keyword blocklist (instant, zero cost)
 * Layer 2: Pattern-based heuristics (instant, zero cost)
 * Layer 3: LLM-based domain classifier (small model, ~200ms)
 *
 * If any layer flags the query as off-topic, TAMI responds with a
 * short rejection message without running the full 4-agent pipeline.
 */

import { mistral } from '../mistral/client';
import { isMistralAvailable } from '../observability/health';

// ─── Layer 1: Keyword Blocklist ──────────────────────────────────────────────

// Hard off-topic keywords — if ANY appears, instant reject
// These are topics that TAMI should NEVER engage with
const HARD_BLOCK_KEYWORDS: string[] = [
  // Coding & tech support
  'koding', 'coding', 'program', 'bug error', 'javascript', 'python', 'react',
  'html', 'css', 'php', 'java ', 'kotlin', 'swift', 'golang', 'rust ', 'sql query',
  'database query', 'api endpoint', 'docker', 'kubernetes', 'aws ', 'gcp ',
  'deploy server', 'git push', 'git merge', 'compile', 'stack overflow',
  'tugas kuliah', 'tugas sekolah', 'kerjakan tugas', 'bikin program',
  'bikin website', 'bikin aplikasi', 'bikin code', 'bikin script',
  'debug code', 'fix code', 'review code', 'code review',

  // Food & recipes
  'resep masakan', 'resep makanan', 'cara masak', 'cara bikin kue',
  'resep kue', 'resep minuman', 'bahan masakan', 'takaran resep',
  'masak apa hari ini', 'ide masak',

  // Weather & news
  'cuaca hari ini', 'prediksi cuaca', 'ramalan cuaca', 'suhu hari ini',
  'berita terkini', 'kabar terkini', 'headline berita', 'update berita',
  'hasil pertandingan', 'skor bola', 'klasemen liga',

  // Medical diagnosis
  'diagnosa penyakit', 'gejala sakit', 'obat apa', 'dosis obat',
  ' efek samping obat', 'interaksi obat', 'resep dokter',
  'tes darah', 'tes urine', 'hasil lab', 'x-ray', 'rontgen',
  'kanker stadium', 'tumor ganas', 'biopsi',

  // Academic homework
  'jawab soal', 'kerjakan soal', 'soal matematika', 'soal fisika',
  'soal kimia', 'soal biologi', 'tugas essay', 'makalah kuliah',
  'skripsi', 'thesis', 'disertasi', 'literature review',
  'jurnal review', 'analisis puisi', 'analisis novel', 'paragraf',

  // Entertainment & celebrity
  'drakor', 'kdrama', 'sinopsis drama', 'rekomendasi film',
  'rekomendasi anime', 'rekomendasi musik', 'rekomendasi lagu',
  'lirik lagu', 'chord gitar', 'tab drum', 'cover lagu',
  'gossip artis', 'berita artis', 'skandal artis',

  // Travel & tourism
  'itinerary liburan', 'rute liburan', 'tiket pesawat', 'booking hotel',
  'rekomendasi wisata', 'tempat wisata', 'paket tour', 'visa',
  'paspor', 'itinerary bali', 'itinerary jogja',

  // Gaming
  'walkthrough game', 'cheat game', 'tips game', 'build item',
  'tier list', 'meta game', 'rank game', 'gacha',

  // Religion & politics (too sensitive for TAMI domain)
  'ayat quran', 'tafsir quran', 'hadits', 'khutbah',
  'pemilu', 'capres', 'caleg', 'kampanye', 'partai politik',
  'dukung partai', 'vote partai',

  // General knowledge / trivia
  'ibu kota negara', 'panjang sungai', 'tinggi gunung', 'luas negara',
  'populasi negara', 'kapan merdeka', 'sejarah indonesia',
  'tokoh sejarah', 'penemu', 'teori sains', 'rumus fisika',
  'rumus matematika', 'periodic table', 'tabel periodik',

  // Shopping & product reviews
  'review hp', 'review laptop', 'review motor', 'review mobil',
  'spesifikasi hp', 'spesifikasi laptop', 'bandingkan hp',
  'beli hp mana', 'rekomendasi laptop', 'rekomendasi motor',
  'rekomendasi hp', 'harga hp', 'harga laptop', 'harga motor',
];

// ─── Layer 2: Pattern-based Heuristics ───────────────────────────────────────

// Patterns that strongly indicate off-topic queries
const OFF_TOPIC_PATTERNS: RegExp[] = [
  // Direct commands to do tasks
  /^(tulis|buat|bikin|kerjakan|selesaikan|jawab)\s+(saya|aku|gue)\s+(soal|tugas|esai|essay|makalah|artikel|cerita|puisi|pidato)/i,
  /^(translate|terjemahkan)\s+/i,
  /^(paraphrase|parafrase)\s+/i,
  /^(summarize|ringkas)\s+(artikel|buku|jurnal|paper)\s+(ini|berikut)/i,
  // Math/science problem solving
  /\d+\s*[+\-*/xX]\s*\d+.*=.*\?/i, // math equation
  /hitung\s+(luas|keliling|volume|persentase|rata-rata|mean|median|modus)/i,
  /buktikan\s+bahwa/i, // proof request
  // Code requests
  /^(bikin|buat|tulis|write)\s+(code|kode|script|program|function|fungsi|class|component)/i,
  // General knowledge questions
  /^(siapa|who)\s+(presiden|gubernur|walikota|bupati|ketua|ceo|pendiri)\s/i,
  /^(kapan|when)\s+(merdeka|kemerdekaan|hari\s+nasional)/i,
  // Recipe/food
  /^(cara|gimana)\s+(masak|membuat|bikin)\s+(nasi|mie|kue|roti|kopi|tea|teh|jus|smoothie)/i,
];

// ─── Domain keywords (TAMI's actual domain) ──────────────────────────────────

// If query contains ANY of these, it's likely on-topic
const DOMAIN_KEYWORDS: string[] = [
  // Career & work
  'kerja', 'karir', 'gaji', 'interview', 'resign', 'phk', 'promosi',
  'burnout', 'bos', 'coworker', 'rekan kerja', 'toxic workplace',
  'worklife balance', 'work from home', 'wfh', 'overtime', 'lembur',
  'freelance', 'side hustle', 'gig economy', 'kontrak', 'magang',
  'internship', 'cv', 'portofolio', 'skill', 'upskill', 'reskilling',
  'negosiasi gaji', 'asking rate', 'ikatan dinas', 'sertifikasi',
  'remote work', 'hybrid', 'komuter', 'jenuh kerja', 'kerja keras',
  'bullshit jobs', 'employee monitoring', 'kerja remote',

  // Finance & money
  'uang', 'finansial', 'tabungan', 'investasi', 'hutang', 'pinjol',
  'pinjaman', 'cicilan', 'kartu kredit', 'dana darurat', 'budget',
  'anggaran', 'gaji bulanan', 'expense', 'pengeluaran', 'pemasukan',
  'konsumerisme', 'fomo belanja', 'shopping haul', 'financial freedom',
  'kebebasan finansial', 'pajak', 'pph', 'bpjs', 'asuransi',
  'kpr', 'sewa kos', 'sewa rumah', 'biaya hidup', 'inflasi',
  'sandwich generation', 'kiriman uang', 'tanggung jawab finansial',
  'crypto', 'saham', 'reksadana', 'emas', 'investasi',

  // Social pressure & relationships
  'teman', 'pacar', 'jomblo', 'single', 'breakup', 'patah hati',
  'ghosting', 'red flag', 'toxic relationship', 'tekanan sosial',
  'social media', 'medsos', 'instagram', 'tiktok', 'fomo',
  'perbandingan diri', 'body shaming', 'insecurities', 'self esteem',
  'harga diri', 'kepercayaan diri', 'introvert', 'extrovert',
  'kesepian', 'loneliness', 'isolasi', 'teman seumuran',
  'pernikahan', 'nikah muda', 'pressure nikah', 'single parent',
  'hubungan', 'relationship', 'healing', 'move on',

  // Mental health & life pressure
  'stress', 'stres', 'cemas', 'anxiety', 'overthinking', 'depresi',
  'depression', 'sedih', 'marah', 'frustrasi', 'bingung',
  'lelah', 'capek', 'exhausted', 'burnout', 'mental health',
  'kesehatan mental', 'terapi', 'psikolog', 'konseling',
  'self harm', 'bunuh diri', 'krisis', 'crisis',
  'expectasi', 'ekspektasi', 'beban', 'tekanan', 'pressure',
  'imposter syndrome', 'self doubt', 'keraguan diri',
  'rasa gagal', 'rasa tertinggal', 'ketinggalan',
  'quarter life crisis', 'krisis usia 20', 'krisis usia 30',

  // Life reality & existential
  'hidup', 'life', 'masa depan', 'future', 'tujuan hidup',
  'meaning of life', 'existential', 'eksistensial', 'kebingungan',
  'realita', 'reality check', 'sistem', 'sistem indonesia',
  'birokrasi', 'kemiskinan', 'kemapanan', 'kelayakan',
  'tempat ketiga', 'third place', 'ruang publik',
  'brain drain', 'kabur dari indonesia', 'merantau',
  'generasi', 'gen z', 'gen milenial', 'sandwich generation',
  'demografi', 'punya anak', 'nikah', 'keluarga',
  'pendidikan mahal', 'biaya kuliah', 'utang kuliah',
  'krisis pangan', 'krisis kesehatan', 'sistem media',
  'sistem pajak', 'sistem kesehatan', 'infrastruktur kesepian',

  // Emotional expressions (always on-topic)
  'curhat', 'curhatan', 'pengen cerita', 'aku mau cerita',
  'gue mau cerita', 'sedih banget', 'capek banget',
  'bingung mau gimana', 'nggak tahu harus gimana',
  'feel lost', 'rasa hilang', 'rasa kosong',
];

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DomainCheckResult {
  isOffTopic: boolean;
  layer: 'blocklist' | 'pattern' | 'llm' | 'none';
  reason?: string;
  rejectionMessage?: string;
}

// ─── Layer 1: Keyword Blocklist Check ────────────────────────────────────────

function checkBlocklist(query: string): boolean {
  const q = query.toLowerCase();
  return HARD_BLOCK_KEYWORDS.some(keyword => q.includes(keyword));
}

// ─── Layer 2: Pattern-based Heuristic Check ──────────────────────────────────

function checkPatterns(query: string): boolean {
  return OFF_TOPIC_PATTERNS.some(pattern => pattern.test(query));
}

// ─── Domain keyword check (positive signal) ──────────────────────────────────

function hasDomainKeyword(query: string): boolean {
  const q = query.toLowerCase();
  return DOMAIN_KEYWORDS.some(keyword => q.includes(keyword));
}

// ─── Layer 3: LLM-based Domain Classifier ────────────────────────────────────

async function llmClassifyDomain(query: string): Promise<{ isOffTopic: boolean; reason?: string }> {
  if (!isMistralAvailable()) {
    return { isOffTopic: false }; // fail open if Mistral is down
  }

  try {
    const response = await mistral.chat({
      model: 'mistral-small-latest',
      temperature: 0.1,
      messages: [
        {
          role: 'system',
          content: `Lo domain classifier buat TAMI. TAMI cuma bahas: karir, keuangan, tekanan sosial, kesehatan mental, dilema hidup anak muda Indonesia. Tentukan apakah query user masuk domain TAMI atau nggak. Format: JSON {"isOnTopic": boolean, "reason": "singkat"}.`,
        },
        {
          role: 'user',
          content: `Query: "${query.slice(0, 500)}"\n\nApakah ini masuk domain TAMI (karir/keuangan/tekanan sosial/mental/hidup anak muda)?`,
        },
      ],
      responseFormat: { type: 'json_object' },
      maxTokens: 100,
      promptCacheKey: 'tami-domain-classifier',
      timeoutMs: 3000,
    });

    const content = response.choices[0].message.content;
    const parsed = JSON.parse(content);
    return {
      isOffTopic: !parsed.isOnTopic,
      reason: parsed.reason || undefined,
    };
  } catch {
    // Fail open — if classifier fails, let the main pipeline handle it
    return { isOffTopic: false };
  }
}

// ─── Rejection message generator ─────────────────────────────────────────────

function getRejectionMessage(query: string): string {
  const q = query.toLowerCase();

  // Contextual rejections based on detected topic
  if (q.includes('code') || q.includes('koding') || q.includes('program') || q.includes('script')) {
    return 'Lo nanya soal coding/tech? Itu bukan area gue. Gue TAMI — teman yang bedah realita hidup anak muda: karir, keuangan, tekanan sosial, mental. Curhat soal itu aja, gue siap dengerin.';
  }
  if (q.includes('resep') || q.includes('masak') || q.includes('kue')) {
    return 'Resep masakan? Bukan keahlian gue. Gue TAMI — spesialis bedah realita karir, keuangan, tekanan sosial, dan mental anak muda. Ada yang mau di-curhat soal itu?';
  }
  if (q.includes('cuaca') || q.includes('berita') || q.includes('skor')) {
    return 'Info cuaca/berita/skor bola? Coba cek aplikasi berita. Gue TAMI — fokus gue cuma satu: bedah realita hidup anak muda Indonesia. Karir, uang, tekanan sosial, mental. Mana yang mau di-bahas?';
  }
  if (q.includes('soal') || q.includes('tugas') || q.includes('skripsi') || q.includes('makalah')) {
    return 'Tugas kuliah/skripsi/soal? Lo cara salah tempat. Gue TAMI — gue bukan ngerjain tugas, gue bedah realita hidup. Karir, keuangan, tekanan sosial, mental. Curhat soal itu gue siap.';
  }
  if (q.includes('review') && (q.includes('hp') || q.includes('laptop') || q.includes('motor'))) {
    return 'Review gadget/motor? Bukan domain gue. Gue TAMI — fokus gue: karir, keuangan, tekanan sosial, mental anak muda. Mau curhat soal dilema hidup lo? Gue dengerin.';
  }
  if (q.includes('pemilu') || q.includes('capres') || q.includes('partai')) {
    return 'Politik? Gue netral soal itu. Gue TAMI — fokus gue: realita karir, keuangan, tekanan sosial, dan mental anak muda Indonesia. Ada yang mau di-bedah?';
  }
  if (q.includes('gejala') || q.includes('obat') || q.includes('penyakit')) {
    return 'Diagnosa medis? Lo butuh dokter, bukan gue. Gue TAMI — gue bahas realita hidup: karir, uang, tekanan sosial, mental. Kalau lo stess soal biaya pengobatan atau BPJS, itu baru domain gue.';
  }

  // Generic rejection
  return 'Itu di luar area gue. Gue TAMI — gue cuma bahas satu hal: realita hidup anak muda Indonesia. Karir, keuangan, tekanan sosial, mental. Mana yang lagi ngganggu lo?';
}

// ─── Main exported function ──────────────────────────────────────────────────

/**
 * Multi-layer domain filter for TAMI.
 * Checks query against blocklist, patterns, and LLM classifier.
 * Returns isOffTopic=true if the query should be rejected before
 * running the full 4-agent pipeline.
 */
export async function checkDomain(query: string): Promise<DomainCheckResult> {
  // Skip check for very short queries (greetings, etc.)
  if (query.trim().length < 5) {
    return { isOffTopic: false, layer: 'none' };
  }

  // Skip if query contains strong domain keywords (fast path)
  if (hasDomainKeyword(query)) {
    return { isOffTopic: false, layer: 'none' };
  }

  // Layer 1: Hard blocklist (instant)
  if (checkBlocklist(query)) {
    return {
      isOffTopic: true,
      layer: 'blocklist',
      reason: 'Matched hard blocklist keyword',
      rejectionMessage: getRejectionMessage(query),
    };
  }

  // Layer 2: Pattern heuristics (instant)
  if (checkPatterns(query)) {
    return {
      isOffTopic: true,
      layer: 'pattern',
      reason: 'Matched off-topic pattern',
      rejectionMessage: getRejectionMessage(query),
    };
  }

  // Layer 3: LLM classifier (only for ambiguous queries)
  // Only run if query is long enough to potentially be off-topic
  if (query.split(/\s+/).length >= 4) {
    const llmResult = await llmClassifyDomain(query);
    if (llmResult.isOffTopic) {
      return {
        isOffTopic: true,
        layer: 'llm',
        reason: llmResult.reason,
        rejectionMessage: getRejectionMessage(query),
      };
    }
  }

  return { isOffTopic: false, layer: 'none' };
}
