// ============================================================
// Smart Campus ERP — Parent Dashboard v2
// ============================================================
import Link from "next/link";
import { currentParent, currentStudent, studentFees, studentAttendance, announcements, parentUpcomingEvents } from "@/lib/mock-data-step2";

export default function ParentDashboardPage() {
  const totalFees = studentFees.reduce((s, f) => s + f.total, 0);
  const totalPaid = studentFees.filter((f) => f.status === "Paid").reduce((s, f) => s + f.paid, 0);
  const pendingFees = totalFees - totalPaid;
  const latestAnnouncement = announcements[0];

  const totalClasses = studentAttendance.reduce((s, a) => s + a.total, 0);
  const totalPresent = studentAttendance.reduce((s, a) => s + a.present, 0);
  const attendancePct = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="welcome-banner">
        <div className="relative z-10">
          <p className="text-blue-200 text-sm font-medium mb-1">Parent Portal</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome, {currentParent.name.split(" ")[0]}! 👋
          </h1>
          <p className="mt-2 text-blue-100 text-sm">
            Viewing profile for <span className="font-semibold text-white">{currentParent.childName}</span>
          </p>
        </div>
      </div>

      {/* Child stats */}
      <div className="grid-2 lg:grid-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{currentStudent.program}</div>
              <div className="text-xs text-gray-500 font-medium">Year {currentStudent.year}</div>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{attendancePct}%</div>
              <div className="text-xs text-gray-500 font-medium">Attendance</div>
            </div>
          </div>
          {attendancePct < 85 && (
            <div className="mt-2 badge badge-amber">Below average</div>
          )}
          {attendancePct >= 85 && (
            <div className="mt-2 badge badge-green">Good standing</div>
          )}
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">${totalPaid.toLocaleString()}</div>
              <div className="text-xs text-gray-500 font-medium">Fees Paid</div>
            </div>
          </div>
          {pendingFees > 0 && (
            <div className="mt-2 text-xs font-medium text-amber-600">${pendingFees.toLocaleString()} remaining</div>
          )}
          {pendingFees === 0 && (
            <div className="mt-2 badge badge-green">All paid ✓</div>
          )}
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">GPA {currentStudent.gpa}</div>
              <div className="text-xs text-gray-500 font-medium">Academic Standing</div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety status */}
      <div className="alert-banner alert-banner-success">
        <span className="text-xl">🛡️</span>
        <div className="flex-1">
          <span className="font-semibold">Campus Safety: All Clear</span>
          <span className="text-sm ml-1.5">— No active security alerts in your child&apos;s area.</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming events */}
        <div className="card-flat p-5">
          <h2 className="section-heading">Upcoming Events</h2>
          <div className="space-y-3">
            {parentUpcomingEvents.map((e, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-sm shrink-0">
                  📅
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">{e.event}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{e.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest announcement */}
        <div className="card-flat p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-heading mb-0">Latest Announcement</h2>
            <span className="badge badge-blue">New</span>
          </div>
          <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-100">
            <h3 className="text-sm font-semibold text-gray-900">{latestAnnouncement.title}</h3>
            <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{latestAnnouncement.description}</p>
            <p className="mt-2 text-xs text-gray-400">{latestAnnouncement.date}</p>
          </div>
          {announcements.slice(1, 3).map((a) => (
            <div key={a.id} className="mt-3 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
              <h3 className="text-sm font-medium text-gray-700">{a.title}</h3>
              <p className="mt-1 text-xs text-gray-400">{a.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
