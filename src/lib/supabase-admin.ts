import { createClient } from "@supabase/supabase-js";

// Server-only Supabase client using the service-role key.
// This BYPASSES Row Level Security, so it must NEVER be imported into a
// client component. It is used only by the gated /admin pages and the
// /api/admin/* route handlers to read waitlist + inquiries data that the
// public anon key is blocked from reading.
//
// Required env vars (server-side, NOT prefixed with NEXT_PUBLIC_):
//   SUPABASE_SERVICE_ROLE_KEY
// Reuses the already-present NEXT_PUBLIC_SUPABASE_URL for the project URL.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
}
if (!serviceRoleKey) {
  throw new Error(
    "Missing SUPABASE_SERVICE_ROLE_KEY — add it to .env.local and Vercel env"
  );
}

export const supabaseAdmin = createClient(url, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
