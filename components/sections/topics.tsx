'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  TrendingUp,
  Sliders,
  Sparkles,
  Layers,
  ChevronRight,
  Activity,
  DollarSign,
  Cpu,
  Compass,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Category } from '@/lib/db/schema';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface TopicCategoryItem extends Category {
  articleCount?: number;
  subcategoriesList?: Array<{ title: string; slug: string }>;
}

export interface CategoryArticleItem {
  slug: string;
  title: string;
  excerpt: string;
  readingTime: number;
  publishedAt: string;
  ogHeadline?: string | null;
}

interface TopicsProps {
  categories: TopicCategoryItem[];
  articleCounts?: Record<string, number>;
  articlesByCategory?: Record<string, CategoryArticleItem[]>;
}

/* -------------------------------------------------------------------------- */
/*                 BESPOKE 21ST.DEV INTERACTIVE VISUAL WIDGETS                */
/* -------------------------------------------------------------------------- */

// 01. BISNIS: Unit Economics & Cashflow Real vs Hype Simulator
type BizScenario = 'organic' | 'alive' | 'burn';

function BusinessVisualWidget() {
  const [scenario, setScenario] = useState<BizScenario>('organic');

  const scenarioData = {
    organic: {
      label: 'Organik',
      margin: '+38.4%',
      marginColor: 'text-emerald-400',
      ltvCac: '4.2x (Sehat)',
      cacColor: 'text-amber-400',
      runway: 'Kas Mandiri (∞)',
      payback: '2.1 Bulan',
      takeaway: 'Pertumbuhan berulang didanai oleh keuntungan riil pelanggan, bukan utang.',
      statusType: 'success' as const,
      color: '#F59E0B',
    },
    alive: {
      label: 'Default Alive',
      margin: '+14.5%',
      marginColor: 'text-emerald-400',
      ltvCac: '3.0x (Solid)',
      cacColor: 'text-cyan-400',
      runway: '18 Bulan (Stabil)',
      payback: '4.5 Bulan',
      takeaway: 'Disiplin biaya: Mencapai titik impas sebelum cadangan kas habis.',
      statusType: 'success' as const,
      color: '#10B981',
    },
    burn: {
      label: 'Bakar Uang',
      margin: '-64.2%',
      marginColor: 'text-rose-400',
      ltvCac: '0.8x (Rugi)',
      cacColor: 'text-rose-400',
      runway: '3.5 Bulan (Kritis)',
      payback: '28 Bulan',
      takeaway: 'Ilusi GMV semu: Setiap transaksi baru justru memperdalam lubang defisit.',
      statusType: 'danger' as const,
      color: '#F43F5E',
    },
  };

  const current = scenarioData[scenario];

  return (
    <div className="flex h-full w-full flex-col justify-between rounded-xl sm:rounded-2xl border border-white/10 bg-zinc-950/85 p-3.5 sm:p-5">
      {/* Top Toggle Switch */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5 sm:pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400" />
          <span className="font-mono text-[11px] sm:text-xs font-semibold tracking-wider text-zinc-300">
            SIMULATOR CASHFLOW
          </span>
        </div>
        <div className="inline-flex rounded-lg border border-white/10 bg-black/50 p-0.5 text-[10px] sm:text-[11px] font-mono">
          {(['organic', 'alive', 'burn'] as BizScenario[]).map((key) => {
            const isActive = scenario === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setScenario(key)}
                className={`rounded-md px-2 py-1 transition-all ${
                  isActive
                    ? key === 'burn'
                      ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30'
                      : key === 'alive'
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {scenarioData[key].label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Metric Cards */}
      <div className="my-2.5 sm:my-3 grid grid-cols-2 gap-2 sm:gap-3">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5 sm:p-3">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-zinc-400">
            Margin Operasional
          </span>
          <p
            className={`mt-0.5 sm:mt-1 font-mono text-lg sm:text-xl font-bold transition-colors ${current.marginColor}`}
          >
            {current.margin}
          </p>
          <span className="font-mono text-[9px] sm:text-[10px] text-zinc-400">
            Runway: {current.runway}
          </span>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5 sm:p-3">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-zinc-400">
            Unit Economics (LTV:CAC)
          </span>
          <p
            className={`mt-0.5 sm:mt-1 font-mono text-lg sm:text-xl font-bold transition-colors ${current.cacColor}`}
          >
            {current.ltvCac}
          </p>
          <span className="font-mono text-[9px] sm:text-[10px] text-zinc-400">
            Payback: {current.payback}
          </span>
        </div>
      </div>

      {/* Dynamic Visual Chart (SVG) */}
      <div className="relative h-20 sm:h-28 w-full overflow-hidden rounded-lg sm:rounded-xl border border-white/5 bg-black/40 p-1.5 sm:p-2">
        <svg className="h-full w-full" viewBox="0 0 300 80" fill="none">
          <defs>
            <linearGradient id="bizGradAmber" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="bizGradEmerald" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="bizGradRose" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1="40" x2="300" y2="40" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />

          {scenario === 'organic' && (
            <>
              <path
                d="M 10 65 Q 80 55 140 42 T 290 12 L 290 75 L 10 75 Z"
                fill="url(#bizGradAmber)"
              />
              <path
                d="M 10 65 Q 80 55 140 42 T 290 12"
                stroke="#F59E0B"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="290" cy="12" r="4" fill="#F59E0B" className="animate-pulse" />
            </>
          )}

          {scenario === 'alive' && (
            <>
              <path
                d="M 10 55 Q 70 65 140 48 T 290 22 L 290 75 L 10 75 Z"
                fill="url(#bizGradEmerald)"
              />
              <path
                d="M 10 55 Q 70 65 140 48 T 290 22"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="290" cy="22" r="4" fill="#10B981" className="animate-pulse" />
            </>
          )}

          {scenario === 'burn' && (
            <>
              <path
                d="M 10 18 Q 80 25 140 48 T 290 72 L 290 75 L 10 75 Z"
                fill="url(#bizGradRose)"
              />
              <path
                d="M 10 18 Q 80 25 140 48 T 290 72"
                stroke="#F43F5E"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="290" cy="72" r="4" fill="#F43F5E" className="animate-pulse" />
            </>
          )}
        </svg>

        <div className="absolute bottom-1.5 left-2.5 right-2.5 flex items-center justify-between font-mono text-[9px] sm:text-[10px] text-zinc-400">
          <span>Bln 01</span>
          <span>Bln 06</span>
          <span>Bln 12 (Proyeksi)</span>
        </div>
      </div>

      {/* Footer Status Pill */}
      <div className="mt-2.5 sm:mt-3 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-zinc-400">
        <span className="flex items-center gap-1.5 truncate">
          {current.statusType === 'success' ? (
            <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-400" />
          ) : (
            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 text-rose-400" />
          )}
          <span className="truncate">{current.takeaway}</span>
        </span>
      </div>
    </div>
  );
}

// 02. TEKNOLOGI: Attention Economy & Radar Visualizer
type TechState = 'sovereign' | 'fragmented' | 'hijacked';

function TechVisualWidget() {
  const [techState, setTechState] = useState<TechState>('sovereign');

  const states = {
    sovereign: {
      label: 'Berdaulat',
      score: '94%',
      statusTitle: 'Deep Sovereign',
      tagline: 'AI sebagai asisten eksekusi, kendali fokus 100% di tangan Anda.',
      badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      centerBg: 'bg-purple-500 text-white shadow-[0_0_24px_rgba(139,92,246,0.6)]',
      spinSpeed: 'animate-[spin_24s_linear_infinite]',
      satelliteTop: 'Zero Distraksi',
      satelliteBottom: 'Deep Work: 4.5h',
      indicatorWidth: 'w-[94%]',
      indicatorColor: 'bg-purple-500',
      labelColor: 'text-purple-300',
      labelText: 'Terkendali Penuh',
    },
    fragmented: {
      label: 'Terpecah',
      score: '48%',
      statusTitle: 'Atensi Terfragmentasi',
      tagline: 'Pindah konteks setiap 4 menit, daya nalar analitis terdegradasi.',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      centerBg: 'bg-amber-500 text-black shadow-[0_0_24px_rgba(234,179,8,0.6)]',
      spinSpeed: 'animate-[spin_10s_linear_infinite]',
      satelliteTop: 'Notif Loop: 24x',
      satelliteBottom: 'Atensi Bocor: 3h',
      indicatorWidth: 'w-[48%]',
      indicatorColor: 'bg-amber-500',
      labelColor: 'text-amber-300',
      labelText: 'Semi-Terdistraksi',
    },
    hijacked: {
      label: 'Doomscroll',
      score: '16%',
      statusTitle: 'Terbajak Total',
      tagline: 'Sirkuit dopamin dieksploitasi feed demi monetisasi impresi iklan.',
      badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      centerBg: 'bg-rose-600 text-white shadow-[0_0_24px_rgba(244,63,94,0.6)]',
      spinSpeed: 'animate-[spin_4s_linear_infinite]',
      satelliteTop: 'Zombie Mode',
      satelliteBottom: 'Feed Terbuang: 5.4h',
      indicatorWidth: 'w-[16%]',
      indicatorColor: 'bg-rose-500',
      labelColor: 'text-rose-400',
      labelText: 'Didikte Algoritma',
    },
  };

  const curr = states[techState];

  return (
    <div className="flex h-full w-full flex-col justify-between rounded-xl sm:rounded-2xl border border-white/10 bg-zinc-950/85 p-3.5 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5 sm:pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-400" />
          <span className="font-mono text-[11px] sm:text-xs font-semibold tracking-wider text-zinc-300">
            AUDIT ATENSI DIGITAL
          </span>
        </div>
        <div className="inline-flex rounded-lg border border-white/10 bg-black/50 p-0.5 text-[10px] sm:text-[11px] font-mono">
          {(['sovereign', 'fragmented', 'hijacked'] as TechState[]).map((key) => {
            const isActive = techState === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setTechState(key)}
                className={`rounded-md px-2 py-1 transition-all ${
                  isActive
                    ? `${states[key].badgeClass} font-bold border`
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {states[key].label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Concentric Radar / Audio Scan Graphic */}
      <div className="my-2.5 sm:my-3 flex items-center justify-center">
        <div className="relative flex aspect-square h-28 w-28 sm:h-36 sm:w-36 items-center justify-center rounded-full border border-purple-500/20 bg-purple-950/10">
          <div className="absolute inset-1.5 sm:inset-2 rounded-full border border-purple-500/15" />
          <div className="absolute inset-4 sm:inset-6 rounded-full border border-purple-500/10" />
          <div
            className={`absolute inset-7 sm:inset-10 rounded-full border border-dashed border-purple-500/30 ${curr.spinSpeed}`}
          />

          {/* Center node */}
          <div
            className={`z-10 flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-full font-mono text-[11px] sm:text-xs font-bold transition-all ${curr.centerBg}`}
          >
            {curr.score}
          </div>

          {/* Orbiting Satellite Data Chips */}
          <div className="absolute -top-1 right-1 sm:right-2 rounded-full border border-white/10 bg-black/80 px-1.5 sm:px-2 py-0.5 font-mono text-[8px] sm:text-[9px] text-zinc-300">
            {curr.satelliteTop}
          </div>
          <div className="absolute -bottom-1 left-1 sm:left-2 rounded-full border border-white/10 bg-black/80 px-1.5 sm:px-2 py-0.5 font-mono text-[8px] sm:text-[9px] text-zinc-300">
            {curr.satelliteBottom}
          </div>
        </div>
      </div>

      {/* Real-time Indicator Bar */}
      <div className="space-y-1 sm:space-y-1.5 font-mono text-[10px] sm:text-[11px]">
        <div className="flex justify-between text-zinc-400">
          <span>Kedaulatan Kognitif</span>
          <span className={curr.labelColor}>{curr.labelText}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full transition-all duration-500 ${curr.indicatorWidth} ${curr.indicatorColor}`}
          />
        </div>
      </div>

      <div className="mt-2 text-left font-mono text-[10px] text-zinc-400 truncate">
        <span>{curr.tagline}</span>
      </div>
    </div>
  );
}

// 03. KARIER: Bargaining Power & Career Leverage Calculator
function CareerVisualWidget() {
  const [rarity, setRarity] = useState<number>(75);
  const leverageMultiplier = (1 + (rarity / 100) * 3).toFixed(1);

  const presets = [
    { label: 'Komoditas', value: 35 },
    { label: 'Spesialis', value: 75 },
    { label: 'Monopoli', value: 92 },
  ];

  return (
    <div className="flex h-full w-full flex-col justify-between rounded-xl sm:rounded-2xl border border-white/10 bg-zinc-950/85 p-3.5 sm:p-5">
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5 sm:pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-400" />
          <span className="font-mono text-[11px] sm:text-xs font-semibold tracking-wider text-zinc-300">
            MATRIKS DAYA TAWAR
          </span>
        </div>
        <span className="rounded-md border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 font-mono text-[9px] sm:text-[10px] font-bold text-blue-300">
          {leverageMultiplier}x Multiplier
        </span>
      </div>

      {/* Interactive Slider Section with custom glowing track & 1-tap preset buttons */}
      <div className="my-2 sm:my-3 space-y-2">
        <div className="flex justify-between items-center font-mono text-[11px] sm:text-xs text-zinc-300">
          <span>Kelangkaan Skill Stack:</span>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-blue-400 font-mono text-xs sm:text-sm">{rarity}%</span>
            <span className="text-[9px] text-zinc-400 font-mono">
              {rarity >= 85 ? '(Monopoli)' : rarity >= 65 ? '(Spesialis)' : '(Komoditas)'}
            </span>
          </div>
        </div>

        <div className="relative flex items-center py-1">
          <input
            type="range"
            min="20"
            max="95"
            value={rarity}
            onChange={(e) => setRarity(Number(e.target.value))}
            className="h-2.5 w-full cursor-pointer appearance-none rounded-lg accent-blue-400 touch-pan-x [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-400 [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(59,130,246,0.8)] [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-400"
            style={{
              background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((rarity - 20) / (95 - 20)) * 100}%, rgba(255,255,255,0.12) ${((rarity - 20) / (95 - 20)) * 100}%, rgba(255,255,255,0.12) 100%)`,
            }}
            aria-label="Kelangkaan Skill Stack"
          />
        </div>

        {/* Quick Presets for 1-tap switching */}
        <div className="flex items-center justify-between gap-1.5 pt-0.5">
          {presets.map((p) => {
            const isActive = Math.abs(rarity - p.value) < 6;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => setRarity(p.value)}
                className={`flex-1 rounded-md px-1.5 py-1 text-center font-mono text-[9px] sm:text-[10px] transition-all min-h-[30px] sm:min-h-0 flex items-center justify-center ${
                  isActive
                    ? 'border border-blue-500/50 bg-blue-500/20 text-blue-300 font-bold shadow-[0_0_8px_rgba(59,130,246,0.25)]'
                    : 'border border-white/5 bg-white/[0.03] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06]'
                }`}
              >
                {p.label} {p.value}%
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Position Status */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 rounded-xl border border-white/5 bg-black/40 p-2.5 sm:p-3">
        <div>
          <span className="font-mono text-[9px] sm:text-[10px] uppercase text-zinc-400">Posisi Tawar</span>
          <p className="mt-0.5 sm:mt-1 font-mono text-xs sm:text-sm font-bold text-white">
            {rarity >= 70 ? 'Pemegang Negosiasi' : 'Tergantung Kebijakan'}
          </p>
        </div>
        <div>
          <span className="font-mono text-[9px] sm:text-[10px] uppercase text-zinc-400">Risiko Otomasi</span>
          <p className="mt-0.5 sm:mt-1 font-mono text-xs sm:text-sm font-bold text-emerald-400">
            {rarity >= 70 ? 'Rendah (<15%)' : 'Tinggi (>60%)'}
          </p>
        </div>
      </div>

      <div className="mt-2 sm:mt-2.5 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-zinc-400">
        <span className="flex items-center gap-1.5 text-blue-300">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Ketuk preset / geser
        </span>
        <span>Keahlian Spesifik</span>
      </div>
    </div>
  );
}

// 04. KEHIDUPAN: Adulting Reality & Energy Balance Rings
type LifeScenario = 'mindful' | 'fomo' | 'burnout';

function LifeVisualWidget() {
  const [lifeMode, setLifeMode] = useState<LifeScenario>('mindful');
  const [activeGauge, setActiveGauge] = useState<0 | 1 | 2>(0);

  const scenarios: Record<
    LifeScenario,
    {
      label: string;
      sublabel: string;
      status: string;
      statusColor: string;
      gauges: [
        { title: string; value: number; color: string; desc: string },
        { title: string; value: number; color: string; desc: string },
        { title: string; value: number; color: string; desc: string }
      ];
      principle: string;
    }
  > = {
    mindful: {
      label: 'Sadar Penuh',
      sublabel: 'Sovereign',
      status: 'Harmoni Berkelanjutan',
      statusColor: 'text-emerald-400',
      gauges: [
        { title: 'Energi Mental', value: 88, color: '#10B981', desc: 'Menolak FOMO status & proteksi batas personal' },
        { title: 'Waktu Riil', value: 76, color: '#14B8A6', desc: 'Deep living bersama lingkaran inti yang otentik' },
        { title: 'Bebas Tekanan', value: 92, color: '#3B82F6', desc: 'Nol utang konsumtif, standar hidup terkendali' },
      ],
      principle: 'Mengarahkan energi ke hal yang berdampak riil, menolak memelihara reputasi semu di media sosial.',
    },
    fomo: {
      label: 'Arus Medsos',
      sublabel: 'Default',
      status: 'Rentan Reaktif',
      statusColor: 'text-amber-400',
      gauges: [
        { title: 'Energi Mental', value: 46, color: '#F59E0B', desc: 'Lelah membandingkan diri dengan highlight reel orang' },
        { title: 'Waktu Riil', value: 36, color: '#F97316', desc: 'Waktu produktif terserap algoritma scroll pasif' },
        { title: 'Bebas Tekanan', value: 40, color: '#EAB308', desc: 'Gaya hidup naik secepat gaji demi gengsi pergaulan' },
      ],
      principle: 'Mengikuti ekspektasi standar lingkungan, rentan terhadap krisis quarter-life karena komparasi tanpa akhir.',
    },
    burnout: {
      label: 'Hustle Trap',
      sublabel: 'Overwhelmed',
      status: 'Krisis Burnout',
      statusColor: 'text-rose-400',
      gauges: [
        { title: 'Energi Mental', value: 22, color: '#F43F5E', desc: 'Kecemasan konstan, tidur tidak memulihkan energi' },
        { title: 'Waktu Riil', value: 14, color: '#EF4444', desc: '70+ jam kerja/minggu, nol ruang untuk evaluasi diri' },
        { title: 'Bebas Tekanan', value: 16, color: '#E11D48', desc: 'Retail therapy impulsif sebagai pelarian stres' },
      ],
      principle: 'Bekerja keras tanpa batasan sadar, menukar kesehatan dan relasi primer demi validasi eksternal.',
    },
  };

  const curr = scenarios[lifeMode];
  const currentGauge = curr.gauges[activeGauge];

  return (
    <div className="flex h-full w-full flex-col justify-between rounded-xl sm:rounded-2xl border border-white/10 bg-zinc-950/85 p-3.5 sm:p-5">
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5 sm:pb-3">
        <div className="flex items-center gap-2">
          <Compass className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400" />
          <span className="font-mono text-[11px] sm:text-xs font-semibold tracking-wider text-zinc-300">
            ALOKASI ENERGI DEWASA
          </span>
        </div>
        <span className={`font-mono text-[9px] sm:text-[10px] font-bold ${curr.statusColor}`}>
          ● {curr.status}
        </span>
      </div>

      {/* 3 Tactile Lifestyle Scenario Chips */}
      <div className="my-2 grid grid-cols-3 gap-1.5 font-mono text-[9px] sm:text-[10px]">
        {(
          [
            { key: 'mindful', label: 'Sadar Penuh' },
            { key: 'fomo', label: 'Arus Medsos' },
            { key: 'burnout', label: 'Hustle Trap' },
          ] as const
        ).map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setLifeMode(s.key)}
            className={`rounded-lg py-1 px-1 text-center transition-all min-h-[30px] sm:min-h-0 flex items-center justify-center ${
              lifeMode === s.key
                ? lifeMode === 'mindful'
                  ? 'border border-emerald-500/50 bg-emerald-500/20 text-emerald-300 font-bold shadow-[0_0_8px_rgba(16,185,129,0.25)]'
                  : lifeMode === 'fomo'
                  ? 'border border-amber-500/50 bg-amber-500/20 text-amber-300 font-bold shadow-[0_0_8px_rgba(245,158,11,0.25)]'
                  : 'border border-rose-500/50 bg-rose-500/20 text-rose-300 font-bold shadow-[0_0_8px_rgba(244,63,94,0.25)]'
                : 'border border-white/5 bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* 3 Interactive Gauges with Dynamic Progress Track */}
      <div className="my-1.5 sm:my-2 grid grid-cols-3 gap-1.5 sm:gap-2">
        {curr.gauges.map((g, idx) => (
          <button
            key={g.title}
            type="button"
            onClick={() => setActiveGauge(idx as 0 | 1 | 2)}
            className={`flex flex-col items-center rounded-xl border p-2 sm:p-2.5 min-h-[62px] sm:min-h-[68px] justify-between transition-all ${
              activeGauge === idx
                ? 'border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                : 'border-white/5 bg-white/[0.02] hover:border-white/15'
            }`}
          >
            <div className="flex items-baseline gap-0.5">
              <span className="font-mono text-base sm:text-lg font-bold" style={{ color: g.color }}>
                {g.value}
              </span>
              <span className="font-mono text-[9px] text-zinc-400">%</span>
            </div>
            <span className="font-mono text-[9px] sm:text-[10px] text-zinc-300 truncate w-full text-center">
              {g.title}
            </span>
            {/* Animated mini progress bar */}
            <div className="mt-1 h-1 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${g.value}%`, backgroundColor: g.color }}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Active Gauge Detail Panel */}
      <div className="rounded-xl border border-white/5 bg-black/40 p-2.5 sm:p-3 text-left">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-emerald-400">
            {'//'} Realita: {currentGauge.title}
          </span>
          <span className="font-mono text-[9px] text-zinc-400">Klik dimensi</span>
        </div>
        <p className="mt-1 font-display text-[11px] sm:text-xs leading-relaxed text-zinc-300">
          {currentGauge.desc}. {curr.principle}
        </p>
      </div>

      <div className="mt-2 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-zinc-400">
        <span>Menghindari Krisis 20-an</span>
        <span className="text-emerald-400">Resiliensi Otentik</span>
      </div>
    </div>
  );
}

// 05. MINDSET: Signal vs Noise Waveform Filter
type EpistemicMode = 'first_principles' | 'critical_filter' | 'raw_noise';

function MindsetVisualWidget() {
  const [epistemicMode, setEpistemicMode] = useState<EpistemicMode>('first_principles');

  const modes: Record<
    EpistemicMode,
    {
      label: string;
      sublabel: string;
      snr: string;
      snrQuality: string;
      snrColor: string;
      reactivity: string;
      reactivityColor: string;
      biasScore: string;
      biasLabel: string;
      insight: string;
      waveformColor: string;
    }
  > = {
    first_principles: {
      label: 'Prinsip Pertama',
      sublabel: 'First Principles',
      snr: '+26.8 dB',
      snrQuality: 'Murni Objektif',
      snrColor: 'text-teal-300',
      reactivity: 'Nol (Rasional)',
      reactivityColor: 'text-teal-400',
      biasScore: '0.0%',
      biasLabel: 'Bebas Polarisasi',
      insight: 'Dekomposisi persoalan ke hukum dasar fisika & logika empiris. Mengeliminasi rumor pasar tanpa verifikasi.',
      waveformColor: '#14B8A6',
    },
    critical_filter: {
      label: 'Saring Kritis',
      sublabel: 'Mental Model',
      snr: '+14.2 dB',
      snrQuality: 'Tersaring Stabil',
      snrColor: 'text-sky-300',
      reactivity: 'Rendah (Terkendali)',
      reactivityColor: 'text-sky-400',
      biasScore: '12.4%',
      biasLabel: 'Minimal Distorsi',
      insight: 'Uji silang insentif pembuat narasi, tunda reaksi impulsif 24 jam sebelum menarik keputusan strategis.',
      waveformColor: '#38BDF8',
    },
    raw_noise: {
      label: 'Raw Feed Medsos',
      sublabel: 'Dopamin Rush',
      snr: '-16.5 dB',
      snrQuality: 'Kakofoni Distorsi',
      snrColor: 'text-rose-400',
      reactivity: 'Kritis (Panic/Anger)',
      reactivityColor: 'text-rose-400',
      biasScore: '92.6%',
      biasLabel: 'Polarisasi Akut',
      insight: 'Algoritma feed mengeksploitasi kemarahan & kecemasan demi watch-time. Kognisi terfragmentasi total.',
      waveformColor: '#F43F5E',
    },
  };

  const curr = modes[epistemicMode];

  return (
    <div className="flex h-full w-full flex-col justify-between rounded-xl sm:rounded-2xl border border-white/10 bg-zinc-950/85 p-3.5 sm:p-5">
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5 sm:pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-400" />
          <span className="font-mono text-[11px] sm:text-xs font-semibold tracking-wider text-zinc-300">
            FILTER SIGNAL VS NOISE
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px]">
          <span className="text-zinc-400">SNR:</span>
          <span className={`font-bold ${curr.snrColor}`}>{curr.snr}</span>
        </div>
      </div>

      {/* 3 Epistemic Mode Switcher */}
      <div className="my-2 grid grid-cols-3 gap-1.5 font-mono text-[9px] sm:text-[10px]">
        {(
          [
            { key: 'first_principles', label: 'Prinsip Pertama' },
            { key: 'critical_filter', label: 'Saring Kritis' },
            { key: 'raw_noise', label: 'Raw Medsos' },
          ] as const
        ).map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setEpistemicMode(m.key)}
            className={`rounded-lg py-1 px-1 text-center transition-all min-h-[30px] sm:min-h-0 flex items-center justify-center ${
              epistemicMode === m.key
                ? epistemicMode === 'first_principles'
                  ? 'border border-teal-500/50 bg-teal-500/20 text-teal-300 font-bold shadow-[0_0_8px_rgba(20,184,166,0.25)]'
                  : epistemicMode === 'critical_filter'
                  ? 'border border-sky-500/50 bg-sky-500/20 text-sky-300 font-bold shadow-[0_0_8px_rgba(56,189,248,0.25)]'
                  : 'border border-rose-500/50 bg-rose-500/20 text-rose-300 font-bold shadow-[0_0_8px_rgba(244,63,94,0.25)]'
                : 'border border-white/5 bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Dynamic Oscilloscope Waveform Simulation */}
      <div className="my-1.5 sm:my-2 flex h-20 sm:h-24 items-center justify-center rounded-lg sm:rounded-xl border border-white/5 bg-black/60 p-1.5 sm:p-2 relative overflow-hidden">
        <svg className="h-full w-full" viewBox="0 0 300 70" fill="none">
          <defs>
            <linearGradient id="mindsetGradTeal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#2DD4BF" stopOpacity="1" />
              <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="mindsetGradSky" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#60A5FA" stopOpacity="1" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Oscilloscope Reticle Grid */}
          <line x1="0" y1="35" x2="300" y2="35" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
          <line x1="75" y1="0" x2="75" y2="70" stroke="rgba(255,255,255,0.04)" />
          <line x1="150" y1="0" x2="150" y2="70" stroke="rgba(255,255,255,0.04)" />
          <line x1="225" y1="0" x2="225" y2="70" stroke="rgba(255,255,255,0.04)" />

          {epistemicMode === 'first_principles' && (
            // Clean, harmonious sine wave
            <>
              <path
                d="M 0 35 Q 37.5 12 75 35 T 150 35 T 225 35 T 300 35"
                stroke="url(#mindsetGradTeal)"
                strokeWidth="2.5"
                fill="none"
              />
              <circle cx="150" cy="35" r="4" fill="#2DD4BF" className="animate-ping" />
              <circle cx="150" cy="35" r="3" fill="#14B8A6" />
            </>
          )}

          {epistemicMode === 'critical_filter' && (
            // Modulated dual-frequency wave
            <>
              <path
                d="M 0 35 Q 18.75 22 37.5 35 T 75 35 T 112.5 35 T 150 35 T 187.5 35 T 225 35 T 262.5 35 T 300 35"
                stroke="url(#mindsetGradSky)"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M 0 35 Q 37.5 18 75 35 T 150 35 T 225 35 T 300 35"
                stroke="#818CF8"
                strokeWidth="1.2"
                strokeDasharray="4 2"
                fill="none"
                opacity="0.5"
              />
              <circle cx="75" cy="35" r="3" fill="#38BDF8" />
              <circle cx="225" cy="35" r="3" fill="#38BDF8" />
            </>
          )}

          {epistemicMode === 'raw_noise' && (
            // Violent, high-frequency chaotic spikes
            <>
              <path
                d="M 0 35 L 12 12 L 24 58 L 36 18 L 48 52 L 60 8 L 72 62 L 84 20 L 96 50 L 108 10 L 120 64 L 132 22 L 144 54 L 156 12 L 168 62 L 180 18 L 192 56 L 204 10 L 216 60 L 228 24 L 240 52 L 252 14 L 264 58 L 276 20 L 288 50 L 300 35"
                stroke="#F43F5E"
                strokeWidth="2"
                fill="none"
              />
              <circle cx="72" cy="62" r="3.5" fill="#F43F5E" className="animate-ping" />
              <circle cx="216" cy="60" r="3.5" fill="#F43F5E" className="animate-ping" />
            </>
          )}
        </svg>

        {/* Reticle frequency overlay text */}
        <div className="absolute top-1 left-2 font-mono text-[8px] text-zinc-400">
          MODE: {curr.sublabel.toUpperCase()}
        </div>
        <div className="absolute bottom-1 right-2 font-mono text-[8px] text-zinc-400">
          SIGNAL: {curr.snrQuality}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-2.5 text-left font-mono text-[10px] sm:text-[11px]">
        <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2 sm:p-2.5">
          <span className="text-zinc-400 text-[9px] sm:text-[10px]">Reaktivitas Emosi</span>
          <p className={`mt-0.5 text-xs sm:text-sm font-bold ${curr.reactivityColor}`}>
            {curr.reactivity}
          </p>
        </div>
        <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2 sm:p-2.5">
          <span className="text-zinc-400 text-[9px] sm:text-[10px]">Bias Algoritma</span>
          <p className="mt-0.5 text-xs sm:text-sm font-bold text-white">
            {curr.biasScore}{' '}
            <span className="text-[9px] text-zinc-400 font-normal">({curr.biasLabel})</span>
          </p>
        </div>
      </div>

      {/* Tactical Insight Panel */}
      <div className="mt-1.5 rounded-xl border border-white/5 bg-white/[0.02] p-2 sm:p-2.5 font-mono text-[10px] sm:text-[11px] text-zinc-300 text-left">
        <p className="text-zinc-400 text-[9px] uppercase">{'//'} Disiplin Berpikir</p>
        <p className="mt-0.5 leading-snug text-[10px] text-zinc-300/90">{curr.insight}</p>
      </div>
    </div>
  );
}

// 06. UANG: Purchasing Power vs Real Inflation
function MoneyVisualWidget() {
  const [metricType, setMetricType] = useState<'real' | 'official'>('real');
  const [salaryTier, setSalaryTier] = useState<'umr' | 'mid' | 'high'>('umr');

  // Tier data computation: Starter Home ~800jt (Jabodetabek / Kota Besar Riil) vs 350jt (Data BPS/Subsidi)
  const tierData = {
    umr: {
      label: 'UMR 5 Jt',
      realRatio: '26.4 Thn',
      officialRatio: '7.2 Thn',
      realDeficit: '-14.2%/th',
      officialDeficit: '+1.2%/th',
      context: 'Realita Pekerja Pemula Kota',
    },
    mid: {
      label: 'Mid 10 Jt',
      realRatio: '13.2 Thn',
      officialRatio: '3.6 Thn',
      realDeficit: '-8.5%/th',
      officialDeficit: '+2.8%/th',
      context: 'Generasi Sandwich Terjepit',
    },
    high: {
      label: 'Senior 20 Jt',
      realRatio: '6.6 Thn',
      officialRatio: '1.8 Thn',
      realDeficit: '-2.8%/th',
      officialDeficit: '+5.4%/th',
      context: 'Laju Aset Masih Menantang',
    },
  }[salaryTier];

  return (
    <div className="flex h-full w-full flex-col justify-between rounded-xl sm:rounded-2xl border border-white/10 bg-zinc-950/85 p-3.5 sm:p-5">
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5 sm:pb-3">
        <div className="flex items-center gap-2">
          <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-rose-400" />
          <span className="font-mono text-[11px] sm:text-xs font-semibold tracking-wider text-zinc-300">
            DAYA BELI VS INFLASI
          </span>
        </div>
        <div className="inline-flex rounded-lg border border-white/10 bg-black/50 p-0.5 text-[10px] sm:text-[11px] font-mono">
          <button
            type="button"
            onClick={() => setMetricType('real')}
            className={`rounded-md px-2 py-1 sm:px-2.5 sm:py-1 transition-all ${
              metricType === 'real'
                ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Inflasi Riil
          </button>
          <button
            type="button"
            onClick={() => setMetricType('official')}
            className={`rounded-md px-2 py-1 sm:px-2.5 sm:py-1 transition-all ${
              metricType === 'official'
                ? 'bg-zinc-700 text-zinc-200 font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Data Resmi
          </button>
        </div>
      </div>

      {/* Interactive Salary Presets */}
      <div className="my-2 sm:my-2.5">
        <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] text-zinc-400">
          <span>Simulasi Penghasilan Bersih:</span>
          <span className="font-bold text-rose-400">{tierData.label}</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 font-mono text-[9px] sm:text-[10px]">
          {(
            [
              { key: 'umr', label: 'UMR (5Jt)' },
              { key: 'mid', label: 'Mid (10Jt)' },
              { key: 'high', label: 'Senior (20Jt)' },
            ] as const
          ).map((tier) => (
            <button
              key={tier.key}
              type="button"
              onClick={() => setSalaryTier(tier.key)}
              className={`rounded-lg py-1.5 px-1 text-center transition-all min-h-[32px] sm:min-h-0 flex items-center justify-center ${
                salaryTier === tier.key
                  ? 'border border-rose-500/40 bg-rose-500/20 font-bold text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.2)]'
                  : 'border border-white/5 bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div className="rounded-xl border border-white/5 bg-black/40 p-2.5 sm:p-3">
          <span className="font-mono text-[9px] sm:text-[10px] text-zinc-400">Rasio Gaji vs Rumah</span>
          <p className="mt-0.5 sm:mt-1 font-mono text-lg sm:text-xl font-bold text-rose-400">
            {metricType === 'real' ? tierData.realRatio : tierData.officialRatio}
          </p>
          <span className="font-mono text-[9px] sm:text-[10px] text-zinc-400">
            {metricType === 'real' ? tierData.context : 'Kalkulasi Standar'}
          </span>
        </div>

        <div className="rounded-xl border border-white/5 bg-black/40 p-2.5 sm:p-3">
          <span className="font-mono text-[9px] sm:text-[10px] text-zinc-400">Defisit Daya Beli</span>
          <p
            className={`mt-0.5 sm:mt-1 font-mono text-lg sm:text-xl font-bold ${
              metricType === 'real' ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >
            {metricType === 'real' ? tierData.realDeficit : tierData.officialDeficit}
          </p>
          <span className="font-mono text-[9px] sm:text-[10px] text-zinc-400">
            {metricType === 'real' ? 'Pangan + Papan' : 'Indeks Umum'}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2 sm:p-2.5 font-mono text-[10px] sm:text-[11px] text-zinc-300">
        <p className="text-zinc-400 text-[9px] uppercase">{'//'} Analisis Realitas Sistemik</p>
        <p className="mt-0.5 leading-snug text-[10px] text-zinc-300/90">
          {salaryTier === 'umr'
            ? 'Untuk UMR, alokasi 30% cicilan rumah standar Jabodetabek memerlukan waktu 26+ tahun tanpa belanja kebutuhan darurat.'
            : salaryTier === 'mid'
            ? 'Gaji 10Jt mulai cukup untuk cicilan suburban, namun rentan tergerus inflasi sekolah anak dan biaya rawat orang tua.'
            : 'Gaji 20Jt memberikan ruang bernapas, namun inflasi aset primer tetap menuntut strategi proteksi likuiditas ketat.'}
        </p>
      </div>

      <div className="mt-1.5 flex items-center justify-between font-mono text-[9px] sm:text-[10px] text-zinc-400">
        <span>Literasi Finansial Rasional</span>
        <span className="text-rose-400">Nol Gimmick Cepat Kaya</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            CATEGORY DATA DEFINITION                        */
/* -------------------------------------------------------------------------- */

interface CategoryMeta {
  number: string;
  badge: string;
  tagline: string;
  description: string;
  accentColor: string;
  tags: string[];
  widget: React.ReactNode;
}

const CATEGORY_META_REGISTRY: Record<string, CategoryMeta> = {
  bisnis: {
    number: '01',
    badge: 'UNIT ECONOMICS & EKONOMI RIIL',
    tagline: 'Membangun Bisnis yang Menghasilkan Kas, Bukan Sekadar Cerita Panggung.',
    description:
      'Valuasi tanpa laba hanyalah kebohongan yang ditangguhkan. Kami membedah realitas pasar, biaya riil, dan matematika bertahan hidup solo founder.',
    accentColor: '#F59E0B',
    tags: ['Unit Economics', 'Solo Founder', 'Cashflow Riil', 'Margin Bersih'],
    widget: <BusinessVisualWidget />,
  },
  teknologi: {
    number: '02',
    badge: 'EKONOMI ATENSI & DISTORSI ALGORITMA',
    tagline: 'Kuasai Alatnya Secara Rasional, Atau Dikendalikan oleh Algoritmanya.',
    description:
      'Membongkar manipulasi dopamin media sosial, penetrasi AI di dunia kerja, kedaulatan data, dan menjaga fokus di tengah distraksi digital.',
    accentColor: '#8B5CF6',
    tags: ['Ekonomi Atensi', 'AI di Dunia Kerja', 'Kedaulatan Data', 'Deep Work'],
    widget: <TechVisualWidget />,
  },
  karier: {
    number: '03',
    badge: 'DAYA TAWAR & STRUKTUR PASAR KERJA',
    tagline: 'Karier Bukan Soal Loyalitas Buta, Ini Soal Posisi Tawar yang Terukur.',
    description:
      'Menghitung posisi tawar di pasar kerja modern, negosiasi kompensasi berbasis nilai riil, dan menavigasi dinamika korporat secara realistis.',
    accentColor: '#3B82F6',
    tags: ['Daya Tawar', 'Skill Langka', 'Negosiasi Gaji', 'Politik Kantor'],
    widget: <CareerVisualWidget />,
  },
  kehidupan: {
    number: '04',
    badge: 'REALITAS SOSIAL & ADULTING',
    tagline: 'Menavigasi Kedewasaan Tanpa Harus Membeli Ekspektasi Orang Lain.',
    description:
      'Analisis objektif tentang quarter-life crisis, relasi era modern, isolasi sosial, dan menyusun standar hidup yang rasional bagi diri sendiri.',
    accentColor: '#10B981',
    tags: ['Adulting', 'Quarter-Life Crisis', 'Kesehatan Mental', 'Batas Sosial'],
    widget: <LifeVisualWidget />,
  },
  mindset: {
    number: '05',
    badge: 'KEJERNIHAN MENTAL & FIRST-PRINCIPLES',
    tagline: 'Berpikir dari Prinsip Pertama, Bukan Mengikuti Histeria Kolektif.',
    description:
      'Menolak doomerism dan optimisme palsu. Membangun resiliensi psikologis berbasis data objektif dan stoikisme praktis yang membumi.',
    accentColor: '#14B8A6',
    tags: ['First Principles', 'Signal vs Noise', 'Stoikisme Praktis', 'Anti-Gimmick'],
    widget: <MindsetVisualWidget />,
  },
  uang: {
    number: '06',
    badge: 'DAYA BELI & SISTEM KEUANGAN RIIL',
    tagline: 'Kenapa Makin Hemat Tetap Terasa Kalah dari Kenaikan Biaya Hidup?',
    description:
      'Membedah unit economics kelas menengah, inflasi riil kebutuhan dasar, jebakan paylater, dan struktur finansial yang menggerus daya beli generasi muda.',
    accentColor: '#F43F5E',
    tags: ['Daya Beli Riil', 'Jebakan Utang', 'Biaya Hidup', 'Investasi Rasional'],
    widget: <MoneyVisualWidget />,
  },
};

/* -------------------------------------------------------------------------- */
/*                         INDIVIDUAL 21ST.DEV GLASS CARD                     */
/* -------------------------------------------------------------------------- */

interface StackingCardProps {
  category: TopicCategoryItem;
  count: number;
  index: number;
  totalCards: number;
  latestArticle?: CategoryArticleItem;
}

const StackingCard: React.FC<StackingCardProps> = ({
  category,
  count,
  index,
  totalCards,
  latestArticle,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dimmerRef = useRef<HTMLDivElement>(null);

  const meta = CATEGORY_META_REGISTRY[category.slug] || {
    number: String(index + 1).padStart(2, '0'),
    badge: category.title.toUpperCase(),
    tagline: category.description || `Investigasi & Analisis Sektor ${category.title}`,
    description: category.description || 'Analisis data primer dan dekonstruksi sistemik.',
    accentColor: category.color || '#E11D48',
    tags: ['Analisis', 'Riset Data', 'Investigasi'],
    widget: <BusinessVisualWidget />,
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const card = cardRef.current;
    const container = containerRef.current;
    const dimmer = dimmerRef.current;
    if (!card || !container) return;

    const isMobile = window.innerWidth < 640;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    // On mobile, keep scale 1.0 (no horizontal shrinkage so full width is maintained with 0 black gutters)
    // On desktop, keep scale subtle (min 0.965) so cards stack with elegant visible rims without gaping holes
    const targetScale = isMobile
      ? 1
      : Math.max(0.965, 1 - (totalCards - index) * 0.005);

    gsap.set(card, {
      scale: 1,
      transformOrigin: 'center top',
      force3D: true,
    });

    if (dimmer) {
      gsap.set(dimmer, { opacity: 0 });
    }

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: isMobile ? 'top top+=60' : 'top top+=84',
      end: isMobile ? 'bottom top+=60' : 'bottom top+=84',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const currentScale = gsap.utils.interpolate(1, targetScale, progress);
        const currentDim = gsap.utils.interpolate(0, 0.22, progress);

        gsap.set(card, {
          scale: Math.max(currentScale, targetScale),
          transformOrigin: 'center top',
          force3D: true,
        });

        if (dimmer) {
          gsap.set(dimmer, {
            opacity: Math.min(Math.max(currentDim, 0), 0.22),
          });
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, [index, totalCards]);

  const categoryUrl = `/kategori/${category.slug}`;

  return (
    <div
      ref={containerRef}
      className="sticky w-full pb-8 sm:pb-14 lg:pb-16 [--stack-top:56px] sm:[--stack-top:80px] lg:[--stack-top:88px] [--stack-step:0px] sm:[--stack-step:12px] lg:[--stack-step:16px]"
      style={{
        top: `calc(var(--stack-top, 56px) + ${index} * var(--stack-step, 0px))`,
        zIndex: 10 + index,
      }}
    >
      {/* 21st.dev Premium Obsidian Glass Card with Hardware Acceleration */}
      <div
        ref={cardRef}
        style={{
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
        className="group relative w-full min-h-[480px] sm:min-h-[460px] lg:min-h-[480px] overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0E] p-4 sm:p-7 lg:p-9 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.12)] transition-[border-color,box-shadow] duration-200 sm:rounded-[28px]"
      >
        {/* Hardware-accelerated GPU overlay dimmer (replaces heavy filter:brightness) */}
        <div
          ref={dimmerRef}
          className="pointer-events-none absolute inset-0 z-20 rounded-2xl sm:rounded-[28px] bg-black opacity-0 transition-none"
          aria-hidden="true"
        />
        {/* Top Accent Hairline */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[2px] opacity-80 transition-opacity group-hover:opacity-100"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${meta.accentColor} 30%, ${meta.accentColor} 70%, transparent 100%)`,
          }}
          aria-hidden="true"
        />

        {/* Ambient Radial Lighting */}
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-[0.07] blur-3xl transition-opacity group-hover:opacity-[0.14]"
          style={{ backgroundColor: meta.accentColor }}
          aria-hidden="true"
        />

        {/* 2-Column Content Layout: Left Editorial Copy, Right Interactive Visual */}
        <div className="grid grid-cols-1 gap-5 sm:gap-7 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Category Narrative */}
          <div className="flex flex-col justify-between lg:col-span-6">
            <div>
              {/* Tactile Deck Header: Category Pill Tag & Progress Dots */}
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5 mb-2.5 sm:mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full shadow-[0_0_8px_currentColor]"
                    style={{ backgroundColor: meta.accentColor, color: meta.accentColor }}
                    aria-hidden="true"
                  />
                  <span
                    className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest"
                    style={{ color: meta.accentColor }}
                  >
                    SEKSI {meta.number} {'//'} {meta.badge}
                  </span>
                </div>

                {/* Tactile Deck Progress: e.g. 01 / 06 + 6-segment mini progress */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalCards }).map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === index
                            ? 'w-3.5 sm:w-4'
                            : i < index
                            ? 'w-1.5 bg-white/35'
                            : 'w-1.5 bg-white/10'
                        }`}
                        style={{
                          backgroundColor: i === index ? meta.accentColor : undefined,
                          boxShadow: i === index ? `0 0 8px ${meta.accentColor}` : undefined,
                        }}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span className="font-mono text-[9px] sm:text-[10px] font-semibold text-zinc-400 bg-white/[0.04] px-1.5 py-0.5 rounded-full border border-white/10">
                    {String(index + 1).padStart(2, '0')}/{String(totalCards).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Headline */}
              <h3 className="mt-2 sm:mt-3 font-display text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
                <Link
                  href={categoryUrl}
                  prefetch={false}
                  className="transition-colors hover:text-white/85"
                >
                  {category.title}
                </Link>
              </h3>

              {/* Tagline */}
              <p className="mt-1 font-display text-xs sm:text-sm font-medium text-zinc-300/90">
                {meta.tagline}
              </p>

              {/* Concise Description (No AI Essay) */}
              <p className="mt-2.5 sm:mt-4 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                {meta.description}
              </p>

              {/* Pillar Badges */}
              <div className="mt-3 sm:mt-5 flex flex-wrap gap-1.5 sm:gap-2">
                {meta.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-0.5 sm:px-3 sm:py-1 font-mono text-[10px] sm:text-[11px] font-medium text-zinc-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions: Latest Article Hook & Index Link */}
            <div className="mt-5 sm:mt-7 border-t border-white/[0.08] pt-4 sm:pt-5">
              {latestArticle && (
                <Link
                  href={`/artikel/${latestArticle.slug}`}
                  prefetch={false}
                  className="group/article mb-3 sm:mb-4 flex items-center justify-between gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-2.5 sm:p-3 text-xs text-zinc-300 transition-all hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Sparkles
                      size={13}
                      style={{ color: meta.accentColor }}
                      className="shrink-0"
                    />
                    <span className="truncate font-display font-medium text-white/90 group-hover/article:text-white">
                      {latestArticle.title}
                    </span>
                  </div>
                  <span className="shrink-0 font-mono text-[10px] sm:text-[11px] text-zinc-400">
                    {latestArticle.readingTime}m baca →
                  </span>
                </Link>
              )}

              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-4">
                <Link
                  href={categoryUrl}
                  prefetch={false}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl px-4 py-3 sm:px-5 sm:py-2.5 font-display text-xs font-bold uppercase tracking-wider text-white transition-all hover:brightness-110 active:scale-[0.98] min-h-[44px]"
                  style={{
                    backgroundColor: meta.accentColor,
                    boxShadow: `0 4px 20px -2px ${meta.accentColor}35`,
                  }}
                >
                  <span>
                    Buka Arsip {category.title} ({count > 0 ? `${count} Laporan` : 'Lengkap'})
                  </span>
                  <ArrowRight size={14} />
                </Link>

                <Link
                  href="/kategori"
                  prefetch={false}
                  className="inline-flex items-center justify-center py-1 font-mono text-[11px] sm:text-xs text-zinc-400 hover:text-white sm:py-0 sm:inline-block text-center"
                >
                  Indeks Seluruh Sektor →
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: 21st.dev Interactive Component Widget */}
          <div className="flex flex-col lg:col-span-6">{meta.widget}</div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                     DECK CLOSING DIRECTORY CARD (CARD 07)                  */
/* -------------------------------------------------------------------------- */

function DeckClosingCard({
  categories,
  articleCounts,
  index,
  totalCards,
}: {
  categories: TopicCategoryItem[];
  articleCounts: Record<string, number>;
  index: number;
  totalCards: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const card = cardRef.current;
    const container = containerRef.current;
    if (!card || !container) return;

    const isMobile = window.innerWidth < 640;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    gsap.set(card, {
      scale: 1,
      transformOrigin: 'center top',
      force3D: true,
    });

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: isMobile ? 'top top+=60' : 'top top+=84',
      end: isMobile ? 'bottom top+=60' : 'bottom top+=84',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const currentScale = isMobile
          ? 1
          : gsap.utils.interpolate(1, 0.985, progress);

        gsap.set(card, {
          scale: isMobile ? 1 : Math.max(currentScale, 0.98),
          transformOrigin: 'center top',
          force3D: true,
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [index, totalCards]);

  const totalArticles = Object.values(articleCounts).reduce((acc, count) => acc + count, 0);

  return (
    <div
      ref={containerRef}
      className="sticky w-full pb-16 sm:pb-20 lg:pb-24 [--stack-top:56px] sm:[--stack-top:80px] lg:[--stack-top:88px] [--stack-step:0px] sm:[--stack-step:12px] lg:[--stack-step:16px]"
      style={{
        top: `calc(var(--stack-top, 56px) + ${index} * var(--stack-step, 0px))`,
        zIndex: 10 + index,
      }}
    >
      <div
        ref={cardRef}
        style={{
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
        className="group relative w-full min-h-[480px] sm:min-h-[460px] lg:min-h-[480px] overflow-hidden rounded-2xl border border-white/15 bg-[#0B0B0E] p-4 sm:p-7 lg:p-9 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.15)] transition-[border-color,box-shadow] duration-200 sm:rounded-[28px]"
      >
        {/* Top Accent Hairline with multi-sector gradient */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[2px] opacity-90 transition-opacity group-hover:opacity-100"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, #E11D48 20%, #3B82F6 40%, #10B981 60%, #F59E0B 80%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        {/* Ambient Radial Lighting */}
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 gap-5 sm:gap-7 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Direktori Narrative & Main Action */}
          <div className="flex flex-col justify-between lg:col-span-6">
            <div>
              {/* Tactile Deck Header: Pill Tag & All-Clear 6-Segment Indicator */}
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5 mb-2.5 sm:mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_#E11D48]"
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest text-primary">
                    SEKTOR 01-06 {'//'} DIREKTORI LENGKAP
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <span
                        key={i}
                        className="h-1.5 w-2 sm:w-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span className="font-mono text-[9px] sm:text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    DEK TUNTAS 6/6
                  </span>
                </div>
              </div>

              {/* Headline */}
              <h3 className="mt-2 sm:mt-3 font-display text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
                Arsip & Indeks Seluruh Sektor Investigasi
              </h3>

              {/* Tagline */}
              <p className="mt-1 font-display text-xs sm:text-sm font-medium text-zinc-300/90">
                6 Sektor Riil. Menghubungkan Realitas Tanpa Filter.
              </p>

              {/* Description */}
              <p className="mt-2.5 sm:mt-4 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                Akses komprehensif ke seluruh indeks taksonomi tulisan TAM—mencakup dekonstruksi bisnis, riset teknologi AI, daya tawar karier, friksi kedewasaan, disiplin mental, dan peta modal.
              </p>
            </div>

            {/* Bottom Actions: Prominent Button to Full Index */}
            <div className="mt-5 sm:mt-7 border-t border-white/[0.08] pt-4 sm:pt-5">
              <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <Link
                  href="/kategori"
                  prefetch={false}
                  className="group/btn inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl bg-primary px-5 py-3.5 sm:px-6 sm:py-3 font-display text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-[0_4px_25px_rgba(225,29,72,0.4)] transition-all duration-300 hover:brightness-110 active:scale-[0.98] min-h-[44px]"
                >
                  <span>Buka Indeks Seluruh Sektor</span>
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
                  />
                </Link>

                <span className="text-center font-mono text-[10px] sm:text-[11px] text-zinc-400 sm:text-left">
                  {categories.length} Sektor Aktif • {totalArticles > 0 ? `${totalArticles} Laporan` : 'Riset Mendalam'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: 6-Sector Interactive Directory Grid */}
          <div className="flex flex-col justify-center lg:col-span-6">
            <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3">
              {categories.map((cat, i) => {
                const count = articleCounts[cat.slug] ?? 0;
                const reg = CATEGORY_META_REGISTRY[cat.slug];
                const color = reg?.accentColor || cat.color || '#E11D48';
                return (
                  <Link
                    key={cat.slug}
                    href={`/kategori/${cat.slug}`}
                    prefetch={false}
                    className="group/item flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.02] p-2.5 sm:p-3.5 min-h-[72px] sm:min-h-[80px] transition-all duration-200 hover:border-white/25 hover:bg-white/[0.06] active:scale-[0.98]"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] sm:text-[10px] font-bold text-zinc-400 group-hover/item:text-white">
                          0{i + 1}
                        </span>
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      </div>
                      <p className="mt-1.5 sm:mt-2 font-display text-xs font-bold text-white transition-colors group-hover/item:text-primary">
                        {cat.title}
                      </p>
                    </div>
                    <span className="mt-2 sm:mt-3 font-mono text-[9px] sm:text-[10px] text-zinc-400">
                      {count > 0 ? `${count} Laporan` : 'Arsip'} →
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Quick Helper Note */}
            <div className="mt-3 sm:mt-4 flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.01] px-2.5 sm:px-3 py-2 text-[10px] sm:text-[11px] text-zinc-400">
              <Sparkles size={12} className="text-primary shrink-0" />
              <span>Sentuh sektor di atas untuk eksplorasi spesifik, atau klik tombol untuk indeks penuh.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                MAIN TOPICS SECTION                         */
/* -------------------------------------------------------------------------- */

export function Topics({
  categories,
  articleCounts = {},
  articlesByCategory = {},
}: TopicsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }, []);

  if (!categories || categories.length === 0) return null;

  // Ordered strictly from 01 to 06
  const preferredOrder = ['bisnis', 'teknologi', 'karier', 'kehidupan', 'mindset', 'uang'];
  const sortedCategories = [...categories].sort((a, b) => {
    const idxA = preferredOrder.indexOf(a.slug);
    const idxB = preferredOrder.indexOf(b.slug);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.title.localeCompare(b.title);
  });

  return (
    <section
      ref={containerRef}
      className="relative w-full border-b border-t border-border bg-[#070709] py-14 sm:py-20 md:py-28 text-white"
    >
      {/* Subtle Background Architectural Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 20%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 20%, #000 60%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-10 sm:mb-14 md:mb-16 flex flex-col gap-4 sm:gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-2 sm:mb-3 flex items-center gap-3">
              <span className="font-display text-sm font-bold text-primary">02</span>
              <div className="h-px w-10 sm:w-12 bg-border" />
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Sektor Investigasi
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white">
              Enam Sektor Riil. Menjawab &ldquo;Kenapa&rdquo;, Bukan Sekadar &ldquo;Apa&rdquo;.
            </h2>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base leading-relaxed text-zinc-400">
              Dekonstruksi sistemik atas realitas ekonomi, algoritma digital, daya tawar kerja, dan
              krisis kedewasaan pemuda hari ini.
            </p>

            <div className="mt-3.5 sm:mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] sm:text-xs font-medium text-zinc-400 backdrop-blur-md">
              <Layers size={13} className="text-primary shrink-0" />
              <span>Scroll untuk menelusuri 6 sektor bertumpuk & indeks arsip</span>
            </div>
          </div>

          <Link
            href="/kategori"
            prefetch={false}
            className="group inline-flex shrink-0 items-center gap-1.5 font-mono text-xs font-semibold text-primary transition-all hover:text-white min-h-[32px]"
          >
            <span>Semua Sektor</span>
            <ChevronRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* GSAP Stacking Cards Deck */}
        <div className="relative mx-auto w-full max-w-5xl">
          {sortedCategories.map((category, index) => (
            <StackingCard
              key={category.id || category.slug}
              category={category}
              count={articleCounts[category.slug] ?? 0}
              index={index}
              totalCards={sortedCategories.length + 1}
              latestArticle={articlesByCategory[category.slug]?.[0]}
            />
          ))}

          {/* Deck Closing Card: Direktori Lengkap 6 Sektor */}
          <DeckClosingCard
            categories={sortedCategories}
            articleCounts={articleCounts}
            index={sortedCategories.length}
            totalCards={sortedCategories.length + 1}
          />
        </div>
      </div>
    </section>
  );
}
