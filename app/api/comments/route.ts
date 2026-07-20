import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getApprovedCommentsByPost, createComment, deleteComment } from '@/lib/db/queries/comments';
import { getReaderProfile } from '@/lib/db/queries/reader';
import { getPostById } from '@/lib/db/queries/posts';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { commentSchema } from '@/lib/validations/comment';
import { commentsQuerySchema } from '@/lib/validations/query-params';
import { parseQueryParams, parseRequestBody } from '@/lib/validations/helpers';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { sendEmail } from '@/lib/email/client';
import { renderCommentNotificationEmail } from '@/lib/email/templates/comment-notification';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const query = parseQueryParams(request, commentsQuerySchema);
    if (!query.success) return query.errorResponse;

    if (!query.data.post_id) {
      return NextResponse.json(
        { error: 'Post ID wajib diisi' },
        { status: 400 }
      );
    }

    const comments = await getApprovedCommentsByPost(query.data.post_id);

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Comments fetch error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil komentar' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const limit = await rateLimit(request, {
      limit: 5,
      window: 300,
      identifier: 'comment',
    });
    if (!limit.success) {
      return rateLimitResponse(limit);
    }

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
      return NextResponse.json(
        { error: 'Login dulu untuk berkomentar' },
        { status: 401 }
      );
    }

    const parsed = await parseRequestBody(request, commentSchema);
    if (!parsed.success) return parsed.errorResponse;

    const valid = await verifyTurnstileToken(parsed.data.turnstile_token, request);
    if (!valid) {
      return NextResponse.json(
        { error: 'Verifikasi keamanan gagal. Coba lagi.' },
        { status: 403 }
      );
    }

    const profile = await getReaderProfile(user.id);

    const authorName = profile?.name || user.email?.split('@')[0] || 'Anonim';
    const authorEmail = profile?.email || user.email || null;

    const comment = await createComment({
      postId: parsed.data.post_id,
      parentId: parsed.data.parent_id || null,
      readerId: user.id,
      authorName,
      authorEmail: authorEmail || '',
      body: parsed.data.body,
      status: 'approved',
    });

    // Send notification email to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@tamparananakmuda.com';
    const post = await getPostById(parsed.data.post_id);
    if (post) {
      const { subject, html } = renderCommentNotificationEmail({
        postTitle: post.title,
        postSlug: post.slug,
        authorName,
        commentBody: parsed.data.body,
      });
      const result = await sendEmail({
        to: adminEmail,
        subject,
        htmlContent: html,
        tags: ['comment-notification'],
      });
      if (!result.success) {
        console.error('[comments] Notification email failed:', result.error);
      }
    }

    return NextResponse.json({ success: true, comment });
  } catch (error) {
    console.error('Comment create error:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan komentar' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const query = parseQueryParams(request, commentsQuerySchema);
    if (!query.success) return query.errorResponse;

    if (!query.data.id) {
      return NextResponse.json(
        { error: 'ID komentar wajib diisi' },
        { status: 400 }
      );
    }

    const commentId = query.data.id;

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
      return NextResponse.json(
        { error: 'Tidak punya akses' },
        { status: 401 }
      );
    }

    await deleteComment(commentId, user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Comment delete error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus komentar' },
      { status: 500 }
    );
  }
}
