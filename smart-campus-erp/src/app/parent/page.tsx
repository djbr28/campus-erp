// ============================================================
// Smart Campus ERP — Parent Dashboard
// ============================================================
import { currentParent, currentStudent, studentFees, announcements, parentUpcomingEvents } from "@/lib/mock-data-step2";

export default function ParentDashboardPage() {
  const totalFees = studentFees.reduce((s, f) => s + f.total, 0);
  const totalPaid = studentFees.filter((f) => f.status === "Paid").reduce((s, f) => s + f.paid, 0);
  const pendingFees = totalFees - totalPaid;
  const latestAnnouncement = announcements[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 sm:p-8 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Welcome, {currentParent.name.split(" ")[0]}! 👋
        </h1>
        <p className="mt-2 text-purple-100">
          Viewing your child&apos;s profile: <span className="font-semibold">{currentParent.childName}</span>
        </p>
      </div>

      {/* Child overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-5 bg-white rounded-2xl border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Student</div>
          <div className="text-lg font-bold text-gray-900">{currentStudent.name}</div>
          <div className="text-xs text-gray-500 mt-1">{currentStudent.program} · Year {currentStudent.year}</div>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Attendance</div>
          <div className="text-2xl font-bold text-gray-900">{currentStudent.attendancePct}%</div>
          <div className={`text-xs mt-1 ${currentStudent.attendancePct >= 85 ? "text-green-600" : "text-amber-600"}`}>
            {currentStudent.attendancePct >= 85 ? "Good standing" : "Below average"}
          </div>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Fees</div>
          <div className="text-2xl font-bold text-gray-900">${totalPaid.toLocaleString()} <span className="text-lg text-gray-400">/ ${totalFees.toLocaleString()}</span></div>
          {pendingFees > 0 ? (
            <div className="text-xs text-amber-600 mt-1">${pendingFees.toLocaleString()} remaining</div>
          ) : (
            <div className="text-xs text-green-600 mt-1">All fees paid ✓</div>
          )}
        </div>
      </div>

      {/* Upcoming events */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Upcoming Events</h2>
        <div className="space-y-3">
          {parentUpcomingEvents.map((e, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-sm">
                📅
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{e.event}</div>
                <div className="text-xs text-gray-500">{e.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Latest announcement + safety status */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-3">Latest Announcement</h2>
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
            <h3 className="text-sm font-semibold text-gray-900">{latestAnnouncement.title}</h3>
            <p className="mt-1 text-xs text-gray-600">{latestAnnouncement.description}</p>
            <p className="mt-2 text-xs text-gray-400">{latestAnnouncement.date}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-3">Campus Safety Status</h2>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-100">
            <span className="text-2xl">🛡️</span>
            <div>
              <div className="text-sm font-semibold text-green-700">All Clear</div>
              <div className="text-xs text-green-600">No active security alerts for your child&apos;s area</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
