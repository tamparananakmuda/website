'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function NewsletterPage() {
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

      if (!res.ok) {
        throw new Error(data.error || 'Gagal mendaftar newsletter');
      }

      setStatus('success');
      setMessage('Kamu sudah terdaftar. Cek inbox untuk konfirmasi.');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Terjadi kesalahan');
    }
  }

  return (
    <main className="container mx-auto px-4 py-20 md:py-32">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
          Bukan Konten.
          <br />
          Tapi Sudut Pandang.
        </h1>
        <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
          Surat mingguan untuk anak muda yang ingin melihat kenyataan lebih jelas. Tidak ada spam, tidak ada clickbait. Hanya perspektif yang layak kamu baca pelan-pelan.
        </p>

        <ul className="mb-8 space-y-3">
          <li className="flex items-center gap-3 text-muted-foreground">
            <span className="text-primary">&#10003;</span> Satu sudut pandang baru setiap minggu, bukan link-link acak
          </li>
          <li className="flex items-center gap-3 text-muted-foreground">
            <span className="text-primary">&#10003;</span> Tidak ada spam, tidak ada clickbait, tidak ada fluff
          </li>
          <li className="flex items-center gap-3 text-muted-foreground">
            <span className="text-primary">&#10003;</span> Dibaca dalam 5 menit, dipikirkan selama seminggu
          </li>
          <li className="flex items-center gap-3 text-muted-foreground">
            <span className="text-primary">&#10003;</span> Gratis. Berhenti kapan saja.
          </li>
        </ul>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kamu@email.com"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={status === 'loading'}
            size="lg"
          >
            {status === 'loading' ? 'Mendaftar...' : 'Daftar Sekarang, Gratis'}
          </Button>
          <p className="text-sm text-muted-foreground">
            Satu email per minggu. Tidak lebih. Berhenti kapan saja.
          </p>
        </form>

        {message && (
          <p
            className={`mt-4 text-sm ${
              status === 'success' ? 'text-primary' : 'text-destructive'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
