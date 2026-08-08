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

            if (event.type === 'cognitive') {
              setCognitiveData(event.data);
              options?.onCognitiveData?.(event.data);
            } else if (event.type === 'token') {
              fullTextRef.current += event.content;
              setStreamedText(fullTextRef.current);
              options?.onToken?.(event.content);
            } else if (event.type === 'done') {
              const finalText = fullTextRef.current || 'Maaf, TAMI tidak bisa memberikan respons saat ini. Silakan coba lagi.';
              options?.onComplete?.(finalText);
            }
          } catch {
            // Skip unparseable events
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // User aborted, keep partial text
        options?.onComplete?.(fullTextRef.current);
      } else {
        const msg = err.message || 'Streaming failed';
        setError(msg);
        options?.onError?.(msg);
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [options]);

  const abort = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { stream, isStreaming, streamedText, cognitiveData, error, abort };
}
