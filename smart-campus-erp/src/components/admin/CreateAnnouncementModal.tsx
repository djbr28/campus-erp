// ============================================================
// Smart Campus ERP — Create Announcement Modal (Admin)
//
// Posts to /api/announcements, which verifies the caller is an
// ADMIN (or FACULTY) server-side before inserting into Supabase.
// ============================================================
"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";

interface CreateAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/** Matches the field styling used in AddUserModal. */
const inputClass =
  "w-full bg-[#181818] border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#f4f6d6]/50 transition-colors";

export default function CreateAnnouncementModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateAnnouncementModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    target_role: "ALL",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data?.announcement) {
        throw new Error(data?.error || "Failed to publish the announcement.");
      }

      setFormData({ title: "", description: "", priority: "medium", target_role: "ALL" });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish the announcement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Announcement"
      subtitle="Broadcast a notice to the campus. It is saved to Supabase immediately."
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
            form="create-announcement-form"
            className="btn-primary btn-sm"
            disabled={loading}
          >
            {loading ? "Publishing…" : "Publish Announcement"}
          </button>
        </>
      }
    >
      <form id="create-announcement-form" onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-white/70">Title</label>
          <input
            required
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Campus Maintenance — Science Wing"
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-white/70">Description</label>
          <textarea
            required
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            placeholder="Describe the notice, dates, and any action required…"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/70">Audience</label>
            <select
              name="target_role"
              value={formData.target_role}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="ALL">Everyone</option>
              <option value="STUDENT">Students</option>
              <option value="FACULTY">Faculty</option>
              <option value="PARENT">Parents</option>
              <option value="SECURITY">Security</option>
              <option value="ADMIN">Administrators</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/70">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </form>
    </Modal>
  );
}
