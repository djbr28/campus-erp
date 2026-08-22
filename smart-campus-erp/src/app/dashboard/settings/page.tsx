// ============================================================
// Smart Campus ERP — Settings Page (Editorial Aesthetic)
// ============================================================
"use client";

import { useState } from "react";
import Badge from "@/components/ui/Badge";

export default function SettingsPage() {
  // Note: Settings page still uses mock display data
  // This will be updated when settings CRUD is implemented
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
    { id: "appearance", label: "Interface Theme" },
    { id: "security", label: "Password & Security" },
  ];

  const toggleNotif = (key: string) => {
    setNotifStates((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
              SM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base font-normal text-[#f4f6d6]">Dr. Sarah Mitchell</h3>
                <Badge variant="blue">Faculty Admin</Badge>
              </div>
              <p className="text-xs text-white/50 mt-0.5 font-light">JPG, PNG or GIF format under 2MB.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 pt-2">
            <div>
              <label htmlFor="settings-name" className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                id="settings-name"
                type="text"
                defaultValue="Dr. Sarah Mitchell"
                className="input"
              />
            </div>
            <div>
              <label htmlFor="settings-email" className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-1.5">
                Institutional Email
              </label>
              <input
                id="settings-email"
                type="email"
                defaultValue="sarah.mitchell@campus.edu"
                className="input"
              />
            </div>
            <div>
              <label htmlFor="settings-dept" className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-1.5">
                Assigned Department
              </label>
              <input
                id="settings-dept"
                type="text"
                defaultValue="Computer Science & Engineering"
                className="input"
              />
            </div>
            <div>
              <label htmlFor="settings-phone" className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-1.5">
                Contact Phone
              </label>
              <input
                id="settings-phone"
                type="tel"
                defaultValue="+1 (555) 123-4567"
                className="input"
              />
            </div>
          </div>

          <div className="pt-2">
            <button className="btn-primary">
              Save Profile Changes
            </button>
          </div>
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

      {/* Appearance Tab */}
      {activeTab === "appearance" && (
        <div className="card-flat p-6 sm:p-8 space-y-6 bg-[#141414] border border-white/10">
          <div>
            <h3 className="font-serif text-base font-normal text-[#f4f6d6]">Interface Theme</h3>
            <p className="text-xs text-white/50 mt-0.5 font-light">Customize the visual theme and contrast level of the ERP dashboard.</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "dark", label: "Editorial Dark", icon: "🌙", active: true },
              { id: "cream", label: "Warm Oat Cream", icon: "🌾", active: false },
              { id: "system", label: "System Sync", icon: "💻", active: false },
            ].map((theme) => (
              <div
                key={theme.id}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                  theme.active
                    ? "border-[#bf783e] bg-[#bf783e]/20 text-[#f4f6d6] shadow-sm"
                    : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                <span className="text-2xl block mb-1">{theme.icon}</span>
                <span className="text-xs font-bold block">{theme.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="card-flat p-6 sm:p-8 space-y-6 bg-[#141414] border border-white/10">
          <div>
            <h3 className="font-serif text-base font-normal text-[#f4f6d6]">Change Password</h3>
            <p className="text-xs text-white/50 mt-0.5 font-light">Ensure your account uses a strong, unique password.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="current-pw" className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-1">
                Current Password
              </label>
              <input id="current-pw" type="password" placeholder="••••••••" className="input" />
            </div>
            <div>
              <label htmlFor="new-pw" className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-1">
                New Password
              </label>
              <input id="new-pw" type="password" placeholder="••••••••" className="input" />
            </div>
            <div>
              <label htmlFor="confirm-pw" className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <input id="confirm-pw" type="password" placeholder="••••••••" className="input" />
            </div>
          </div>

          <button className="btn-primary btn-sm">
            Update Password
          </button>

          <div className="border-t border-white/10 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#f4f6d6]">Two-Factor Authentication (2FA)</h4>
                <p className="text-xs text-white/50 mt-0.5 font-light">Add an extra verification step when signing in to your institutional account.</p>
              </div>
              <Badge variant="green" dot>Active</Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
