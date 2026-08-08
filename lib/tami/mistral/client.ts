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
}

export class MistralClient {
  private apiKey: string;

  constructor(apiKey: string = process.env.MISTRAL_API_KEY || '') {
    this.apiKey = apiKey;
  }

  async chat(options: ChatCompletionOptions) {
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
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Mistral API Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  async embed(input: string | string[]) {
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
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Mistral Embed API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.data.map((item: any) => item.embedding);
  }

  async chatStream(options: ChatCompletionOptions): Promise<ReadableStream> {
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
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Mistral Stream API Error: ${response.status} - ${errorText}`);
    }

    return response.body || new ReadableStream();
  }
}

export const mistral = new MistralClient();
