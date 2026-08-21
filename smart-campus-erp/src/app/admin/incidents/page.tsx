// ============================================================
// Smart Campus ERP — Admin Incidents Management
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

export default function AdminIncidentsPage() {
  const [items, setItems] = useState<Incident[]>(incidents);
  const [viewIncident, setViewIncident] = useState<Incident | null>(null);

  const updateStatus = (id: string, status: Incident["status"]) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Incident Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track and manage all campus incidents · {items.filter((i) => i.status !== "Resolved").length} active
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500">
                <th className="px-5 py-3 font-medium">ID</th>
                <th className="px-5 py-3 font-medium">Incident</th>
                <th className="px-5 py-3 font-medium hidden md:table-cell">Category</th>
                <th className="px-5 py-3 font-medium hidden lg:table-cell">Location</th>
                <th className="px-5 py-3 font-medium">Severity</th>
                <th className="px-5 py-3 font-medium hidden sm:table-cell">Time</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((inc) => (
                <tr key={inc.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-gray-500">{inc.id}</td>
                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-900 text-sm">{inc.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]">{inc.description}</div>
                  </td>
                  <td className="px-5 py-3 text-gray-600 hidden md:table-cell">{inc.category}</td>
                  <td className="px-5 py-3 text-gray-600 hidden lg:table-cell">{inc.location}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${severityStyles[inc.severity]}`}>
                      {inc.severity}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs hidden sm:table-cell">{inc.time}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${statusStyles[inc.status]}`}>
                      {inc.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1 flex-wrap">
                      <button
                        onClick={() => setViewIncident(inc)}
                        className="px-2 py-1 text-[11px] font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        View
                      </button>
                      {inc.status !== "Resolved" && (
                        <>
                          <button
                            onClick={() => updateStatus(inc.id, "In Progress")}
                            className="px-2 py-1 text-[11px] font-medium bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            Assign
                          </button>
                          <button
                            onClick={() => updateStatus(inc.id, "Resolved")}
                            className="px-2 py-1 text-[11px] font-medium bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                          >
                            Resolve
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {viewIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={() => setViewIncident(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{viewIncident.title}</h2>
                <p className="text-sm text-gray-500">{viewIncident.id}</p>
              </div>
              <button onClick={() => setViewIncident(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Category:</span> {viewIncident.category}</div>
              <div><span className="text-gray-500">Location:</span> {viewIncident.location}</div>
              <div><span className="text-gray-500">Severity:</span> <span className={`font-medium ${severityStyles[viewIncident.severity]} px-2 py-0.5 rounded-full text-xs`}>{viewIncident.severity}</span></div>
              <div><span className="text-gray-500">Status:</span> <span className={`font-medium ${statusStyles[viewIncident.status]} px-2 py-0.5 rounded-full text-xs`}>{viewIncident.status}</span></div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Description</div>
              <p className="text-sm text-gray-700">{viewIncident.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
