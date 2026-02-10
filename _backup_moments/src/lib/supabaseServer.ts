import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client for API routes.
// In production (Vercel), set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
// in the dashboard. During local build or in environments where these aren't present,
// we avoid throwing so the build can still succeed.
const supabaseUrlEnv = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKeyEnv = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrlEnv || !supabaseAnonKeyEnv) {
  // This will show up in the build logs but won't crash the build.
  console.warn(
    "Supabase env vars (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY) are missing. " +
      "API routes that depend on Supabase will return empty data until these are configured."
  );
}

// Fall back to empty strings; API routes check for missing envs and short‑circuit safely.
const supabaseUrl = supabaseUrlEnv ?? "";
const supabaseAnonKey = supabaseAnonKeyEnv ?? "";

export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  db: { schema: "public" },
});

