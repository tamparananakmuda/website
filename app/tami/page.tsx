import type { Metadata } from 'next';
import { IntelligenceChatInterface } from '@/components/tami/intelligence-chat-interface';

export const metadata: Metadata = {
  title: 'TAMI AI - Autonomous Cognitive Intelligence Portal',
  description:
    'TAMI (Tamparan Anak Muda Intelligence) adalah asisten AI kecerdasan kognitif dengan antarmuka independen untuk mendiagnosa realita karir, keuangan, & tekanan hidup.',
};

export default function TamiPage() {
  return (
    <main className="w-full h-[calc(100vh-65px)] bg-neutral-950 overflow-hidden flex flex-col">
      <IntelligenceChatInterface />
    </main>
  );
}


