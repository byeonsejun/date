import { NextResponse } from 'next/server';

/** Expo web / local dev: browser requires CORS. Native apps do not send Origin the same way. */
function corsHeaders(request) {
  const origin = request.headers.get('origin');
  let allowOrigin = '*';
  if (origin) {
    try {
      const { hostname } = new URL(origin);
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        allowOrigin = origin;
      }
    } catch {
      /* ignore */
    }
  }
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

export function middleware(request) {
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: corsHeaders(request) });
  }

  const res = NextResponse.next();
  const h = corsHeaders(request);
  Object.entries(h).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}

export const config = {
  matcher: '/api/:path*',
};
