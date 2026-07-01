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
    <main className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-4 font-serif text-3xl font-bold md:text-4xl">
          Jangan Ketinggalan
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Satu email per minggu. Tidak ada spam. Hanya tamparan yang kamu butuhkan untuk tetap jujur sama diri sendiri.
        </p>

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
            {status === 'loading' ? 'Mendaftar...' : 'Langganan Newsletter'}
          </Button>
        </form>

        {message && (
          <p
            className={`mt-4 text-sm ${
              status === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
