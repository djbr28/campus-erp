// ============================================================
// Smart Campus ERP — Schedule Page
// ============================================================

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const hours = ["8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"];

const scheduleData: Record<string, { time: string; course: string; room: string; color: string }[]> = {
  Mon: [
    { time: "8 AM", course: "CS-301", room: "R-201", color: "bg-blue-100 border-blue-300 text-blue-800" },
    { time: "11 AM", course: "EE-201", room: "R-105", color: "bg-purple-100 border-purple-300 text-purple-800" },
    { time: "2 PM", course: "CS-303", room: "R-302", color: "bg-green-100 border-green-300 text-green-800" },
  ],
  Tue: [
    { time: "9 AM", course: "CS-302", room: "R-201", color: "bg-amber-100 border-amber-300 text-amber-800" },
    { time: "1 PM", course: "BA-401", room: "R-405", color: "bg-rose-100 border-rose-300 text-rose-800" },
  ],
  Wed: [
    { time: "8 AM", course: "CS-301", room: "R-201", color: "bg-blue-100 border-blue-300 text-blue-800" },
    { time: "10 AM", course: "CS-303", room: "R-302", color: "bg-green-100 border-green-300 text-green-800" },
    { time: "2 PM", course: "EE-201", room: "R-105", color: "bg-purple-100 border-purple-300 text-purple-800" },
  ],
  Thu: [
    { time: "9 AM", course: "CS-302", room: "R-201", color: "bg-amber-100 border-amber-300 text-amber-800" },
    { time: "11 AM", course: "BA-401", room: "R-405", color: "bg-rose-100 border-rose-300 text-rose-800" },
  ],
  Fri: [
    { time: "8 AM", course: "CS-301", room: "R-201", color: "bg-blue-100 border-blue-300 text-blue-800" },
    { time: "10 AM", course: "CS-303", room: "R-302", color: "bg-green-100 border-green-300 text-green-800" },
    { time: "1 PM", course: "EE-201", room: "R-105", color: "bg-purple-100 border-purple-300 text-purple-800" },
  ],
};

export default function SchedulePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
          <p className="mt-1 text-sm text-gray-500">Weekly timetable overview</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 text-sm font-medium bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            ← Previous
          </button>
          <button className="px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            This Week
          </button>
          <button className="px-3 py-2 text-sm font-medium bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            Next →
          </button>
        </div>
      </div>

      {/* Desktop grid */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-[80px_repeat(5,1fr)] border-b border-gray-100">
          <div className="p-3 text-xs font-medium text-gray-400 border-r border-gray-100" />
          {days.map((d) => (
            <div key={d} className="p-3 text-xs font-semibold text-gray-500 text-center border-r border-gray-100 last:border-r-0">
              {d}
            </div>
          ))}
        </div>
        {hours.map((hour) => (
          <div key={hour} className="grid grid-cols-[80px_repeat(5,1fr)] border-b border-gray-50 last:border-b-0 min-h-[56px]">
            <div className="p-2 text-xs font-mono text-gray-400 border-r border-gray-100 flex items-start">
              {hour}
            </div>
            {days.map((d) => {
              const cls = scheduleData[d]?.find((c) => c.time === hour);
              return (
                <div key={`${d}-${hour}`} className="p-1 border-r border-gray-50 last:border-r-0">
                  {cls && (
                    <div className={`h-full p-2 rounded-lg border text-xs font-medium ${cls.color}`}>
                      <div>{cls.course}</div>
                      <div className="opacity-70 text-[10px] mt-0.5">{cls.room}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Mobile: simple list */}
      <div className="md:hidden space-y-4">
        {days.map((d) => (
          <div key={d} className="bg-white rounded-2xl border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">{d}</h3>
            <div className="space-y-2">
              {scheduleData[d]?.length ? (
                scheduleData[d].map((cls, i) => (
                  <div key={i} className={`p-3 rounded-xl border ${cls.color}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{cls.course}</span>
                      <span className="text-xs opacity-70">{cls.time}</span>
                    </div>
                    <div className="text-xs opacity-70 mt-1">Room {cls.room}</div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No classes</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
