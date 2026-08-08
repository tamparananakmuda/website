'use client';

import React from 'react';
import { Sparkles, Briefcase, Wallet, HeartPulse, Users } from 'lucide-react';

const ONBOARDING_KEY = 'tami_onboarding_seen';

/**
 * Check if user has seen TAMI onboarding before.
 */
export function hasSeenOnboarding(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
}

/**
 * Mark onboarding as seen.
 */
export function markOnboardingSeen(): void {
  localStorage.setItem(ONBOARDING_KEY, 'true');
}

/**
 * Onboarding intro message shown to first-time TAMI users.
 * Displays as a special assistant message with topic suggestions.
 */
export const OnboardingMessage: React.FC<{ onSuggestionClick: (text: string) => void }> = ({ onSuggestionClick }) => {
  const suggestions = [
    { icon: Briefcase, text: 'Gue bingung soal karir, mau mulai dari mana?', label: 'Karir' },
    { icon: Wallet, text: 'Gaji gue habis tiap bulan, gimana sih ngaturnya?', label: 'Keuangan' },
    { icon: HeartPulse, text: 'Gue merasa burnout terus, apa yang salah?', label: 'Mental' },
    { icon: Users, text: 'Gue merasa ketinggalan sama temen-temen sebaya', label: 'Sosial' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 flex-shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-neutral-200 leading-relaxed">
            <span className="font-bold text-white">Halo, aku TAMI.</span>{' '}
            Aku bisa bantu kamu membedah realita karir, keuangan, tekanan sosial, dan kesehatan mental.
            Tidak ada jawaban instan, tapi aku akan kasih sudut pandang yang mungkin belum kamu pikirin.
          </p>
          <p className="text-xs text-neutral-400 mt-2">
            Cerita aja, apa yang lagi dipikirin? Atau pilih topik di bawah:
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-11">
        {suggestions.map((s) => (
          <button
            key={s.label}
            onClick={() => onSuggestionClick(s.text)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/60 text-left transition-all group"
          >
            <s.icon className="w-4 h-4 text-neutral-500 group-hover:text-primary transition-colors flex-shrink-0" />
            <span className="text-xs text-neutral-300 group-hover:text-white transition-colors line-clamp-2">{s.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
