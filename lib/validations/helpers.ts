import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

type ParseResult<T> =
  | { success: true; data: T; errorResponse: null }
  | { success: false; data: null; errorResponse: NextResponse };

export function parseRequestBody<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<ParseResult<T>> {
  return request.json().then(
    (body) => {
      const parsed = schema.safeParse(body);
      if (parsed.success) {
        return { success: true, data: parsed.data, errorResponse: null };
      }
      const firstError = parsed.error.issues[0];
      return {
        success: false,
        data: null,
        errorResponse: NextResponse.json(
          { error: firstError?.message || 'Input tidak valid' },
          { status: 400 }
        ),
      };
    },
    () => ({
      success: false,
      data: null,
      errorResponse: NextResponse.json(
        { error: 'Body request tidak valid' },
        { status: 400 }
      ),
    })
  );
}

export function parseQueryParams<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): ParseResult<T> {
  const { searchParams } = new URL(request.url);
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const parsed = schema.safeParse(params);
  if (parsed.success) {
    return { success: true, data: parsed.data, errorResponse: null };
  }
  const firstError = parsed.error.issues[0];
  return {
    success: false,
    data: null,
    errorResponse: NextResponse.json(
      { error: firstError?.message || 'Parameter query tidak valid' },
      { status: 400 }
    ),
  };
}
