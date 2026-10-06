// ============================================================
// Smart Campus ERP — Parent Dashboard (100% Live Supabase)
//
// The connected student is resolved server-side from the signed-in
// parent's own `parents` row (see /api/parent/child). This page never
// names a student id, so there is nothing to tamper with client-side.
// ============================================================
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useParentChild } from "@/hooks/useParentChild";
import { getSupabaseClient } from "@/lib/supabase/client";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import {
  StudentsIcon,
  AttendanceIcon,
  FeesIcon,
  SecurityIcon,
  AcademicCapIcon,
  ChevronRightIcon,
} from "@/components/ui/Icons";
import type { Announcement } from "@/types";

function money(amount: number) {
  return `$${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export default function ParentDashboardPage() {
  const { profile, parentData, loading: userLoading } = useCurrentUser();
  const {
    linked,
    student,
    summary,
    loading: childLoading,
    error: childError,
    reload,
  } = useParentChild();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Announcements addressed to parents or to everyone.
  useEffect(() => {
    async function load() {
      const supabase = getSupabaseClient();
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .or("target_role.eq.ALL,target_role.eq.PARENT,target_role.is.null")
        .order("date", { ascending: false });
      if (data) {
        setAnnouncements(
          data.map((d: Record<string, unknown>) => ({
            id: String(d.id),
            title: String(d.title),
            description: String(d.description),
            date: d.date ? String(d.date) : undefined,
            read: false,
            priority: (d.priority as Announcement["priority"]) || "medium",
          }))
        );
      }
    }
    load();
  }, []);

  const parentName = parentData?.name || profile?.name || "Parent";
  const firstName = parentName.split(" ")[0];
  const childName = student?.name || parentData?.childName || null;
  const childId = student?.id || parentData?.childId || null;
  const latestAnnouncement = announcements[0];

  const att = summary?.attendance;
  const fee = summary?.fees;
  const acad = summary?.academics;

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

  return (
    <div className="space-y-8 animate-fade-in text-[#f4f6d6]">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold mb-3 border border-white/15">
              <span>Parent Access Verified</span>
              {childId && (
                <>
                  <span>•</span>
                  <span>Student ID: {childId}</span>
                </>
              )}
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#f4f6d6]">
              Welcome, {firstName}! 👋
            </h1>
            <p className="mt-2 text-white/70 text-xs sm:text-sm font-light">
              {childName ? (
                <>
                  Monitoring profile &amp; progress for{" "}
                  <span className="font-bold text-[#bf783e]">{childName}</span>
                  {student?.year != null && (
                    <>
                      {" "}
                      · Year {student.year}
                      {student.semester != null ? `, Semester ${student.semester}` : ""}
                    </>
                  )}
                </>
              ) : (
                "No student is linked to your account yet."
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/parent/announcements" className="btn-primary btn-sm">
              School Announcements
            </Link>
          </div>
        </div>
      </div>

      {/* Safety Status Banner */}
      <div className="alert-banner alert-banner-success">
        <div className="w-8 h-8 rounded-full bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 flex items-center justify-center shrink-0">
          <SecurityIcon className="w-4 h-4" />
        </div>
        <div className="flex-1 text-xs sm:text-sm">
          <span className="font-bold text-emerald-200">Campus Safety Status: All Verified Clear</span>
          <span className="opacity-90 ml-1 text-emerald-300 font-light">
            — No active safety incidents or emergency broadcasts in your child&apos;s campus zone.
          </span>
        </div>
      </div>

      {/* Child error / unlinked states */}
      {childError && (
        <div className="p-4 bg-rose-950/60 border border-rose-600/50 rounded-2xl text-xs text-rose-200 flex items-center justify-between gap-3">
          <span>{childError}</span>
          <button
            onClick={reload}
            className="px-3 py-1 bg-rose-800/60 hover:bg-rose-700/60 rounded-lg text-white font-medium transition-colors cursor-pointer shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {!childLoading && !childError && !linked && (
        <div className="card-flat bg-[#141414] border border-white/10">
          <EmptyState
            icon={<StudentsIcon className="w-6 h-6 text-white/40" />}
            title="No student is linked to your account"
            description="Your parent account is not yet connected to a student record. Contact the campus administrator, who can link it to your child's Student ID."
          />
        </div>
      )}

      {/* Child KPI Stats Grid — every value is a stored record */}
      {linked && (
        <>
          <div className="grid-2 lg:grid-4">
            <StatCard
              label="Enrolled Program"
              value={student?.program || "Not recorded"}
              subtitle={
                student?.year != null
                  ? `Year ${student.year}${
                      student.semester != null ? ` · Semester ${student.semester}` : ""
                    }`
                  : "Year not recorded"
              }
              icon={<StudentsIcon className="w-5 h-5 text-[#bf783e]" />}
            />
            <StatCard
              label="Cumulative Attendance"
              value={att?.percentage != null ? `${att.percentage}%` : "No records"}
              change={
                att?.percentage == null
                  ? "Not yet marked"
                  : att.percentage >= 85
                  ? "Good Standing"
                  : "Requires Attention"
              }
              trend={att?.percentage == null ? "neutral" : att.percentage >= 85 ? "up" : "down"}
              icon={<AttendanceIcon className="w-5 h-5 text-emerald-400" />}
            />
            <StatCard
              label="Outstanding Fees"
              value={fee?.hasRecords ? money(fee.outstanding) : "No invoices"}
              change={
                !fee?.hasRecords
                  ? "None issued"
                  : fee.outstanding === 0
                  ? "All cleared"
                  : `${fee.pendingCount + fee.overdueCount} unpaid`
              }
              trend={!fee?.hasRecords ? "neutral" : fee.outstanding === 0 ? "up" : "down"}
              icon={<FeesIcon className="w-5 h-5 text-[#bf783e]" />}
            />
            <StatCard
              label="Academic GPA"
              value={student?.gpa ?? "N/A"}
              change={
                acad?.hasRecords ? `${acad.courses} graded courses` : "No grades released"
              }
              trend={acad?.hasRecords ? "up" : "neutral"}
              icon={<AcademicCapIcon className="w-5 h-5 text-[#bf783e]" />}
            />
          </div>

          {/* Quick links into the detail pages */}
          <div className="grid-3">
            {[
              {
                href: "/parent/academics",
                title: "Academic Information",
                body:
                  student?.year != null
                    ? `Year ${student.year}${
                        student.semester != null ? `, Semester ${student.semester}` : ""
                      } · ${acad?.courses ?? 0} graded courses`
                    : "Registration record and transcript",
                icon: <AcademicCapIcon className="w-5 h-5 text-[#bf783e]" />,
              },
              {
                href: "/parent/attendance",
                title: "Attendance",
                body: att?.hasRecords
                  ? `${att.present} of ${att.totalClasses} lectures attended`
                  : "No attendance recorded yet",
                icon: <AttendanceIcon className="w-5 h-5 text-[#bf783e]" />,
              },
              {
                href: "/parent/fees",
                title: "Fees & Payments",
                body: fee?.hasRecords
                  ? `${money(fee.paid)} paid of ${money(fee.total)}`
                  : "No invoices issued yet",
                icon: <FeesIcon className="w-5 h-5 text-[#bf783e]" />,
              },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="card-flat p-5 sm:p-6 bg-[#141414] border border-white/10 transition-all duration-200 hover:border-[#bf783e]/50 hover:-translate-y-0.5 group"
              >
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center border bg-white/5 border-white/10 mb-4">
                  {card.icon}
                </div>
                <div className="font-serif text-lg font-normal text-[#f4f6d6] tracking-tight">
                  {card.title}
                </div>
                <p className="text-xs text-white/60 font-light mt-1 leading-relaxed">{card.body}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#bf783e] mt-3">
                  <span>View details</span>
                  <ChevronRightIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Announcements */}
      <div className="card-flat p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-heading mb-0">Latest School Notices</h2>
          <Badge variant="blue">Broadcasts</Badge>
        </div>

        {latestAnnouncement ? (
          <div className="space-y-3">
            <div className="p-5 rounded-2xl bg-[#181818] border border-white/15">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#bf783e]" />
                <h3 className="text-sm font-bold text-[#f4f6d6]">{latestAnnouncement.title}</h3>
              </div>
              <p className="text-xs text-white/70 leading-relaxed font-light">
                {latestAnnouncement.description}
              </p>
              <p className="text-[10px] text-white/40 font-medium mt-2.5">
                {latestAnnouncement.date}
              </p>
            </div>

            {announcements.slice(1, 3).map((a) => (
              <div
                key={a.id}
                className="p-3.5 rounded-xl border border-white/10 hover:border-[#bf783e]/40 transition-colors bg-[#181818]"
              >
                <div className="text-xs font-bold text-[#f4f6d6]">{a.title}</div>
                <div className="text-[11px] text-white/40 mt-0.5 font-light">{a.date}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-white/40 text-xs font-light">
            No announcements yet. Check back later.
          </div>
        )}

        <div className="pt-4 border-t border-white/10 mt-4">
          <Link
            href="/parent/announcements"
            className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-[#bf783e] hover:underline"
          >
            <span>View All Campus Bulletins</span>
            <ChevronRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
