const BASE_URL = 'https://api.mistral.ai/v1';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionOptions {
  model?: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  responseFormat?: { type: 'json_object' | 'text' };
  timeoutMs?: number;
  promptCacheKey?: string;
}

export class MistralClient {
  private apiKey: string;

  constructor(apiKey: string = process.env.MISTRAL_API_KEY || '') {
    this.apiKey = apiKey;
  }

  async chat(options: ChatCompletionOptions) {
    const maxRetries = 3;
    let lastError: Error | null = null;
    const timeoutMs = options.timeoutMs ?? 20000;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(`${BASE_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: options.model || 'mistral-large-latest',
            messages: options.messages,
            temperature: options.temperature ?? 0.7,
            max_tokens: options.maxTokens,
            response_format: options.responseFormat,
            prompt_cache_key: options.promptCacheKey,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorText = await response.text();
          // Retry on transient server errors (502, 503, 429, 500)
          if ((response.status === 500 || response.status === 502 || response.status === 503 || response.status === 429) && attempt < maxRetries) {
            clearTimeout(timeoutId);
            // Exponential backoff with jitter: base * 2^attempt + random jitter
            const baseDelay = 500;
            const backoff = baseDelay * Math.pow(2, attempt);
            const jitter = Math.random() * 300;
            await new Promise(r => setTimeout(r, backoff + jitter));
            console.warn(`[TAMI MISTRAL] Retry ${attempt + 1}/${maxRetries} after ${response.status} (${Math.round(backoff + jitter)}ms delay)`);
            continue;
          }
          throw new Error(`Mistral API Error: ${response.status} - ${errorText}`);
        }

        return response.json();
      } catch (error: any) {
        if (error.name === 'AbortError') {
          lastError = new Error(`Mistral API timeout after ${timeoutMs}ms`);
        } else {
          lastError = error;
        }
        // Retry on network errors (not AbortError)
        if (attempt < maxRetries && error.name !== 'AbortError') {
          clearTimeout(timeoutId);
          const baseDelay = 500;
          const backoff = baseDelay * Math.pow(2, attempt);
          const jitter = Math.random() * 300;
          await new Promise(r => setTimeout(r, backoff + jitter));
          console.warn(`[TAMI MISTRAL] Retry ${attempt + 1}/${maxRetries} after network error (${Math.round(backoff + jitter)}ms delay)`);
          continue;
        }
        throw lastError;
      } finally {
        clearTimeout(timeoutId);
      }
    }
    throw lastError || new Error('Mistral API failed after retries');
  }

  async embed(input: string | string[]) {
    const maxRetries = 1;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      try {
        const response = await fetch(`${BASE_URL}/embeddings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: 'mistral-embed',
            input: Array.isArray(input) ? input : [input],
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorText = await response.text();
          if ((response.status === 502 || response.status === 503 || response.status === 429) && attempt < maxRetries) {
            clearTimeout(timeoutId);
            await new Promise(r => setTimeout(r, 1000));
            continue;
          }
          throw new Error(`Mistral Embed API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return data.data.map((item: any) => item.embedding);
      } catch (error: any) {
        if (error.name === 'AbortError') {
          lastError = new Error('Mistral Embed API timeout after 15000ms');
        } else {
          lastError = error;
        }
        if (attempt < maxRetries && error.name !== 'AbortError') {
          clearTimeout(timeoutId);
          await new Promise(r => setTimeout(r, 1000));
          continue;
        }
        throw lastError;
      } finally {
        clearTimeout(timeoutId);
      }
    }
    throw lastError || new Error('Mistral Embed API failed after retries');
  }

  async chatStream(options: ChatCompletionOptions): Promise<ReadableStream> {
    const maxRetries = 1;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const controller = new AbortController();
      const timeoutMs = options.timeoutMs ?? 30000;
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(`${BASE_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: options.model || 'mistral-large-latest',
            messages: options.messages,
            temperature: options.temperature ?? 0.7,
            max_tokens: options.maxTokens,
            stream: true,
            prompt_cache_key: options.promptCacheKey,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorText = await response.text();
          if ((response.status === 502 || response.status === 503 || response.status === 429) && attempt < maxRetries) {
            clearTimeout(timeoutId);
            await new Promise(r => setTimeout(r, 1000));
            continue;
          }
          throw new Error(`Mistral Stream API Error: ${response.status} - ${errorText}`);
        }

        clearTimeout(timeoutId);
        return response.body || new ReadableStream();
      } catch (error: any) {
        if (error.name === 'AbortError') {
          lastError = new Error(`Mistral Stream API timeout after ${timeoutMs}ms`);
        } else {
          lastError = error;
        }
        if (attempt < maxRetries && error.name !== 'AbortError') {
          clearTimeout(timeoutId);
          await new Promise(r => setTimeout(r, 1000));
          continue;
        }
        throw lastError;
      } finally {
        clearTimeout(timeoutId);
      }
    }
    throw lastError || new Error('Mistral Stream API failed after retries');
  }
}

/**
 * Model fallback chain: tries primary model first, falls back to smaller model
 * on timeout or error. Returns first successful response.
 */
export async function chatWithFallback(
  mistral: MistralClient,
  options: ChatCompletionOptions,
  fallbackModel: string = 'mistral-small-latest',
): Promise<any> {
  try {
    return await mistral.chat(options);
  } catch (error: any) {
    const isTimeout = error?.message?.includes('timeout') || error?.name === 'AbortError';
    const isServerError = error?.message?.includes('502') || error?.message?.includes('503') || error?.message?.includes('429');

    if (isTimeout || isServerError) {
      console.warn(`[Mistral] Primary model ${options.model} failed (${isTimeout ? 'timeout' : 'server error'}), falling back to ${fallbackModel}`);
      return await mistral.chat({ ...options, model: fallbackModel });
    }
    throw error;
  }
}

export const mistral = new MistralClient();
