// ============================================================
// Smart Campus ERP — Comprehensive Multi-Role Signup Page
// ============================================================
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";
import { CampusBuildingIcon, SecurityIcon, SparklesIcon } from "@/components/ui/Icons";

type AllowedRole = "STUDENT" | "FACULTY" | "PARENT" | "SECURITY" | "ADMIN";

const roleOptions: { value: AllowedRole; label: string; icon: string; desc: string }[] = [
  { value: "STUDENT", label: "Student", icon: "🎓", desc: "Courses, grades & attendance" },
  { value: "FACULTY", label: "Faculty", icon: "👨‍🏫", desc: "Lecture rosters & marking" },
  { value: "PARENT", label: "Parent", icon: "👨‍👩‍👧", desc: "Child progress & alerts" },
  { value: "SECURITY", label: "Security", icon: "🛡️", desc: "Campus safety & dispatch" },
  { value: "ADMIN", label: "Admin", icon: "🏛️", desc: "Institutional oversight" },
];

const departments = [
  "Computer Science",
  "Data Science & AI",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Business Administration",
  "Mathematics",
  "Civil Engineering",
  "Biomedical Engineering",
];

const programs = [
  "B.Tech Computer Science",
  "B.Tech AI & Data Science",
  "B.Tech Electrical Eng.",
  "B.Tech Mechanical Eng.",
  "BBA Management",
  "M.Sc Cybersecurity",
  "M.Tech Software Systems",
  "MBA Institutional Leadership",
];

const designations = [
  "Department Chair & Professor",
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Senior Lecturer",
  "Research Fellow",
];

function routeForRole(role: string): string {
  switch (role.toUpperCase()) {
    case "STUDENT":
      return "/student";
    case "PARENT":
      return "/parent";
    case "FACULTY":
      return "/dashboard";
    case "SECURITY":
      return "/security";
    case "ADMIN":
      return "/admin";
    default:
      return "/";
  }
}

