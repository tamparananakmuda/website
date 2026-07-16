import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { socialPostUpdateSchema } from '@/lib/validations/social';
import { socialPostsQuerySchema } from '@/lib/validations/query-params';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { checkAdminAuth } from '@/lib/auth/admin-check';
import { parseRequestBody, parseQueryParams } from '@/lib/validations/helpers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = await checkAdminAuth();
    if (!auth.isAdmin) return auth.response;

    const query = parseQueryParams(request, socialPostsQuerySchema);
    if (!query.success) return query.errorResponse;

    const { status, platform, limit } = query.data;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    let supaQuery = supabase
      .from('social_posts')
      .select('*')
      .order('published_at', { ascending: false, nullsFirst: false })
      .limit(limit);

    if (status && status !== 'all') {
      supaQuery = supaQuery.eq('status', status);
    }
    if (platform && ['x', 'instagram', 'tiktok', 'youtube'].includes(platform)) {
      supaQuery = supaQuery.eq('platform', platform);
    }

    const { data, error } = await supaQuery;

    if (error) throw error;

    return NextResponse.json({ posts: data || [] });
  } catch (error) {
    console.error('Social posts list error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await checkAdminAuth();
    if (!auth.isAdmin) return auth.response;

    const limit = await rateLimit(request, {
      limit: 20,
      window: 60,
      identifier: 'social-posts-update',
    });
    if (!limit.success) {
      return rateLimitResponse(limit);
    }

    const parsed = await parseRequestBody(request, socialPostUpdateSchema);
    if (!parsed.success) return parsed.errorResponse;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    const { id, ...updates } = parsed.data;
    const { error } = await supabase
      .from('social_posts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Social post update error:', error);
    return NextResponse.json(
      { error: 'Gagal update konten' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await checkAdminAuth();
    if (!auth.isAdmin) return auth.response;

    const limit = await rateLimit(request, {
      limit: 10,
      window: 60,
      identifier: 'social-posts-delete',
    });
    if (!limit.success) {
      return rateLimitResponse(limit);
    }

    const query = parseQueryParams(request, socialPostsQuerySchema);
    if (!query.success) return query.errorResponse;

    if (!query.data.id) {
      return NextResponse.json(
        { error: 'ID wajib diisi' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    const { error } = await supabase
      .from('social_posts')
      .delete()
      .eq('id', query.data.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Social post delete error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus konten' },
      { status: 500 }
    );
  }
}
