// ============================================================
// Smart Campus ERP — Faculty Students Page (Editorial Aesthetic)
// ============================================================
"use client";

import { useState } from "react";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { SearchIcon, PlusIcon, StudentsIcon } from "@/components/ui/Icons";

const mockStudents = [
  { id: "STU-001", name: "Alex Johnson", email: "alex.j@campus.edu", grade: "CS-301", gpa: "3.8", status: "Active" },
  { id: "STU-002", name: "Priya Patel", email: "priya.p@campus.edu", grade: "CS-302", gpa: "3.9", status: "Active" },
  { id: "STU-003", name: "James Rodriguez", email: "james.r@campus.edu", grade: "EE-201", gpa: "3.5", status: "Active" },
  { id: "STU-004", name: "Li Wei", email: "li.w@campus.edu", grade: "CS-301", gpa: "3.7", status: "Active" },
  { id: "STU-005", name: "Emma Watson", email: "emma.w@campus.edu", grade: "BA-401", gpa: "3.6", status: "On Leave" },
  { id: "STU-006", name: "Omar Hassan", email: "omar.h@campus.edu", grade: "CS-302", gpa: "3.4", status: "Active" },
  { id: "STU-007", name: "Sofia Martinez", email: "sofia.m@campus.edu", grade: "EE-201", gpa: "3.9", status: "Active" },
];

export default function FacultyStudentsPage() {
  const [search, setSearch] = useState("");

  const filtered = mockStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.grade.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in text-[#f4f6d6]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Course Student Roster</h1>
          <p className="page-subtitle">Faculty class enrollment and student academic records.</p>
        </div>
        <button className="btn-primary btn-sm self-start sm:self-auto">
          <PlusIcon className="w-4 h-4" />
          <span>Add Student to Course</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="table-wrapper">
        <div className="p-4 border-b border-white/10 bg-[#181818]">
          <div className="relative max-w-md">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40">
              <SearchIcon className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, ID, or course code..."
              className="input-search text-xs"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th className="hidden sm:table-cell">Enrolled Course</th>
                <th className="hidden md:table-cell">GPA</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="table-row-clickable">
                  <td className="font-mono text-xs font-semibold text-white/40">{s.id}</td>
                  <td>
                    <div className="font-bold text-[#f4f6d6] text-sm">{s.name}</div>
                    <div className="text-xs text-white/40 font-mono">{s.email}</div>
                  </td>
                  <td className="hidden sm:table-cell text-white/80 font-medium">{s.grade}</td>
                  <td className="hidden md:table-cell">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-[#bf783e]/20 text-[#f4f6d6] border border-[#bf783e]/40 font-mono">
                      {s.gpa}
                    </span>
                  </td>
                  <td>
                    <Badge variant={s.status === "Active" ? "green" : "amber"} dot>
                      {s.status}
                    </Badge>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <EmptyState
                      icon={<StudentsIcon className="w-6 h-6 text-white/40" />}
                      title={`No students found matching "${search}"`}
                      description="Check the spelling or try searching by student ID number."
                    />
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