export default function SignupPage() {
  const router = useRouter();

  // Role selector
  const [role, setRole] = useState<AllowedRole>("STUDENT");

  // Common fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");

  // Student specific
  const [registerNumber, setRegisterNumber] = useState("");
  const [department, setDepartment] = useState("Computer Science");
  const [program, setProgram] = useState("B.Tech Computer Science");
  const [year, setYear] = useState(1);
  const [semester, setSemester] = useState(1);

  // Faculty specific
  const [designation, setDesignation] = useState("Associate Professor");

  // Parent specific
  const [childName, setChildName] = useState("");
  const [childId, setChildId] = useState("");

  // Security & Admin specific
  const [badgeId, setBadgeId] = useState("");
  const [officeName, setOfficeName] = useState("");

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = getSupabaseClient();

      const regNum = registerNumber.trim() || `REG2026CS${Math.floor(100 + Math.random() * 900)}`;

      // ── Step 1: Create user in Supabase Auth ──
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            department: role === "STUDENT" || role === "FACULTY" ? department : role === "SECURITY" ? "Campus Security" : officeName || "Administration",
            phone,
            register_number: regNum,
            program,
            year: Number(year),
            semester: Number(semester),
            designation,
            childName,
            childId,
            badgeId,
          },
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
      const userDept = role === "STUDENT" || role === "FACULTY" ? department : role === "SECURITY" ? "Campus Security" : officeName || "Administration";

      // ── Step 2: Upsert profile into profiles table ──
      const { error: profileError } = await supabase.from("profiles").upsert([
        {
          id: userId,
          name,
          email,
          role,
          department: userDept,
        },
      ]);

      if (profileError) {
        console.warn("[SIGNUP] Profile upsert warning:", profileError.message);
      }

      // ── Step 3: Upsert into role-specific tables ──
      if (role === "STUDENT") {
        const { error: studentErr } = await supabase.from("students").upsert([
          {
            id: userId,
            profile_id: userId,
            register_number: regNum,
            name,
            email,
            department,
            program,
            year: Number(year),
            semester: Number(semester),
            phone: phone || "+1 (555) 019-2834",
            gpa: 3.85,
            status: "Active",
            attendance_pct: 92.5,
          },
        ]);

        if (studentErr) {
          console.warn("[SIGNUP] Student table insert warning:", studentErr.message);
        }

        // Seed initial fee records for this newly registered student
        try {
          await supabase.from("fees").upsert([
            {
              id: `FEE-${userId.slice(0, 6)}-01`,
              student_id: userId,
              label: `Tuition Fee — Semester ${semester} (2026)`,
              total_amount: 8500.0,
              paid_amount: 8500.0,
              status: "Paid",
              due_date: "2026-08-01",
              payment_date: "2026-08-01",
            },
            {
              id: `FEE-${userId.slice(0, 6)}-02`,
              student_id: userId,
              label: "Laboratory & Technology Access Fee",
              total_amount: 800.0,
              paid_amount: 800.0,
              status: "Paid",
              due_date: "2026-08-15",
              payment_date: "2026-08-15",
            },
            {
              id: `FEE-${userId.slice(0, 6)}-03`,
              student_id: userId,
              label: "Campus Student Activities & Sports",
              total_amount: 400.0,
              paid_amount: 0.0,
              status: "Pending",
              due_date: "2026-09-15",
            },
          ]);

          // Seed attendance records
          await supabase.from("attendance_records").insert([
            { student_id: userId, subject: "Data Structures & Algorithms", code: "CS-301", total: 30, present: 28, absent: 2, percentage: 93.33, status: "Present" },
            { student_id: userId, subject: "Advanced Operating Systems", code: "CS-302", total: 28, present: 26, absent: 2, percentage: 92.86, status: "Present" },
            { student_id: userId, subject: "Database Management Systems", code: "CS-304", total: 32, present: 30, absent: 2, percentage: 93.75, status: "Present" },
          ]);
        } catch (seedErr) {
          console.warn("[SIGNUP] Seeding initial student records skipped:", seedErr);
        }
      } else if (role === "FACULTY") {
        await supabase.from("faculty").upsert([
          {
            id: userId,
            profile_id: userId,
            name,
            email,
            department,
            designation,
            phone: phone || "+1 (555) 876-5432",
          },
        ]);
      } else if (role === "PARENT") {
        let matchedStudentId = childId.trim();
        let matchedStudentName = childName.trim();

        if (childId || childName) {
          try {
            const { data: matchedStudent } = await supabase
              .from("students")
              .select("id, name, register_number")
              .or(`id.eq.${childId || "none"},register_number.eq.${childId || "none"},name.ilike.%${childName || "none"}%`)
              .limit(1)
              .maybeSingle();

            if (matchedStudent) {
              matchedStudentId = matchedStudent.register_number || matchedStudent.id;
              matchedStudentName = matchedStudent.name;

              // Link parent to the student record
              await supabase.from("students").update({ parent_id: userId }).eq("id", matchedStudent.id);
            }
          } catch (linkErr) {
            console.warn("[SIGNUP] Parent student link lookup warning:", linkErr);
          }
        }

        await supabase.from("parents").upsert([
          {
            id: userId,
            profile_id: userId,
            name,
            email,
            phone: phone || "+1 (555) 234-5678",
            child_name: matchedStudentName || childName || "Student",
            child_id: matchedStudentId || childId || "REG2024CS001",
          },
        ]);
      }

      // ── Step 4: Hard redirect to role dashboard ──
      const route = routeForRole(role);
      router.refresh();
      window.location.href = route;
    } catch (err) {
      console.error("[SIGNUP] Unexpected error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#0e0e0e] flex flex-col lg:flex-row overflow-hidden selection:bg-[#bf783e] selection:text-white">
      {/* ─── LEFT: Branding Panel ─── */}
      <div className="relative w-full lg:w-[45%] h-[30vh] lg:h-full flex-shrink-0 overflow-hidden">
        <Image
          src="/images/login-illustration.jpg"
          alt="Smart Campus Workspace"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 45vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 lg:bg-gradient-to-r lg:from-black/40 lg:via-black/50 lg:to-black/80" />

        <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 z-10 text-white">
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
                  University Onboarding Portal
                </span>
              </div>
            </Link>

            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs text-white">
              <SparklesIcon className="w-3.5 h-3.5 text-[#bf783e]" />
              <span>Institutional Identity</span>
            </div>
          </div>

          <div className="hidden lg:block max-w-md">
            <h2 className="font-serif text-3xl xl:text-4xl font-normal text-white tracking-tight leading-[1.2] drop-shadow-xl">
              One account, <br />
              <span className="italic text-[#bf783e]">tailored for your campus role</span>.
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-white/80 font-light leading-relaxed drop-shadow-md">
              Complete your verification profile to activate attendance tracking, grade transcripts, financial ledgers, and emergency security channels.
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] text-white/70">
            <div className="flex items-center gap-2">
              <SecurityIcon className="w-3.5 h-3.5 text-[#bf783e]" />
              <span className="drop-shadow">256-bit encrypted · automated database sync</span>
            </div>
            <span className="hidden sm:inline drop-shadow">FERPA Compliant</span>
          </div>
        </div>
      </div>

      {/* ─── RIGHT: Full Registration Panel ─── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-[#0e0e0e] overflow-y-auto">
        <div className="w-full max-w-lg space-y-6 py-6">
          {/* Header */}
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#bf783e] font-bold block mb-1">
              New Member Registration
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#f4f6d6] tracking-tight">
              Create Your Campus Account
            </h1>
            <p className="mt-1 text-xs text-white/50 font-light">
              Select your university role and provide your official details.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-red-950/70 border border-red-500/50 rounded-2xl text-xs text-red-200 flex items-start gap-3 animate-fade-in shadow-lg">
              <svg className="w-4 h-4 mt-0.5 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection Tabs */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-white/70 tracking-wide">
                1. Select University Role
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {roleOptions.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`p-2.5 rounded-2xl border text-center transition-all duration-150 cursor-pointer ${
                      role === r.value
                        ? "border-[#bf783e] bg-[#bf783e]/20 shadow-sm"
                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-lg block mb-0.5">{r.icon}</span>
                    <span className={`font-bold text-[11px] block ${role === r.value ? "text-[#f4f6d6]" : "text-white/70"}`}>
                      {r.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Core Identity Credentials */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-white/70">Full Legal Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vishal Sharma"
                  required
                  className="input text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-white/70">University Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@campus.edu"
                  required
                  className="input text-xs"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-white/70">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 chars"
                    required
                    minLength={6}
                    className="input text-xs pr-9 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1"
                  >
                    {showPassword ? "👁️" : "🙈"}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-white/70">Direct Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="input text-xs"
                />
              </div>
            </div>

            {/* ─── Dynamic Role-Specific Fields ─── */}

            {/* STUDENT Role Fields */}
            {role === "STUDENT" && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-bold text-[#bf783e] uppercase tracking-wider">
                    Student Matriculation Details
                  </span>
                  <span className="text-[10px] text-white/40 font-mono">Live ERP Sync</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-white/70">Register / Roll Number</label>
                    <input
                      type="text"
                      value={registerNumber}
                      onChange={(e) => setRegisterNumber(e.target.value)}
                      placeholder="e.g. REG2024CS042"
                      required
                      className="input text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-white/70">Academic Department</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="input text-xs"
                    >
                      {departments.map((d) => (
                        <option key={d} value={d} className="bg-[#141414] text-[#f4f6d6]">
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-white/70">Degree Program</label>
                  <select
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    className="input text-xs"
                  >
                    {programs.map((p) => (
                      <option key={p} value={p} className="bg-[#141414] text-[#f4f6d6]">
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-white/70">Academic Year</label>
                    <select
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="input text-xs"
                    >
                      {[1, 2, 3, 4].map((y) => (
                        <option key={y} value={y} className="bg-[#141414] text-[#f4f6d6]">
                          Year {y}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-white/70">Current Semester</label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(Number(e.target.value))}
                      className="input text-xs"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s} className="bg-[#141414] text-[#f4f6d6]">
                          Semester {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* FACULTY Role Fields */}
            {role === "FACULTY" && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4 animate-fade-in">
                <div className="border-b border-white/10 pb-2">
                  <span className="text-xs font-bold text-[#bf783e] uppercase tracking-wider">
                    Faculty Department & Designation
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-white/70">Department</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="input text-xs"
                    >
                      {departments.map((d) => (
                        <option key={d} value={d} className="bg-[#141414] text-[#f4f6d6]">
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-white/70">Academic Title</label>
                    <select
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="input text-xs"
                    >
                      {designations.map((d) => (
                        <option key={d} value={d} className="bg-[#141414] text-[#f4f6d6]">
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* PARENT Role Fields */}
            {role === "PARENT" && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4 animate-fade-in">
                <div className="border-b border-white/10 pb-2">
                  <span className="text-xs font-bold text-[#bf783e] uppercase tracking-wider">
                    Child / Student Linking
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-white/70">Child&apos;s Full Name</label>
                    <input
                      type="text"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      placeholder="e.g. Alex Johnson"
                      required
                      className="input text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-white/70">Child&apos;s Register Number / ID</label>
                    <input
                      type="text"
                      value={childId}
                      onChange={(e) => setChildId(e.target.value)}
                      placeholder="e.g. REG2024CS001"
                      required
                      className="input text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SECURITY Role Fields */}
            {role === "SECURITY" && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4 animate-fade-in">
                <div className="border-b border-white/10 pb-2">
                  <span className="text-xs font-bold text-[#bf783e] uppercase tracking-wider">
                    Security Command & Dispatch Badge
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-white/70">Badge ID / Station</label>
                  <input
                    type="text"
                    value={badgeId}
                    onChange={(e) => setBadgeId(e.target.value)}
                    placeholder="e.g. SEC-088 · Gate B Command Station"
                    required
                    className="input text-xs font-mono"
                  />
                </div>
              </div>
            )}

            {/* ADMIN Role Fields */}
            {role === "ADMIN" && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4 animate-fade-in">
                <div className="border-b border-white/10 pb-2">
                  <span className="text-xs font-bold text-[#bf783e] uppercase tracking-wider">
                    Administrative Directorate
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-white/70">Office / Department</label>
                  <input
                    type="text"
                    value={officeName}
                    onChange={(e) => setOfficeName(e.target.value)}
                    placeholder="e.g. Office of the Registrar & Student Affairs"
                    required
                    className="input text-xs"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-[#f4f6d6] text-[#0e0e0e] font-bold text-sm hover:bg-white shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer mt-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-[#0e0e0e]" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Registering & Linking Records…</span>
                </span>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-3">
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
