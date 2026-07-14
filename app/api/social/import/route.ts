import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { socialImportSchema } from '@/lib/validations/social';
import { previewSocialContent } from '@/lib/social-preview';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { checkAdminAuth } from '@/lib/auth/admin-check';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const auth = await checkAdminAuth();
    if (!auth.isAdmin) return auth.response;

    const limit = await rateLimit(request, {
      limit: 10,
      window: 60,
      identifier: 'social-import',
    });
    if (!limit.success) {
      return rateLimitResponse(limit);
    }

    const body = await request.json();
    const parsed = socialImportSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || 'Input tidak valid' },
        { status: 400 }
      );
    }

    const preview = await previewSocialContent(parsed.data.url);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    const { data: existing } = await supabase
      .from('social_posts')
      .select('id, status')
      .eq('source_url', parsed.data.url)
      .single();

    if (existing) {
      return NextResponse.json({
        success: true,
        preview,
        existing_id: existing.id,
        existing_status: existing.status,
        message: 'Konten ini sudah pernah diimport',
      });
    }

    const { data, error } = await supabase
      .from('social_posts')
      .insert({
        platform: preview.platform,
        source_url: preview.source_url,
        source_id: preview.source_id,
        author_handle: preview.author_handle,
        author_name: preview.author_name,
        author_avatar_url: preview.author_avatar_url,
        content_text: preview.content_text,
        media_urls: preview.media_urls,
        video_url: preview.video_url,
        thumbnail_url: preview.thumbnail_url,
        title: preview.title,
        excerpt: preview.excerpt,
        status: 'draft',
      })
      .select('id')
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      preview,
      id: data.id,
    });
  } catch (error) {
    console.error('Social import error:', error);
    return NextResponse.json(
      { error: 'Gagal mengimport konten' },
      { status: 500 }
    );
  }
}
