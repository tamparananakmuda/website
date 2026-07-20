'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Turnstile } from '@/components/turnstile';
import { trackEvent } from '@/lib/track';

const TOPICS = [
  { id: 'uang', label: 'Uang' },
  { id: 'karier', label: 'Karier' },
  { id: 'bisnis', label: 'Bisnis' },
  { id: 'teknologi', label: 'Teknologi' },
  { id: 'kehidupan', label: 'Kehidupan' },
  { id: 'mindset', label: 'Mindset' },
];

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  function toggleTopic(id: string) {
    setTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, topics, turnstile_token: turnstileToken || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal mendaftar newsletter');
      }

      setStatus('success');
      setMessage('Kamu sudah terdaftar. Email welcome sudah dikirim ke inbox kamu.');
      trackEvent('newsletter_signup', { topics: topics.join(',') || 'none' });
      setEmail('');
      setTopics([]);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Terjadi kesalahan');
    }
  }

  return (
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

        <div>
          <label className="mb-2 block text-sm font-medium">
            Topik yang kamu minati (opsional)
          </label>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((topic) => (
              <button
                key={topic.id}
                type="button"
                onClick={() => toggleTopic(topic.id)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  topics.includes(topic.id)
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:border-foreground'
                }`}
              >
                {topic.label}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Pilih topik untuk dapat konten yang lebih relevan. Kamu bisa ubah kapan saja.
          </p>
        </div>

        <Turnstile onVerify={setTurnstileToken} onExpire={() => setTurnstileToken(null)} />

        <Button
          type="submit"
          disabled={status === 'loading' || !turnstileToken}
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

      <div className="mt-12 pt-8 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Sudah pernah berlangganan?{' '}
          <a href="/newsletter-arsip" className="text-primary font-medium hover:underline">
            Baca arsip edisi sebelumnya
          </a>
        </p>
      </div>
    </div>
  );
}
