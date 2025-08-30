import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self';",
      "script-src 'self';",
      "style-src 'self';",
      "img-src 'self' data:;",
      "font-src 'self';",
      "connect-src 'self';",
      "object-src 'none';",
      "base-uri 'self';",
      "form-action 'self';"
    ].join(' ')
  );
  // その他セキュリティヘッダー
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=()');

  return response;
}

export const config = {
  matcher: '/:path*',
};
