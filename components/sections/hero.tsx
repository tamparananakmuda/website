import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden">
      <div className="container mx-auto px-4 py-20 md:py-28">
        <div className="max-w-3xl">
          <p className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Awakening the youth to reality
          </p>
          <h1 className="mb-6 text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            Melawan Ilusi.
            <br />
            Membangun Realita.
          </h1>
          <p className="mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Media digital tentang mindset, bisnis, keuangan, teknologi, dan kehidupan untuk generasi muda Indonesia.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/artikel">Mulai Membaca</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/tentang">Tentang Kami</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
