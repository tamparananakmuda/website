import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

type Message = { role: 'system' | 'user'; content: string };

export async function callAI(
  messages: Message[],
  options?: { model?: string; temperature?: number }
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY not configured');
  }

  const model = options?.model || 'google/gemini-2.0-flash-001';
  const temperature = options?.temperature ?? 0.7;

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com',
      'X-Title': 'TAMPARAN ANAK MUDA',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`AI API error: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

export const TAM_SYSTEM_PROMPT = `Kamu adalah asisten editorial untuk TAMPARAN ANAK MUDA (TAM), media editorial digital Indonesia untuk anak muda.

Identitas TAM:
- Bukan media berita, tapi editorial media tentang realita hidup anak muda
- Tagline: "Menyadarkan generasi muda akan kenyataan"
- Tone: Jujur, Rasional, Berani, Tidak Menghakimi, Membuka Mata
- Formula wajib: Tamparan (bongkar ilusi) > Penjelasan (kenapa realita ini) > Solusi (langkah konkret)

Aturan tulisan:
- Bahasa Indonesia formal-santai, gunakan "kamu" untuk pembaca
- DILARANG menggunakan em-dash ( — ), gunakan koma atau titik
- Tidak ada pola tulisan AI (inflated symbolism, promotional language, vague attribution)
- Setiap klaim faktual harus punya sumber
- Tidak menulis "ultimate guide", tidak clickbait, tidak motivasi kosong

17 Content Pillars:
1. Mindset & Realita (20%) - cara pikir yang menentukan cara hidup
2. Bisnis (15%) - realita bisnis, bukan motivasi
3. Karier & Dunia Kerja (15%) - panduan dunia kerja
4. Uang (15%) - keuangan + cara dapat uang
5. Teknologi & AI (10%) - tools, bukan hype
6. Produktivitas (10%) - fokus dan kelola waktu
7. Psikologi (5%) - psikologi kehidupan
8. Skill Masa Depan (5%) - skill relevan 5-10 tahun
9. Analisis Fenomena (5%) - membongkar tren sosial
10-17. Pendidikan, Komunikasi, Hubungan Sosial, Lifestyle, Sejarah Orang Sukses, Ulasan Buku, Filosofi Hidup, Tamparan (as-needed)

9 POV Tags: kontra-narasi, refleksi, data, framework, tamparan, riset, opini, panduan, inspirasi`;

export function aiErrorResponse(error: unknown) {
  console.error('AI API error:', error);
  const message = error instanceof Error ? error.message : 'Unknown error';
  if (message.includes('OPENROUTER_API_KEY')) {
    return NextResponse.json(
      { error: 'AI API key belum dikonfigurasi. Tambahkan OPENROUTER_API_KEY ke .env.local' },
      { status: 500 }
    );
  }
  return NextResponse.json(
    { error: 'Gagal memproses AI request' },
    { status: 500 }
  );
}
