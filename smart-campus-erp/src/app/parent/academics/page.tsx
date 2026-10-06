// ============================================================
// Smart Campus ERP — Parent → Academic Information (Live Supabase)
//
// Reads the SAME authoritative `students` row the student's own
// portal reads, via /api/parent/child. Year and semester shown here
// and on the student dashboard always agree.
// ============================================================
"use client";

import RoleGuard from "@/components/layout/RoleGuard";
import ChildGate from "@/components/parent/ChildGate";
import { useParentChild } from "@/hooks/useParentChild";
import DashboardCard from "@/components/ui/DashboardCard";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { AcademicCapIcon, CheckIcon, StudentsIcon } from "@/components/ui/Icons";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-white/5 last:border-b-0">
      <span className="text-white/50 shrink-0">{label}</span>
      <span className="text-[#f4f6d6] font-medium text-right">{value}</span>
    </div>
  );
}

export default function ParentAcademicsPage() {
  const { linked, student, academics, summary, loading, error, reload } = useParentChild();

  return (
    <RoleGuard allow={["PARENT"]} fallbackHref="/parent">
      <div className="space-y-6 animate-fade-in text-[#f4f6d6]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="page-title">Academic Information</h1>
            <p className="page-subtitle">
              {student
                ? `Official registration record and transcript for ${student.name}.`
                : "Official registration record and transcript for your child."}
            </p>
          </div>
          {student?.status && (
            <Badge variant={student.status === "Active" ? "green" : "amber"} dot>
              {student.status}
            </Badge>
          )}
        </div>

        <ChildGate
          loading={loading}
          error={error}
          linked={linked}
          loadingMessage="Loading academic information…"
          onRetry={reload}
        >
          {/* KPI row — all values come from stored records */}
          <div className="grid-3 mb-6">
            <StatCard
              label="Current Academic Year"
              value={student?.year != null ? `Year ${student.year}` : "Not recorded"}
              subtitle={student?.semester != null ? `Semester ${student.semester}` : undefined}
              icon={<AcademicCapIcon className="w-5 h-5 text-[#bf783e]" />}
            />
            <StatCard
              label="Cumulative GPA"
              value={student?.gpa ?? "N/A"}
              icon={<span className="text-base font-bold text-[#bf783e]">⭐</span>}
            />
            <StatCard
              label="Credits on Record"
              value={summary?.academics.hasRecords ? `${summary.academics.credits} Units` : "0 Units"}
              change={
                summary?.academics.hasRecords
                  ? `${summary.academics.courses} graded courses`
                  : "No graded courses yet"
              }
              trend={summary?.academics.hasRecords ? "up" : "neutral"}
              icon={<CheckIcon className="w-5 h-5 text-emerald-400" />}
            />
          </div>

          <div className="grid-2 mb-6">
            <DashboardCard
              title="Registration Record"
              subtitle="The registrar's record for your child"
            >
              <div className="space-y-1 text-xs">
                <Row label="Student Name" value={student?.name || "—"} />
                <Row
                  label="Student ID"
                  value={<span className="font-mono">{student?.id || "—"}</span>}
                />
                <Row
                  label="Register Number"
                  value={<span className="font-mono">{student?.register_number || "—"}</span>}
                />
                <Row label="Department" value={student?.department || "—"} />
                <Row label="Program" value={student?.program || "—"} />
                <Row
                  label="Academic Year"
                  value={
                    <span className="text-[#bf783e] font-bold">
                      {student?.year != null ? `Year ${student.year}` : "Not recorded"}
                    </span>
                  }
                />
                <Row
                  label="Semester"
                  value={
                    <span className="text-[#bf783e] font-bold">
                      {student?.semester != null ? `Semester ${student.semester}` : "Not recorded"}
                    </span>
                  }
                />
                <Row label="Enrollment Status" value={student?.status || "—"} />
              </div>
            </DashboardCard>

            <DashboardCard title="Contact Details" subtitle="On file with the campus registrar">
              <div className="space-y-1 text-xs">
                <Row label="Campus Email" value={student?.email || "—"} />
                <Row label="Phone" value={student?.phone || "Not provided"} />
                <Row
                  label="Latest Graded Semester"
                  value={
                    summary?.academics.latestSemester != null
                      ? `Semester ${summary.academics.latestSemester}`
                      : "No grades released"
                  }
                />
                <Row
                  label="Average Course Score"
                  value={
                    summary?.academics.averageMarks != null
                      ? `${summary.academics.averageMarks}%`
                      : "—"
                  }
                />
              </div>
            </DashboardCard>
          </div>

          {/* Transcript */}
          <div className="table-wrapper">
            <div className="px-6 py-4 border-b border-white/10 bg-[#181818] flex items-center justify-between">
              <div>
                <h2 className="section-heading mb-0">Transcript & Grade Sheet</h2>
                <p className="text-xs text-white/50 mt-0.5 font-light">
                  Subject performance by semester, as released by the examination office
                </p>
              </div>
              <Badge variant="blue">{academics.length} Courses</Badge>
            </div>

            {academics.length === 0 ? (
              <EmptyState
                icon={<StudentsIcon className="w-6 h-6 text-white/40" />}
                title="No academic records yet"
                description="Grades will appear here once the examination office releases results for your child."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Semester</th>
                      <th>Course / Subject</th>
                      <th className="hidden sm:table-cell text-center">Credits</th>
                      <th className="hidden md:table-cell text-center">Marks</th>
                      <th>Grade</th>
                      <th className="hidden md:table-cell">Term CGPA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {academics.map((r) => (
                      <tr key={r.id}>
                        <td className="font-semibold text-white/70 text-xs">Sem {r.semester}</td>
                        <td className="font-bold text-[#f4f6d6] text-sm">{r.subject}</td>
                        <td className="hidden sm:table-cell text-center text-xs text-white/50">
                          {r.credits ?? "—"}
                        </td>
                        <td className="hidden md:table-cell text-center font-mono text-sm text-[#f4f6d6] font-semibold">
                          {r.marks}%
                        </td>
                        <td>
                          <Badge
                            variant={
                              r.grade.startsWith("A")
                                ? "green"
                                : r.grade.startsWith("B")
                                ? "blue"
                                : "amber"
                            }
                          >
                            {r.grade}
                          </Badge>
                        </td>
                        <td className="hidden md:table-cell font-serif text-sm text-[#bf783e] font-semibold">
                          {r.cgpa.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </ChildGate>
      </div>
    </RoleGuard>
  );
}
