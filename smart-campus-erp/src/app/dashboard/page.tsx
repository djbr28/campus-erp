// ============================================================
// Smart Campus ERP — Faculty Dashboard (100% Live Supabase)
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
  DashboardIcon,
  IncidentsIcon,
  ChevronRightIcon,
} from "@/components/ui/Icons";

export default function DashboardPage() {
  const { profile, loading } = useCurrentUser();
  const [stats, setStats] = useState({ totalStudents: 0, activeIncidents: 0 });

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseClient();
      const [studentsRes, incidentsRes] = await Promise.all([
        supabase.from("students").select("id", { count: "exact", head: true }),
        supabase.from("incidents").select("*"),
      ]);
      const incidents = incidentsRes.data || [];
      setStats({
        totalStudents: studentsRes.count || 0,
        activeIncidents: incidents.filter((i: any) => i.status !== "Resolved").length,
      });
    }
    load();
  }, []);

  const userName = profile?.name || "Faculty";
  const firstName = userName.split(" ")[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-white/20 border-t-[#bf783e] rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-white/50">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-[#f4f6d6]">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Faculty Portal Overview</h1>
          <p className="page-subtitle">
            Welcome back, {firstName}. Lecture schedules, course rosters, and class metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/attendance" className="btn-primary btn-sm">
            <AttendanceIcon className="w-4 h-4" />
            <span>Mark Class Attendance</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Stats Grid */}
      <div className="grid-4">
        <StatCard
          label="Total Students"
          value={stats.totalStudents}
          change="Enrolled"
          trend="up"
          icon={<StudentsIcon className="w-5 h-5 text-[#bf783e]" />}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />
        <StatCard
          label="Active Incidents"
          value={stats.activeIncidents}
          change={stats.activeIncidents > 0 ? "Requires Action" : "All Clear"}
          trend={stats.activeIncidents > 0 ? "down" : "up"}
          icon={<IncidentsIcon className="w-5 h-5 text-rose-400" />}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />
        <StatCard
          label="Classes Today"
          value="—"
          change="View schedule"
          trend="neutral"
          icon={<DashboardIcon className="w-5 h-5 text-[#bf783e]" />}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />
        <StatCard
          label="Campus Status"
          value={stats.activeIncidents === 0 ? "Normal" : "Alert"}
          change={stats.activeIncidents === 0 ? "All Clear" : `${stats.activeIncidents} Open`}
          trend={stats.activeIncidents === 0 ? "up" : "down"}
          icon={<span className="text-lg">🏫</span>}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />
      </div>

      {/* Quick Action Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/students" className="card group p-5 flex items-center gap-4 hover:border-[#bf783e]/50">
          <div className="w-12 h-12 rounded-2xl bg-white/5 text-[#f4f6d6] flex items-center justify-center group-hover:bg-[#f4f6d6] group-hover:text-[#0e0e0e] transition-all border border-white/10">
            <StudentsIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-serif text-sm font-normal text-[#f4f6d6]">Student Rosters</div>
            <div className="text-xs text-white/50 font-light mt-0.5">View enrolled classes</div>
          </div>
          <ChevronRightIcon className="w-4 h-4 text-white/30 group-hover:text-[#bf783e] group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link href="/dashboard/attendance" className="card group p-5 flex items-center gap-4 hover:border-[#bf783e]/50">
          <div className="w-12 h-12 rounded-2xl bg-white/5 text-[#f4f6d6] flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all border border-white/10">
            <AttendanceIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-serif text-sm font-normal text-[#f4f6d6]">Class Attendance</div>
            <div className="text-xs text-white/50 font-light mt-0.5">Record daily lectures</div>
          </div>
          <ChevronRightIcon className="w-4 h-4 text-white/30 group-hover:text-[#bf783e] group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link href="/dashboard/schedule" className="card group p-5 flex items-center gap-4 hover:border-[#bf783e]/50">
          <div className="w-12 h-12 rounded-2xl bg-white/5 text-[#f4f6d6] flex items-center justify-center group-hover:bg-[#bf783e] group-hover:text-white transition-all border border-white/10">
            <DashboardIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-serif text-sm font-normal text-[#f4f6d6]">Timetable Grid</div>
            <div className="text-xs text-white/50 font-light mt-0.5">Weekly class hours</div>
          </div>
          <ChevronRightIcon className="w-4 h-4 text-white/30 group-hover:text-[#bf783e] group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link href="/dashboard/incidents" className="card group p-5 flex items-center gap-4 hover:border-[#bf783e]/50">
          <div className="w-12 h-12 rounded-2xl bg-white/5 text-[#f4f6d6] flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-all border border-white/10">
            <IncidentsIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-serif text-sm font-normal text-[#f4f6d6]">Safety Alerts</div>
            <div className="text-xs text-white/50 font-light mt-0.5">Campus incident reports</div>
          </div>
          <ChevronRightIcon className="w-4 h-4 text-white/30 group-hover:text-[#bf783e] group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>
    </div>
  );
}
