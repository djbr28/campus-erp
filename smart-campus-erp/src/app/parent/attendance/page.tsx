// ============================================================
// Smart Campus ERP — Parent → Student Attendance (Live Supabase)
//
// Every figure is derived from `attendance_records` rows that
// actually exist for the connected student. Nothing is invented:
// when the table holds no rows the page says so.
// ============================================================
"use client";

import RoleGuard from "@/components/layout/RoleGuard";
import ChildGate from "@/components/parent/ChildGate";
import { useParentChild } from "@/hooks/useParentChild";
import CircularProgress from "@/components/ui/CircularProgress";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { AttendanceIcon, CheckIcon } from "@/components/ui/Icons";

export default function ParentAttendancePage() {
  const { linked, student, attendance, summary, loading, error, reload } = useParentChild();

  const att = summary?.attendance;
  const overallPct = att?.percentage ?? 0;
  const hasRecords = Boolean(att?.hasRecords && att.totalClasses > 0);

  // Most recent dated entries, for an "is anything going wrong right now" read.
  const recent = attendance
    .filter((a) => a.date)
    .slice(0, 6);

  return (
    <RoleGuard allow={["PARENT"]} fallbackHref="/parent">
      <div className="space-y-6 animate-fade-in text-[#f4f6d6]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="page-title">Student Attendance</h1>
            <p className="page-subtitle">
              {student
                ? `${student.name}${student.program ? ` · ${student.program}` : ""}${
                    student.year != null ? ` · Year ${student.year}` : ""
                  }`
                : "Lecture attendance for your child."}
            </p>
          </div>
          {hasRecords && (
            <Badge
              variant={overallPct >= 85 ? "green" : overallPct >= 75 ? "amber" : "red"}
              dot
            >
              {overallPct >= 85
                ? "Good Standing"
                : overallPct >= 75
                ? "Warning Threshold"
                : "Critical Risk"}
            </Badge>
          )}
        </div>

        <ChildGate
          loading={loading}
          error={error}
          linked={linked}
          loadingMessage="Loading attendance…"
          onRetry={reload}
        >
          {!hasRecords ? (
            <div className="card-flat bg-[#141414] border border-white/10">
              <EmptyState
                icon={<AttendanceIcon className="w-6 h-6 text-white/40" />}
                title="No attendance has been recorded yet"
                description={
                  att?.recordedPct != null
                    ? `The registrar's enrolment record lists ${att.recordedPct}% for this student, but no individual lecture records exist in the attendance register yet. Subject-wise figures will appear here once faculty begin marking attendance.`
                    : "Subject-wise figures will appear here once faculty begin marking attendance for your child."
                }
              />
            </div>
          ) : (
            <>
              {/* Hero gauge */}
              <div className="card-flat p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-8 bg-gradient-to-r from-[#141414] via-[#141414] to-[#1e1712] border border-white/10">
                <CircularProgress
                  percentage={overallPct}
                  size={120}
                  strokeWidth={10}
                  subtitle="Attendance"
                />

                <div className="flex-1 text-center sm:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-[#f4f6d6] text-xs font-bold mb-2 border border-white/10">
                    <AttendanceIcon className="w-3.5 h-3.5 text-[#bf783e]" />
                    <span>Cumulative Attendance</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#f4f6d6] tracking-tight">
                    {overallPct}% Overall Attendance
                  </h2>
                  <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-lg font-light leading-relaxed">
                    {student?.name || "Your child"} has attended{" "}
                    <span className="font-bold text-[#f4f6d6]">{att!.present}</span> of{" "}
                    <span className="font-bold text-[#f4f6d6]">{att!.totalClasses}</span> registered
                    lectures. The minimum institutional threshold is 75%.
                  </p>
                  {overallPct < 75 && (
                    <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 bg-rose-950/60 text-rose-200 rounded-full text-xs font-bold border border-rose-600/40">
                      <span>⚠️ Below the 75% threshold — please contact the academic advisor.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* KPI cards */}
              <div className="grid-3">
                <StatCard
                  label="Total Scheduled Lectures"
                  value={att!.totalClasses}
                  icon={<AttendanceIcon className="w-5 h-5 text-[#bf783e]" />}
                />
                <StatCard
                  label="Lectures Present"
                  value={att!.present}
                  change="Present"
                  trend="up"
                  icon={<CheckIcon className="w-5 h-5 text-emerald-400" />}
                />
                <StatCard
                  label="Lectures Absent"
                  value={att!.absent}
                  change={att!.absent === 0 ? "Perfect" : `${att!.absent} Missed`}
                  trend={att!.absent === 0 ? "up" : "down"}
                  icon={<span className="text-base text-rose-400">⚠️</span>}
                />
              </div>

              {/* Subject-wise breakdown */}
              <div className="table-wrapper">
                <div className="px-6 py-4 border-b border-white/10 bg-[#181818] flex items-center justify-between">
                  <div>
                    <h2 className="section-heading mb-0">Subject-wise Breakdown</h2>
                    <p className="text-xs text-white/50 mt-0.5 font-light">
                      Course-by-course present vs absent statistics
                    </p>
                  </div>
                  <Badge variant="blue">{attendance.length} Courses</Badge>
                </div>

                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Course Name</th>
                        <th className="hidden sm:table-cell">Code</th>
                        <th className="hidden md:table-cell text-center">Total</th>
                        <th className="hidden md:table-cell text-center">Present</th>
                        <th className="hidden md:table-cell text-center">Absent</th>
                        <th>Attendance Rate</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.map((a) => {
                        const pct =
                          a.total > 0
                            ? Math.round((a.present / a.total) * 100)
                            : a.percentage ?? 0;
                        return (
                          <tr key={a.id}>
                            <td className="font-bold text-[#f4f6d6] text-sm">{a.subject}</td>
                            <td className="hidden sm:table-cell font-mono text-xs font-semibold text-white/40">
                              {a.code}
                            </td>
                            <td className="hidden md:table-cell text-center font-medium text-white/70">
                              {a.total}
                            </td>
                            <td className="hidden md:table-cell text-center font-bold text-emerald-400">
                              {a.present}
                            </td>
                            <td className="hidden md:table-cell text-center font-bold text-rose-400">
                              {a.absent}
                            </td>
                            <td>
                              <div className="flex items-center gap-3 min-w-[130px]">
                                <div className="flex-1 progress-track">
                                  <div
                                    className={`progress-fill ${
                                      pct >= 85
                                        ? "progress-fill-green"
                                        : pct >= 75
                                        ? "progress-fill-amber"
                                        : "progress-fill-red"
                                    }`}
                                    style={{ width: `${Math.min(pct, 100)}%` }}
                                  />
                                </div>
                                <span
                                  className={`text-xs font-bold tabular-nums ${
                                    pct >= 85
                                      ? "text-emerald-400"
                                      : pct >= 75
                                      ? "text-amber-400"
                                      : "text-rose-400"
                                  }`}
                                >
                                  {pct}%
                                </span>
                              </div>
                            </td>
                            <td>
                              <Badge
                                variant={pct >= 85 ? "green" : pct >= 75 ? "amber" : "red"}
                                dot
                              >
                                {pct >= 85 ? "Good" : pct >= 75 ? "Warning" : "Low"}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent marked entries — only when the rows carry dates */}
              {recent.length > 0 && (
                <div className="table-wrapper">
                  <div className="px-6 py-4 border-b border-white/10 bg-[#181818]">
                    <h2 className="section-heading mb-0">Recent Entries</h2>
                    <p className="text-xs text-white/50 mt-0.5 font-light">
                      The latest attendance rows recorded against your child
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Course</th>
                          <th className="hidden sm:table-cell">Code</th>
                          <th>Marked</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recent.map((a) => (
                          <tr key={`recent-${a.id}`}>
                            <td className="text-xs text-white/60 font-medium">{a.date}</td>
                            <td className="font-bold text-[#f4f6d6] text-sm">{a.subject}</td>
                            <td className="hidden sm:table-cell font-mono text-xs text-white/40">
                              {a.code}
                            </td>
                            <td>
                              <Badge
                                variant={
                                  a.status === "Present"
                                    ? "green"
                                    : a.status === "Late"
                                    ? "amber"
                                    : "red"
                                }
                                dot
                              >
                                {a.status || "—"}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </ChildGate>
      </div>
    </RoleGuard>
  );
}
