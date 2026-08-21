// ============================================================
// Smart Campus ERP — Attendance Page v2
// ============================================================

const todayClasses = [
  { time: "08:00 AM", course: "CS-301: Data Structures", section: "A", present: 42, total: 45, pct: 93 },
  { time: "09:30 AM", course: "CS-302: Algorithms", section: "B", present: 38, total: 40, pct: 95 },
  { time: "11:00 AM", course: "EE-201: Circuits", section: "A", present: 30, total: 35, pct: 86 },
  { time: "01:00 PM", course: "BA-401: Marketing", section: "C", present: 28, total: 30, pct: 93 },
  { time: "02:30 PM", course: "CS-303: AI Fundamentals", section: "A", present: 0, total: 38, pct: 0 },
];

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Attendance</h1>
        <p className="page-subtitle">
          Today&apos;s attendance overview — {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid-3">
        <div className="stat-card">
          <div className="text-sm text-gray-500 mb-1">Total Classes Today</div>
          <div className="text-2xl font-bold text-gray-900">5</div>
        </div>
        <div className="stat-card">
          <div className="text-sm text-gray-500 mb-1">Overall Attendance</div>
          <div className="text-2xl font-bold text-gray-900">91.7%</div>
          <div className="badge badge-green mt-2">Good</div>
        </div>
        <div className="stat-card">
          <div className="text-sm text-gray-500 mb-1">Classes Pending</div>
          <div className="text-2xl font-bold text-amber-600">1</div>
        </div>
      </div>

      {/* Class list */}
      <div className="card-flat">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="section-heading mb-0">Classes</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {todayClasses.map((c, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
              <div className="text-sm font-mono text-gray-400 w-20 shrink-0">{c.time}</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm">{c.course}</div>
                <div className="text-xs text-gray-500">Section {c.section}</div>
              </div>
              <div className="hidden sm:block flex-1 max-w-[120px]">
                <div className="progress-track">
                  <div
                    className={`progress-fill ${
                      c.pct >= 90 ? "progress-fill-green" : c.pct > 0 ? "progress-fill-amber" : "progress-fill-red"
                    }`}
                    style={{ width: `${c.pct}%` }}
                  />
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className={`text-sm font-semibold ${
                  c.pct >= 90 ? "text-green-600" : c.pct > 0 ? "text-amber-600" : "text-gray-400"
                }`}>
                  {c.pct > 0 ? `${c.pct}%` : "—"}
                </div>
                <div className="text-xs text-gray-400">{c.present}/{c.total}</div>
              </div>
              <button className="btn-primary btn-sm shrink-0">
                {c.pct === 0 ? "Take" : "View"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
