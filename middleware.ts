import { NextResponse, type NextRequest } from 'next/server';

// Cookie and path settings
const COOKIE_NAME = 'moments_portal_ok';
const PORTAL_BASE_PATH = '/team';
const ACCESS_PATH = '/team/access';

async function sha256Hex(input: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(digest);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the access page and its subpaths without a cookie
  if (pathname === ACCESS_PATH || pathname.startsWith('/team/access/')) {
    return NextResponse.next();
  }

  // Only guard under /portal (matcher limits this, but keep as a safeguard)
  if (!pathname.startsWith(PORTAL_BASE_PATH)) {
    return NextResponse.next();
  }

  const secret = process.env.PORTAL_ACCESS_CODE || '';
  if (!secret) {
    // If secret is not configured, fail closed by redirecting to access page
    const url = request.nextUrl.clone();
    url.pathname = ACCESS_PATH;
    return NextResponse.redirect(url);
  }

  const expected = await sha256Hex(secret);
  const cookie = request.cookies.get(COOKIE_NAME)?.value;

  if (cookie === expected) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = ACCESS_PATH;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/portal/:path*'],
};


