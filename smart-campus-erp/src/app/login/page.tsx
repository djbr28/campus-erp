// ============================================================
// Smart Campus ERP — Login Page v3 (Supabase Auth)
//
// Flow:
//   1. User enters email + password
//   2. supabase.auth.signInWithPassword() authenticates the user
//   3. We fetch the user's profile from public.profiles to get their role
//   4. We redirect to the role-appropriate portal:
//        STUDENT  → /student
//        PARENT   → /parent
//        ADMIN    → /admin
//        SECURITY → /security
//        FACULTY  → /dashboard
//   5. If no profile or invalid role → show a clear error
// ============================================================
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";

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
    setError(null);
    setIsLoading(true);

    try {
      const supabase = getSupabaseClient();

      // ── Step 1: Sign in with Supabase Auth ──
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (!authData.user) {
        setError("Authentication succeeded but no user was returned. Please try again.");
        return;
      }

      // ── Step 2: Fetch the user's profile to get their role ──
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .single();

      if (profileError || !profile) {
        setError(
          "Your account does not have a profile. Please contact an administrator to set up your access."
        );
        return;
      }

      // ── Step 3: Redirect based on the role from the database ──
      const route = routeForRole(profile.role);

      if (!route) {
        setError(
          `Your account has an unrecognized role ("${profile.role}"). Please contact an administrator.`
        );
        return;
      }

      router.push(route);
    } catch (err) {
      // Catch unexpected errors (network, etc.)
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-24 left-16 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-16 right-16 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-14 text-white">
          <Link href="/" className="flex items-center gap-2.5 mb-14">
            <span className="text-3xl">🏫</span>
            <span className="text-xl font-bold tracking-tight">Smart Campus ERP</span>
          </Link>
          <h2 className="text-3xl font-bold leading-snug tracking-tight">
            Intelligent Campus Management
          </h2>
          <p className="mt-4 text-gray-400 leading-relaxed max-w-md">
            AI-powered safety, student management, and operations platform
            trusted by 500+ institutions worldwide.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6">
            {[
              { value: "500+", label: "Institutions" },
              { value: "2M+", label: "Students" },
              { value: "99.9%", label: "Uptime" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-10">
        <div className="w-full max-w-[400px]">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <span className="text-2xl">🏫</span>
            <span className="text-lg font-bold text-gray-900 tracking-tight">Smart Campus ERP</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Sign in</h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter your credentials to access your account
          </p>

          {/* Error message */}
          {error && (
            <div className="mt-4 p-3.5 bg-red-50 rounded-lg text-sm text-red-700 border border-red-200 flex items-start gap-2.5">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@campus.edu"
                required
                className="input"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
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
                  className="input pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    )}
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3">
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            <Link href="/" className="text-gray-500 hover:text-gray-700 font-medium transition-colors">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
