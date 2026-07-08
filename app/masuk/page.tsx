'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, AlertCircle } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(errorParam === 'auth' ? 'Link gagal atau kadaluarsa. Coba lagi.' : null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Masuk ke TAM
          </h1>
          <p className="text-muted-foreground text-sm">
            Masukkan email kamu. Kami kirim link masuk, tanpa password.
          </p>
        </div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg border border-border bg-card p-6 text-center"
          >
            <Mail className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h2 className="font-semibold text-foreground mb-2">Cek email kamu</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Link masuk sudah dikirim ke <strong>{email}</strong>. Klik link tersebut untuk masuk.
            </p>
            <p className="text-xs text-muted-foreground">
              Tidak menerima email? Cek folder spam, atau coba lagi dalam beberapa menit.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="kamu@email.com"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Mengirim...' : 'Kirim Link Masuk'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>

            <p className="text-xs text-muted-foreground text-center pt-2">
              Dengan masuk, kamu setuju untuk menerima newsletter dan update dari TAM.
              Kamu bisa unsubscribe kapan saja.
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
}

export default function MasukPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
