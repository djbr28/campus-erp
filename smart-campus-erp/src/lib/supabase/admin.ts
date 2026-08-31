import { createClient } from "@supabase/supabase-js";

/**
 * Returns a Supabase client with the Service Role Key.
 * 
 * WARNING: This client bypasses Row Level Security (RLS).
 * It should ONLY be used in server-side API routes or Server Actions,
 * NEVER on the client-side.
 */
export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase environment variables for Admin Client. " +
      "Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY " +
      "are set in .env.local"
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
