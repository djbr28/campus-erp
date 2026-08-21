// ============================================================
// Smart Campus ERP — Browser Supabase Client (Cookie-Based)
//
// Uses @supabase/ssr's createBrowserClient so that auth
// tokens are stored in cookies — the same format the
// middleware reads via createServerClient.
//
// Previously used @supabase/supabase-js's createClient()
// which stores tokens in localStorage by default. The
// middleware couldn't see those tokens, so sessions appeared
// unauthenticated on every server-side navigation.
// ============================================================

import { createBrowserClient } from "@supabase/ssr";

/**
 * Returns a Supabase browser client backed by cookies.
 *
 * - Safe to import in any Client Component ("use client").
 * - Auth tokens are written to cookies (not localStorage).
 * - Cookies match the format @supabase/ssr reads in middleware.
 * - Throws a clear error if environment variables are missing at runtime.
 * - Reads process.env at call time (not at import time).
 */
export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase environment variables. " +
        "Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY " +
        "are set in .env.local"
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
