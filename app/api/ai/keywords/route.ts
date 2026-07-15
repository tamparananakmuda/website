import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/auth/admin-check';
import { callAI, TAM_SYSTEM_PROMPT, aiErrorResponse } from '@/lib/ai/helper';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const auth = await checkAdminAuth();
  if (!auth.isAdmin) return auth.response;

  try {
    const { topic, pillar } = await request.json();

    const userPrompt = `Lakukan riset keyword untuk artikel TAM.

Topik: ${topic}
Pillar: ${pillar || 'bebas'}

Beri 10 keyword suggestions dalam format JSON array:
[
  {
    "keyword": "keyword dalam bahasa Indonesia",
    "intent": "informational | comparison | transactional",
    "estimated_volume": "low | medium | high",
    "difficulty": "low | medium | high",
    "angle": "angle TAM yang unik untuk keyword ini, 1 kalimat"
  }
]

Aturan:
- Keyword dalam bahasa Indonesia (bahasa yang dipakai orang Indonesia saat search)
- Mix antara long-tail dan head terms
- Angle harus berbeda dari artikel generik di Google
- Prioritaskan keyword yang cocok dengan formula Tamparan-Penjelasan-Solusi`;

    const content = await callAI([
      { role: 'system', content: TAM_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ], { temperature: 0.5 });

    let keywords: unknown[] = [];
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      keywords = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
      keywords = [];
    }

    return NextResponse.json({ keywords });
  } catch (error) {
    return aiErrorResponse(error);
  }
}
