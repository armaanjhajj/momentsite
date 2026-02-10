import { NextResponse, type NextRequest } from 'next/server';

const COOKIE_NAME = 'moments_portal_ok';
const COOKIE_PATH = '/portal';

async function sha256Hex(input: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(digest);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const code = (formData.get('code') ?? '').toString();

  const secret = process.env.PORTAL_ACCESS_CODE || '';
  if (!secret) {
    const url = new URL('/portal/access?error=missing', request.url);
    return NextResponse.redirect(url, 303);
  }

  if (code !== secret) {
    const url = new URL('/portal/access?error=invalid', request.url);
    return NextResponse.redirect(url, 303);
  }

  const signature = await sha256Hex(secret);
  const res = NextResponse.redirect(new URL('/portal', request.url), 303);
  // 30 days
  const maxAge = 60 * 60 * 24 * 30;
  res.cookies.set({
    name: COOKIE_NAME,
    value: signature,
    path: COOKIE_PATH,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
  });
  return res;
}


