import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkAdminAuth } from '@/lib/auth/admin-check';
import { callAI, TAM_SYSTEM_PROMPT, aiErrorResponse } from '@/lib/ai/helper';
import { aiRepurposeSchema } from '@/lib/validations/ai';
import { parseRequestBody } from '@/lib/validations/helpers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const auth = await checkAdminAuth();
  if (!auth.isAdmin) return auth.response;

  try {
    const parsed = await parseRequestBody(request, aiRepurposeSchema);
    if (!parsed.success) return parsed.errorResponse;

    const { post_id, platforms } = parsed.data;

    const supabase = createClient();
    const { data: post } = await supabase
      .from('posts')
      .select('title, excerpt, body, slug')
      .eq('id', post_id)
      .single();

    if (!post) {
      return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 });
    }

    const targetPlatforms = platforms || ['tiktok', 'instagram', 'x', 'linkedin', 'newsletter', 'youtube'];

    const userPrompt = `Ubah artikel berikut menjadi aset konten untuk multiple platforms.

Judul: ${post.title}
Excerpt: ${post.excerpt || ''}
Body (first 2000 chars): ${(post.body || '').substring(0, 2000)}

Target platforms: ${targetPlatforms.join(', ')}

Buat output JSON:
{
  "tiktok": {
    "hook": "kalimat pertama 0-3 detik yang berhenti scroll",
    "body": "script 30-60 detik, 1 insight utama",
    "cta": "CTA natural",
    "engagement": "prompt untuk komentar"
  },
  "instagram": {
    "slides": [
      {"slide": 1, "type": "cover", "text": "headline max 10 kata"},
      {"slide": 2, "type": "tamparan", "text": "statement kontra-narasi"},
      {"slide": 3, "type": "penjelasan", "text": "point 1"},
      {"slide": 4, "type": "penjelasan", "text": "point 2"},
      {"slide": 5, "type": "solusi", "text": "action item"},
      {"slide": 6, "type": "cta", "text": "CTA ke artikel full"}
    ],
    "caption": "caption dengan CTA dan 3-5 hashtags"
  },
  "x": {
    "tweets": [
      "tweet 1 (hook)",
      "tweet 2 (point 1)",
      "tweet 3 (point 2)",
      "tweet 4 (solusi)",
      "tweet 5 (CTA ke artikel)"
    ]
  },
  "linkedin": {
    "hook": "kalimat pembuka untuk LinkedIn",
    "body": "long-form post 150-200 kata",
    "cta": "CTA untuk LinkedIn audience"
  },
  "newsletter": {
    "subject": "subject line max 50 karakter",
    "opening": "1 paragraf personal opening",
    "insight": "1 insight utama dari artikel",
    "recommendation": "1 rekomendasi actionable",
    "question": "1 pertanyaan untuk pembaca"
  },
  "youtube": {
    "title": "title max 60 karakter",
    "hook": "0-10 detik hook",
    "outline": ["point 1", "point 2", "point 3"],
    "cta": "CTA subscribe/watch full"
  }
}

Aturan:
- 1 artikel = 1 insight utama yang diadaptasi per platform, bukan rangkum seluruh artikel
- Bahasa Indonesia, jangan em-dash
- TikTok: 30-60 detik, spoken language
- Instagram: max 10 slides, max 30 kata per slide
- X: 5-7 tweets, max 280 karakter per tweet
- LinkedIn: long-form, profesional tapi tetap TAM tone
- Newsletter: max 600 kata, personal tone
- YouTube: max 10 menit outline`;

    const content = await callAI([
      { role: 'system', content: TAM_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ], { temperature: 0.7, model: 'google/gemini-2.0-flash-001' });

    let assets: Record<string, unknown> | null = null;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      assets = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      assets = null;
    }

    return NextResponse.json({ assets });
  } catch (error) {
    return aiErrorResponse(error);
  }
}
