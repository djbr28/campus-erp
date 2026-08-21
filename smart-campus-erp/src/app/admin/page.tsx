// ============================================================
// Smart Campus ERP — Admin Dashboard
// ============================================================
import { dashboardStats, recentActivities, alerts } from "@/lib/mock-data";

const severityStyles: Record<string, string> = {
  danger: "bg-red-50 border-red-200 text-red-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
  success: "bg-green-50 border-green-200 text-green-800",
};

const trendStyles: Record<string, string> = {
  up: "text-green-600",
  down: "text-red-600",
  neutral: "text-gray-500",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, Dr. Mitchell. Here&apos;s your campus overview.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <div key={stat.label} className="p-5 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-xs font-medium ${trendStyles[stat.trend]}`}>{stat.change}</span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                  {activity.user.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium text-gray-900">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Active Alerts</h2>
            <span className="px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-600 rounded-full">{alerts.length}</span>
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-xl border ${severityStyles[alert.severity]}`}>
                <div className="font-medium text-sm">{alert.title}</div>
                <p className="text-xs mt-1 opacity-80">{alert.message}</p>
                <p className="text-xs mt-2 opacity-60">{alert.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
