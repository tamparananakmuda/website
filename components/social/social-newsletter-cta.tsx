'use client';

import { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { Turnstile } from '@/components/turnstile';

export function SocialNewsletterCTA() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, turnstile_token: turnstileToken || undefined }),
      });

      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center mt-8">
        <Mail className="w-8 h-8 mx-auto mb-3 text-primary" />
        <p className="font-medium text-foreground mb-1">Berhasil!</p>
        <p className="text-sm text-muted-foreground">Email welcome sudah dikirim ke inbox kamu.</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center mt-8">
        <p className="text-sm text-destructive mb-2">Gagal mendaftar. Coba lagi.</p>
        <button
          onClick={() => setStatus('idle')}
          className="text-sm text-primary font-medium hover:underline"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 mt-8">
      <h3 className="font-semibold text-foreground mb-1">Suka konten seperti ini?</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Dapatkan perspektif baru setiap minggu langsung di inbox kamu. Gratis, berhenti kapan saja.
      </p>
      <form onSubmit={subscribe} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="kamu@email.com"
            className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === 'loading' || !turnstileToken}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {status === 'loading' ? '...' : 'Daftar'}
            {status !== 'loading' && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
        <Turnstile onVerify={setTurnstileToken} onExpire={() => setTurnstileToken(null)} />
      </form>
    </div>
  );
}
