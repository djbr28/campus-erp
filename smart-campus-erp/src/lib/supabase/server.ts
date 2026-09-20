// ============================================================
// Smart Campus ERP — Server Supabase Client (Cookie-Based)
//
// Uses @supabase/ssr's createServerClient bound to the request
// cookies, so Route Handlers and Server Components act AS THE
// SIGNED-IN USER. Row Level Security still applies.
//
// This is deliberately NOT the service-role client. For
// privileged operations that must bypass RLS (e.g. Admin Auth
// user creation) use getSupabaseAdmin() from ./admin, and only
// after verifying the caller's role with requireRole() below.
// ============================================================

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Returns a Supabase client bound to the current request's cookies.
 * Safe to use in Route Handlers and Server Components.
 */
export async function getSupabaseServer() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase environment variables. " +
        "Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY " +
        "are set in .env.local"
    );
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component — safe to ignore, the
          // middleware refreshes the session cookies instead.
        }
      },
    },
  });
}

/** The shape requireRole() hands back on success. */
export interface AuthedProfile {
  id: string;
  role: string;
  name: string;
  email: string;
  department: string | null;
}

export type RoleCheck =
  | { ok: true; profile: AuthedProfile }
  | { ok: false; status: number; error: string };

/**
 * Verifies that the request comes from an authenticated user whose
 * profiles.role is one of `allowedRoles`.
 *
 * Returns a discriminated union so callers can return an accurate
 * 401 / 403 / 500 response.
 */
export async function requireRole(allowedRoles: string[]): Promise<RoleCheck> {
  const supabase = await getSupabaseServer();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false, status: 401, error: "You must be signed in to perform this action." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role, name, email, department")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return {
      ok: false,
      status: 500,
      error: `Could not verify your account role: ${profileError.message}`,
    };
  }

  if (!profile) {
    return {
      ok: false,
      status: 403,
      error: "Your account has no profile record. Contact an administrator.",
    };
  }

  const role = String(profile.role || "").toUpperCase();

  if (!allowedRoles.includes(role)) {
    return {
      ok: false,
      status: 403,
      error: `Your role (${role}) is not permitted to perform this action.`,
    };
  }

  return {
    ok: true,
    profile: {
      id: profile.id,
      role,
      name: profile.name,
      email: profile.email,
      department: profile.department ?? null,
    },
  };
}
