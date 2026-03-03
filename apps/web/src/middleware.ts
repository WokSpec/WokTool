import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGINS = new Set([
  'https://tools.wokspec.org',
  'http://localhost:3000',
  'http://localhost:3001',
]);

// Reject API request bodies larger than 512 KB
const MAX_BODY_BYTES = 512 * 1024;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith('/api/')) return NextResponse.next();

  const origin = req.headers.get('origin') ?? '';
  const isAllowedOrigin = ALLOWED_ORIGINS.has(origin) || origin === '';

  // Block cross-origin requests from untrusted origins
  if (origin && !isAllowedOrigin) {
    return new NextResponse(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Reject oversized request bodies early (Content-Length header check)
  const contentLength = Number(req.headers.get('content-length') ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return new NextResponse(JSON.stringify({ error: 'Request body too large.' }), {
      status: 413,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const res = NextResponse.next();

  // Add CORS headers to all API responses
  if (isAllowedOrigin && origin) {
    res.headers.set('Access-Control-Allow-Origin', origin);
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    res.headers.set('Vary', 'Origin');
  }

  // Harden API responses
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Cache-Control', 'no-store');

  return res;
}

// Handle OPTIONS preflight
export async function handleOptions(req: NextRequest) {
  const origin = req.headers.get('origin') ?? '';
  if (!ALLOWED_ORIGINS.has(origin)) {
    return new NextResponse(null, { status: 204 });
  }
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export const config = {
  matcher: '/api/:path*',
};
