// ============================================================
// Smart Campus ERP — Middleware (Route Protection)
//
// Runs on every matched request. Verifies Supabase session,
// fetches the user's role from profiles, and blocks access
// to unauthorized dashboards.
// ============================================================

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// ── Route → allowed roles mapping ──────────────────────────
const protectedRoutes: Record<string, string[]> = {
  "/student": ["STUDENT"],
  "/parent": ["PARENT"],
  "/admin": ["ADMIN"],
  "/security": ["SECURITY"],
  "/dashboard": ["FACULTY"],
};

const roleHomeRoute: Record<string, string> = {
  STUDENT: "/student",
  PARENT: "/parent",
  ADMIN: "/admin",
  SECURITY: "/security",
  FACULTY: "/dashboard",
};

/**
 * Check whether the pathname falls under a protected route prefix.
 * Returns the allowed roles, or null if the route is unprotected.
 */
function getAllowedRoles(pathname: string): string[] | null {
  for (const [route, roles] of Object.entries(protectedRoutes)) {
    if (pathname === route || pathname.startsWith(route + "/")) {
      return roles;
    }
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Skip static assets ──────────────────────────────────
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.match(/\.\w+$/) // files with extensions
  ) {
    return NextResponse.next();
  }

  console.log("[MIDDLEWARE]", pathname);

  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // ── Guard: allow through if env vars missing (dev mode) ─
  if (!supabaseUrl || !supabaseKey) {
    console.log("[MIDDLEWARE] Env vars missing, passing through");
    return NextResponse.next();
  }

  // ── Create Supabase server client with cookie handling ──
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // Set cookies on the request (for downstream use)
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        // Set cookies on the response (for the browser)
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  // ── Verify session ──────────────────────────────────────
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("[MIDDLEWARE] User:", user ? `${user.id} (${user.email})` : "none");

  // ── Public routes: landing page always allowed ──────────
  if (pathname === "/") {
    return supabaseResponse;
  }

  // ── Login / Signup: redirect to portal if already auth'd ──
  if (pathname === "/login" || pathname === "/signup") {
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      console.log("[MIDDLEWARE] /login已有session, role:", profile?.role);

      if (profile?.role && roleHomeRoute[profile.role]) {
        const url = request.nextUrl.clone();
        url.pathname = roleHomeRoute[profile.role];
        console.log("[MIDDLEWARE] Redirecting logged-in user to", roleHomeRoute[profile.role]);
        return NextResponse.redirect(url);
      }
    }
    console.log("[MIDDLEWARE]", pathname, "passing through (no session)");
    return supabaseResponse;
  }

  // ── Protected routes ────────────────────────────────────
  const allowedRoles = getAllowedRoles(pathname);

  if (allowedRoles) {
    // Not authenticated → send to login
    if (!user) {
      console.log("[MIDDLEWARE] No session on protected route", pathname, "→ /login");
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // Fetch role from profiles
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    console.log("[MIDDLEWARE]", pathname, "→ user role:", profile?.role, "| allowed:", allowedRoles);

    // No profile or wrong role → redirect to their own portal
    if (!profile || !allowedRoles.includes(profile.role)) {
      const correctRoute = profile?.role
        ? roleHomeRoute[profile.role] || "/login"
        : "/login";
      console.log("[MIDDLEWARE] Wrong role, redirecting to", correctRoute);
      const url = request.nextUrl.clone();
      url.pathname = correctRoute;
      return NextResponse.redirect(url);
    }
    console.log("[MIDDLEWARE] Access granted to", pathname);
  }

  return supabaseResponse;
}

// ── Matcher: run on everything except static files ─────────
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
