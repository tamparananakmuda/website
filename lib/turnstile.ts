import { NextRequest } from 'next/server';

export async function verifyTurnstileToken(
  token: string | undefined,
  request?: NextRequest
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;

  if (!token) return false;

  try {
    const body = new URLSearchParams();
    body.append('secret', secret);
    body.append('response', token);

    if (request) {
      const forwarded = request.headers.get('x-forwarded-for');
      const realIp = request.headers.get('x-real-ip');
      const ip = forwarded?.split(',')[0]?.trim() || realIp;
      if (ip) body.append('remoteip', ip);
    }

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    });

    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}
