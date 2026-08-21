// ============================================================
// Smart Campus ERP — Students Page v2
// ============================================================
"use client";

import { useState } from "react";

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
  const [search, setSearch] = useState("");

  const filtered = mockStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">Students</h1>
            <p className="page-subtitle">Manage student records and information</p>
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
              placeholder="Search by name or ID..."
              className="input-search"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th className="hidden sm:table-cell">Program</th>
                <th className="hidden md:table-cell">GPA</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="table-row-clickable">
                  <td className="font-mono text-xs text-gray-500">{s.id}</td>
                  <td className="font-medium text-gray-900">{s.name}</td>
                  <td className="hidden sm:table-cell text-gray-600">{s.grade}</td>
                  <td className="hidden md:table-cell text-gray-600">{s.gpa}</td>
                  <td>
                    <span className={`badge ${
                      s.status === "Active" ? "badge-green" : "badge-amber"
                    }`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5}>
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
