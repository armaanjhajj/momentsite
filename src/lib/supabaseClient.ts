"use client";
import { createClient } from "@supabase/supabase-js";

// Fallback values to prevent runtime crashes if envs aren't loaded yet.
// Move these to .env.local as NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.
const FALLBACK_URL = "https://cuqhhhyfyqerhhbpeoeq.supabase.co";
const FALLBACK_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1cWhoaHlmeXFlcmhoYnBlb2VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MDUyNDIsImV4cCI6MjA3MjM4MTI0Mn0.EisVmzpbpwaiE5wPYs4rUkAf7D-JoeMvtxOSwea3_ec";

const supabaseUrl =
  (process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined) ||
  (process.env.EXPO_PUBLIC_SUPABASE_URL as string | undefined) ||
  FALLBACK_URL;

const supabaseAnonKey =
  (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined) ||
  (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string | undefined) ||
  FALLBACK_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase env vars are missing. Set NEXT_PUBLIC_SUPABASE_URL/ANON_KEY or EXPO_PUBLIC_*.");
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "", {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  db: { schema: "public" },
});


