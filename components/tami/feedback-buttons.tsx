'use client';

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface FeedbackButtonsProps {
  messageId: string;
  query: string;
  reply: string;
}

/**
 * Thumbs up/down feedback buttons for TAMI responses.
 * Stores feedback via API and shows thank-you state.
 */
export const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({ messageId, query, reply }) => {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleFeedback = async (type: 'up' | 'down') => {
    if (submitted) return;
    setFeedback(type);
    setSubmitted(true);

    try {
      await fetch('/api/tami/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId,
          feedback: type,
          query: query.slice(0, 500),
          reply: reply.slice(0, 1000),
        }),
      });
    } catch {
      // Silent fail — feedback is best-effort
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-neutral-600">
        {feedback === 'up' ? <ThumbsUp className="w-3 h-3 text-emerald-500" /> : <ThumbsDown className="w-3 h-3 text-red-500" />}
        <span>Terima kasih atas feedback</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 mt-1.5">
      <button
        onClick={() => handleFeedback('up')}
        className="p-1 rounded hover:bg-neutral-800 transition-colors text-neutral-600 hover:text-emerald-500"
        aria-label="Respons membantu"
      >
        <ThumbsUp className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => handleFeedback('down')}
        className="p-1 rounded hover:bg-neutral-800 transition-colors text-neutral-600 hover:text-red-500"
        aria-label="Respons tidak membantu"
      >
        <ThumbsDown className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
