'use client';

import React from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { TamiCognitiveResponse } from '@/lib/tami/cognitive/types';

interface FollowUpSuggestionsProps {
  cognitiveData?: Omit<TamiCognitiveResponse, 'conversationalReply'>;
  userQuery: string;
  onSuggestionClick: (text: string) => void;
}

/**
 * Generate follow-up question suggestions based on cognitive data and user query.
 * Uses heuristic mapping from detected emotion/distortion/severity.
 */
function generateSuggestions(
  cognitiveData: FollowUpSuggestionsProps['cognitiveData'],
  userQuery: string,
): string[] {
  const suggestions: string[] = [];
  const emotion = cognitiveData?.mindState?.primaryEmotion?.toLowerCase() || '';
  const distortion = cognitiveData?.diagnosis?.cognitiveDistortion?.toLowerCase() || '';
  const severity = cognitiveData?.severityLevel?.toLowerCase() || '';
  const resilience = cognitiveData?.mindState?.resilienceScore || 5;

  // Emotion-based suggestions
  if (emotion.includes('cemas') || emotion.includes('anxious') || emotion.includes('takut')) {
    suggestions.push('Apa yang bisa aku lakukan sekarang untuk ngurangin kecemasan ini?');
    suggestions.push('Kenapa sih aku selalu overthinking soal hal ini?');
  } else if (emotion.includes('sedih') || emotion.includes('sad') || emotion.includes('down')) {
    suggestions.push('Gimana caranya keluar dari perasaan ini?');
    suggestions.push('Apakah yang aku rasain ini normal?');
  } else if (emotion.includes('marah') || emotion.includes('angry') || emotion.includes('frustrat')) {
    suggestions.push('Gimana aku bisa channel emosi ini jadi sesuatu yang positif?');
    suggestions.push('Apakah reaksi aku berlebihan atau wajar?');
  } else if (emotion.includes('bingung') || emotion.includes('confused') || emotion.includes('lost')) {
    suggestions.push('Langkah pertama yang paling masuk akal buat aku apa?');
    suggestions.push('Gimana aku bisa mulai bikin keputusan tanpa takut salah?');
  } else if (emotion.includes('lelah') || emotion.includes('exhausted') || emotion.includes('burnout')) {
    suggestions.push('Tanda-tanda aku butuh istirahat total apa aja?');
    suggestions.push('Gimana aku bisa recharge tanpa ngerasa bersalah?');
  }

  // Distortion-based suggestions
  if (distortion.includes('catastrophizing') || distortion.includes('catastroph')) {
    suggestions.push('Gimana aku bisa berhenti ngebayangin skenario terburuk terus?');
  } else if (distortion.includes('all-or-nothing') || distortion.includes('black')) {
    suggestions.push('Kenapa aku selalu ngerasa kalau nggak sempurna berarti gagal total?');
  } else if (distortion.includes('overgeneraliz')) {
    suggestions.push('Apakah satu kegagalan benar-benar nentuin masa depan aku?');
  } else if (distortion.includes('personalization') || distortion.includes('personal')) {
    suggestions.push('Kenapa aku selalu nyalahin diri sendiri untuk hal di luar kendali?');
  }

  // Severity-based suggestions
  if (severity.includes('critical') || severity.includes('kritis')) {
    suggestions.push('Aku butuh bantuan profesional, gimana caranya mulai?');
  } else if (severity.includes('moderate') || severity.includes('sedang')) {
    if (resilience < 4) {
      suggestions.push('Apa ada hal kecil yang bisa aku lakukan hari ini untuk ngebantu diri sendiri?');
    }
  }

  // General fallbacks if not enough suggestions
  while (suggestions.length < 3) {
    const fallbacks = [
      'Bisa dijelasin lebih detail soal point kedua?',
      'Apa ada artikel di TAM yang bahas ini lebih dalam?',
      'Gimana kalau aku cerita lebih spesifik soal situasi aku?',
      'Apa yang kamu maksud dengan distorsi kognitif tadi?',
    ];
    const next = fallbacks[suggestions.length];
    if (next && !suggestions.includes(next)) {
      suggestions.push(next);
    } else {
      break;
    }
  }

  return suggestions.slice(0, 3);
}

export const FollowUpSuggestions: React.FC<FollowUpSuggestionsProps> = ({
  cognitiveData,
  userQuery,
  onSuggestionClick,
}) => {
  const suggestions = generateSuggestions(cognitiveData, userQuery);

  if (suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3 pl-11">
      {suggestions.map((text, i) => (
        <button
          key={i}
          onClick={() => onSuggestionClick(text)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/60 text-left transition-all group"
        >
          <MessageSquarePlus className="w-3 h-3 text-neutral-500 group-hover:text-primary transition-colors flex-shrink-0" />
          <span className="text-[11px] text-neutral-400 group-hover:text-neutral-200 transition-colors">{text}</span>
        </button>
      ))}
    </div>
  );
};
