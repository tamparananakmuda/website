'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Turnstile } from '@/components/turnstile';

export function NewsletterCta() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, turnstile_token: turnstileToken || undefined }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('Berhasil! Email welcome sudah dikirim ke inbox kamu.');
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

  return (
    <section className="py-24 md:py-40">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border bg-card">
          <div className="px-6 py-16 text-center md:px-12 md:py-24">
            <div className="mb-8 flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-primary" />
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
                Newsletter
              </span>
              <div className="h-px w-12 bg-primary" />
            </div>
            <h2 className="mb-4 font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              Satu Email.
              <span className="block text-muted-foreground">
                Bukan Konten. Tapi Sudut Pandang.
              </span>
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Surat mingguan untuk anak muda yang ingin melihat kenyataan lebih jelas. Tidak ada spam, tidak ada clickbait. Hanya perspektif yang layak kamu baca pelan-pelan.
            </p>
            <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  type="email"
                  placeholder="kamu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background"
                />
                <Button
                  type="submit"
                  disabled={status === 'loading' || !turnstileToken}
                  size="lg"
                  className="shrink-0"
                >
                  {status === 'loading' ? 'Mendaftar...' : 'Berlangganan'}
                </Button>
              </div>
              <Turnstile onVerify={setTurnstileToken} onExpire={() => setTurnstileToken(null)} className="flex justify-center" />
            </form>
            <p className="mt-4 text-xs text-muted-foreground">
              Gratis. Berhenti kapan saja.
            </p>
            {message && (
              <p className={`mt-4 text-sm ${status === 'success' ? 'text-primary' : 'text-destructive'}`}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
