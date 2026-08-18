'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';

export function NewsletterInline() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('Cek email kamu untuk konfirmasi langganan.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Terjadi kesalahan. Coba lagi.');
      }
    } catch {
      setStatus('error');
      setMessage('Terjadi kesalahan. Coba lagi.');
    }
  }

  if (status === 'success') {
    return (
      <div className="mx-auto max-w-3xl my-12 rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
        <div className="mb-2 flex justify-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <p className="font-medium text-primary">Hampir selesai!</p>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl my-12 rounded-xl border border-border bg-secondary/20 p-6">
      <div className="mb-3 flex items-center gap-2">
        <Mail size={16} className="text-primary" />
        <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">Newsletter</h3>
      </div>
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
        Satu email per minggu untuk melihat uang, karier, bisnis, dan kehidupan dari sudut yang lebih jernih. Gratis, berhenti kapan saja.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          placeholder="kamu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="shrink-0 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {status === 'loading' ? 'Mendaftar...' : 'Berlangganan'}
        </button>
      </form>
      {status === 'error' && message && (
        <p className="mt-2 text-sm text-destructive">{message}</p>
      )}
    </div>
  );
}
