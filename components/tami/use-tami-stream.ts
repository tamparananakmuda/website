'use client';

import { useState, useCallback, useRef } from 'react';
import { TamiCognitiveResponse } from '@/lib/tami/cognitive/types';

interface UseTamiStreamOptions {
  onCognitiveData?: (data: Omit<TamiCognitiveResponse, 'conversationalReply'>) => void;
  onToken?: (token: string) => void;
  onComplete?: (fullText: string) => void;
  onError?: (error: string) => void;
}

interface UseTamiStreamReturn {
  stream: (query: string, history: { role: 'user' | 'assistant'; content: string }[]) => Promise<void>;
  isStreaming: boolean;
  streamedText: string;
  cognitiveData: Omit<TamiCognitiveResponse, 'conversationalReply'> | null;
  error: string | null;
  abort: () => void;
}

/**
 * Client-side hook for SSE streaming from /api/tami/stream.
 * Receives cognitive data first, then streams conversational reply token-by-token.
 */
export function useTamiStream(options?: UseTamiStreamOptions): UseTamiStreamReturn {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [cognitiveData, setCognitiveData] = useState<Omit<TamiCognitiveResponse, 'conversationalReply'> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const fullTextRef = useRef('');
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const stream = useCallback(async (
    query: string,
    history: { role: 'user' | 'assistant'; content: string }[],
  ) => {
    // Reset state
    setStreamedText('');
    setCognitiveData(null);
    setError(null);
    setIsStreaming(true);
    fullTextRef.current = '';

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch('/api/tami/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, history }),
        signal: controller.signal,
      });

      // Auto-abort after 55s if no completion (server maxDuration is 60s)
      // Cleared once we receive the first event (processing heartbeat)
      const timeoutId = setTimeout(() => controller.abort(), 55000);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: 'Stream request failed' }));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const block of lines) {
          if (!block.startsWith('data: ')) continue;
          const jsonStr = block.slice(6).trim();
          if (!jsonStr) continue;

          try {
            const event = JSON.parse(jsonStr);

            if (event.type === 'processing') {
              // Heartbeat received — connection is alive, clear the abort timeout
              clearTimeout(timeoutId);
            } else if (event.type === 'cognitive') {
              setCognitiveData(event.data);
              optionsRef.current?.onCognitiveData?.(event.data);
            } else if (event.type === 'token') {
              fullTextRef.current += event.content;
              setStreamedText(fullTextRef.current);
              optionsRef.current?.onToken?.(event.content);
            } else if (event.type === 'done') {
              const finalText = fullTextRef.current || 'Maaf, TAMI tidak bisa memberikan respons saat ini. Silakan coba lagi.';
              optionsRef.current?.onComplete?.(finalText);
            }
          } catch {
            // Skip unparseable events
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // Could be user abort or timeout — keep partial text
        if (fullTextRef.current) {
          optionsRef.current?.onComplete?.(fullTextRef.current);
        } else {
          optionsRef.current?.onError?.('TAMI butuh waktu terlalu lama. Coba pertanyaan yang lebih singkat.');
        }
      } else {
        const msg = err.message || 'Streaming failed';
        setError(msg);
        optionsRef.current?.onError?.(msg);
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, []);

  const abort = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { stream, isStreaming, streamedText, cognitiveData, error, abort };
}
