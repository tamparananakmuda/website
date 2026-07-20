'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MessageSquare, Heart, Trash2, Loader2, Send, CornerDownRight } from 'lucide-react';
import { Turnstile } from '@/components/turnstile';

interface Comment {
  id: string;
  postId: string;
  parentId: string | null;
  readerId: string | null;
  authorName: string;
  body: string;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
}

interface CommentsSectionProps {
  postId: string;
}

function timeAgo(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diff < 60) return 'baru saja';
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
  return past.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function CommentItem({
  comment,
  currentUserId,
  onReply,
  onLike,
  onDelete,
}: {
  comment: Comment;
  currentUserId: string | null;
  onReply: (parentId: string) => void;
  onLike: (commentId: string) => void;
  onDelete: (commentId: string) => void;
}) {
  const isOwner = currentUserId && comment.readerId === currentUserId;

  return (
    <div className="py-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
          {comment.authorName[0]?.toUpperCase() || 'A'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-foreground">{comment.authorName}</span>
            <span className="text-xs text-muted-foreground">{timeAgo(comment.createdAt)}</span>
          </div>
          <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{comment.body}</p>
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => onLike(comment.id)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <Heart className="w-3.5 h-3.5" />
              {comment.likesCount > 0 && <span>{comment.likesCount}</span>}
            </button>
            <button
              onClick={() => onReply(comment.id)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <CornerDownRight className="w-3.5 h-3.5" />
              Balas
            </button>
            {isOwner && (
              <button
                onClick={() => onDelete(comment.id)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CommentsSection({ postId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/comments?post_id=${postId}`);
      const data = await res.json();
      setComments(data.comments || []);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setLoggedIn(!!user);
      if (user) {
        setCurrentUserId(user.id);
      }
    });
  }, [fetchComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: postId,
          body: body.trim(),
          parent_id: replyTo || undefined,
          turnstile_token: turnstileToken || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setBody('');
      setReplyTo(null);
      fetchComments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLike(commentId: string) {
    if (!loggedIn) {
      setError('Login dulu untuk menyukai komentar');
      return;
    }

    try {
      const res = await fetch('/api/comments/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment_id: commentId, action: 'like' }),
      });

      if (res.ok) {
        const data = await res.json();
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId ? { ...c, likesCount: data.likesCount } : c
          )
        );
      }
    } catch {
      // silent fail
    }
  }

  async function handleDelete(commentId: string) {
    if (!confirm('Hapus komentar ini?')) return;

    try {
      const res = await fetch(`/api/comments?id=${commentId}`, { method: 'DELETE' });
      if (res.ok) fetchComments();
    } catch {
      // silent fail
    }
  }

  const topLevelComments = comments.filter((c) => !c.parentId);
  const getReplies = (parentId: string) => comments.filter((c) => c.parentId === parentId);

  return (
    <section className="mx-auto max-w-3xl mt-12 pt-8 border-t border-border">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">
          Komentar ({comments.length})
        </h2>
      </div>

      {loggedIn ? (
        <form onSubmit={handleSubmit} className="mb-8">
          {replyTo && (
            <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
              <CornerDownRight className="w-3 h-3" />
              Membalas komentar
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="text-primary hover:underline"
              >
                Batal
              </button>
            </div>
          )}
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Bagikan sudut pandangmu..."
            maxLength={2000}
            rows={3}
            className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-primary resize-none"
          />
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{body.length}/2000</p>
            <button
              type="submit"
              disabled={submitting || !body.trim() || !turnstileToken}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {submitting ? 'Mengirim...' : 'Kirim'}
            </button>
          </div>
          <Turnstile onVerify={setTurnstileToken} onExpire={() => setTurnstileToken(null)} className="mt-2" />
        </form>
      ) : (
        <div className="mb-8 rounded-lg border border-border bg-card/50 p-4 text-center text-sm text-muted-foreground">
          <a href="/masuk" className="text-primary font-medium hover:underline">Login</a> untuk berkomentar
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-8">
          Belum ada komentar. Jadi yang pertama.
        </p>
      ) : (
        <div className="divide-y divide-border">
          {topLevelComments.map((comment) => (
            <div key={comment.id}>
              <CommentItem
                comment={comment}
                currentUserId={currentUserId}
                onReply={setReplyTo}
                onLike={handleLike}
                onDelete={handleDelete}
              />
              {getReplies(comment.id).map((reply) => (
                <div key={reply.id} className="ml-8 border-l-2 border-border pl-4">
                  <CommentItem
                    comment={reply}
                    currentUserId={currentUserId}
                    onReply={setReplyTo}
                    onLike={handleLike}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
