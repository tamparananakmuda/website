import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const ALLOWED_ORIGINS = [
  'https://tamparananakmuda.com',
  'https://www.tamparananakmuda.com',
  ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000', 'http://127.0.0.1:3000'] : []),
];

const CRON_PATHS = ['/api/cron/'];

function isMutatingMethod(method: string) {
  return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase());
}

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGINS.some((allowed) => origin === allowed || origin.startsWith(allowed));
}

function csrfCheck(request: NextRequest): NextResponse | null {
  if (!isMutatingMethod(request.method)) return null;

  const path = request.nextUrl.pathname;

  if (!path.startsWith('/api/')) return null;

  if (CRON_PATHS.some((c) => path.startsWith(c))) return null;

  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  const originOk = isOriginAllowed(origin);
  const refererOk = referer ? ALLOWED_ORIGINS.some((a) => referer.startsWith(a)) : false;

  if (!originOk && !refererOk) {
    return NextResponse.json(
      { error: 'Forbidden: request origin tidak diizinkan.' },
      { status: 403 }
    );
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const csrfResult = csrfCheck(request);
  if (csrfResult) return csrfResult;

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|robots.txt|sitemap.xml|rss.xml).*$).*)',
  ],
};
