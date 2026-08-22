// ============================================================
// Smart Campus ERP — Student Attendance (Live Supabase + Fallback)
// ============================================================
"use client";

import { useState, useEffect } from "react";
import { currentStudent, studentAttendance as defaultAttendance } from "@/lib/mock-data-step2";
import { getSupabaseClient } from "@/lib/supabase/client";
import CircularProgress from "@/components/ui/CircularProgress";
import Badge from "@/components/ui/Badge";
import StatCard from "@/components/ui/StatCard";
import { CheckIcon, AttendanceIcon } from "@/components/ui/Icons";
import type { AttendanceRecord } from "@/types";

export default function StudentAttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(defaultAttendance);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAttendance() {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from("attendance_records")
          .select("*");

        if (error) {
          console.warn("[StudentAttendance] Supabase query error, using defaults:", error.message);
        } else if (data && data.length > 0) {
          const mapped: AttendanceRecord[] = data.map((d: any) => ({
            subject: d.subject,
            code: d.code,
            total: Number(d.total),
            present: Number(d.present),
            absent: Number(d.absent),
            pct: d.pct ? Number(d.pct) : Math.round((Number(d.present) / Number(d.total)) * 100),
          }));
          setAttendance(mapped);
        }
      } catch (err) {
        console.warn("[StudentAttendance] Exception loading attendance:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadAttendance();
  }, []);

  const totalClasses = attendance.reduce((s, a) => s + a.total, 0);
  const totalPresent = attendance.reduce((s, a) => s + a.present, 0);
  const totalAbsent = attendance.reduce((s, a) => s + a.absent, 0);
  const overallPct = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in text-[#f4f6d6]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">Attendance Record</h1>
          <p className="page-subtitle">
            {currentStudent.name} · {currentStudent.program} · Year {currentStudent.year}
          </p>
        </div>
        <Badge
          variant={overallPct >= 85 ? "green" : overallPct >= 75 ? "amber" : "red"}
          dot
        >
          {overallPct >= 85 ? "Good Standing" : overallPct >= 75 ? "Warning Threshold" : "Critical Risk"}
        </Badge>
      </div>

      {/* Hero Attendance Gauge Card */}
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
            You have attended <span className="font-bold text-[#f4f6d6]">{totalPresent}</span> out of{" "}
            <span className="font-bold text-[#f4f6d6]">{totalClasses}</span> registered lectures. Minimum required
            institutional threshold is 75%.
          </p>
          {overallPct < 75 && (
            <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 bg-rose-950/60 text-rose-200 rounded-full text-xs font-bold border border-rose-600/40">
              <span>⚠️ Action required: Meet with academic advisor regarding attendance risk.</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid-3">
        <StatCard
          label="Total Scheduled Lectures"
          value={totalClasses}
          icon={<AttendanceIcon className="w-5 h-5 text-[#bf783e]" />}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />
        <StatCard
          label="Lectures Present"
          value={totalPresent}
          change="Present"
          trend="up"
          icon={<CheckIcon className="w-5 h-5 text-emerald-400" />}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />
        <StatCard
          label="Lectures Absent"
          value={totalAbsent}
          change={totalAbsent === 0 ? "Perfect" : `${totalAbsent} Missed`}
          trend={totalAbsent === 0 ? "up" : "down"}
          icon={<span className="text-base text-rose-400">⚠️</span>}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />
      </div>

      {/* Subject-wise Breakdown Table */}
      <div className="table-wrapper">
        <div className="px-6 py-4 border-b border-white/10 bg-[#181818] flex items-center justify-between">
          <div>
            <h2 className="section-heading mb-0">Subject-wise Attendance Breakdown</h2>
            <p className="text-xs text-white/50 mt-0.5 font-light">Course-by-course present vs absent statistics</p>
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
              {attendance.map((a) => (
                <tr key={a.code}>
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
                            a.pct >= 85
                              ? "progress-fill-green"
                              : a.pct >= 75
                              ? "progress-fill-amber"
                              : "progress-fill-red"
                          }`}
                          style={{ width: `${a.pct}%` }}
                        />
                      </div>
                      <span
                        className={`text-xs font-bold tabular-nums ${
                          a.pct >= 85
                            ? "text-emerald-400"
                            : a.pct >= 75
                            ? "text-amber-400"
                            : "text-rose-400"
                        }`}
                      >
                        {a.pct}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <Badge
                      variant={a.pct >= 85 ? "green" : a.pct >= 75 ? "amber" : "red"}
                      dot
                    >
                      {a.pct >= 85 ? "Good" : a.pct >= 75 ? "Warning" : "Low"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
