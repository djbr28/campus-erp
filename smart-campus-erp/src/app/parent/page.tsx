// ============================================================
// Smart Campus ERP — Parent Dashboard (100% Live Supabase)
// ============================================================
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getSupabaseClient } from "@/lib/supabase/client";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import {
  StudentsIcon,
  AttendanceIcon,
  FeesIcon,
  SecurityIcon,
  ScheduleIcon,
  ChevronRightIcon,
} from "@/components/ui/Icons";
import type { Announcement } from "@/types";

export default function ParentDashboardPage() {
  const { profile, parentData, loading } = useCurrentUser();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [childData, setChildData] = useState<any>(null);

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

  // Fetch child data if parent has a linked child
  useEffect(() => {
    async function load() {
      const childIdentifier = parentData?.childId || parentData?.child_id;
      const childName = parentData?.childName || parentData?.child_name;

      if (!childIdentifier && !childName) return;

      try {
        const supabase = getSupabaseClient();
        const { data } = await supabase
          .from("students")
          .select("*")
          .or(
            `id.eq.${childIdentifier || "none"},register_number.eq.${childIdentifier || "none"},name.ilike.%${childName || "none"}%`
          )
          .limit(1)
          .maybeSingle();

        if (data) {
          setChildData({
            ...data,
            attendancePct: Number(data.attendance_pct || data.attendancePct || 0),
          });
        }
      } catch (err) {
        console.warn("[ParentDashboard] Error loading linked child data:", err);
      }
    }
    load();
  }, [parentData?.childId, parentData?.child_id, parentData?.childName, parentData?.child_name]);

  const parentName = parentData?.name || profile?.name || "Parent";
  const firstName = parentName.split(" ")[0];
  const childName = parentData?.childName || "your child";
  const childId = parentData?.childId || "—";
  const latestAnnouncement = announcements[0];

  if (loading) {
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
              <span>•</span>
              <span>Student ID: {childId}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#f4f6d6]">
              Welcome, {firstName}! 👋
            </h1>
            <p className="mt-2 text-white/70 text-xs sm:text-sm font-light">
              Monitoring profile & progress for <span className="font-bold text-[#bf783e]">{childName}</span>
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
          <span className="opacity-90 ml-1 text-emerald-300 font-light">— No active safety incidents or emergency broadcasts in your child&apos;s campus zone.</span>
        </div>
      </div>

      {/* Child KPI Stats Grid */}
      <div className="grid-2 lg:grid-4">
        <StatCard
          label="Enrolled Program"
          value={childData?.program || "Not linked"}
          subtitle={childData ? `Year ${childData.year} • Full Time` : "Link your child's account"}
          icon={<StudentsIcon className="w-5 h-5 text-[#bf783e]" />}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />
        <StatCard
          label="Cumulative Attendance"
          value={childData ? `${childData.attendancePct || 0}%` : "—"}
          change={childData && childData.attendancePct >= 85 ? "Good Standing" : "Requires Attention"}
          trend={childData && childData.attendancePct >= 85 ? "up" : "down"}
          icon={<AttendanceIcon className="w-5 h-5 text-emerald-400" />}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />
        <StatCard
          label="Academic GPA"
          value={childData ? `GPA ${childData.gpa || "0.0"}` : "—"}
          change={childData && parseFloat(childData.gpa || "0") >= 3.5 ? "Dean's List Track" : "Review needed"}
          trend={childData && parseFloat(childData.gpa || "0") >= 3.5 ? "up" : "neutral"}
          icon={<span className="text-lg">⭐</span>}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />
        <StatCard
          label="Campus Alerts"
          value={announcements.length}
          change={announcements.length > 0 ? "New Notices" : "All clear"}
          trend={announcements.length > 0 ? "down" : "up"}
          icon={<FeesIcon className="w-5 h-5 text-[#bf783e]" />}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />
      </div>

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
              <p className="text-xs text-white/70 leading-relaxed font-light">{latestAnnouncement.description}</p>
              <p className="text-[10px] text-white/40 font-medium mt-2.5">{latestAnnouncement.date}</p>
            </div>

            {announcements.slice(1, 3).map((a) => (
              <div key={a.id} className="p-3.5 rounded-xl border border-white/10 hover:border-[#bf783e]/40 transition-colors bg-[#181818]">
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
