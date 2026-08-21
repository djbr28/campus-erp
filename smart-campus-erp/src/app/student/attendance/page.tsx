// ============================================================
// Smart Campus ERP — Student Attendance
// ============================================================
import { currentStudent, studentAttendance } from "@/lib/mock-data-step2";

export default function StudentAttendancePage() {
  const totalClasses = studentAttendance.reduce((s, a) => s + a.total, 0);
  const totalPresent = studentAttendance.reduce((s, a) => s + a.present, 0);
  const overallPct = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
        <p className="mt-1 text-sm text-gray-500">
          {currentStudent.name} · {currentStudent.program}
        </p>
      </div>

      {/* Overall */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white flex items-center gap-6">
        <div className="text-5xl font-extrabold">{overallPct}%</div>
        <div>
          <div className="text-lg font-semibold">Overall Attendance</div>
          <div className="text-blue-100 text-sm">
            {totalPresent} of {totalClasses} classes attended
          </div>
        </div>
      </div>

      {/* Subject breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Subject-wise Attendance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500">
                <th className="px-5 py-3 font-medium">Subject</th>
                <th className="px-5 py-3 font-medium">Code</th>
                <th className="px-5 py-3 font-medium hidden sm:table-cell">Total</th>
                <th className="px-5 py-3 font-medium hidden sm:table-cell">Present</th>
                <th className="px-5 py-3 font-medium hidden sm:table-cell">Absent</th>
                <th className="px-5 py-3 font-medium">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {studentAttendance.map((a) => (
                <tr key={a.code} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-900">{a.subject}</td>
                  <td className="px-5 py-3 font-mono text-xs text-gray-500">{a.code}</td>
                  <td className="px-5 py-3 text-gray-600 hidden sm:table-cell">{a.total}</td>
                  <td className="px-5 py-3 text-green-600 font-medium hidden sm:table-cell">{a.present}</td>
                  <td className="px-5 py-3 text-red-600 font-medium hidden sm:table-cell">{a.absent}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${a.pct >= 85 ? "bg-green-500" : a.pct >= 75 ? "bg-amber-500" : "bg-red-500"}`}
                          style={{ width: `${a.pct}%` }}
                        />
                      </div>
                      <span className={`text-xs font-semibold ${a.pct >= 85 ? "text-green-600" : a.pct >= 75 ? "text-amber-600" : "text-red-600"}`}>
                        {a.pct}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
