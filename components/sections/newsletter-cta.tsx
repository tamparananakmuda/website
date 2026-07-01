'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function NewsletterCta() {
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
        setMessage('Berhasil! Cek email kamu untuk konfirmasi.');
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
    <section className="bg-primary py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl">
            Satu Email.
            <br />
            Bukan Konten. Tapi Sudut Pandang.
          </h2>
          <p className="mb-8 text-lg leading-relaxed text-primary-foreground/80">
            Surat mingguan untuk anak muda yang ingin melihat kenyataan lebih jelas. Tidak ada spam, tidak ada clickbait. Hanya perspektif yang layak kamu baca pelan-pelan.
          </p>
          <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              placeholder="kamu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-primary-foreground text-background"
            />
            <Button
              type="submit"
              disabled={status === 'loading'}
              variant="secondary"
              size="lg"
            >
              {status === 'loading' ? 'Mendaftar...' : 'Berlangganan'}
            </Button>
          </form>
          <p className="mt-4 text-sm text-primary-foreground/60">
            Gratis. Berhenti kapan saja.
          </p>
          {message && (
            <p className={`mt-4 text-sm ${status === 'success' ? 'text-primary-foreground' : 'text-primary-foreground/90'}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
