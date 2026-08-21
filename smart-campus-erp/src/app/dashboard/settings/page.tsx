// ============================================================
// Smart Campus ERP — Settings Page
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
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your account and preferences</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
              SM
            </div>
            <div>
              <button className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                Change Photo
              </button>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                defaultValue="Dr. Sarah Mitchell"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                defaultValue="sarah.mitchell@campus.edu"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
              <input
                type="text"
                defaultValue="Administration"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <input
                type="tel"
                defaultValue="+1 (555) 123-4567"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <button className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
            Save Changes
          </button>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          {[
            { label: "Email Notifications", desc: "Receive email for important updates", enabled: true },
            { label: "Push Notifications", desc: "Browser push notifications", enabled: true },
            { label: "SMS Alerts", desc: "Critical safety alerts via SMS", enabled: false },
            { label: "Weekly Digest", desc: "Summary of campus activity", enabled: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
              <div>
                <div className="text-sm font-medium text-gray-900">{item.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
              </div>
              <div className={`w-10 h-6 rounded-full transition-colors cursor-pointer flex items-center px-1 ${item.enabled ? "bg-blue-600" : "bg-gray-300"}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${item.enabled ? "translate-x-4" : ""}`} />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "appearance" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
            <div className="grid grid-cols-3 gap-3">
              {["Light", "Dark", "System"].map((t) => (
                <button
                  key={t}
                  className={`p-4 rounded-xl border-2 text-sm font-medium transition-colors ${
                    t === "Light" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {t === "Light" ? "☀️" : t === "Dark" ? "🌙" : "💻"} {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Sidebar</label>
            <p className="text-xs text-gray-500">Sidebar will always be visible on desktop.</p>
          </div>
        </div>
      )}

      {activeTab === "security" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Change Password</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Current Password</label>
                <input type="password" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div />
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">New Password</label>
                <input type="password" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Confirm Password</label>
                <input type="password" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <button className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
              Update Password
            </button>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-semibold text-gray-900">Two-Factor Authentication</h3>
            <p className="text-xs text-gray-500 mt-1">Add an extra layer of security to your account.</p>
            <button className="mt-3 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors">
              Enable 2FA
            </button>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-semibold text-gray-900">Active Sessions</h3>
            <div className="mt-3 p-4 rounded-xl bg-gray-50 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">Chrome on macOS</div>
                <div className="text-xs text-gray-500">Last active: now</div>
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Current</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
