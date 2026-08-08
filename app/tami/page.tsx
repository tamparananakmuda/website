import type { Metadata } from 'next';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';
import { IntelligenceChatInterface } from '@/components/tami/intelligence-chat-interface';

export const metadata: Metadata = {
  title: 'TAMI AI - Autonomous Cognitive Intelligence Engine',
  description:
    'TAMI (Tamparan Anak Muda Intelligence) adalah asisten kecerdasan kognitif dengan analisis realita, multi-agent reasoning, dan dynamic reading path TAM.',
};

export default function TamiPage() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'TAMI AI', href: '/tami' },
        ]}
      />

      <div className="mx-auto max-w-6xl mt-4">
        {/* Portal interface */}
        <IntelligenceChatInterface />
      </div>
    </main>
  );
}
