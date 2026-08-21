// ============================================================
// Smart Campus ERP — Security Incidents Page
// ============================================================
"use client";

import { useState } from "react";
import { incidents } from "@/lib/mock-data-step2";
import type { Incident } from "@/types";

export default function SecurityIncidentsPage() {
  const [items, setItems] = useState<Incident[]>(incidents);
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("all");

  const filtered = items.filter((i) => {
    if (filter === "active") return i.status !== "Resolved";
    if (filter === "resolved") return i.status === "Resolved";
    return true;
  });

  const activeCount = items.filter((i) => i.status !== "Resolved").length;
  const resolvedCount = items.filter((i) => i.status === "Resolved").length;

  const updateStatus = (id: string, status: Incident["status"]) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Incident Management</h1>
        <p className="page-subtitle">View, assign, and resolve campus security incidents</p>
      </div>

      {/* Stats */}
      <div className="grid-3">
        <div className="stat-card">
          <div className="text-2xl font-bold text-gray-900">{items.length}</div>
          <div className="text-xs text-gray-500 font-medium">Total Incidents</div>
        </div>
        <div className="stat-card">
          <div className="text-2xl font-bold text-red-600">{activeCount}</div>
          <div className="text-xs text-gray-500 font-medium">Active</div>
        </div>
        <div className="stat-card">
          <div className="text-2xl font-bold text-green-600">{resolvedCount}</div>
          <div className="text-xs text-gray-500 font-medium">Resolved</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "active", "resolved"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Incidents list */}
      <div className="card-flat">
        <div className="divide-y divide-gray-100">
          {filtered.length === 0 && (
            <div className="p-10 text-center text-sm text-gray-400">No incidents match this filter.</div>
          )}
          {filtered.map((inc) => (
            <div
              key={inc.id}
              className={`p-5 transition-colors ${
                inc.status === "Resolved" ? "opacity-60" : "hover:bg-gray-50"
              } ${
                inc.severity === "critical" && inc.status !== "Resolved"
                  ? "bg-red-50/50 border-l-4 border-l-red-500"
                  : ""
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900">{inc.title}</span>
                    <span
                      className={`badge ${
                        inc.severity === "low"
                          ? "badge-green"
                          : inc.severity === "medium"
                          ? "badge-amber"
                          : inc.severity === "high"
                          ? "badge-red"
                          : "badge-red-strong"
                      }`}
                    >
                      {inc.severity}
                    </span>
                    <span
                      className={`badge ${
                        inc.status === "Open"
                          ? "badge-blue"
                          : inc.status === "In Progress"
                          ? "badge-amber"
                          : "badge-green"
                      }`}
                    >
                      {inc.status}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {inc.category} · {inc.location} · {inc.time}
                  </div>
                  <div className="mt-1 text-xs text-gray-400 line-clamp-1">{inc.description}</div>
                </div>
                <div className="flex gap-2 shrink-0">
                  {inc.status !== "Resolved" && (
                    <>
                      <button onClick={() => updateStatus(inc.id, "In Progress")} className="btn-primary btn-sm">
                        Assign
                      </button>
                      <button onClick={() => updateStatus(inc.id, "Resolved")} className="btn-secondary btn-sm">
                        Mark Resolved
                      </button>
                    </>
                  )}
                  {inc.status === "Resolved" && <span className="badge badge-green">Resolved</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
