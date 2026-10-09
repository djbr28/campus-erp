// ============================================================
// Smart Campus ERP — Settings Page (Editorial Aesthetic)
//
// Profile details are read from the signed-in faculty member's
// profiles / faculty rows. Only the contact phone is editable here;
// identity fields are managed by an administrator.
// ============================================================
"use client";

import { useState } from "react";
import Badge from "@/components/ui/Badge";
import LoadingState from "@/components/ui/LoadingState";
import { CheckIcon } from "@/components/ui/Icons";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getSupabaseClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const { profile, facultyData, initials, loading } = useCurrentUser();
  const [activeTab, setActiveTab] = useState("profile");
  const [notifStates, setNotifStates] = useState<Record<string, boolean>>({
    email: true,
    push: true,
    sms: false,
    digest: true,
  });

  const tabs = [
    { id: "profile", label: "Profile & Information" },
    { id: "notifications", label: "Notification Channels" },
    { id: "security", label: "Password & Security" },
  ];

  const toggleNotif = (key: string) => {
    setNotifStates((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) return <LoadingState message="Loading your settings…" />;

  const name = facultyData?.name || profile?.name || "";
  const email = facultyData?.email || profile?.email || "";
  const department = facultyData?.department || profile?.department || "";
  const designation = facultyData?.designation || "";

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl text-[#f4f6d6]">
      {/* Header */}
      <div>
        <h1 className="page-title">Account & System Settings</h1>
        <p className="page-subtitle">Manage personal profile details, notifications, and security preferences.</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1.5 p-1 bg-white/5 border border-white/10 rounded-full w-fit overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-bold rounded-full transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-[#f4f6d6] text-[#0e0e0e] shadow-sm"
                : "text-white/60 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="card-flat p-6 sm:p-8 space-y-6 bg-[#141414] border border-white/10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-[#f4f6d6] text-[#0e0e0e] flex items-center justify-center text-xl font-extrabold shadow-sm ring-4 ring-white/10">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif text-base font-normal text-[#f4f6d6]">{name || "Not provided"}</h3>
                <Badge variant="blue">{designation || profile?.role || "FACULTY"}</Badge>
              </div>
              <p className="text-xs text-white/50 mt-0.5 font-light">
                Name, email and department are managed by your administrator.
              </p>
            </div>
          </div>

          {/* Mounted after load so the phone field starts from the stored value. */}
          <FacultyProfileForm
            profileId={profile?.id ?? null}
            name={name}
            email={email}
            department={department}
            initialPhone={facultyData?.phone || ""}
          />
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="card-flat p-6 sm:p-8 space-y-4 bg-[#141414] border border-white/10">
          <div>
            <h3 className="font-serif text-base font-normal text-[#f4f6d6]">Notification Preferences</h3>
            <p className="text-xs text-white/50 mt-0.5 font-light">Control how and when you receive university alerts and digests.</p>
          </div>

          {[
            { key: "email", label: "Email Notifications", desc: "Receive immediate email alerts for high-priority incidents and messages" },
            { key: "push", label: "Browser Push Notifications", desc: "Show desktop popups when students submit project reports or incident tickets" },
            { key: "sms", label: "Emergency SMS Alerts", desc: "Receive urgent campus safety broadcasts directly on your mobile device" },
            { key: "digest", label: "Weekly Academic Digest", desc: "Receive a compiled weekly summary of class attendance and department performance" },
          ].map((item) => (
            <div
              key={item.key}
              onClick={() => toggleNotif(item.key)}
              className="flex items-center justify-between p-4 rounded-2xl border border-white/10 hover:bg-white/[0.02] transition-colors cursor-pointer bg-[#181818]"
            >
              <div>
                <div className="text-sm font-bold text-[#f4f6d6]">{item.label}</div>
                <div className="text-xs text-white/50 mt-0.5 font-light">{item.desc}</div>
              </div>
              <div
                className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ${
                  notifStates[item.key] ? "bg-[#bf783e]" : "bg-white/20"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform shadow-xs ${
                    notifStates[item.key] ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="card-flat p-6 sm:p-8 space-y-6 bg-[#141414] border border-white/10">
          <div>
            <h3 className="font-serif text-base font-normal text-[#f4f6d6]">Password Security</h3>
            <p className="text-xs text-white/50 mt-0.5 font-light">
              Your password is managed by Supabase Auth and stored only as a one-way hash. It cannot
              be viewed by anyone, including administrators.
            </p>
          </div>

          <div className="flex justify-between items-center py-2 text-xs border-t border-white/10 pt-6">
            <div>
              <span className="text-white/50 block">Password</span>
              <span className="text-[10px] text-white/30 font-light block">Managed by Supabase Auth</span>
            </div>
            <span
              className="font-mono text-white/80 tracking-widest"
              aria-label="Password hidden for security"
              title="Hidden for security"
            >
              ••••••••••
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function FacultyProfileForm({
  profileId,
  name,
  email,
  department,
  initialPhone,
}: {
  profileId: string | null;
  name: string;
  email: string;
  department: string;
  initialPhone: string;
}) {
  const [phone, setPhone] = useState(initialPhone);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileId) return;
    setSaving(true);
    setSaveError(null);
    try {
      // RLS allows a faculty member to update only the faculty row linked to
      // their own profile; .select() confirms a row was actually written.
      const { data, error } = await getSupabaseClient()
        .from("faculty")
        .update({ phone: phone.trim() || null })
        .eq("profile_id", profileId)
        .select("id");

      if (error) {
        setSaveError("Your contact number could not be saved.");
        return;
      }
      if (!data || data.length === 0) {
        setSaveError("No faculty record is linked to your account. Contact an administrator.");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const readOnlyClass = "input opacity-60 cursor-not-allowed";

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 pt-2">
        <div>
          <label htmlFor="settings-name" className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-1.5">
            Full Name
          </label>
          <input id="settings-name" type="text" value={name} placeholder="Not provided" disabled className={readOnlyClass} />
        </div>
        <div>
          <label htmlFor="settings-email" className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-1.5">
            Institutional Email
          </label>
          <input id="settings-email" type="email" value={email} placeholder="Not provided" disabled className={readOnlyClass} />
        </div>
        <div>
          <label htmlFor="settings-dept" className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-1.5">
            Assigned Department
          </label>
          <input id="settings-dept" type="text" value={department} placeholder="Not provided" disabled className={readOnlyClass} />
        </div>
        <div>
          <label htmlFor="settings-phone" className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-1.5">
            Contact Phone
          </label>
          <input
            id="settings-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Not provided"
            className="input"
          />
        </div>
      </div>

      <div className="pt-2 flex items-center gap-4">
        <button type="submit" disabled={saving || !profileId} className="btn-primary">
          {saving ? "Saving…" : "Save Contact Phone"}
        </button>
        {saved && (
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <CheckIcon className="w-3.5 h-3.5" /> Saved successfully
          </span>
        )}
        {saveError && <span className="text-xs text-rose-400 font-semibold">{saveError}</span>}
      </div>
    </form>
  );
}
