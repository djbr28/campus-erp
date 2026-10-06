"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";

/** The directory row shape this modal edits (mirrors /api/admin/users). */
export interface EditableUser {
  id: string;
  recordId: string | null;
  name: string;
  email: string;
  role: string;
  department: string | null;
  phone: string | null;
  hasAuthAccount: boolean;
  registerNumber?: string | null;
  program?: string | null;
  year?: number | null;
  semester?: number | null;
  status?: string | null;
  designation?: string | null;
  childId?: string | null;
  childName?: string | null;
}

interface EditUserModalProps {
  isOpen: boolean;
  user: EditableUser | null;
  /** The signed-in admin's own profile id, so self-role-edits can be blocked in the UI too. */
  currentAdminId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

/** Form state seeded from the directory row. The caller remounts this
 *  component per user (via `key`), so this runs once per row opened. */
function seedForm(user: EditableUser | null) {
  return {
    role: (user?.role || "STUDENT").toUpperCase(),
    name: user?.name || "",
    email: user?.email || "",
    department: user?.department || "",
    program: user?.program || "",
    year: user?.year != null ? String(user.year) : "",
    semester: user?.semester != null ? String(user.semester) : "",
    registerNumber: user?.registerNumber || "",
    designation: user?.designation || "",
    phone: user?.phone || "",
    childId: user?.childId || "",
    status: user?.status || "Active",
  };
}

const inputClass =
  "w-full bg-[#181818] border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#f4f6d6]/50 transition-colors";

export default function EditUserModal({
  isOpen,
  user,
  currentAdminId,
  onClose,
  onSuccess,
}: EditUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState(() => seedForm(user));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, ...formData }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update user");
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const isSelf = Boolean(currentAdminId && currentAdminId === user.id);

  // Rows that exist only in a role table (seeded data with no login) have no
  // profiles row to edit, so the API would reject them. Say so plainly.
  if (!user.hasAuthAccount) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Record has no login"
        subtitle={`${user.name} exists in the ${user.role.toLowerCase()} table but has no Supabase Auth account.`}
        maxWidth="max-w-lg"
        footer={
          <button type="button" onClick={onClose} className="btn-primary btn-sm">
            Close
          </button>
        }
      >
        <p className="text-sm text-white/70 font-light leading-relaxed">
          Editing works through the account&apos;s profile, and this is a legacy/seeded record without
          one. Create a new user with this person&apos;s details to give them a login, or edit the row
          directly in Supabase.
        </p>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit User"
      subtitle="Updates the profile, the role-specific record, and the Supabase Auth email."
      maxWidth="max-w-2xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" form="edit-user-form" className="btn-primary btn-sm" disabled={loading}>
            {loading ? "Saving…" : "Save Changes"}
          </button>
        </>
      }
    >
      <form id="edit-user-form" onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-white/70">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={isSelf}
              className={`${inputClass} ${isSelf ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <option value="STUDENT">Student</option>
              <option value="FACULTY">Faculty</option>
              <option value="PARENT">Parent</option>
              <option value="SECURITY">Security Officer</option>
              <option value="ADMIN">Administrator</option>
            </select>
            <p className="text-[10px] text-white/40 mt-1">
              {isSelf
                ? "You cannot change your own role. Another administrator must do it."
                : "Changing the role moves this account to the matching record table. The previous record is kept and detached, never deleted."}
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/70">Full Name</label>
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/70">Email Address</label>
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
            />
            <p className="text-[10px] text-white/40 mt-1">
              This is also the sign-in email.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/70">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/70">
              {formData.role === "SECURITY" || formData.role === "ADMIN"
                ? "Department / Unit"
                : "Department"}
            </label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* STUDENT */}
          {formData.role === "STUDENT" && (
            <>
              {user.recordId && (
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-white/70">Student ID</label>
                  <input type="text" value={user.recordId} readOnly disabled className={`${inputClass} opacity-60`} />
                  <p className="text-[10px] text-white/40 mt-1">
                    The Student ID is the key that attendance, fees and academic records hang off, so it
                    is fixed. Use the register number below for a changeable identifier.
                  </p>
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70">Register Number</label>
                <input
                  type="text"
                  name="registerNumber"
                  value={formData.registerNumber}
                  onChange={handleChange}
                  placeholder="REG2026CS001"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70">Program</label>
                <input
                  type="text"
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  placeholder="B.Tech Computer Science"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70">Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70">Semester</label>
                <input
                  type="number"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  min="1"
                  max="20"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-white/70">Enrollment Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Graduated">Graduated</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </>
          )}

          {/* FACULTY */}
          {formData.role === "FACULTY" && (
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-white/70">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="Assistant Professor"
                className={inputClass}
              />
            </div>
          )}

          {/* PARENT */}
          {formData.role === "PARENT" && (
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-white/70">
                Child&apos;s Student ID <span className="text-rose-400">*</span> (Required)
              </label>
              <input
                required
                type="text"
                name="childId"
                value={formData.childId}
                onChange={handleChange}
                placeholder="STU-001"
                className={inputClass}
              />
              <p className="text-[10px] text-white/40 mt-1">
                Verified against the database on save. A parent account is never left without a student.
                {user.childName ? ` Currently linked to ${user.childName}.` : ""}
              </p>
            </div>
          )}

          {/* ADMIN / SECURITY */}
          {(formData.role === "ADMIN" || formData.role === "SECURITY") && (
            <div className="sm:col-span-2">
              <p className="text-[10px] text-white/40">
                {formData.role === "SECURITY" ? "Security officers" : "Administrators"} are stored in
                Supabase Auth and the profiles table — this schema has no separate role table for them.
              </p>
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
}
