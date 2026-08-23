// ============================================================
// Smart Campus ERP — Server-Side Auth Sign-Out API Route
// ============================================================
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  const response = NextResponse.json({ success: true, message: "Signed out successfully" });

  if (supabaseUrl && supabaseKey) {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("[SignOut API] Error during Supabase signOut:", err);
    }
  }

  // Explicitly delete any sb- cookie
  const allCookies = cookieStore.getAll();
  for (const c of allCookies) {
    if (c.name.startsWith("sb-") || c.name.includes("auth-token") || c.name.includes("supabase")) {
      response.cookies.set(c.name, "", { maxAge: 0, path: "/" });
      response.cookies.delete(c.name);
    }
  }

  return response;
}
