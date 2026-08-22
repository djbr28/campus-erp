// ============================================================
// Smart Campus ERP — Student Dashboard (100% Live Supabase)
// ============================================================
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getSupabaseClient } from "@/lib/supabase/client";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import {
  AttendanceIcon,
  FeesIcon,
  ScheduleIcon,
  AnnouncementsIcon,
  EmergencyPhoneIcon,
  ChevronRightIcon,
} from "@/components/ui/Icons";
import type { FeeRecord, Announcement, AttendanceRecord } from "@/types";

export default function StudentDashboardPage() {
  const { studentData, loading: userLoading, error: userError } = useCurrentUser();

  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  // Fetch student-specific fees
  useEffect(() => {
    if (!studentData?.id) return;
    async function load() {
      const supabase = getSupabaseClient();
      const { data } = await supabase
        .from("fees")
        .select("*")
        .eq("student_id", studentData!.id)
        .order("due_date", { ascending: true });
      if (data) {
        setFees(data.map((d: any) => ({
          id: d.id,
          label: d.label,
          total: Number(d.total),
          paid: Number(d.paid),
          dueDate: d.due_date,
          status: d.status,
        })));
      }
    }
    load();
  }, [studentData?.id]);

  // Fetch attendance records for this student
  useEffect(() => {
    if (!studentData?.id) return;
    async function load() {
      const supabase = getSupabaseClient();
      const { data } = await supabase
        .from("attendance_records")
        .select("*")
        .eq("student_id", studentData!.id);
      if (data) {
        setAttendance(data.map((d: any) => ({
          subject: d.subject,
          code: d.code,
          total: Number(d.total),
          present: Number(d.present),
          absent: Number(d.absent),
          pct: d.pct ? Number(d.pct) : Math.round((Number(d.present) / Number(d.total)) * 100),
        })));
      }
    }
    load();
  }, [studentData?.id]);

  // Fetch announcements (campus-wide)
  useEffect(() => {
    async function load() {
      const supabase = getSupabaseClient();
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .order("date", { ascending: false });
      if (data) {
        setAnnouncements(data.map((d: any) => ({
          id: d.id,
          title: d.title,
          description: d.description,
          date: d.date,
          read: false,
          priority: d.priority || "medium",
        })));
      }
    }
    load();
  }, []);

  // Computed values
  const totalPaid = fees.filter((f) => f.status === "Paid").reduce((s, f) => s + f.paid, 0);
  const totalDue = fees.filter((f) => f.status !== "Paid").reduce((s, f) => s + (f.total - f.paid), 0);
  const unreadAnnouncements = announcements.filter((a) => !a.read);

  const name = studentData?.name || "Student";
  const firstName = name.split(" ")[0];
  const year = studentData?.year || 1;
  const program = studentData?.program || "Undeclared";
  const studentId = studentData?.id || "—";
  const gpa = studentData?.gpa || "0.0";
  const attendancePct = studentData?.attendancePct || 0;

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-white/20 border-t-[#bf783e] rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-white/50">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center card-flat p-8 max-w-md">
          <p className="text-sm text-red-400 mb-2">Unable to load dashboard</p>
          <p className="text-xs text-white/50">{userError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-[#f4f6d6]">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold mb-3 border border-white/15">
              <span>Academic Year {year}</span>
              <span>•</span>
              <span>{program}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#f4f6d6]">
              Welcome back, {firstName}! 👋
            </h1>
            <p className="mt-2 text-white/70 text-xs sm:text-sm font-light">
              Student ID: <span className="font-mono font-bold text-[#f4f6d6]">{studentId}</span> · Current GPA: <span className="font-bold text-[#bf783e]">{gpa}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/student/attendance" className="btn-primary btn-sm">
              My Attendance Record
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid-4">
        <StatCard
          label="Overall Attendance"
          value={`${attendancePct}%`}
          change={attendancePct >= 85 ? "Good" : "Warning"}
          trend={attendancePct >= 85 ? "up" : "down"}
          icon={<AttendanceIcon className="w-5 h-5 text-[#bf783e]" />}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />
        <StatCard
          label="Fees Cleared"
          value={`$${totalPaid.toLocaleString()}`}
          change={totalDue > 0 ? `$${totalDue.toLocaleString()} Due` : "All Paid"}
          trend={totalDue > 0 ? "neutral" : "up"}
          icon={<FeesIcon className="w-5 h-5 text-[#bf783e]" />}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />
        <StatCard
          label="Classes Today"
          value={attendance.length > 0 ? `${attendance.length} enrolled` : "No classes"}
          change={attendance.length > 0 ? "On Track" : "Check schedule"}
          trend={attendance.length > 0 ? "up" : "neutral"}
          icon={<ScheduleIcon className="w-5 h-5 text-[#bf783e]" />}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />
        <StatCard
          label="New Campus Alerts"
          value={unreadAnnouncements.length}
          change={unreadAnnouncements.length > 0 ? "Action Req" : "Up to date"}
          trend={unreadAnnouncements.length > 0 ? "down" : "neutral"}
          icon={<AnnouncementsIcon className="w-5 h-5 text-[#bf783e]" />}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />
      </div>

      {/* Schedule & Announcements Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Classes */}
        <div className="lg:col-span-2 card-flat p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="section-heading mb-0">Lecture Schedule</h2>
                <p className="text-xs text-white/50 mt-0.5 font-light">Enrolled courses & attendance progress</p>
              </div>
              <Link href="/student/attendance" className="text-xs font-bold text-[#bf783e] hover:underline">
                Full Details →
              </Link>
            </div>

            {attendance.length === 0 ? (
              <div className="text-center py-8 text-white/40 text-xs font-light">
                No attendance records yet. Your classes will appear here once enrolled.
              </div>
            ) : (
              <div className="space-y-3">
                {attendance.slice(0, 4).map((a) => (
                  <div
                    key={a.code}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 hover:border-[#bf783e]/50 hover:bg-white/[0.02] transition-colors bg-[#181818]"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/5 text-[#f4f6d6] border border-white/10 flex items-center justify-center text-xs font-bold shrink-0 font-mono">
                      {a.code.split("-")[1] || a.code}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-[#f4f6d6] truncate">{a.subject}</div>
                      <div className="text-xs text-white/40 font-mono mt-0.5">{a.code}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <span
                        className={`font-serif text-base font-normal ${
                          a.pct >= 85 ? "text-emerald-400" : a.pct >= 75 ? "text-amber-400" : "text-rose-400"
                        }`}
                      >
                        {a.pct}%
                      </span>
                      <div className="text-[11px] text-white/40 font-medium mt-0.5">
                        {a.present}/{a.total} Attended
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Priority Announcements */}
        <div className="card-flat p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-heading mb-0">Campus Bulletin</h2>
              <Badge variant="blue">{unreadAnnouncements.length} unread</Badge>
            </div>

            <div className="space-y-3">
              {unreadAnnouncements.length === 0 ? (
                <div className="text-center py-8 text-white/40 text-xs font-light">
                  All caught up! No unread announcements.
                </div>
              ) : (
                unreadAnnouncements.map((a) => (
                  <Link
                    key={a.id}
                    href="/student/announcements"
                    className="block p-4 rounded-2xl border border-white/10 hover:border-[#bf783e]/50 hover:bg-white/[0.03] transition-colors group bg-[#181818]"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#bf783e] mt-1.5 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#f4f6d6] group-hover:text-[#bf783e] transition-colors truncate">
                          {a.title}
                        </div>
                        <div className="text-[11px] text-white/60 mt-1 line-clamp-2 leading-relaxed font-light">
                          {a.description}
                        </div>
                        <div className="text-[10px] text-white/40 mt-2 font-medium">{a.date}</div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 mt-4">
            <Link
              href="/student/announcements"
              className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-[#bf783e] hover:underline"
            >
              <span>View All Campus Notices</span>
              <ChevronRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Tiles */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/student/attendance" className="card group p-5 flex items-center gap-4 hover:border-[#bf783e]/50">
          <div className="w-12 h-12 rounded-2xl bg-white/5 text-[#f4f6d6] flex items-center justify-center group-hover:bg-[#f4f6d6] group-hover:text-[#0e0e0e] transition-all border border-white/10">
            <AttendanceIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-serif text-sm font-normal text-[#f4f6d6]">Attendance Breakdown</div>
            <div className="text-xs text-white/50 font-light mt-0.5">Subject records & thresholds</div>
          </div>
          <ChevronRightIcon className="w-4 h-4 text-white/30 group-hover:text-[#bf783e] group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link href="/student/fees" className="card group p-5 flex items-center gap-4 hover:border-[#bf783e]/50">
          <div className="w-12 h-12 rounded-2xl bg-white/5 text-[#f4f6d6] flex items-center justify-center group-hover:bg-[#bf783e] group-hover:text-white transition-all border border-white/10">
            <FeesIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-serif text-sm font-normal text-[#f4f6d6]">Fees & Receipts</div>
            <div className="text-xs text-white/50 font-light mt-0.5">Payment status & invoices</div>
          </div>
          <ChevronRightIcon className="w-4 h-4 text-white/30 group-hover:text-[#bf783e] group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link href="/student/report-incident" className="card group p-5 flex items-center gap-4 hover:border-[#bf783e]/50">
          <div className="w-12 h-12 rounded-2xl bg-white/5 text-[#f4f6d6] flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-all border border-white/10">
            <EmergencyPhoneIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-serif text-sm font-normal text-[#f4f6d6]">Report Campus Incident</div>
            <div className="text-xs text-white/50 font-light mt-0.5">Submit confidential safety report</div>
          </div>
          <ChevronRightIcon className="w-4 h-4 text-white/30 group-hover:text-[#bf783e] group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>

      {/* Emergency Bar */}
      <Link
        href="/student/report-incident"
        className="w-full py-4 px-6 bg-gradient-to-r from-rose-900/80 via-red-800 to-rose-950 text-white font-bold rounded-full hover:from-rose-800 hover:to-rose-900 transition-all shadow-xl border border-rose-600/40 flex items-center justify-center gap-3 text-sm sm:text-base group"
      >
        <EmergencyPhoneIcon className="w-5 h-5 group-hover:scale-110 transition-transform animate-pulse text-[#f4f6d6]" />
        <span>Campus Emergency? Tap Here to Alert Security Immediately</span>
      </Link>
    </div>
  );
}
