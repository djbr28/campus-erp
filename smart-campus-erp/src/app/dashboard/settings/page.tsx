// ============================================================
// Smart Campus ERP — Settings Page v2
// ============================================================
"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "notifications", label: "Notifications" },
    { id: "appearance", label: "Appearance" },
    { id: "security", label: "Security" },
  ];

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account and preferences</p>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <div className="card-flat p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
              SM
            </div>
            <div>
              <button className="btn-secondary btn-sm">
                Change Photo
              </button>
              <p className="text-xs text-gray-400 mt-1.5">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="settings-name" className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                id="settings-name"
                type="text"
                defaultValue="Dr. Sarah Mitchell"
                className="input"
              />
            </div>
            <div>
              <label htmlFor="settings-email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                id="settings-email"
                type="email"
                defaultValue="sarah.mitchell@campus.edu"
                className="input"
              />
            </div>
            <div>
              <label htmlFor="settings-dept" className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
              <input
                id="settings-dept"
                type="text"
                defaultValue="Administration"
                className="input"
              />
            </div>
            <div>
              <label htmlFor="settings-phone" className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <input
                id="settings-phone"
                type="tel"
                defaultValue="+1 (555) 123-4567"
                className="input"
              />
            </div>
          </div>

          <button className="btn-primary">
            Save Changes
          </button>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="card-flat p-6 space-y-4">
          {[
            { label: "Email Notifications", desc: "Receive email for important updates", enabled: true },
            { label: "Push Notifications", desc: "Browser push notifications", enabled: true },
            { label: "SMS Alerts", desc: "Critical safety alerts via SMS", enabled: false },
            { label: "Weekly Digest", desc: "Summary of campus activity", enabled: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div>
                <div className="text-sm font-medium text-gray-900">{item.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
              </div>
              <div
                className={`w-10 h-6 rounded-full transition-colors cursor-pointer flex items-center px-1 ${
                  item.enabled ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${
                  item.enabled ? "translate-x-4" : ""
                }`} />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "appearance" && (
        <div className="card-flat p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Theme</label>
            <div className="grid grid-cols-3 gap-3">
              {(["Light", "Dark", "System"] as const).map((t) => (
                <button
                  key={t}
                  className={`p-4 rounded-lg border-2 text-sm font-medium transition-all ${
                    t === "Light"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {t === "Light" ? "☀️" : t === "Dark" ? "🌙" : "💻"} {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sidebar</label>
            <p className="text-xs text-gray-500">Sidebar will always be visible on desktop.</p>
          </div>
        </div>
      )}

      {activeTab === "security" && (
        <div className="card-flat p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Change Password</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="current-pw" className="block text-xs font-medium text-gray-500 mb-1">Current Password</label>
                <input id="current-pw" type="password" className="input" />
              </div>
              <div />
              <div>
                <label htmlFor="new-pw" className="block text-xs font-medium text-gray-500 mb-1">New Password</label>
                <input id="new-pw" type="password" className="input" />
              </div>
              <div>
                <label htmlFor="confirm-pw" className="block text-xs font-medium text-gray-500 mb-1">Confirm Password</label>
                <input id="confirm-pw" type="password" className="input" />
              </div>
            </div>
            <button className="btn-primary mt-3">
              Update Password
            </button>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900">Two-Factor Authentication</h3>
            <p className="text-xs text-gray-500 mt-1">Add an extra layer of security to your account.</p>
            <button className="btn-primary mt-3" style={{ background: "var(--green-600)" }}>
              Enable 2FA
            </button>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900">Active Sessions</h3>
            <div className="mt-3 p-4 rounded-lg bg-gray-50 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">Chrome on macOS</div>
                <div className="text-xs text-gray-500">Last active: now</div>
              </div>
              <span className="badge badge-green">Current</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
