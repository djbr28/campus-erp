// ============================================================
// Smart Campus ERP — Security Dashboard v2
// ============================================================
"use client";

import { useState } from "react";
import { incidents } from "@/lib/mock-data-step2";
import type { Incident } from "@/types";

export default function SecurityDashboardPage() {
  const [items, setItems] = useState<Incident[]>(incidents);

  const activeIncidents = items.filter((i) => i.status !== "Resolved");
  const criticalCount = activeIncidents.filter((i) => i.severity === "critical" || i.severity === "high").length;

  const updateStatus = (id: string, status: Incident["status"]) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Security Dashboard</h1>
        <p className="page-subtitle">Monitor campus safety and incident response</p>
      </div>

      {/* Emergency banner */}
      {criticalCount > 0 && (
        <div className="alert-banner alert-banner-danger">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 animate-pulse">
            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="font-bold text-sm">EMERGENCY: High-Priority Alerts Active</div>
            <div className="text-sm opacity-90">{criticalCount} incident(s) require immediate attention</div>
          </div>
          <button className="btn-danger btn-sm animate-pulse">
            Respond Now
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid-3">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{activeIncidents.length}</div>
              <div className="text-xs text-gray-500 font-medium">Active Incidents</div>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
              <div className="text-xs text-gray-500 font-medium">High / Critical</div>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{items.filter((i) => i.status === "Resolved").length}</div>
              <div className="text-xs text-gray-500 font-medium">Resolved</div>
            </div>
          </div>
        </div>
      </div>

      {/* Incidents */}
      <div className="card-flat">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="section-heading mb-0">All Incidents</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {items.map((inc) => (
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
                    <span className={`badge ${
                      inc.severity === "low" ? "badge-green" :
                      inc.severity === "medium" ? "badge-amber" :
                      inc.severity === "high" ? "badge-red" : "badge-red-strong"
                    }`}>
                      {inc.severity}
                    </span>
                    <span className={`badge ${
                      inc.status === "Open" ? "badge-blue" :
                      inc.status === "In Progress" ? "badge-amber" : "badge-green"
                    }`}>
                      {inc.status}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {inc.category} · {inc.location} · {inc.time}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  {inc.status !== "Resolved" && (
                    <>
                      <button
                        onClick={() => updateStatus(inc.id, "In Progress")}
                        className="btn-primary btn-sm"
                      >
                        Assign
                      </button>
                      <button
                        onClick={() => updateStatus(inc.id, "Resolved")}
                        className="btn-secondary btn-sm"
                      >
                        Mark Resolved
                      </button>
                    </>
                  )}
                  {inc.status === "Resolved" && (
                    <span className="badge badge-green">Resolved</span>
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
