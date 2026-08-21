// ============================================================
// Smart Campus ERP — Student Announcements v2
// ============================================================
"use client";

import { useState } from "react";
import { announcements } from "@/lib/mock-data-step2";
import type { Announcement } from "@/types";

const priorityConfig: Record<string, { badge: string; dot: string; bg: string }> = {
  high: { badge: "badge-red", dot: "bg-red-500", bg: "border-l-red-500" },
  medium: { badge: "badge-amber", dot: "bg-amber-500", bg: "border-l-amber-500" },
  low: { badge: "badge-blue", dot: "bg-blue-500", bg: "border-l-blue-500" },
};

export default function StudentAnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>(announcements);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const markRead = (id: string) => {
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  const markAllRead = () => {
    setItems((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const unreadCount = items.filter((a) => !a.read).length;
  const filtered = filter === "unread" ? items.filter((a) => !a.read) : items;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="page-title">Announcements</h1>
            <p className="page-subtitle">Campus-wide updates and notifications</p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <>
                <span className="badge badge-red">{unreadCount} unread</span>
                <button onClick={markAllRead} className="btn-ghost">
                  Mark all read
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
        {(["all", "unread"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filter === f
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {f === "all" ? "All" : "Unread"}
            {f === "unread" && unreadCount > 0 && (
              <span className="ml-1.5 text-xs">({unreadCount})</span>
            )}
          </button>
        ))}
      </div>

      {/* Announcements list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="empty-state card-flat">
            <div className="text-3xl mb-3">📭</div>
            <p className="text-sm text-gray-500">
              {filter === "unread" ? "All caught up! No unread announcements." : "No announcements yet."}
            </p>
          </div>
        )}

        {filtered.map((a) => {
          const config = priorityConfig[a.priority] || priorityConfig.low;
          return (
            <button
              key={a.id}
              onClick={() => markRead(a.id)}
              className={`w-full text-left card-flat p-5 transition-all border-l-4 ${
                config.bg
              } ${
                !a.read
                  ? "bg-blue-50/30 hover:bg-blue-50/50"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {!a.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    )}
                    <h3 className={`text-sm font-semibold ${
                      a.read ? "text-gray-600" : "text-gray-900"
                    }`}>
                      {a.title}
                    </h3>
                    <span className={`badge ${config.badge}`}>
                      {a.priority}
                    </span>
                    {!a.read && (
                      <span className="badge badge-blue">New</span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-2">
                    {a.description}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">{a.date}</p>
                </div>
                <svg className="w-4 h-4 text-gray-300 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
