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
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'already'>('idle');
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
        if (data.error && data.error.toLowerCase().includes('sudah')) {
          setStatus('already');
          setMessage(data.error);
        } else {
          throw new Error(data.error || 'Gagal mendaftar newsletter');
        }
        return;
      }

      setStatus('success');
      setMessage('Cek email kamu untuk konfirmasi langganan.');
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

      {status === 'success' && (
        <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
          <div className="mb-3 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <p className="mb-1 font-medium text-primary">Hampir selesai!</p>
          <p className="text-sm text-muted-foreground">{message}</p>
          <p className="mt-2 text-xs text-muted-foreground/70">Tidak menerima email? Cek folder spam.</p>
        </div>
      )}

      {status === 'already' && (
        <div className="mt-6 rounded-xl border border-border bg-secondary p-6 text-center">
          <p className="mb-1 font-medium text-foreground">Email sudah terdaftar</p>
          <p className="text-sm text-muted-foreground">{message}</p>
          <a href="/newsletter-arsip" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
            Baca arsip newsletter &rarr;
          </a>
        </div>
      )}

      {status === 'error' && message && (
        <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">{message}</p>
        </div>
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
