// ============================================================
// Smart Campus ERP — Students Page
// ============================================================

const mockStudents = [
  { id: "STU-001", name: "Alex Johnson", grade: "CS-301", gpa: "3.8", status: "Active" },
  { id: "STU-002", name: "Priya Patel", grade: "CS-302", gpa: "3.9", status: "Active" },
  { id: "STU-003", name: "James Rodriguez", grade: "EE-201", gpa: "3.5", status: "Active" },
  { id: "STU-004", name: "Li Wei", grade: "CS-301", gpa: "3.7", status: "Active" },
  { id: "STU-005", name: "Emma Watson", grade: "BA-401", gpa: "3.6", status: "On Leave" },
  { id: "STU-006", name: "Omar Hassan", grade: "CS-302", gpa: "3.4", status: "Active" },
  { id: "STU-007", name: "Sofia Martinez", grade: "EE-201", gpa: "3.9", status: "Active" },
];

export default function StudentsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="mt-1 text-sm text-gray-500">Manage student records and information</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
          + Add Student
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <input
            type="text"
            placeholder="Search students by name or ID…"
            className="w-full sm:w-80 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Student ID</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Program</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">GPA</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockStudents.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{s.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{s.grade}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{s.gpa}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                        s.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {s.status}
                    </span>
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
