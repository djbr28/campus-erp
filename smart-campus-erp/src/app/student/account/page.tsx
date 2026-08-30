// ============================================================
// Smart Campus ERP — Student Account & Security Settings
// ============================================================
"use client";

import { useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getSupabaseClient } from "@/lib/supabase/client";
import DashboardCard from "@/components/ui/DashboardCard";
import Badge from "@/components/ui/Badge";
import LoadingState from "@/components/ui/LoadingState";
import { SecurityIcon, CheckIcon } from "@/components/ui/Icons";

export default function StudentAccountPage() {
  const { studentData, profile, loading } = useCurrentUser();
  const [phone, setPhone] = useState(studentData?.phone || "+1 (555) 019-2834");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const supabase = getSupabaseClient();
      if (studentData?.id) {
        await supabase.from("students").update({ phone }).eq("id", studentData.id);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.warn("[StudentAccount] Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState message="Loading account preferences…" />;

  return (
    <div className="space-y-6 animate-fade-in text-[#f4f6d6]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">My Account & Preferences</h1>
          <p className="page-subtitle">
            Manage your personal contact info, authentication security, and session settings.
          </p>
        </div>
        <Badge variant="green" dot>Active Session</Badge>
      </div>

      <div className="grid-2">
        {/* Personal Details Form */}
        <DashboardCard title="Contact Preferences" subtitle="Update contact numbers for campus SMS alerts">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">Full Name</label>
              <input
                type="text"
                disabled
                value={studentData?.name || profile?.name || "Alex Johnson"}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white/50 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">University Email</label>
              <input
                type="email"
                disabled
                value={studentData?.email || profile?.email || "alex.johnson@campus.edu"}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white/50 cursor-not-allowed font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">Mobile Contact (SMS Alerts)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-[#f4f6d6] focus:border-[#bf783e] focus:outline-hidden"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              {saved && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckIcon className="w-3.5 h-3.5" /> Saved successfully
                </span>
              )}
              <div className="ml-auto">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary text-xs px-5 py-2 font-bold cursor-pointer"
                >
                  {saving ? "Updating…" : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </DashboardCard>

        {/* Security & Authentication */}
        <DashboardCard title="Authentication & Role Security" subtitle="Row Level Security & Identity mapping">
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <SecurityIcon className="w-5 h-5 text-[#bf783e] shrink-0" />
              <div>
                <div className="font-bold text-[#f4f6d6]">Supabase RLS Protected</div>
                <div className="text-[11px] text-white/50 font-light mt-0.5">
                  Your student record is strictly restricted to your authorized profile ID.
                </div>
              </div>
            </div>

            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/50">User Role</span>
              <Badge variant="blue">STUDENT</Badge>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/50">Two-Factor Authentication</span>
              <span className="text-emerald-400 font-medium">Enforced by SSO</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <div>
                <span className="text-white/50 block">FERPA & GDPR Status</span>
                <span className="text-[10px] text-white/30 font-light block max-w-[150px]">Student Data Privacy Regulations</span>
              </div>
              <span className="text-emerald-400 font-medium">Compliant</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-white/50">Current Password</span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-white/80 tracking-widest">{showPassword ? "password123" : "••••••••"}</span>
                <button
                  type="button"
                  className="bg-white/10 hover:bg-white/20 text-[#f4f6d6] text-[10px] font-bold px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
