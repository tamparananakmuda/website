'use client';

import React from 'react';
import { DiagnosisResult } from '@/lib/tami/cognitive/types';
import { AlertTriangle, TrendingUp, DollarSign, Brain, Sparkles } from 'lucide-react';
import { TamiIcon } from './tami-icon';
import dynamic from 'next/dynamic';

const TAMRadarChart = dynamic(() => import('@/components/charts/radar-chart').then(m => m.TAMRadarChart), {
  ssr: false,
  loading: () => <div className="h-[240px] w-full flex items-center justify-center text-xs text-neutral-500">Mempersiapkan grafik...</div>
});

interface RealityDiagnosisCardProps {
  diagnosis: DiagnosisResult;
}

export const RealityDiagnosisCard: React.FC<RealityDiagnosisCardProps> = ({ diagnosis }) => {
  const getMetricBadgeColor = (status: string) => {
    switch (status) {
      case 'high':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'low':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      default:
        return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
    }
  };

  const getMetricLabel = (key: string) => {
    switch (key) {
      case 'financialStress':
        return 'Tekanan Finansial';
      case 'careerBurnout':
        return 'Burnout Karir';
      case 'socialPressure':
        return 'Tekanan Sosial';
      case 'futureAnxiety':
        return 'Kecemasan Masa Depan';
      default:
        return key;
    }
  };

  const getMetricIcon = (key: string) => {
    switch (key) {
      case 'financialStress':
        return <DollarSign className="w-4 h-4" />;
      case 'careerBurnout':
        return <TrendingUp className="w-4 h-4" />;
      case 'socialPressure':
        return <AlertTriangle className="w-4 h-4" />;
      case 'futureAnxiety':
        return <Brain className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const scoreMapping: Record<string, number> = {
    high: 100,
    medium: 60,
    low: 20,
    not_applicable: 0
  };

  const chartData = [
    { metric: 'Finansial', skor: scoreMapping[diagnosis.metrics.financialStress] ?? 0 },
    { metric: 'Karir', skor: scoreMapping[diagnosis.metrics.careerBurnout] ?? 0 },
    { metric: 'Sosial', skor: scoreMapping[diagnosis.metrics.socialPressure] ?? 0 },
    { metric: 'Masa Depan', skor: scoreMapping[diagnosis.metrics.futureAnxiety] ?? 0 },
  ];

  const series = [
    { key: 'skor', name: 'Tingkat Tekanan', color: '#ff6b00' }
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950/60 p-6 backdrop-blur-xl transition-all duration-300 hover:border-neutral-700 hover:shadow-2xl hover:shadow-primary/10">
      <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
          <TamiIcon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-white text-base">Diagnosa Realita</h3>
          <p className="text-xs text-neutral-400">Analisis kondisi mental & realita hidupmu saat ini.</p>
        </div>
      </div>

      {/* Radar Chart Visualization */}
      <div className="mb-6 rounded-2xl overflow-hidden border border-neutral-900 bg-neutral-950/50 p-2">
        <TAMRadarChart 
          data={chartData} 
          series={series} 
          height={200}
        />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {Object.entries(diagnosis.metrics).map(([key, value]) => (
          <div 
            key={key} 
            className="flex items-center gap-3 rounded-2xl border border-neutral-900 bg-neutral-950/80 p-3"
          >
            <div className="text-neutral-400">
              {getMetricIcon(key)}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">{getMetricLabel(key)}</span>
              <span className={`inline-block text-[11px] font-bold capitalize mt-0.5 rounded-full border px-2 py-0.5 w-max ${getMetricBadgeColor(value)}`}>
                {value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Root Cause Analysis */}
      <div className="mb-5 rounded-2xl border border-neutral-900 bg-neutral-950/40 p-4">
        <h4 className="text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          Akar Masalah Utama
        </h4>
        <p className="text-xs text-neutral-400 leading-relaxed">
          {diagnosis.rootCauseAnalysis}
        </p>
      </div>

      {/* Cognitive Distortion */}
      <div className="mb-5 rounded-2xl border border-neutral-900 bg-neutral-950/40 p-4">
        <h4 className="text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          Jebakan Berpikir (Cognitive Bias)
        </h4>
        <span className="inline-block text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg mb-2">
          {diagnosis.cognitiveDistortion}
        </span>
        {diagnosis.cognitiveDistortionDescription && (
          <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
            {diagnosis.cognitiveDistortionDescription}
          </p>
        )}
        {diagnosis.cognitiveDistortionReframing && (
          <div className="border-t border-neutral-900 pt-3 mt-2">
            <h5 className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1">
              Reframing Realistis (Sudut Pandang Seimbang)
            </h5>
            <p className="text-xs text-neutral-300 leading-relaxed italic">
              {diagnosis.cognitiveDistortionReframing}
            </p>
          </div>
        )}
      </div>

      {/* Reality Check Verdict */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
        <h4 className="text-xs font-bold text-primary mb-1 flex items-center gap-1.5">
          💥 TAMPARAN REALITA
        </h4>
        <p className="text-xs text-white/90 leading-relaxed font-medium italic">
          &quot;{diagnosis.realityCheckVerdict}&quot;
        </p>
      </div>
    </div>
  );
};
export default RealityDiagnosisCard;
