'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Progressive typing effect for streaming-like text reveal.
 * Reveals text character by character at a configurable speed.
 * Returns the visible portion and controls.
 */
export function useTypingEffect(
  fullText: string,
  options?: { speed?: number; enabled?: boolean }
): {
  displayedText: string;
  isTyping: boolean;
  skip: () => void;
} {
  const speed = options?.speed ?? 15;
  const enabled = options?.enabled ?? true;

  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const indexRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const skipRef = useRef(false);

  // Reset when fullText changes
  useEffect(() => {
    if (!enabled || !fullText) {
      setDisplayedText(fullText);
      setIsTyping(false);
      return;
    }

    setDisplayedText('');
    setIsTyping(true);
    indexRef.current = 0;
    skipRef.current = false;

    // Adaptive speed: faster for longer text to avoid excessive wait
    const adaptiveSpeed = fullText.length > 500 ? 8 : fullText.length > 200 ? 12 : speed;

    intervalRef.current = setInterval(() => {
      if (skipRef.current) {
        setDisplayedText(fullText);
        setIsTyping(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      indexRef.current += 2; // Reveal 2 chars per tick for smoother feel
      const next = fullText.slice(0, indexRef.current);

      setDisplayedText(next);

      if (indexRef.current >= fullText.length) {
        setDisplayedText(fullText);
        setIsTyping(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, adaptiveSpeed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fullText, enabled, speed]);

  const skip = useCallback(() => {
    skipRef.current = true;
  }, []);

  return { displayedText, isTyping, skip };
}
