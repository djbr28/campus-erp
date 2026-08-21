// ============================================================
// Smart Campus ERP — Attendance Page
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
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="mt-1 text-sm text-gray-500">Today&apos;s attendance overview — {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Classes Today", value: "5", icon: "📚" },
          { label: "Overall Attendance", value: "91.7%", icon: "✅" },
          { label: "Classes Pending", value: "1", icon: "⏳" },
        ].map((s) => (
          <div key={s.label} className="p-4 bg-white rounded-2xl border border-gray-100 flex items-center gap-4">
            <span className="text-2xl">{s.icon}</span>
            <div>
              <div className="text-xl font-bold text-gray-900">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Class list */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Classes</h2>
        <div className="space-y-3">
          {todayClasses.map((c, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
              <div className="text-sm font-mono text-gray-400 w-20 shrink-0">{c.time}</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm">{c.course}</div>
                <div className="text-xs text-gray-500">Section {c.section}</div>
              </div>
              <div className="text-right shrink-0">
                <div className={`text-sm font-semibold ${c.pct >= 90 ? "text-green-600" : c.pct > 0 ? "text-amber-600" : "text-gray-400"}`}>
                  {c.pct > 0 ? `${c.pct}%` : "—"}
                </div>
                <div className="text-xs text-gray-400">{c.present}/{c.total}</div>
              </div>
              <button className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors shrink-0">
                {c.pct === 0 ? "Take" : "View"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
