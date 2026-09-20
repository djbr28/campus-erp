// ============================================================
// Smart Campus ERP — Admin Incidents Management (Live Supabase + Fallback)
// ============================================================
"use client";

import { useState, useEffect, useCallback } from "react";

import { getSupabaseClient } from "@/lib/supabase/client";
import type { Incident } from "@/types";
import Badge, { type BadgeVariant } from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import { IncidentsIcon, CheckIcon } from "@/components/ui/Icons";

const severityVariants: Record<string, BadgeVariant> = {
  low: "green",
  medium: "amber",
  high: "red",
  critical: "red-strong",
};

const statusVariants: Record<string, BadgeVariant> = {
  Open: "blue",
  "In Progress": "amber",
  Resolved: "green",
};

export default function AdminIncidentsPage() {
  const [items, setItems] = useState<Incident[]>([]);
  const [viewIncident, setViewIncident] = useState<Incident | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Admin has read-only oversight of incidents. Resolution is a
  // SECURITY-only capability, enforced in the API route and in RLS.
  const loadIncidents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const supabase = getSupabaseClient();
      const { data, error: queryError } = await supabase
        .from("incidents")
        .select("*")
        .order("created_at", { ascending: false });

      if (queryError) throw new Error(queryError.message);

      const mapped: Incident[] = (data || []).map((d: any) => ({
        id: d.id,
        title: d.title,
        category: d.category,
        location: d.location,
        severity: d.priority || "medium",
        status: d.status || "Open",
        description: d.description,
        resolved_at: d.resolved_at || undefined,
        time: d.created_at ? new Date(d.created_at).toLocaleDateString() : "Recently",
      }));
      setItems(mapped);
    } catch (err: any) {
      console.error("[AdminIncidents] Error loading incidents:", err);
      setError(err?.message || "Failed to load incidents from the database.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadIncidents();
  }, [loadIncidents]);

  const activeCount = items.filter((i) => i.status !== "Resolved").length;
  const criticalCount = items.filter(
    (i) => (i.severity === "high" || i.severity === "critical") && i.status !== "Resolved"
  ).length;
  const resolvedCount = items.filter((i) => i.status === "Resolved").length;

  const filtered =
    filter === "all"
      ? items
      : filter === "active"
      ? items.filter((i) => i.status !== "Resolved")
      : items.filter((i) => i.status === "Resolved");

  return (
    <div className="space-y-6 animate-fade-in text-[#f4f6d6]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Incident Oversight</h1>
          <p className="page-subtitle">
            Read-only log of campus safety reports. Resolution is handled by Campus Security.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={activeCount > 0 ? "red" : "green"} dot>
            {activeCount} Active Issues
          </Badge>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-rose-950/60 border border-rose-600/50 rounded-2xl text-xs text-rose-200 flex items-center justify-between gap-3">
          <span>{error}</span>
          <button
            onClick={loadIncidents}
            className="px-3 py-1 bg-rose-800/60 hover:bg-rose-700/60 rounded-lg text-white font-medium transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats Summary Bar */}
      <div className="grid-3">
        <div className="stat-card">
          <div className="text-xs font-semibold text-white/50 uppercase tracking-wider">Active Incidents</div>
          <div className="font-serif text-2xl sm:text-3xl font-normal text-[#f4f6d6] mt-1">{activeCount}</div>
        </div>
        <div className="stat-card">
          <div className="text-xs font-semibold text-white/50 uppercase tracking-wider">Critical / High Severity</div>
          <div className="font-serif text-2xl sm:text-3xl font-normal text-rose-400 mt-1">{criticalCount}</div>
        </div>
        <div className="stat-card">
          <div className="text-xs font-semibold text-white/50 uppercase tracking-wider">Resolved Cases</div>
          <div className="font-serif text-2xl sm:text-3xl font-normal text-emerald-400 mt-1">{resolvedCount}</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 p-1 bg-white/5 border border-white/10 rounded-full w-fit">
        {(["all", "active", "resolved"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all capitalize ${
              filter === f
                ? "bg-[#f4f6d6] text-[#0e0e0e] shadow-sm"
                : "text-white/60 hover:text-white"
            }`}
          >
            {f === "all" ? "All Incidents" : f}
          </button>
        ))}
      </div>

      {/* Table Section */}
      <div className="table-wrapper">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="hidden sm:table-cell">ID</th>
                <th>Incident Details</th>
                <th className="hidden md:table-cell">Category</th>
                <th className="hidden lg:table-cell">Location</th>
                <th>Severity</th>
                <th className="hidden sm:table-cell">Reported</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading && filtered.map((inc) => (
                <tr
                  key={inc.id}
                  className={`transition-colors ${
                    inc.severity === "critical" && inc.status !== "Resolved"
                      ? "bg-rose-950/20"
                      : ""
                  }`}
                >
                  <td className="hidden sm:table-cell font-mono text-xs font-semibold text-white/40">
                    {inc.id}
                  </td>
                  <td>
                    <div className="font-bold text-[#f4f6d6] text-sm">{inc.title}</div>
                    <div className="text-xs text-white/60 mt-0.5 line-clamp-1 max-w-[240px] font-light">
                      {inc.description}
                    </div>
                  </td>
                  <td className="hidden md:table-cell text-xs font-semibold text-white/80">
                    {inc.category}
                  </td>
                  <td className="hidden lg:table-cell text-xs text-white/60 font-medium">
                    {inc.location}
                  </td>
                  <td>
                    <Badge variant={severityVariants[inc.severity || "medium"] || "amber"}>
                      {(inc.severity || "medium").toUpperCase()}
                    </Badge>
                  </td>
                  <td className="hidden sm:table-cell text-white/40 text-xs font-medium">
                    {inc.time}
                  </td>
                  <td>
                    <Badge variant={statusVariants[inc.status] || "blue"} dot>
                      {inc.status}
                    </Badge>
                  </td>
                  <td className="text-right">
                    <div className="inline-flex items-center gap-2 justify-end">
                      <button
                        onClick={() => setViewIncident(inc)}
                        className="btn-ghost"
                      >
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {isLoading && (
                <tr>
                  <td colSpan={8}>
                    <div className="flex items-center justify-center py-16">
                      <div className="text-center">
                        <div className="w-9 h-9 border-3 border-white/20 border-t-[#bf783e] rounded-full animate-spin mx-auto" />
                        <p className="mt-3 text-xs text-white/50">Loading incident records…</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}

              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <EmptyState
                      icon={<CheckIcon className="w-6 h-6 text-emerald-400" />}
                      title="No incidents in this view"
                      description="All incidents under this filter have been addressed or no records exist."
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Detail Modal */}
      {viewIncident && (
        <Modal
          isOpen={true}
          onClose={() => setViewIncident(null)}
          title={viewIncident.title}
          subtitle={`Reference ID: ${viewIncident.id}`}
          footer={
            <button
              onClick={() => setViewIncident(null)}
              className="btn-secondary btn-sm"
            >
              Close
            </button>
          }
        >
          <div className="space-y-4 text-[#f4f6d6]">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[#181818] border border-white/10">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-white/40">Category</div>
                <div className="text-sm font-bold text-[#f4f6d6] mt-0.5">{viewIncident.category}</div>
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-white/40">Location</div>
                <div className="text-sm font-bold text-[#f4f6d6] mt-0.5">{viewIncident.location}</div>
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-white/40">Severity Level</div>
                <div className="mt-1">
                  <Badge variant={severityVariants[viewIncident.severity || "medium"] || "amber"}>
                    {(viewIncident.severity || "medium").toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-white/40">Current Status</div>
                <div className="mt-1">
                  <Badge variant={statusVariants[viewIncident.status] || "blue"} dot>
                    {viewIncident.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-white/60 uppercase tracking-wider mb-1.5">
                Incident Description & Context
              </div>
              <p className="text-sm text-white/80 leading-relaxed p-4 rounded-2xl bg-[#181818] border border-white/10 font-light">
                {viewIncident.description}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
