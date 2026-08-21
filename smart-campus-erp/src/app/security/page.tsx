// ============================================================
// Smart Campus ERP — Security Dashboard
// ============================================================
"use client";

import { useState } from "react";
import { incidents } from "@/lib/mock-data-step2";
import type { Incident } from "@/types";

const severityStyles: Record<string, string> = {
  low: "bg-green-100 text-green-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
  critical: "bg-red-200 text-red-800",
};

const statusStyles: Record<string, string> = {
  Open: "bg-blue-100 text-blue-700",
  "In Progress": "bg-amber-100 text-amber-700",
  Resolved: "bg-green-100 text-green-700",
};

export default function SecurityDashboardPage() {
  const [items, setItems] = useState<Incident[]>(incidents);

  const activeIncidents = items.filter((i) => i.status !== "Resolved");
  const criticalCount = activeIncidents.filter((i) => i.severity === "critical" || i.severity === "high").length;

  const updateStatus = (id: string, status: Incident["status"]) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Security Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Monitor campus safety and incident response</p>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="p-5 bg-white rounded-2xl border border-gray-100">
          <div className="text-2xl mb-2">🚨</div>
          <div className="text-2xl font-bold text-gray-900">{activeIncidents.length}</div>
          <div className="text-sm text-gray-500">Active Incidents</div>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-gray-100">
          <div className="text-2xl mb-2">🔴</div>
          <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
          <div className="text-sm text-gray-500">High / Critical</div>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-gray-100">
          <div className="text-2xl mb-2">✅</div>
          <div className="text-2xl font-bold text-green-600">{items.filter((i) => i.status === "Resolved").length}</div>
          <div className="text-sm text-gray-500">Resolved Today</div>
        </div>
      </div>

      {/* Emergency alert banner */}
      {criticalCount > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
          <span className="text-2xl animate-pulse">⚠️</span>
          <div>
            <div className="text-sm font-semibold text-red-800">Active High-Priority Alerts</div>
            <div className="text-xs text-red-600">{criticalCount} incident(s) require immediate attention</div>
          </div>
          <button className="ml-auto px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-colors">
            Respond
          </button>
        </div>
      )}

      {/* Incidents list */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">All Incidents</h2>
        <div className="space-y-3">
          {items.map((inc) => (
            <div
              key={inc.id}
              className={`p-4 rounded-xl border transition-colors ${
                inc.status === "Resolved" ? "border-gray-100 opacity-60" : "border-gray-200 hover:border-blue-200"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900">{inc.title}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${severityStyles[inc.severity]}`}>
                      {inc.severity}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${statusStyles[inc.status]}`}>
                      {inc.status}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {inc.category} · {inc.location} · {inc.time}
                  </div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  {inc.status !== "Resolved" && (
                    <>
                      <button
                        onClick={() => updateStatus(inc.id, "In Progress")}
                        className="px-3 py-1.5 text-xs font-medium bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        Assign
                      </button>
                      <button
                        onClick={() => updateStatus(inc.id, "Resolved")}
                        className="px-3 py-1.5 text-xs font-medium bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        Mark Resolved
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
