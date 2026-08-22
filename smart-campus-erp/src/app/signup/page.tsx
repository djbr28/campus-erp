// ============================================================
// Smart Campus ERP — Signup Page (Canva Editorial Aesthetic)
//
//   Layout: Mirror of login — full-screen split
//   Left  : Full-bleed background image with branding overlay
//   Right : Sign-up form panel
//   Auth  : Supabase Auth signUp + profile + role-table insert
// ============================================================
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";
import { CampusBuildingIcon, SecurityIcon, SparklesIcon } from "@/components/ui/Icons";

type AllowedRole = "STUDENT" | "PARENT" | "FACULTY";

const roles: { value: AllowedRole; label: string; icon: string; desc: string }[] = [
  { value: "STUDENT", label: "Student", icon: "🎓", desc: "Access courses, attendance & grades" },
  { value: "PARENT", label: "Parent", icon: "👨‍👩‍👧", desc: "Monitor child's academic progress" },
  { value: "FACULTY", label: "Faculty", icon: "👨‍🏫", desc: "Manage classes & campus reports" },
];

/** Map a role to the app route after signup. */
function routeForRole(role: string): string | null {
  switch (role.toUpperCase()) {
    case "STUDENT":
      return "/student";
    case "PARENT":
      return "/parent";
    case "FACULTY":
      return "/dashboard";
    default:
      return null;
  }
}

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<AllowedRole>("STUDENT");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = getSupabaseClient();

      // ── Step 1: Create user in Supabase Auth ──
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role },
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (!authData.user) {
        setError("Signup succeeded but no user was returned. Please try again.");
        return;
      }

      const userId = authData.user.id;

      // ── Step 2: Upsert profile into profiles table ──
      // Uses upsert because a Supabase trigger may auto-create the profile
      // on auth signup. Upsert handles both cases gracefully.
      // If profile already exists with different data, we update it.
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .single();

      if (existingProfile) {
        // Profile already exists (likely from a trigger or previous attempt)
        // Update it with the latest data
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ role, name, email })
          .eq("id", userId);

        if (updateError) {
          console.error("[SIGNUP] Profile update error:", updateError.message);
          // Non-fatal: profile exists, user can still login
        }
      } else {
        // Profile doesn't exist, insert it
        const { error: insertError } = await supabase
          .from("profiles")
          .insert([{ id: userId, role, name, email }]);

        if (insertError) {
          console.error("[SIGNUP] Profile insert error:", insertError.message);
          setError(
            `Account created but profile setup failed: ${insertError.message}. Please contact support.`
          );
          return;
        }
      }

      // ── Step 3: Upsert into role-specific table ──
      // Check if row already exists before inserting to avoid duplicate key errors.
      if (role === "STUDENT") {
        const { data: existing } = await supabase
          .from("students")
          .select("id")
          .eq("id", userId)
          .single();

        if (!existing) {
          const { error: studentError } = await supabase
            .from("students")
            .insert([
              {
                id: userId,
                name,
                email,
                program: "Undeclared",
                year: 1,
                gpa: "0.0",
                status: "Active",
                attendancePct: 0,
              },
            ]);

          if (studentError) {
            console.warn("[SIGNUP] Student insert error (non-fatal):", studentError.message);
          }
        }
      } else if (role === "PARENT") {
        const { data: existing } = await supabase
          .from("parents")
          .select("id")
          .eq("id", userId)
          .single();

        if (!existing) {
          const { error: parentError } = await supabase
            .from("parents")
            .insert([
              {
                id: userId,
                name,
                email,
                childName: "",
                childId: "",
              },
            ]);

          if (parentError) {
            console.warn("[SIGNUP] Parent insert error (non-fatal):", parentError.message);
          }
        }
      } else if (role === "FACULTY") {
        const { data: existing } = await supabase
          .from("faculty")
          .select("id")
          .eq("id", userId)
          .single();

        if (!existing) {
          const { error: facultyError } = await supabase
            .from("faculty")
            .insert([
              {
                id: userId,
                name,
                email,
                department: "General",
              },
            ]);

          if (facultyError) {
            console.warn("[SIGNUP] Faculty insert error (non-fatal):", facultyError.message);
          }
        }
      }

      // ── Step 4: Redirect to role dashboard ──
      const route = routeForRole(role);
      if (route) {
        router.refresh();
        window.location.href = route;
      }
    } catch (err) {
      console.error("[SIGNUP] Unexpected error:", err);
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
        <Image
          src="/images/login-illustration.jpg"
          alt="Smart Campus Workspace"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover"
        />

        {/* Dark gradient overlay */}
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

          {/* Center: Headline */}
          <div className="hidden lg:block max-w-lg">
            <h2 className="font-serif text-4xl xl:text-5xl font-normal text-white tracking-tight leading-[1.15] drop-shadow-xl">
              Join the campus.<br />
              <span className="italic text-[#bf783e]">Start learning today</span>.
            </h2>
            <p className="mt-4 text-sm text-white/80 font-light leading-relaxed max-w-md drop-shadow-md">
              Create your Smart Campus account and get instant access to
              attendance tracking, fee management, campus safety tools, and more.
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

      {/* ─── RIGHT: Sign-Up Panel ─── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16 bg-[#0e0e0e] overflow-y-auto">
        <div className="w-full max-w-md space-y-7">

          {/* Header */}
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#bf783e] font-bold block mb-2">
              Create Account
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#f4f6d6] tracking-tight">
              Sign Up
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-white/50 font-light">
              Select your role and complete your details to get started.
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

            {/* Role Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-white/70 tracking-wide">
                I am a…
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`p-3.5 rounded-2xl border text-center transition-all duration-150 ${
                      role === r.value
                        ? "border-[#bf783e] bg-[#bf783e]/15 shadow-sm"
                        : "border-white/15 bg-white/5 hover:border-white/25"
                    }`}
                  >
                    <span className="text-xl block mb-1">{r.icon}</span>
                    <span
                      className={`font-bold text-xs block ${
                        role === r.value ? "text-[#f4f6d6]" : "text-white/70"
                      }`}
                    >
                      {r.label}
                    </span>
                    <span className="text-[10px] text-white/40 block mt-0.5 font-light leading-tight">
                      {r.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-xs font-semibold text-white/70 tracking-wide">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Johnson"
                required
                autoComplete="name"
                className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-sm text-[#f4f6d6] placeholder:text-white/25 focus:border-[#bf783e] focus:outline-hidden transition-colors"
              />
            </div>

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
              <label htmlFor="password" className="block text-xs font-semibold text-white/70 tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                  autoComplete="new-password"
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
              <p className="text-[11px] text-white/30 font-light">
                Must be at least 6 characters long.
              </p>
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
                  <span>Creating Account…</span>
                </span>
              ) : (
                <>
                  <span>Create Account</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-3">
            <Link href="/" className="text-[#f4f6d6] font-semibold hover:underline">
              ← Back to Homepage
            </Link>
            <span>
              Already have an account?{" "}
              <Link href="/login" className="text-[#bf783e] font-semibold hover:underline">
                Sign In
              </Link>
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
