"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddUserModal({ isOpen, onClose, onSuccess }: AddUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    role: "STUDENT",
    name: "",
    email: "",
    password: "",
    department: "",
    program: "",
    year: "1",
    semester: "1",
    registerNumber: "",
    designation: "",
    phone: "",
    childId: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create user");
      }

      onSuccess();
      onClose();
      // Reset form
      setFormData({
        role: "STUDENT",
        name: "",
        email: "",
        password: "",
        department: "",
        program: "",
        year: "1",
        semester: "1",
        registerNumber: "",
        designation: "",
        phone: "",
        childId: "",
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New User"
      subtitle="Create a new Student, Faculty, or Parent account."
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
          <button
            type="submit"
            form="add-user-form"
            className="btn-primary btn-sm"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </>
      }
    >
      <form id="add-user-form" onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full bg-[#181818] border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#f4f6d6]/50 transition-colors"
            >
              <option value="STUDENT">Student</option>
              <option value="FACULTY">Faculty</option>
              <option value="PARENT">Parent</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/70">Full Name</label>
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full bg-[#181818] border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#f4f6d6]/50 transition-colors"
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
              placeholder="john@example.com"
              className="w-full bg-[#181818] border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#f4f6d6]/50 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/70">Initial Password</label>
            <input
              required
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min 6 characters"
              minLength={6}
              className="w-full bg-[#181818] border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#f4f6d6]/50 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/70">Phone Number (Optional)</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className="w-full bg-[#181818] border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#f4f6d6]/50 transition-colors"
            />
          </div>

          {/* Conditional Fields: STUDENT */}
          {formData.role === "STUDENT" && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70">Register Number</label>
                <input
                  required
                  type="text"
                  name="registerNumber"
                  value={formData.registerNumber}
                  onChange={handleChange}
                  placeholder="STU-001"
                  className="w-full bg-[#181818] border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#f4f6d6]/50 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70">Department</label>
                <input
                  required
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Computer Science"
                  className="w-full bg-[#181818] border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#f4f6d6]/50 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70">Program</label>
                <input
                  required
                  type="text"
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  placeholder="B.Tech Computer Science"
                  className="w-full bg-[#181818] border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#f4f6d6]/50 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70">Year & Semester</label>
                <div className="flex gap-2">
                  <input
                    required
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    min="1"
                    max="5"
                    className="w-full bg-[#181818] border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#f4f6d6]/50 transition-colors"
                  />
                  <input
                    required
                    type="number"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    className="w-full bg-[#181818] border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#f4f6d6]/50 transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          {/* Conditional Fields: FACULTY */}
          {formData.role === "FACULTY" && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70">Department</label>
                <input
                  required
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Computer Science"
                  className="w-full bg-[#181818] border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#f4f6d6]/50 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70">Designation</label>
                <input
                  required
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="Assistant Professor"
                  className="w-full bg-[#181818] border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#f4f6d6]/50 transition-colors"
                />
              </div>
            </>
          )}

          {/* Conditional Fields: PARENT */}
          {formData.role === "PARENT" && (
            <>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-white/70">Child's Student ID (Optional)</label>
                <input
                  type="text"
                  name="childId"
                  value={formData.childId}
                  onChange={handleChange}
                  placeholder="STU-001"
                  className="w-full bg-[#181818] border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#f4f6d6]/50 transition-colors"
                />
                <p className="text-[10px] text-white/40 mt-1">
                  Enter the exact Student ID (e.g. STU-001) to link this parent account to the student.
                </p>
              </div>
            </>
          )}
        </div>
      </form>
    </Modal>
  );
}
