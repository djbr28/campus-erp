// ============================================================
// Smart Campus ERP — Login Page
// ============================================================
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const roleOptions = [
  { value: "admin", label: "Administrator" },
  { value: "faculty", label: "Faculty" },
  { value: "student", label: "Student" },
  { value: "parent", label: "Parent" },
  { value: "security", label: "Security" },
] as const;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock login — just redirect to dashboard after a short delay
    await new Promise((r) => setTimeout(r, 800));
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* ─── Left panel — branding ─── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <span className="text-4xl">🏫</span>
            <span className="text-2xl font-bold">Smart Campus ERP</span>
          </Link>
          <h2 className="text-4xl font-bold leading-tight">
            Empowering Campuses with{" "}
            <span className="text-blue-200">Intelligent</span> Management
          </h2>
          <p className="mt-6 text-lg text-blue-100 leading-relaxed max-w-lg">
            AI-powered campus safety, student management, and operations platform
            trusted by 500+ institutions worldwide.
          </p>
          <div className="mt-12 flex gap-8">
            <div>
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm text-blue-200">Institutions</div>
            </div>
            <div>
              <div className="text-3xl font-bold">2M+</div>
              <div className="text-sm text-blue-200">Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold">99.9%</div>
              <div className="text-sm text-blue-200">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Right panel — form ─── */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 bg-gray-50">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <span className="text-2xl">🏫</span>
            <span className="text-xl font-bold gradient-text">Smart Campus ERP</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Login as
              </label>
              <div className="grid grid-cols-5 gap-1 p-1 bg-gray-100 rounded-xl">
                {roleOptions.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`py-2 text-xs font-medium rounded-lg transition-all ${
                      role === r.value
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="#" className="text-xs text-blue-600 hover:text-blue-700">
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl text-sm text-blue-700">
            <strong>Demo mode:</strong> Click &quot;Sign In&quot; with any input to explore the dashboard.
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
