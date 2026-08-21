// ============================================================
// Smart Campus ERP — Student Attendance v2
// ============================================================
import { currentStudent, studentAttendance } from "@/lib/mock-data-step2";

export default function StudentAttendancePage() {
  const totalClasses = studentAttendance.reduce((s, a) => s + a.total, 0);
  const totalPresent = studentAttendance.reduce((s, a) => s + a.present, 0);
  const totalAbsent = studentAttendance.reduce((s, a) => s + a.absent, 0);
  const overallPct = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">My Attendance</h1>
        <p className="page-subtitle">{currentStudent.name} · {currentStudent.program}</p>
      </div>

      {/* Overall attendance hero */}
      <div className="card-flat p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-28 h-28 shrink-0">
          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#f3f4f6" strokeWidth="10" />
            <circle
              cx="60" cy="60" r="50" fill="none"
              stroke={overallPct >= 85 ? "#22c55e" : overallPct >= 75 ? "#f59e0b" : "#ef4444"}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${(overallPct / 100) * 314} 314`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">{overallPct}%</span>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Overall Attendance</h2>
          <p className="text-sm text-gray-500 mt-1">
            {totalPresent} classes present · {totalAbsent} absent · {totalClasses} total
          </p>
          {overallPct < 75 && (
            <div className="mt-2 badge badge-red">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
              </svg>
              Below minimum threshold
            </div>
          )}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid-3">
        <div className="stat-card">
          <div className="text-sm text-gray-500 mb-1">Total Classes</div>
          <div className="text-xl font-bold text-gray-900">{totalClasses}</div>
        </div>
        <div className="stat-card">
          <div className="text-sm text-gray-500 mb-1">Present</div>
          <div className="text-xl font-bold text-green-600">{totalPresent}</div>
        </div>
        <div className="stat-card">
          <div className="text-sm text-gray-500 mb-1">Absent</div>
          <div className="text-xl font-bold text-red-600">{totalAbsent}</div>
        </div>
      </div>

      {/* Subject breakdown */}
      <div className="table-wrapper">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="section-heading mb-0">Subject-wise Attendance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Subject</th>
                <th className="hidden sm:table-cell">Code</th>
                <th className="hidden md:table-cell text-center">Total</th>
                <th className="hidden md:table-cell text-center">Present</th>
                <th className="hidden md:table-cell text-center">Absent</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {studentAttendance.map((a) => (
                <tr key={a.code}>
                  <td className="font-medium text-gray-900">{a.subject}</td>
                  <td className="hidden sm:table-cell font-mono text-xs text-gray-500">{a.code}</td>
                  <td className="hidden md:table-cell text-center text-gray-500">{a.total}</td>
                  <td className="hidden md:table-cell text-center text-green-600 font-medium">{a.present}</td>
                  <td className="hidden md:table-cell text-center text-red-500 font-medium">{a.absent}</td>
                  <td>
                    <div className="flex items-center gap-3 min-w-[120px]">
                      <div className="flex-1 progress-track">
                        <div
                          className={`progress-fill ${a.pct >= 85 ? "progress-fill-green" : a.pct >= 75 ? "progress-fill-amber" : "progress-fill-red"}`}
                          style={{ width: `${a.pct}%` }}
                        />
                      </div>
                      <span className={`text-xs font-semibold tabular-nums ${a.pct >= 85 ? "text-green-600" : a.pct >= 75 ? "text-amber-600" : "text-red-600"}`}>
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
