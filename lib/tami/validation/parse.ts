import { ZodSchema, ZodError } from 'zod';

/**
 * Strip markdown code fences (```json ... ``` or ``` ... ```) from LLM output.
 */
export function stripMarkdownFences(raw: string): string {
  let content = raw.trim();
  if (content.startsWith('```json')) {
    content = content.substring(7);
  } else if (content.startsWith('```')) {
    content = content.substring(3);
  }
  if (content.endsWith('```')) {
    content = content.substring(0, content.length - 3);
  }
  return content.trim();
}

/**
 * Attempt to recover partial/truncated JSON from LLM output.
 * Closes unclosed braces/brackets to make truncated JSON parseable.
 * This is useful when LLM output gets cut off due to token limits.
 */
export function recoverPartialJson(raw: string): string {
  let content = stripMarkdownFences(raw);

  // Count unclosed braces and brackets
  let braces = 0;
  let brackets = 0;
  let inString = false;
  let escape = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (char === '\\') {
      escape = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;

    if (char === '{') braces++;
    else if (char === '}') braces--;
    else if (char === '[') brackets++;
    else if (char === ']') brackets--;
  }

  // If we're inside a string, close it
  if (inString) {
    content += '"';
  }

  // Close unclosed brackets and braces
  for (let i = 0; i < brackets; i++) content += ']';
  for (let i = 0; i < braces; i++) content += '}';

  return content;
}

export type ParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; raw: string };

/**
 * Parse JSON string and validate against a Zod schema.
 * Strips markdown fences automatically.
 * Returns a discriminated union for safe handling.
 */
export function parseAndValidate<T>(raw: string, schema: ZodSchema<T>): ParseResult<T> {
  const cleaned = stripMarkdownFences(raw);

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    return {
      success: false,
      error: `JSON parse failed: ${(err as Error).message}`,
      raw: cleaned,
    };
  }

  const result = schema.safeParse(parsed);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const errorMessages = formatZodError(result.error);
  return {
    success: false,
    error: errorMessages,
    raw: cleaned,
  };
}

/**
 * Format Zod error into a concise, LLM-readable string.
 * Example: "mindState.resilienceScore: Expected number, received string"
 */
function formatZodError(error: ZodError): string {
  return error.issues
    .map(issue => {
      const path = issue.path.length > 0 ? issue.path.join('.') : '(root)';
      return `${path}: ${issue.message}`;
    })
    .join('; ');
}

/**
 * Parse + validate with retry via LLM.
 *
 * On validation failure, calls `retryFn` with the error message appended
 * to the original prompt, then tries again.
 *
 * @param rawOutput - First LLM output to parse
 * @param schema - Zod schema to validate against
 * @param retryFn - Called with (errorFeedback) → returns new LLM output string
 * @param maxRetries - Default 2
 * @returns Parsed & validated data, or throws if all retries fail
 */
export async function parseWithRetry<T>(
  rawOutput: string,
  schema: ZodSchema<T>,
  retryFn: (errorFeedback: string) => Promise<string>,
  maxRetries = 2,
): Promise<T> {
  let current = rawOutput;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const result = parseAndValidate(current, schema);
    if (result.success) {
      return result.data;
    }

    // On first failure, try partial JSON recovery before retrying via LLM
    if (attempt === 0) {
      const recovered = parseAndValidate(recoverPartialJson(current), schema);
      if (recovered.success) {
        console.log('[TAMI PARSE] Recovered partial JSON successfully');
        return recovered.data;
      }
    }

    if (attempt >= maxRetries) {
      throw new Error(
        `Validation failed after ${maxRetries + 1} attempts. Last error: ${result.error}`,
      );
    }

    const feedback = `Output sebelumnya tidak valid. Error: ${result.error}. ` +
      `Perbaiki dan hasilkan JSON yang valid sesuai schema. ` +
      `Output mentah yang salah (untuk referensi): ${result.raw.slice(0, 500)}`;

    current = await retryFn(feedback);
  }

  throw new Error('parseWithRetry: unreachable');
}
