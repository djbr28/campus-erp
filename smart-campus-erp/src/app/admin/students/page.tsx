// ============================================================
// Smart Campus ERP — Admin Students Management v2
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
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">Students</h1>
            <p className="page-subtitle">
              Manage student records · {allStudents.length} total
            </p>
          </div>
          <button className="btn-primary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Student
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID, or program..."
              className="input-search"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th className="hidden sm:table-cell">Program</th>
                <th className="hidden md:table-cell">Year</th>
                <th className="hidden md:table-cell">GPA</th>
                <th className="hidden lg:table-cell">Attendance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="table-row-clickable">
                  <td className="font-mono text-xs text-gray-500">{s.id}</td>
                  <td className="font-medium text-gray-900">{s.name}</td>
                  <td className="hidden sm:table-cell text-gray-600">{s.program}</td>
                  <td className="hidden md:table-cell text-gray-600">Yr {s.year}</td>
                  <td className="hidden md:table-cell text-gray-600">{s.gpa}</td>
                  <td className="hidden lg:table-cell">
                    <div className="flex items-center gap-3 min-w-[100px]">
                      <div className="flex-1 progress-track">
                        <div
                          className={`progress-fill ${
                            s.attendancePct >= 85 ? "progress-fill-green" :
                            s.attendancePct >= 75 ? "progress-fill-amber" : "progress-fill-red"
                          }`}
                          style={{ width: `${Math.min(s.attendancePct, 100)}%` }}
                        />
                      </div>
                      <span className={`text-xs font-semibold tabular-nums ${
                        s.attendancePct >= 85 ? "text-green-600" :
                        s.attendancePct >= 75 ? "text-amber-600" : "text-red-600"
                      }`}>
                        {s.attendancePct}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${
                      s.status === "Active" ? "badge-green" :
                      s.status === "On Leave" ? "badge-amber" : "badge-gray"
                    }`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state py-12">
                      <div className="text-3xl mb-3">🔍</div>
                      <p className="text-sm text-gray-500">No students match &quot;{search}&quot;</p>
                    </div>
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
