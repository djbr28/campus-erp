// ============================================================
// Smart Campus ERP — Admin User Directory (Live Supabase)
//
// Reads every real account through /api/admin/users, which runs
// server-side with the service role after verifying the caller is
// an ADMIN. The browser never queries auth.users directly.
// ============================================================
"use client";

import { useState, useEffect, useCallback } from "react";

import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { SearchIcon, PlusIcon, StudentsIcon } from "@/components/ui/Icons";
import AddUserModal from "@/components/admin/AddUserModal";

/** Matches the `role` query parameter accepted by /api/admin/users. */
type RoleTab = "ALL" | "STUDENT" | "FACULTY" | "PARENT" | "SECURITY" | "ADMIN";

const roleTabs: { key: RoleTab; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "STUDENT", label: "Students" },
  { key: "FACULTY", label: "Faculty" },
  { key: "PARENT", label: "Parents" },
  { key: "SECURITY", label: "Security" },
  { key: "ADMIN", label: "Admins" },
];

interface DirectoryUser {
  id: string;
  recordId: string | null;
  name: string;
  email: string;
  role: RoleTab;
  department: string | null;
  phone: string | null;
  created_at: string | null;
  hasAuthAccount: boolean;
  registerNumber?: string | null;
  program?: string | null;
  year?: number | null;
  gpa?: string | null;
  status?: string | null;
  attendancePct?: number | null;
  designation?: string | null;
  childId?: string | null;
  childName?: string | null;
}

const roleBadge: Record<string, "green" | "amber" | "blue" | "red" | "gray"> = {
  STUDENT: "blue",
  FACULTY: "green",
  PARENT: "amber",
  SECURITY: "red",
  ADMIN: "gray",
};

