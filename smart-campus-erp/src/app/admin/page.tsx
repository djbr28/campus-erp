// ============================================================
// Smart Campus ERP — Admin Dashboard v2
// ============================================================
import Link from "next/link";
import { dashboardStats, recentActivities, alerts } from "@/lib/mock-data";
import { incidents } from "@/lib/mock-data-step2";

const alertSeverityStyles: Record<string, string> = {
  danger: "alert-banner-danger",
  warning: "alert-banner-warning",
  info: "alert-banner-info",
  success: "alert-banner-success",
};

export default function AdminDashboardPage() {
  const activeIncidents = incidents.filter((i) => i.status !== "Resolved").length;
  const criticalIncidents = incidents.filter((i) => (i.severity === "critical" || i.severity === "high") && i.status !== "Resolved").length;

  return (
    <div className="space-y-8">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Welcome back, Dr. Mitchell. Here&apos;s your campus overview.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid-4">
        {dashboardStats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`badge ${stat.trend === "up" ? "badge-green" : stat.trend === "down" ? "badge-red" : "badge-gray"}`}>
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

      {/* Critical incidents banner */}
      {criticalIncidents > 0 && (
        <div className="alert-banner alert-banner-danger">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <div className="flex-1">
            <span className="font-semibold">{criticalIncidents} critical incident(s)</span>{" "}
            <span className="text-sm">require immediate attention.</span>
          </div>
          <Link href="/admin/incidents" className="btn-danger btn-sm">
            View All
          </Link>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2 card-flat">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="section-heading mb-0">Recent Activity</h2>
            <span className="badge badge-gray">{recentActivities.length} events</span>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                  {activity.user.split(" ").map((w) => w[0]).join("").slice(0, 2)}
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

        {/* Alerts */}
        <div className="card-flat">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="section-heading mb-0">Active Alerts</h2>
            <span className="badge badge-red">{alerts.length}</span>
          </div>
          <div className="p-4 space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={`alert-banner ${alertSeverityStyles[alert.severity] || "alert-banner-info"}`}>
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

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/students" className="card group p-4 flex items-center gap-3 hover:border-blue-200">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">Students</div>
            <div className="text-xs text-gray-500">Manage records</div>
          </div>
        </Link>
        <Link href="/admin/incidents" className="card group p-4 flex items-center gap-3 hover:border-red-200">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">Incidents</div>
            <div className="text-xs text-gray-500">{activeIncidents} active</div>
          </div>
        </Link>
        <Link href="/admin/ai-assistant" className="card group p-4 flex items-center gap-3 hover:border-purple-200">
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">AI Assistant</div>
            <div className="text-xs text-gray-500">Ask anything</div>
          </div>
        </Link>
        <Link href="/security" className="card group p-4 flex items-center gap-3 hover:border-amber-200">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">Security</div>
            <div className="text-xs text-gray-500">Monitor safety</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
