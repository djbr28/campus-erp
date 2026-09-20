// ============================================================
// Smart Campus ERP — Parent Incidents View (Live Supabase + Fallback)
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

export default function ParentIncidentsPage() {
  const [items, setItems] = useState<Incident[]>([]);
  const [viewIncident, setViewIncident] = useState<Incident | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        // The schema column is `priority`, not `severity`.
        severity: d.priority || "medium",
        status: d.status || "Open",
        description: d.description,
        resolved_at: d.resolved_at || undefined,
        time: d.created_at ? new Date(d.created_at).toLocaleDateString() : "Just now",
      }));
      setItems(mapped);
    } catch (err: any) {
      console.error("[ParentIncidents] Error loading incidents:", err);
      setError(err?.message || "Failed to load incidents from the database.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadIncidents();
  }, [loadIncidents]);

  const activeCount = items.filter((i) => i.status !== "Resolved").length;
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
          <h1 className="page-title">Campus Incidents</h1>
          <p className="page-subtitle">
            View safety reports and incident status for your child&apos;s campus zone.
          </p>
        </div>
        <Badge variant={activeCount > 0 ? "amber" : "green"} dot>
          {activeCount} Active
        </Badge>
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

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="stat-card">
          <div className="text-xs font-semibold text-white/50 uppercase tracking-wider">Active Incidents</div>
          <div className="font-serif text-2xl font-normal text-[#f4f6d6] mt-1">{activeCount}</div>
        </div>
        <div className="stat-card">
          <div className="text-xs font-semibold text-white/50 uppercase tracking-wider">Resolved</div>
          <div className="font-serif text-2xl font-normal text-emerald-400 mt-1">{resolvedCount}</div>
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
            {f === "all" ? "All Incidents" : f === "active" ? `Active (${activeCount})` : `Resolved (${resolvedCount})`}
          </button>
        ))}
      </div>

      {/* Incidents List */}
      <div className="card-flat overflow-hidden">
        <div className="divide-y divide-white/5">
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="w-9 h-9 border-3 border-white/20 border-t-[#bf783e] rounded-full animate-spin mx-auto" />
                <p className="mt-3 text-xs text-white/50">Loading campus incidents…</p>
              </div>
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <EmptyState
              icon={<CheckIcon className="w-6 h-6 text-emerald-400" />}
              title="No incidents in this view"
              description="All campus zones report normal status under this filter."
            />
          )}

          {!isLoading && filtered.map((inc) => (
            <div
              key={inc.id}
              className={`p-5 sm:p-6 transition-colors hover:bg-white/[0.02] cursor-pointer ${
                inc.status === "Resolved" ? "opacity-60" : ""
              } ${
                inc.severity === "critical" && inc.status !== "Resolved"
                  ? "bg-rose-950/20 border-l-4 border-l-rose-500"
                  : ""
              }`}
              onClick={() => setViewIncident(inc)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-sm font-bold text-[#f4f6d6]">{inc.title}</span>
                    <Badge variant={severityVariants[inc.severity || "medium"] || "amber"}>
                      {(inc.severity || "medium").toUpperCase()}
                    </Badge>
                    <Badge variant={statusVariants[inc.status] || "blue"} dot>
                      {inc.status}
                    </Badge>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-xs text-white/50 font-light">
                    <span>Category: <strong className="text-white/80">{inc.category}</strong></span>
                    <span>•</span>
                    <span>Location: <strong className="text-white/80">{inc.location}</strong></span>
                    <span>•</span>
                    <span>{inc.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
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
                <div className="text-[11px] font-bold uppercase tracking-wider text-white/40">Severity</div>
                <div className="mt-1">
                  <Badge variant={severityVariants[viewIncident.severity || "medium"] || "amber"}>
                    {(viewIncident.severity || "medium").toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-white/40">Status</div>
                <div className="mt-1">
                  <Badge variant={statusVariants[viewIncident.status] || "blue"} dot>
                    {viewIncident.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-white/60 uppercase tracking-wider mb-1.5">
                Description
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