export default function AdminUserDirectoryPage() {
  const [users, setUsers] = useState<DirectoryUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleTab, setRoleTab] = useState<RoleTab>("ALL");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "On Leave">("All");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch(`/api/admin/users?role=${roleTab}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to load the user directory.");
      }

      setUsers(data.users || []);
    } catch (err) {
      console.error("[AdminUserDirectory] Error loading users:", err);
      setError(err instanceof Error ? err.message : "Failed to load the user directory.");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [roleTab]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const showStudentColumns = roleTab === "STUDENT";

  const filtered = users.filter((u) => {
    const needle = search.toLowerCase();
    const matchesSearch =
      !needle ||
      u.name.toLowerCase().includes(needle) ||
      u.email.toLowerCase().includes(needle) ||
      u.id.toLowerCase().includes(needle) ||
      (u.recordId || "").toLowerCase().includes(needle) ||
      (u.program || "").toLowerCase().includes(needle) ||
      (u.department || "").toLowerCase().includes(needle);

    const matchesStatus =
      !showStudentColumns || statusFilter === "All" ? true : u.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const students = users.filter((u) => u.role === "STUDENT");
  const withGpa = students.filter((s) => s.gpa != null && s.gpa !== "");
  const avgGpa =
    withGpa.length > 0
      ? (withGpa.reduce((acc, s) => acc + parseFloat(String(s.gpa)), 0) / withGpa.length).toFixed(2)
      : "0.00";
  const avgAttendance =
    students.length > 0
      ? Math.round(students.reduce((acc, s) => acc + Number(s.attendancePct || 0), 0) / students.length)
      : 0;

  const authAccounts = users.filter((u) => u.hasAuthAccount).length;

  return (
    <div className="space-y-6 animate-fade-in text-[#f4f6d6]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">User Directory</h1>
          <p className="page-subtitle">
            Every account on record — students, faculty, parents, security, and administrators.
          </p>
        </div>
        <button
          onClick={() => setIsAddUserModalOpen(true)}
          className="btn-primary btn-sm self-start sm:self-auto"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-rose-950/60 border border-rose-600/50 rounded-2xl text-xs text-rose-200 flex items-center justify-between gap-3">
          <span>{error}</span>
          <button
            onClick={loadUsers}
            className="px-3 py-1 bg-rose-800/60 hover:bg-rose-700/60 rounded-lg text-white font-medium transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* KPI Stats Bar */}
      <div className="grid-3">
        <div className="stat-card">
          <div className="text-xs font-semibold text-white/50 uppercase tracking-wider">
            {roleTab === "ALL" ? "Total Accounts" : `Total ${roleTabs.find((t) => t.key === roleTab)?.label}`}
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-normal text-[#f4f6d6] mt-1">
            {users.length}
          </div>
        </div>
        {showStudentColumns ? (
          <>
            <div className="stat-card">
              <div className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                Institutional Avg GPA
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-normal text-[#bf783e] mt-1">
                {avgGpa} / 4.0
              </div>
            </div>
            <div className="stat-card">
              <div className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                Avg Attendance Rate
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-normal text-emerald-400 mt-1">
                {avgAttendance}%
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="stat-card">
              <div className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                With Login Access
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-normal text-emerald-400 mt-1">
                {authAccounts}
              </div>
            </div>
            <div className="stat-card">
              <div className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                Records Without Login
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-normal text-[#bf783e] mt-1">
                {users.length - authAccounts}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Role Tabs */}
      <div className="flex gap-1.5 p-1 bg-white/5 border border-white/10 rounded-full w-fit flex-wrap">
        {roleTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setRoleTab(tab.key)}
            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
              roleTab === tab.key
                ? "bg-[#f4f6d6] text-[#0e0e0e] shadow-sm"
                : "text-white/60 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="table-wrapper">
        {/* Search & Filter Toolbar */}
        <div className="p-4 border-b border-white/10 bg-[#181818] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40">
              <SearchIcon className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, ID, or department..."
              className="input-search text-xs"
            />
          </div>

          {showStudentColumns && (
            <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-full border border-white/10 self-start sm:self-auto">
              {(["All", "Active", "On Leave"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
                    statusFilter === status
                      ? "bg-[#f4f6d6] text-[#0e0e0e] shadow-sm"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                {showStudentColumns ? (
                  <>
                    <th className="hidden sm:table-cell">Program</th>
                    <th className="hidden md:table-cell">Year</th>
                    <th className="hidden md:table-cell">GPA</th>
                    <th className="hidden lg:table-cell">Attendance</th>
                    <th>Status</th>
                  </>
                ) : (
                  <>
                    <th>Role</th>
                    <th className="hidden sm:table-cell">Department</th>
                    <th className="hidden md:table-cell">Detail</th>
                    <th>Login</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={showStudentColumns ? 7 : 6}>
                    <div className="flex items-center justify-center py-16">
                      <div className="text-center">
                        <div className="w-9 h-9 border-3 border-white/20 border-t-[#bf783e] rounded-full animate-spin mx-auto" />
                        <p className="mt-3 text-xs text-white/50">Loading user directory…</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}

              {!isLoading &&
                filtered.map((u) => (
                  <tr key={`${u.role}-${u.id}`} className="table-row-clickable">
                    <td className="font-mono text-xs font-semibold text-white/50">
                      {u.recordId || u.id.slice(0, 8)}
                    </td>
                    <td>
                      <div className="font-bold text-[#f4f6d6] text-sm">{u.name}</div>
                      <div className="text-xs text-white/40 font-mono">{u.email}</div>
                    </td>

                    {showStudentColumns ? (
                      <>
                        <td className="hidden sm:table-cell text-white/80 font-medium">
                          {u.program || "—"}
                        </td>
                        <td className="hidden md:table-cell text-white/60 text-xs font-semibold">
                          {u.year ? `Year ${u.year}` : "—"}
                        </td>
                        <td className="hidden md:table-cell">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-[#bf783e]/20 text-[#f4f6d6] border border-[#bf783e]/40 font-mono">
                            {u.gpa ?? "—"}
                          </span>
                        </td>
                        <td className="hidden lg:table-cell">
                          {(() => {
                            const att = Number(u.attendancePct || 0);
                            return (
                              <div className="flex items-center gap-3 min-w-[130px]">
                                <div className="flex-1 progress-track">
                                  <div
                                    className={`progress-fill ${
                                      att >= 85
                                        ? "progress-fill-green"
                                        : att >= 75
                                        ? "progress-fill-amber"
                                        : "progress-fill-red"
                                    }`}
                                    style={{ width: `${Math.min(att, 100)}%` }}
                                  />
                                </div>
                                <span
                                  className={`text-xs font-bold tabular-nums ${
                                    att >= 85
                                      ? "text-emerald-400"
                                      : att >= 75
                                      ? "text-amber-400"
                                      : "text-rose-400"
                                  }`}
                                >
                                  {att}%
                                </span>
                              </div>
                            );
                          })()}
                        </td>
                        <td>
                          <Badge
                            variant={
                              u.status === "Active"
                                ? "green"
                                : u.status === "On Leave"
                                ? "amber"
                                : "gray"
                            }
                            dot
                          >
                            {u.status || "—"}
                          </Badge>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>
                          <Badge variant={roleBadge[u.role] || "gray"}>{u.role}</Badge>
                        </td>
                        <td className="hidden sm:table-cell text-white/80 font-medium">
                          {u.department || "—"}
                        </td>
                        <td className="hidden md:table-cell text-xs text-white/60 font-medium">
                          {u.role === "STUDENT"
                            ? u.program || "—"
                            : u.role === "FACULTY"
                            ? u.designation || "—"
                            : u.role === "PARENT"
                            ? u.childName || u.childId || "No child linked"
                            : u.phone || "—"}
                        </td>
                        <td>
                          <Badge variant={u.hasAuthAccount ? "green" : "gray"} dot>
                            {u.hasAuthAccount ? "Active" : "No account"}
                          </Badge>
                        </td>
                      </>
                    )}
                  </tr>
                ))}

              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={showStudentColumns ? 7 : 6}>
                    <EmptyState
                      icon={<StudentsIcon className="w-6 h-6 text-white/40" />}
                      title={
                        search
                          ? `No users found matching "${search}"`
                          : "No users in this category yet"
                      }
                      description="Try a different name, email, or department — or add a new user."
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSuccess={loadUsers}
      />
    </div>
  );
}
