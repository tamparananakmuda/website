import { NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/db/context';
import { getReaderProfile, getReadingHistory } from '@/lib/db/queries/reader';
import { getBookmarksByUser } from '@/lib/db/queries/bookmarks';
import { getDonationsByEmail } from '@/lib/db/queries/donations';

export async function GET() {
  const auth = await getAuthContext();

  if (!auth.userId) {
    return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
  }

  const [profile, bookmarks, history, donations] = await Promise.all([
    getReaderProfile(auth.userId),
    getBookmarksByUser(auth.userId, 10),
    getReadingHistory(auth.userId, 10),
    getDonationsByEmail(auth.email ?? '', 5),
  ]);

  return NextResponse.json({
    profile,
    bookmarks: bookmarks.map((b) => ({
      post_id: b.postId,
      created_at: b.createdAt,
      posts: b.post ? {
        id: b.post.id,
        title: b.post.title,
        slug: b.post.slug,
        excerpt: b.post.excerpt,
        categories: b.post.category ? { name: b.post.category.title, slug: b.post.category.slug } : null,
      } : null,
    })),
    history: history.map((h) => ({
      post_id: h.postId,
      read_at: h.readAt,
      progress: h.progress,
      posts: h.post ? {
        id: h.post.id,
        title: h.post.title,
        slug: h.post.slug,
        excerpt: h.post.excerpt,
        categories: h.post.category ? { name: h.post.category.title, slug: h.post.category.slug } : null,
      } : null,
    })),
    donations: donations.map((d) => ({
      transaction_id: d.reference,
      amount: d.amount,
      status: d.status,
      payment_type: d.paymentType,
      created_at: d.createdAt,
    })),
    email: auth.email,
  });
}
