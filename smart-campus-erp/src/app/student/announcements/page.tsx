// ============================================================
// Smart Campus ERP — Student Announcements
// ============================================================
"use client";

import { useState } from "react";
import { announcements } from "@/lib/mock-data-step2";

const priorityStyles: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-blue-100 text-blue-700",
};

export default function StudentAnnouncementsPage() {
  const [items, setItems] = useState(announcements);

  const markRead = (id: string) => {
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  const unreadCount = items.filter((a) => !a.read).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="mt-1 text-sm text-gray-500">Campus-wide announcements and updates</p>
        </div>
        {unreadCount > 0 && (
          <span className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-600 rounded-full">
            {unreadCount} unread
          </span>
        )}
      </div>

      <div className="space-y-3">
        {items.map((a) => (
          <div
            key={a.id}
            onClick={() => markRead(a.id)}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              a.read
                ? "bg-white border-gray-100 hover:border-gray-200"
                : "bg-blue-50/50 border-blue-200 hover:border-blue-300 shadow-sm"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {!a.read && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />}
                  <h3 className={`text-sm font-semibold ${a.read ? "text-gray-700" : "text-gray-900"}`}>
                    {a.title}
                  </h3>
                  <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${priorityStyles[a.priority]}`}>
                    {a.priority}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{a.description}</p>
                <p className="mt-2 text-xs text-gray-400">{a.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
