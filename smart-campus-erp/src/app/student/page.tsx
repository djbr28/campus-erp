// ============================================================
// Smart Campus ERP — Student Dashboard
// ============================================================
import Link from "next/link";
import { currentStudent, studentFees, studentAttendance, announcements } from "@/lib/mock-data-step2";

export default function StudentDashboardPage() {
  const totalPaid = studentFees.filter((f) => f.status === "Paid").reduce((s, f) => s + f.paid, 0);
  const totalDue = studentFees.filter((f) => f.status !== "Paid").reduce((s, f) => s + (f.total - f.paid), 0);
  const unreadCount = announcements.filter((a) => !a.read).length;
  const todayTotal = 5;
  const todayPresent = 4;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 sm:p-8 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Welcome back, {currentStudent.name.split(" ")[0]}! 👋
        </h1>
        <p className="mt-2 text-blue-100">
          {currentStudent.program} — Year {currentStudent.year} · GPA {currentStudent.gpa}
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-5 bg-white rounded-2xl border border-gray-100">
          <div className="text-2xl mb-2">📋</div>
          <div className="text-2xl font-bold text-gray-900">{currentStudent.attendancePct}%</div>
          <div className="text-sm text-gray-500">Attendance</div>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-gray-100">
          <div className="text-2xl mb-2">💰</div>
          <div className="text-2xl font-bold text-gray-900">${totalPaid.toLocaleString()}</div>
          <div className="text-sm text-gray-500">Fees Paid</div>
          {totalDue > 0 && <div className="text-xs text-amber-600 mt-1">${totalDue.toLocaleString()} remaining</div>}
        </div>
        <div className="p-5 bg-white rounded-2xl border border-gray-100">
          <div className="text-2xl mb-2">📅</div>
          <div className="text-2xl font-bold text-gray-900">{todayPresent}/{todayTotal}</div>
          <div className="text-sm text-gray-500">Classes Today</div>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-gray-100">
          <div className="text-2xl mb-2">📢</div>
          <div className="text-2xl font-bold text-gray-900">{unreadCount}</div>
          <div className="text-sm text-gray-500">New Announcements</div>
        </div>
      </div>

      {/* Today's classes */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Today&apos;s Classes</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {studentAttendance.slice(0, 3).map((a) => (
            <div key={a.code} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-sm font-bold text-blue-600">
                {a.code}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{a.subject}</div>
                <div className="text-xs text-gray-500">Attendance: {a.pct}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/student/attendance"
          className="flex items-center gap-3 p-5 bg-white rounded-2xl border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all group"
        >
          <span className="text-2xl group-hover:scale-110 transition-transform">📋</span>
          <div>
            <div className="text-sm font-semibold text-gray-900">My Attendance</div>
            <div className="text-xs text-gray-500">View subject-wise breakdown</div>
          </div>
        </Link>
        <Link
          href="/student/fees"
          className="flex items-center gap-3 p-5 bg-white rounded-2xl border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all group"
        >
          <span className="text-2xl group-hover:scale-110 transition-transform">💰</span>
          <div>
            <div className="text-sm font-semibold text-gray-900">Fees & Payments</div>
            <div className="text-xs text-gray-500">View and manage payments</div>
          </div>
        </Link>
        <Link
          href="/student/report-incident"
          className="flex items-center gap-3 p-5 bg-white rounded-2xl border border-gray-100 hover:border-red-300 hover:shadow-md transition-all group"
        >
          <span className="text-2xl group-hover:scale-110 transition-transform">🚨</span>
          <div>
            <div className="text-sm font-semibold text-gray-900">Report Incident</div>
            <div className="text-xs text-gray-500">Report a campus safety concern</div>
          </div>
        </Link>
      </div>

      {/* Emergency button */}
      <button className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-colors text-lg shadow-lg shadow-red-600/25">
        🆘 Emergency — Tap to Alert Security
      </button>
    </div>
  );
}
