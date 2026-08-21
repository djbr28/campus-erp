// ============================================================
// Smart Campus ERP — Admin Students Management
// ============================================================
"use client";

import { useState } from "react";
import { allStudents } from "@/lib/mock-data-step2";

export default function AdminStudentsPage() {
  const [search, setSearch] = useState("");

  const filtered = allStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.program.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage student records · {allStudents.length} total
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
          + Add Student
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID, or program…"
            className="w-full sm:w-80 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500">
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Program</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Year</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">GPA</th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">Attendance</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{s.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{s.program}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">Yr {s.year}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{s.gpa}</td>
                  <td className="px-5 py-3 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${s.attendancePct >= 85 ? "bg-green-500" : s.attendancePct >= 75 ? "bg-amber-500" : "bg-red-500"}`}
                          style={{ width: `${Math.min(s.attendancePct, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-500">{s.attendancePct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                        s.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : s.status === "On Leave"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">
                    No students match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
