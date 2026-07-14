import type { Metadata } from 'next';
import { createPublicClient } from '@/lib/supabase/public';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';
import { Mail, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Arsip Newsletter',
  description: 'Kumpulan edisi newsletter TAMPARAN ANAK MUDA yang sudah pernah dikirim.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/newsletter-arsip`,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/newsletter-arsip`,
    title: 'Arsip Newsletter - Tamparan Anak Muda',
    description: 'Kumpulan edisi newsletter TAMPARAN ANAK MUDA yang sudah pernah dikirim.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arsip Newsletter - Tamparan Anak Muda',
    description: 'Kumpulan edisi newsletter TAMPARAN ANAK MUDA yang sudah pernah dikirim.',
  },
};

export const revalidate = 60;

export default async function NewsletterArchivePage() {
  const supabase = createPublicClient();

  const { data: issues } = await supabase
    .from('newsletter_issues')
    .select('id, issue_number, title, subject, excerpt, sent_at, created_at')
    .eq('is_published', true)
    .order('issue_number', { ascending: false });

  return (
    <main className="container mx-auto px-4 py-20 md:py-32">
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Newsletter', href: '/newsletter' },
        { name: 'Arsip', href: '/newsletter-arsip' },
      ]} />

      <header className="mb-12 max-w-2xl">
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="w-4 h-4" />
          Newsletter TAM
        </div>
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">
          Arsip Newsletter
        </h1>
        <p className="text-lg text-muted-foreground">
          Edisi-edisi yang sudah pernah dikirim. Kalau kamu belum berlangganan, daftar gratis di halaman newsletter.
        </p>
      </header>

      {issues && issues.length > 0 ? (
        <div className="space-y-4 max-w-2xl">
          {issues.map((issue) => (
            <article
              key={issue.id}
              className="rounded-lg border border-border bg-card p-5 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2 text-sm text-muted-foreground">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  Edisi #{issue.issue_number}
                </span>
                {issue.sent_at && (
                  <span className="flex items-center gap-1 text-xs">
                    <Calendar className="w-3 h-3" />
                    {new Date(issue.sent_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                )}
              </div>
              <h2 className="mb-1 font-semibold text-foreground">
                {issue.title}
              </h2>
              {issue.excerpt && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {issue.excerpt}
                </p>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="max-w-2xl rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground mb-4">
            Belum ada edisi newsletter yang dipublish.
          </p>
          <a
            href="/newsletter"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Berlangganan Newsletter
          </a>
        </div>
      )}
    </main>
  );
}
