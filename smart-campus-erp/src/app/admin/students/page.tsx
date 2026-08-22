// ============================================================
// Smart Campus ERP — Admin Students Directory (Live Supabase + Fallback)
// ============================================================
"use client";

import { useState, useEffect } from "react";
import { allStudents as defaultStudents } from "@/lib/mock-data-step2";
import { getSupabaseClient } from "@/lib/supabase/client";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { SearchIcon, PlusIcon, StudentsIcon } from "@/components/ui/Icons";
import type { Student } from "@/types";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>(defaultStudents);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "On Leave">("All");

  useEffect(() => {
    async function loadStudents() {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from("students")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.warn("[AdminStudents] Supabase query error, using defaults:", error.message);
        } else if (data && data.length > 0) {
          const mapped: Student[] = data.map((d: any) => ({
            id: d.id,
            name: d.name,
            email: d.email,
            program: d.program,
            year: d.year,
            gpa: d.gpa?.toString() || "0.0",
            status: d.status,
            attendancePct: d.attendance_pct || 100,
          }));
          setStudents(mapped);
        }
      } catch (err) {
        console.warn("[AdminStudents] Exception loading students:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadStudents();
  }, []);

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.program.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ? true : s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const avgGpa = students.length > 0
    ? (students.reduce((acc, s) => acc + parseFloat(s.gpa || "0"), 0) / students.length).toFixed(2)
    : "0.00";

  const avgAttendance = students.length > 0
    ? Math.round(students.reduce((acc, s) => acc + (s.attendancePct || 0), 0) / students.length)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in text-[#f4f6d6]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Student Directory</h1>
          <p className="page-subtitle">
            Manage student academic profiles, attendance standings, and registration status.
          </p>
        </div>
        <button className="btn-primary btn-sm self-start sm:self-auto">
          <PlusIcon className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid-3">
        <div className="stat-card">
          <div className="text-xs font-semibold text-white/50 uppercase tracking-wider">Total Enrolled</div>
          <div className="font-serif text-2xl sm:text-3xl font-normal text-[#f4f6d6] mt-1">{students.length} Students</div>
        </div>
        <div className="stat-card">
          <div className="text-xs font-semibold text-white/50 uppercase tracking-wider">Institutional Avg GPA</div>
          <div className="font-serif text-2xl sm:text-3xl font-normal text-[#bf783e] mt-1">{avgGpa} / 4.0</div>
        </div>
        <div className="stat-card">
          <div className="text-xs font-semibold text-white/50 uppercase tracking-wider">Avg Attendance Rate</div>
          <div className="font-serif text-2xl sm:text-3xl font-normal text-emerald-400 mt-1">{avgAttendance}%</div>
        </div>
      </div>

      {/* Table Container */}
      <div className="table-wrapper">
        {/* Search & Filter Toolbar */}
        <div className="p-4 border-b border-white/10 bg-[#181818] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40">
              <SearchIcon className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, student ID, or program..."
              className="input-search text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-full border border-white/10 self-start sm:self-auto">
            {(["All", "Active", "On Leave"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
                  statusFilter === status
                    ? "bg-[#f4f6d6] text-[#0e0e0e] shadow-sm"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th className="hidden sm:table-cell">Program</th>
                <th className="hidden md:table-cell">Year</th>
                <th className="hidden md:table-cell">GPA</th>
                <th className="hidden lg:table-cell">Attendance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="table-row-clickable">
                  <td className="font-mono text-xs font-semibold text-white/50">{s.id}</td>
                  <td>
                    <div className="font-bold text-[#f4f6d6] text-sm">{s.name}</div>
                    <div className="text-xs text-white/40 font-mono">{s.email}</div>
                  </td>
                  <td className="hidden sm:table-cell text-white/80 font-medium">{s.program}</td>
                  <td className="hidden md:table-cell text-white/60 text-xs font-semibold">Year {s.year}</td>
                  <td className="hidden md:table-cell">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-[#bf783e]/20 text-[#f4f6d6] border border-[#bf783e]/40 font-mono">
                      {s.gpa}
                    </span>
                  </td>
                  <td className="hidden lg:table-cell">
                    <div className="flex items-center gap-3 min-w-[130px]">
                      <div className="flex-1 progress-track">
                        <div
                          className={`progress-fill ${
                            s.attendancePct >= 85
                              ? "progress-fill-green"
                              : s.attendancePct >= 75
                              ? "progress-fill-amber"
                              : "progress-fill-red"
                          }`}
                          style={{ width: `${Math.min(s.attendancePct, 100)}%` }}
                        />
                      </div>
                      <span
                        className={`text-xs font-bold tabular-nums ${
                          s.attendancePct >= 85
                            ? "text-emerald-400"
                            : s.attendancePct >= 75
                            ? "text-amber-400"
                            : "text-rose-400"
                        }`}
                      >
                        {s.attendancePct}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <Badge
                      variant={
                        s.status === "Active"
                          ? "green"
                          : s.status === "On Leave"
                          ? "amber"
                          : "gray"
                      }
                      dot
                    >
                      {s.status}
                    </Badge>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      icon={<StudentsIcon className="w-6 h-6 text-white/40" />}
                      title={`No students found matching "${search}"`}
                      description="Try searching with a different name, program, or student ID number."
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
