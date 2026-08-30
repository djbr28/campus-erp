// ============================================================
// Smart Campus ERP — Full-Screen Login Page (Canva Editorial)
//
//   Layout: True edge-to-edge 100vh split screen
//   Left  : Full-bleed background image with text overlay
//   Right : Sign-in form panel
//   Auth  : 100% Supabase Auth & Role-Based Redirection
// ============================================================
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";
import { CampusBuildingIcon, SecurityIcon, SparklesIcon } from "@/components/ui/Icons";

/** Map a profile role to the corresponding app route. */
function routeForRole(role: string): string | null {
  switch (role.toUpperCase()) {
    case "STUDENT":
      return "/student";
    case "PARENT":
      return "/parent";
    case "ADMIN":
      return "/admin";
    case "SECURITY":
      return "/security";
    case "FACULTY":
      return "/dashboard";
    default:
      return null;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[LOGIN] Form submitted");
    setError(null);
    setIsLoading(true);

    try {
      const supabase = getSupabaseClient();
      console.log("[LOGIN] Supabase client created");

      // ── Step 1: Sign in with Supabase Auth ──
      console.log("[LOGIN] BEFORE SUPABASE LOGIN", { email });
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({ email, password });
      console.log("[LOGIN] AUTH RESULT", {
        userId: authData?.user?.id,
        userEmail: authData?.user?.email,
        authError: authError?.message ?? null,
      });

      if (authError) {
        console.error("[LOGIN] Auth failed:", authError.message);
        setError(authError.message);
        return;
      }

      if (!authData.user) {
        console.error("[LOGIN] Auth succeeded but no user returned");
        setError("Authentication succeeded but no user was returned. Please try again.");
        return;
      }

      // ── Step 2: Fetch the user's profile to get their role ──
      console.log("[LOGIN] Fetching profile for user:", authData.user.id);
      let { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .single();
      console.log("[LOGIN] PROFILE RESULT", {
        role: profile?.role ?? null,
        profileError: profileError?.message ?? null,
      });

      // If user exists in Auth (e.g. created directly in Supabase dashboard) but has no profile row yet:
      if (!profile) {
        const metadataRole = authData.user.user_metadata?.role || (email.toLowerCase().includes("admin") ? "ADMIN" : email.toLowerCase().includes("security") ? "SECURITY" : email.toLowerCase().includes("faculty") ? "FACULTY" : "STUDENT");
        const metadataName = authData.user.user_metadata?.name || email.split("@")[0];

        console.log("[LOGIN] Auto-creating missing profile row with role:", metadataRole);
        const { error: insertErr } = await supabase.from("profiles").upsert([
          {
            id: authData.user.id,
            email: authData.user.email || email,
            name: metadataName,
            role: metadataRole.toUpperCase(),
          },
        ]);

        if (!insertErr) {
          profile = { role: metadataRole.toUpperCase() };
        } else {
          console.error("[LOGIN] Could not auto-create profile:", insertErr.message);
          setError(
            "Your account does not have a profile. Please sign up via the signup page or insert a profile record in Supabase."
          );
          return;
        }
      }

      // ── Step 3: Redirect based on the role from the database ──
      const route = routeForRole(profile.role);
      console.log("[LOGIN] Role:", profile.role, "→ Route:", route);

      if (!route) {
        console.error("[LOGIN] Unrecognized role:", profile.role);
        setError(
          `Your account has an unrecognized role ("${profile.role}"). Please contact an administrator.`
        );
        return;
      }

      console.log("[LOGIN] REDIRECTING TO", route);
      router.refresh();
      window.location.href = route;
    } catch (err) {
      console.error("[LOGIN] Unexpected error:", err);
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#0e0e0e] flex flex-col lg:flex-row overflow-hidden selection:bg-[#bf783e] selection:text-white">

      {/* ─── LEFT: Full-Bleed Image with Text Overlay ─── */}
      <div className="relative w-full lg:w-[55%] h-[40vh] lg:h-full flex-shrink-0 overflow-hidden">
        {/* Background Image — fills entire left half */}
        <Image
          src="/images/login-illustration.jpg"
          alt="Smart Campus Workspace"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover"
        />

        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30 lg:bg-gradient-to-r lg:from-black/30 lg:via-black/40 lg:to-black/70" />

        {/* Content overlaid on image */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 lg:p-14 z-10 text-white">

          {/* Top: Brand */}
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-[#f4f6d6] text-[#0e0e0e] flex items-center justify-center font-bold shadow-lg group-hover:scale-105 transition-transform">
                <CampusBuildingIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white block leading-none drop-shadow-lg">
                  Smart Campus <span className="text-[#bf783e] italic">ERP</span>
                </span>
                <span className="text-[10px] text-white/70 tracking-wider uppercase font-medium block">
                  Next-Generation University Platform
                </span>
              </div>
            </Link>

            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs text-white">
              <SparklesIcon className="w-3.5 h-3.5 text-[#bf783e]" />
              <span>AI-Protected</span>
            </div>
          </div>

          {/* Center: Headline (visible on large screens) */}
          <div className="hidden lg:block max-w-lg">
            <h2 className="font-serif text-4xl xl:text-5xl font-normal text-white tracking-tight leading-[1.15] drop-shadow-xl">
              One platform, <br />
              <span className="italic text-[#bf783e]">every campus role</span>.
            </h2>
            <p className="mt-4 text-sm text-white/80 font-light leading-relaxed max-w-md drop-shadow-md">
              Empowering students, parents, faculty, administrators, and security
              officers with real-time records, automated attendance, and instant
              emergency triage.
            </p>
          </div>

          {/* Bottom: Security badge */}
          <div className="flex items-center justify-between text-[11px] text-white/70">
            <div className="flex items-center gap-2">
              <SecurityIcon className="w-3.5 h-3.5 text-[#bf783e]" />
              <span className="drop-shadow">256-bit encrypted · role-based access</span>
            </div>
            <span className="hidden sm:inline drop-shadow">FERPA & GDPR Compliant</span>
          </div>
        </div>
      </div>

      {/* ─── RIGHT: Sign-In Panel ─── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16 bg-[#0e0e0e] overflow-y-auto">
        <div className="w-full max-w-md space-y-7">

          {/* Header */}
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#bf783e] font-bold block mb-2">
              Institutional Access
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#f4f6d6] tracking-tight">
              Sign In
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-white/50 font-light">
              Enter your verified email and password to access your role-based dashboard.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-950/70 border border-red-500/50 rounded-2xl text-xs text-red-200 flex items-start gap-3 animate-fade-in shadow-lg">
              <svg className="w-4 h-4 mt-0.5 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold text-white/70 tracking-wide">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@campus.edu"
                required
                autoComplete="email"
                className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-sm text-[#f4f6d6] placeholder:text-white/25 focus:border-[#bf783e] focus:outline-hidden transition-colors"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-semibold text-white/70 tracking-wide">
                  Password
                </label>
                <a href="#" className="text-xs text-[#bf783e] hover:underline font-medium">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full bg-transparent border-b border-white/20 px-0 py-3 pr-10 text-sm text-[#f4f6d6] placeholder:text-white/25 focus:border-[#bf783e] focus:outline-hidden transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#f4f6d6] p-1.5 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-[#f4f6d6] text-[#0e0e0e] font-bold text-sm hover:bg-white shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-[#0e0e0e]" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Verifying Credentials…</span>
                </span>
              ) : (
                <>
                  <span>Sign In</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="pt-5 border-t border-white/10 flex items-center justify-center text-xs text-white/40">
            <Link href="/" className="text-[#f4f6d6] font-semibold hover:underline">
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
