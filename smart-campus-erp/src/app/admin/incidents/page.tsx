// ============================================================
// Smart Campus ERP — Admin Incidents Management v2
// ============================================================
"use client";

import { useState } from "react";
import { incidents } from "@/lib/mock-data-step2";
import type { Incident } from "@/types";

export default function AdminIncidentsPage() {
  const [items, setItems] = useState<Incident[]>(incidents);
  const [viewIncident, setViewIncident] = useState<Incident | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("all");

  const updateStatus = (id: string, status: Incident["status"]) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  const activeCount = items.filter((i) => i.status !== "Resolved").length;
  const filtered = filter === "all" ? items : filter === "active" ? items.filter((i) => i.status !== "Resolved") : items.filter((i) => i.status === "Resolved");

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Incident Management</h1>
        <p className="page-subtitle">
          Track and manage all campus incidents · {activeCount} active
        </p>
      </div>

      {/* Stats */}
      <div className="grid-3">
        <div className="stat-card">
          <div className="text-sm text-gray-500 mb-1">Active Incidents</div>
          <div className="text-2xl font-bold text-gray-900">{activeCount}</div>
        </div>
        <div className="stat-card">
          <div className="text-sm text-gray-500 mb-1">High / Critical</div>
          <div className="text-2xl font-bold text-red-600">
            {items.filter((i) => (i.severity === "high" || i.severity === "critical") && i.status !== "Resolved").length}
          </div>
        </div>
        <div className="stat-card">
          <div className="text-sm text-gray-500 mb-1">Resolved</div>
          <div className="text-2xl font-bold text-green-600">
            {items.filter((i) => i.status === "Resolved").length}
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
        {(["all", "active", "resolved"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${
              filter === f
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table (desktop) / Cards (mobile) */}
      <div className="table-wrapper">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="hidden sm:table-cell">ID</th>
                <th>Incident</th>
                <th className="hidden md:table-cell">Category</th>
                <th className="hidden lg:table-cell">Location</th>
                <th>Severity</th>
                <th className="hidden sm:table-cell">Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inc) => (
                <tr key={inc.id} className={inc.severity === "critical" ? "bg-red-50/50" : ""}>
                  <td className="hidden sm:table-cell font-mono text-xs text-gray-500">{inc.id}</td>
                  <td>
                    <div className="font-medium text-gray-900 text-sm">{inc.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]">{inc.description}</div>
                  </td>
                  <td className="hidden md:table-cell text-gray-600">{inc.category}</td>
                  <td className="hidden lg:table-cell text-gray-600">{inc.location}</td>
                  <td>
                    <span className={`badge ${
                      inc.severity === "low" ? "badge-green" :
                      inc.severity === "medium" ? "badge-amber" :
                      inc.severity === "high" ? "badge-red" : "badge-red-strong"
                    }`}>
                      {inc.severity}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell text-gray-400 text-xs">{inc.time}</td>
                  <td>
                    <span className={`badge ${
                      inc.status === "Open" ? "badge-blue" :
                      inc.status === "In Progress" ? "badge-amber" : "badge-green"
                    }`}>
                      {inc.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1.5 flex-wrap">
                      <button
                        onClick={() => setViewIncident(inc)}
                        className="btn-ghost"
                      >
                        View
                      </button>
                      {inc.status !== "Resolved" && (
                        <>
                          <button
                            onClick={() => updateStatus(inc.id, "In Progress")}
                            className="btn-ghost text-blue-600 hover:bg-blue-50"
                          >
                            Assign
                          </button>
                          <button
                            onClick={() => updateStatus(inc.id, "Resolved")}
                            className="btn-ghost text-green-600 hover:bg-green-50"
                          >
                            Resolve
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state py-12">
                      <div className="text-3xl mb-3">✅</div>
                      <p className="text-sm text-gray-500">No incidents match this filter.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {viewIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={() => setViewIncident(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{viewIncident.title}</h2>
                <p className="text-sm text-gray-400 font-mono mt-0.5">{viewIncident.id}</p>
              </div>
              <button
                onClick={() => setViewIncident(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-medium text-gray-400 mb-1">Category</div>
                  <div className="text-sm font-medium text-gray-900">{viewIncident.category}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-400 mb-1">Location</div>
                  <div className="text-sm font-medium text-gray-900">{viewIncident.location}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-400 mb-1">Severity</div>
                  <span className={`badge ${
                    viewIncident.severity === "low" ? "badge-green" :
                    viewIncident.severity === "medium" ? "badge-amber" :
                    viewIncident.severity === "high" ? "badge-red" : "badge-red-strong"
                  }`}>
                    {viewIncident.severity}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-400 mb-1">Status</div>
                  <span className={`badge ${
                    viewIncident.status === "Open" ? "badge-blue" :
                    viewIncident.status === "In Progress" ? "badge-amber" : "badge-green"
                  }`}>
                    {viewIncident.status}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-400 mb-1">Description</div>
                <p className="text-sm text-gray-700 leading-relaxed">{viewIncident.description}</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
              <button onClick={() => setViewIncident(null)} className="btn-secondary">
                Close
              </button>
              {viewIncident.status !== "Resolved" && (
                <button
                  onClick={() => {
                    updateStatus(viewIncident.id, "Resolved");
                    setViewIncident(null);
                  }}
                  className="btn-primary"
                >
                  Mark Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
