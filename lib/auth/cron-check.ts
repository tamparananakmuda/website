import { NextRequest, NextResponse } from 'next/server';

type CronAuthSuccess = { isAuthorized: true; response: null };
type CronAuthFailure = { isAuthorized: false; response: NextResponse };
type CronAuthResult = CronAuthSuccess | CronAuthFailure;

/**
 * Validasi otentikasi API Cron / Secret secara aman dan terpusat.
 * Mendukung header `Authorization: Bearer <CRON_SECRET>` dan `x-cron-secret`.
 * Toleran terhadap whitespace, quote, serta penanganan jika CRON_SECRET belum diset.
 */
export function checkCronAuth(request: NextRequest): CronAuthResult {
  const cronSecret = process.env.CRON_SECRET?.trim().replace(/^['"]|['"]$/g, '');

  if (!cronSecret) {
    console.error('[auth] CRON_SECRET belum terkonfigurasi di environment variables.');
    return {
      isAuthorized: false,
      response: NextResponse.json(
        { error: 'Server authentication configuration missing' },
        { status: 500 }
      ),
    };
  }

  const authHeader = request.headers.get('authorization')?.trim() ?? '';
  const xCronHeader = request.headers.get('x-cron-secret')?.trim() ?? '';

  // Dukung Bearer token atau header x-cron-secret
  const tokenFromBearer = authHeader.startsWith('Bearer ')
    ? authHeader.substring(7).trim()
    : '';

  const providedSecret = tokenFromBearer || xCronHeader || (authHeader.startsWith('Bearer') ? '' : authHeader);

  if (providedSecret && providedSecret === cronSecret) {
    return { isAuthorized: true, response: null };
  }

  return {
    isAuthorized: false,
    response: NextResponse.json(
      { error: 'Unauthorized API access' },
      { status: 401 }
    ),
  };
}
