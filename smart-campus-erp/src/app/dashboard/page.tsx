// ============================================================
// Smart Campus ERP — Faculty Dashboard Home (Editorial Aesthetic)
// ============================================================
import Link from "next/link";
import { dashboardStats, recentActivities, alerts } from "@/lib/mock-data";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import {
  DynamicNavIcon,
  StudentsIcon,
  AttendanceIcon,
  DashboardIcon,
  IncidentsIcon,
  ChevronRightIcon,
} from "@/components/ui/Icons";

const alertSeverityStyles: Record<string, string> = {
  danger: "alert-banner-danger",
  warning: "alert-banner-warning",
  info: "alert-banner-info",
  success: "alert-banner-success",
};

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in text-[#f4f6d6]">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Faculty Portal Overview</h1>
          <p className="page-subtitle">
            Welcome back, Dr. Mitchell. Lecture schedules, course rosters, and class metrics.
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

      {/* Main Grid: Activity & Alerts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2 card-flat overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#181818]">
            <div>
              <h2 className="section-heading mb-0">Recent Academic Activity</h2>
              <p className="text-xs text-white/50 mt-0.5 font-light">Submissions, grades, and attendance logs</p>
            </div>
            <Badge variant="blue">{recentActivities.length} events</Badge>
          </div>
          <div className="divide-y divide-white/5">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3.5 px-6 py-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-[#f4f6d6] text-[#0e0e0e] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-xs">
                  {activity.user
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-white/80 leading-snug font-light">
                    <span className="font-bold text-[#f4f6d6]">{activity.user}</span>{" "}
                    <span className="text-white/70">{activity.action}</span>
                  </p>
                  <p className="text-[11px] text-white/40 font-medium mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Alerts */}
        <div className="card-flat overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#181818]">
              <h2 className="section-heading mb-0">System Bulletins</h2>
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
              href="/dashboard/schedule"
              className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-[#bf783e] hover:underline"
            >
              <span>View Weekly Timetable</span>
              <ChevronRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/dashboard/students"
          className="card group p-5 flex items-center gap-4 hover:border-[#bf783e]/50"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/5 text-[#f4f6d6] flex items-center justify-center group-hover:bg-[#f4f6d6] group-hover:text-[#0e0e0e] transition-all border border-white/10">
            <StudentsIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-serif text-sm font-normal text-[#f4f6d6]">Student Rosters</div>
            <div className="text-xs text-white/50 font-light mt-0.5">View enrolled classes</div>
          </div>
          <ChevronRightIcon className="w-4 h-4 text-white/30 group-hover:text-[#bf783e] group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          href="/dashboard/attendance"
          className="card group p-5 flex items-center gap-4 hover:border-[#bf783e]/50"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/5 text-[#f4f6d6] flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all border border-white/10">
            <AttendanceIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-serif text-sm font-normal text-[#f4f6d6]">Class Attendance</div>
            <div className="text-xs text-white/50 font-light mt-0.5">Record daily lectures</div>
          </div>
          <ChevronRightIcon className="w-4 h-4 text-white/30 group-hover:text-[#bf783e] group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          href="/dashboard/schedule"
          className="card group p-5 flex items-center gap-4 hover:border-[#bf783e]/50"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/5 text-[#f4f6d6] flex items-center justify-center group-hover:bg-[#bf783e] group-hover:text-white transition-all border border-white/10">
            <DashboardIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-serif text-sm font-normal text-[#f4f6d6]">Timetable Grid</div>
            <div className="text-xs text-white/50 font-light mt-0.5">Weekly class hours</div>
          </div>
          <ChevronRightIcon className="w-4 h-4 text-white/30 group-hover:text-[#bf783e] group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          href="/admin/incidents"
          className="card group p-5 flex items-center gap-4 hover:border-[#bf783e]/50"
        >
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
