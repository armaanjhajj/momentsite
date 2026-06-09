import { cookies } from "next/headers";

// Shared-password admin gate.
//
// Flow: POST /api/admin/login with the password -> if it matches
// ADMIN_PASSWORD, we set an httpOnly cookie whose value is ADMIN_SESSION_SECRET
// (a long, random, secret string). Every protected page/route then checks the
// cookie value against ADMIN_SESSION_SECRET. Because the secret is only ever
// handed out after a correct password, holding the cookie proves the user
// logged in. httpOnly keeps it out of reach of page JavaScript.
//
// Required env vars:
//   ADMIN_PASSWORD        - the password you type to log in
//   ADMIN_SESSION_SECRET  - a long random string (e.g. `openssl rand -hex 32`)

export const ADMIN_COOKIE = "moments_admin";

// 30 days, in seconds.
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "Missing/short ADMIN_SESSION_SECRET — set a long random string in env"
    );
  }
  return secret;
}

// Constant-time-ish string compare. The secret is high-entropy so a timing
// attack is not a realistic threat, but we avoid early-exit anyway.
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

// Validate a submitted password against ADMIN_PASSWORD.
export function isPasswordValid(submitted: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error("Missing ADMIN_PASSWORD — set it in env to enable /admin");
  }
  return safeEqual(submitted, expected);
}

// The value to store in the auth cookie once logged in.
export function sessionCookieValue(): string {
  return getSessionSecret();
}

// Read the request cookies (server components / route handlers) and report
// whether the caller is an authenticated admin.
export async function isAdminAuthed(): Promise<boolean> {
  const store = await cookies();
  const value = store.get(ADMIN_COOKIE)?.value;
  if (!value) return false;
  return safeEqual(value, getSessionSecret());
}
