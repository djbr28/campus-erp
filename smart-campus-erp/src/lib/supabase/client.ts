// ============================================================
// Smart Campus ERP — Browser Supabase Client
//
// Simple, reliable client-side Supabase client.
// Uses only the publishable (anon) key — never a service-role key.
// ============================================================

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

/**
 * Returns the Supabase browser client (singleton).
 *
 * - Safe to import in any Client Component ("use client").
 * - Uses only the publishable (anon) key — never a service-role key.
 * - Throws a clear error if environment variables are missing at runtime.
 * - Reads process.env at call time (not at import time) so that
 *   NEXT_PUBLIC_* values are available even when .env.local had
 *   placeholders at build time.
 */
export function getSupabaseClient(): SupabaseClient {
  if (_client) return _client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase environment variables. " +
        "Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY " +
        "are set in .env.local"
    );
  }

  _client = createClient(supabaseUrl, supabaseKey);
  return _client;
}
