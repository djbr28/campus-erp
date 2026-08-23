// ============================================================
// Smart Campus ERP — Admin Dashboard (100% Live Supabase)
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
  IncidentsIcon,
  SparklesIcon,
  SecurityIcon,
  ChevronRightIcon,
} from "@/components/ui/Icons";

export default function AdminDashboardPage() {
  const { profile, initials, loading } = useCurrentUser();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    activeIncidents: 0,
    criticalIncidents: 0,
  });

  useEffect(() => {
    async function loadStats() {
      const supabase = getSupabaseClient();

      const [studentsRes, facultyRes, incidentsRes] = await Promise.all([
        supabase.from("students").select("id", { count: "exact", head: true }),
        supabase.from("faculty").select("id", { count: "exact", head: true }),
        supabase.from("incidents").select("*"),
      ]);

      const incidents = incidentsRes.data || [];
      const activeIncidents = incidents.filter((i: any) => i.status !== "Resolved").length;
      const criticalIncidents = incidents.filter(
        (i: any) =>
          ((i.priority === "critical" || i.priority === "high" || i.severity === "critical" || i.severity === "high") &&
            i.status !== "Resolved")
      ).length;

      setStats({
        totalStudents: studentsRes.count || 0,
        totalFaculty: facultyRes.count || 0,
        activeIncidents,
        criticalIncidents,
      });
    }

    loadStats();
  }, []);

  const userName = profile?.name || "Administrator";
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Administrator Command</h1>
          <p className="page-subtitle">
            Welcome back, {firstName}. Institutional operations overview for today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/ai-assistant" className="btn-secondary btn-sm">
            <SparklesIcon className="w-4 h-4 text-[#bf783e]" />
            <span>Ask Campus AI</span>
          </Link>
          <Link href="/admin/incidents" className="btn-primary btn-sm">
            <IncidentsIcon className="w-4 h-4" />
            <span>Review Incidents</span>
          </Link>
        </div>
      </div>

      {/* Critical Incidents Warning Banner */}
      {stats.criticalIncidents > 0 && (
        <div className="alert-banner alert-banner-danger flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-rose-950/80 border border-rose-600/50 flex items-center justify-center text-rose-300 shrink-0 animate-pulse">
              <IncidentsIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-rose-200">
                {stats.criticalIncidents} High/Critical Incident{stats.criticalIncidents > 1 ? "s" : ""}
              </span>{" "}
              <span className="text-xs sm:text-sm text-rose-300/80">
                currently open and requiring administrative dispatch.
              </span>
            </div>
          </div>
          <Link href="/admin/incidents" className="btn-danger btn-sm shrink-0">
            Open Queue
          </Link>
        </div>
      )}

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
          label="Faculty Members"
          value={stats.totalFaculty}
          change="Active"
          trend="up"
          icon={<span className="text-lg">👨‍🏫</span>}
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
          label="Campus Status"
          value={stats.criticalIncidents === 0 ? "Normal" : "Alert"}
          change={stats.criticalIncidents === 0 ? "All Clear" : `${stats.criticalIncidents} Critical`}
          trend={stats.criticalIncidents === 0 ? "up" : "down"}
          icon={<SecurityIcon className="w-5 h-5 text-emerald-400" />}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />
      </div>

      {/* Navigation Shortcut Tiles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/students" className="card group p-5 flex items-center gap-4 hover:border-[#bf783e]/50">
          <div className="w-12 h-12 rounded-2xl bg-white/5 text-[#f4f6d6] flex items-center justify-center group-hover:bg-[#f4f6d6] group-hover:text-[#0e0e0e] transition-all border border-white/10">
            <StudentsIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-serif text-sm font-normal text-[#f4f6d6]">Student Directory</div>
            <div className="text-xs text-white/50 font-light mt-0.5">{stats.totalStudents} enrolled</div>
          </div>
          <ChevronRightIcon className="w-4 h-4 text-white/30 group-hover:text-[#bf783e] group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link href="/admin/incidents" className="card group p-5 flex items-center gap-4 hover:border-[#bf783e]/50">
          <div className="w-12 h-12 rounded-2xl bg-white/5 text-[#f4f6d6] flex items-center justify-center group-hover:bg-[#bf783e] group-hover:text-white transition-all border border-white/10">
            <IncidentsIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-serif text-sm font-normal text-[#f4f6d6]">Incidents Center</div>
            <div className="text-xs text-white/50 font-light mt-0.5">{stats.activeIncidents} active reports</div>
          </div>
          <ChevronRightIcon className="w-4 h-4 text-white/30 group-hover:text-[#bf783e] group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link href="/admin/ai-assistant" className="card group p-5 flex items-center gap-4 hover:border-[#bf783e]/50">
          <div className="w-12 h-12 rounded-2xl bg-white/5 text-[#f4f6d6] flex items-center justify-center group-hover:bg-[#bf783e] group-hover:text-white transition-all border border-white/10">
            <SparklesIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-serif text-sm font-normal text-[#f4f6d6]">Campus AI Assistant</div>
            <div className="text-xs text-white/50 font-light mt-0.5">Natural language queries</div>
          </div>
          <ChevronRightIcon className="w-4 h-4 text-white/30 group-hover:text-[#bf783e] group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link href="/security" className="card group p-5 flex items-center gap-4 hover:border-[#bf783e]/50">
          <div className="w-12 h-12 rounded-2xl bg-white/5 text-[#f4f6d6] flex items-center justify-center group-hover:bg-[#f4f6d6] group-hover:text-[#0e0e0e] transition-all border border-white/10">
            <SecurityIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-serif text-sm font-normal text-[#f4f6d6]">Security Command</div>
            <div className="text-xs text-white/50 font-light mt-0.5">Live safety monitoring</div>
          </div>
          <ChevronRightIcon className="w-4 h-4 text-white/30 group-hover:text-[#bf783e] group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>
    </div>
  );
}
