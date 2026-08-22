// ============================================================
// Smart Campus ERP — Admin Dashboard (Canva Editorial Aesthetic)
// ============================================================
import Link from "next/link";
import { dashboardStats, recentActivities, alerts } from "@/lib/mock-data";
import { incidents } from "@/lib/mock-data-step2";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import {
  StudentsIcon,
  IncidentsIcon,
  SparklesIcon,
  SecurityIcon,
  ChevronRightIcon,
  DynamicNavIcon,
} from "@/components/ui/Icons";

const alertSeverityStyles: Record<string, string> = {
  danger: "alert-banner-danger",
  warning: "alert-banner-warning",
  info: "alert-banner-info",
  success: "alert-banner-success",
};

export default function AdminDashboardPage() {
  const activeIncidents = incidents.filter((i) => i.status !== "Resolved").length;
  const criticalIncidents = incidents.filter(
    (i) => (i.severity === "critical" || i.severity === "high") && i.status !== "Resolved"
  ).length;

  return (
    <div className="space-y-8 animate-fade-in text-[#f4f6d6]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Administrator Command</h1>
          <p className="page-subtitle">
            Welcome back, Dr. Mitchell. Institutional operations overview for today.
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
      {criticalIncidents > 0 && (
        <div className="alert-banner alert-banner-danger flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-rose-950/80 border border-rose-600/50 flex items-center justify-center text-rose-300 shrink-0 animate-pulse">
              <IncidentsIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-rose-200">
                {criticalIncidents} High/Critical Incident{criticalIncidents > 1 ? "s" : ""}
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
        {dashboardStats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={<DynamicNavIcon name={stat.icon} className="w-5 h-5 text-[#bf783e]" />}
            iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
          />
        ))}
      </div>

      {/* Main Grid: Recent Activity Stream & Active Alerts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity (2 Cols) */}
        <div className="lg:col-span-2 card-flat overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#181818]">
            <div>
              <h2 className="section-heading mb-0">Live Activity Feed</h2>
              <p className="text-xs text-white/50 mt-0.5 font-light">Real-time actions across all campus portals</p>
            </div>
            <Badge variant="blue">{recentActivities.length} events</Badge>
          </div>
          <div className="divide-y divide-white/5">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3.5 px-6 py-4 hover:bg-white/[0.03] transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-[#f4f6d6] text-[#0e0e0e] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-xs">
                  {activity.user
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-white/80 leading-snug">
                    <span className="font-bold text-[#f4f6d6]">{activity.user}</span>{" "}
                    <span className="text-white/70 font-light">{activity.action}</span>
                  </p>
                  <p className="text-[11px] text-white/40 font-medium mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Alerts Panel */}
        <div className="card-flat overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#181818]">
              <h2 className="section-heading mb-0">System Alerts</h2>
              <Badge variant="red" dot>{alerts.length} active</Badge>
            </div>
            <div className="p-5 space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`alert-banner ${
                    alertSeverityStyles[alert.severity] || "alert-banner-info"
                  }`}
                >
                  <div className="flex-1">
                    <div className="font-bold text-xs sm:text-sm">{alert.title}</div>
                    <p className="text-xs mt-0.5 opacity-85 leading-relaxed font-light">{alert.message}</p>
                    <p className="text-[10px] mt-1.5 opacity-50 font-semibold">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-white/10 bg-[#181818]/60">
            <Link
              href="/admin/incidents"
              className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-[#bf783e] hover:underline"
            >
              <span>View All Security Incidents</span>
              <ChevronRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Shortcut Tiles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/students"
          className="card group p-5 flex items-center gap-4 hover:border-[#bf783e]/50"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/5 text-[#f4f6d6] flex items-center justify-center group-hover:bg-[#f4f6d6] group-hover:text-[#0e0e0e] transition-all border border-white/10">
            <StudentsIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-serif text-sm font-normal text-[#f4f6d6]">Student Directory</div>
            <div className="text-xs text-white/50 font-light mt-0.5">Rosters & performance</div>
          </div>
          <ChevronRightIcon className="w-4 h-4 text-white/30 group-hover:text-[#bf783e] group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          href="/admin/incidents"
          className="card group p-5 flex items-center gap-4 hover:border-[#bf783e]/50"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/5 text-[#f4f6d6] flex items-center justify-center group-hover:bg-[#bf783e] group-hover:text-white transition-all border border-white/10">
            <IncidentsIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-serif text-sm font-normal text-[#f4f6d6]">Incidents Center</div>
            <div className="text-xs text-white/50 font-light mt-0.5">{activeIncidents} active reports</div>
          </div>
          <ChevronRightIcon className="w-4 h-4 text-white/30 group-hover:text-[#bf783e] group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          href="/admin/ai-assistant"
          className="card group p-5 flex items-center gap-4 hover:border-[#bf783e]/50"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/5 text-[#f4f6d6] flex items-center justify-center group-hover:bg-[#bf783e] group-hover:text-white transition-all border border-white/10">
            <SparklesIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-serif text-sm font-normal text-[#f4f6d6]">Campus AI Assistant</div>
            <div className="text-xs text-white/50 font-light mt-0.5">Natural language queries</div>
          </div>
          <ChevronRightIcon className="w-4 h-4 text-white/30 group-hover:text-[#bf783e] group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          href="/security"
          className="card group p-5 flex items-center gap-4 hover:border-[#bf783e]/50"
        >
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
