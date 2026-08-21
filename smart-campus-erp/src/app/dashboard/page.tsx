// ============================================================
// Smart Campus ERP — Dashboard Home v2
// ============================================================
import { dashboardStats, recentActivities, alerts } from "@/lib/mock-data";

const alertSeverityStyles: Record<string, string> = {
  danger: "alert-banner-danger",
  warning: "alert-banner-warning",
  info: "alert-banner-info",
  success: "alert-banner-success",
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Welcome back, Dr. Mitchell. Here&apos;s what&apos;s happening on campus today.
        </p>
      </div>

      {/* ─── Stat Cards ─── */}
      <div className="grid-4">
        {dashboardStats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`badge ${
                stat.trend === "up" ? "badge-green" : stat.trend === "down" ? "badge-red" : "badge-gray"
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500 font-medium mt-0.5">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ─── Recent Activity ─── */}
        <div className="lg:col-span-2 card-flat">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="section-heading mb-0">Recent Activity</h2>
            <button className="btn-ghost text-blue-600">
              View All
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                  {activity.user
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium text-gray-900">{activity.user}</span>{" "}
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Alerts ─── */}
        <div className="card-flat">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="section-heading mb-0">Active Alerts</h2>
            <span className="badge badge-red">{alerts.length}</span>
          </div>
          <div className="p-4 space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`alert-banner ${alertSeverityStyles[alert.severity] || "alert-banner-info"}`}
              >
                <div className="flex-1">
                  <div className="font-semibold text-sm">{alert.title}</div>
                  <p className="text-xs mt-0.5 opacity-80">{alert.message}</p>
                  <p className="text-xs mt-1 opacity-60">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Quick Actions ─── */}
      <div className="card-flat p-5">
        <h2 className="section-heading">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: "📝", label: "Add New Student", desc: "Register a new student" },
            { icon: "📋", label: "Take Attendance", desc: "Mark class attendance" },
            { icon: "📊", label: "Generate Report", desc: "Analytics & reports" },
            { icon: "🚨", label: "Report Incident", desc: "Campus safety alert" },
          ].map((action) => (
            <button
              key={action.label}
              className="card group flex items-center gap-3 p-4 hover:border-blue-200 text-left"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">
                {action.icon}
              </span>
              <div>
                <div className="text-sm font-semibold text-gray-900">{action.label}</div>
                <div className="text-xs text-gray-500">{action.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
