import type { Metadata } from 'next';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';
import { IntelligenceChatInterface } from '@/components/tami/intelligence-chat-interface';
import { Sparkles, BrainCircuit, ShieldAlert, Compass, Activity, Zap, MessageSquareQuote } from 'lucide-react';
import { TamiIcon } from '@/components/tami/tami-icon';

export const metadata: Metadata = {
  title: 'TAMI AI - Autonomous Cognitive Intelligence Engine | Tamparan Anak Muda',
  description:
    'TAMI (Tamparan Anak Muda Intelligence) adalah engine kecerdasan kognitif independen untuk diagnosa realita karir, keuangan, mentalitas, dan tekanan hidup anak muda Indonesia.',
};

export default function TamiPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white relative overflow-hidden pb-16">
      {/* Background Decorative Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[480px] bg-gradient-to-b from-primary/15 via-primary/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-60 -left-48 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-96 -right-48 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-4 pt-6 md:pt-10">
        <BreadcrumbSchema
          items={[
            { name: 'Home', href: '/' },
            { name: 'TAMI AI Portal', href: '/tami' },
          ]}
        />

        {/* Hero Section */}
        <div className="mt-4 mb-8 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>TAMI Cognitive Intelligence Engine v2.0</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Bedah Realita & Dilema Hidupmu Tanpa <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-400 to-amber-400">Halusinasi Positif</span>
          </h1>

          <p className="text-sm md:text-base text-neutral-400 leading-relaxed font-normal">
            Asisten AI independen yang membedah distorsi berpikir, bias keuangan, burnout karir, dan tekanan sosial anak muda Indonesia berdasarkan 150+ analisis esai & seri investigasi TAM.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 max-w-2xl mx-auto">
            <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-3 backdrop-blur-xl">
              <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
                <BrainCircuit className="w-4 h-4" />
                <span className="text-xs font-bold text-white">4-Agent Pipeline</span>
              </div>
              <p className="text-[10px] text-neutral-400">Analisis Kognitif Multi-Sudut</p>
            </div>
            <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-3 backdrop-blur-xl">
              <div className="flex items-center justify-center gap-1.5 text-amber-400 mb-1">
                <ShieldAlert className="w-4 h-4" />
                <span className="text-xs font-bold text-white">Fact Guardrail</span>
              </div>
              <p className="text-[10px] text-neutral-400">100% Berbasis RAG TAM</p>
            </div>
            <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-3 backdrop-blur-xl">
              <div className="flex items-center justify-center gap-1.5 text-emerald-400 mb-1">
                <Compass className="w-4 h-4" />
                <span className="text-xs font-bold text-white">Action Roadmap</span>
              </div>
              <p className="text-[10px] text-neutral-400">Langkah Konkret 3 Tahap</p>
            </div>
            <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-3 backdrop-blur-xl">
              <div className="flex items-center justify-center gap-1.5 text-sky-400 mb-1">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-bold text-white">Resilience Score</span>
              </div>
              <p className="text-[10px] text-neutral-400">Ukur Ketahanan Mental</p>
            </div>
          </div>
        </div>

        {/* Portal Chat Interface Wrapper */}
        <div className="mx-auto max-w-6xl">
          <IntelligenceChatInterface />
        </div>

        {/* Bottom Capabilities Section */}
        <div className="mt-12 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-neutral-900 bg-neutral-950/60 p-6 backdrop-blur-xl hover:border-neutral-800 transition-colors">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Diagnosa Kognitif Jujur</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Mendeteksi pola pikir melingkar (*catastrophizing*, *FOMO*, *coping mekanisme toksik*) yang menahan potensi sejatimu tanpa penghiburan manis palsu.
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-900 bg-neutral-950/60 p-6 backdrop-blur-xl hover:border-neutral-800 transition-colors">
            <div className="h-10 w-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
              <MessageSquareQuote className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Rekomendasi Bacaan Tersambung</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Setiap diagnosa langsung ditautkan dengan rujukan esai dan seri investigasi TAM yang paling relevan untuk memperdalam pemahamanmu.
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-900 bg-neutral-950/60 p-6 backdrop-blur-xl hover:border-neutral-800 transition-colors">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Rencana Aksi Konkret</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Merumuskan panduan aksi taktis 24 jam pertama, 7 hari, dan 30 hari kedepan lengkap dengan estimasi hambatan realistis.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

