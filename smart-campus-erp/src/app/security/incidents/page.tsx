// ============================================================
// Smart Campus ERP — Security Incidents Operations (Editorial Aesthetic)
// ============================================================
"use client";

import { useState, useEffect } from "react";

import { getSupabaseClient } from "@/lib/supabase/client";
import type { Incident } from "@/types";
import Badge, { type BadgeVariant } from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import StatCard from "@/components/ui/StatCard";
import { IncidentsIcon, CheckIcon, SecurityIcon } from "@/components/ui/Icons";

const severityVariants: Record<Incident["severity"], BadgeVariant> = {
  low: "green",
  medium: "amber",
  high: "red",
  critical: "red-strong",
};

const statusVariants: Record<Incident["status"], BadgeVariant> = {
  Open: "blue",
  "In Progress": "amber",
  Resolved: "green",
};

export default function SecurityIncidentsPage() {
  const [items, setItems] = useState<Incident[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("all");

  useEffect(() => {
    async function loadIncidents() {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from("incidents")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.warn("[SecurityIncidents] Supabase query error, using defaults:", error.message);
        } else if (data && data.length > 0) {
          const mapped: Incident[] = data.map((d: any) => ({
            id: d.id,
            title: d.title,
            category: d.category,
            location: d.location,
            severity: d.severity || "medium",
            status: d.status || "Open",
            description: d.description,
            time: d.created_at || "Just now",
          }));
          setItems(mapped);
        }
      } catch (err) {
        console.warn("[SecurityIncidents] Exception loading incidents:", err);
      }
    }

    loadIncidents();
  }, []);

  const filtered = items.filter((i) => {
    if (filter === "active") return i.status !== "Resolved";
    if (filter === "resolved") return i.status === "Resolved";
    return true;
  });

  const activeCount = items.filter((i) => i.status !== "Resolved").length;
  const resolvedCount = items.filter((i) => i.status === "Resolved").length;

  const updateStatus = async (id: string, status: Incident["status"]) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    try {
      const supabase = getSupabaseClient();
      await supabase.from("incidents").update({ status }).eq("id", id);
    } catch (err) {
      console.warn("[SecurityIncidents] Error updating status in Supabase:", err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-[#f4f6d6]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Security Incident Operations</h1>
          <p className="page-subtitle">
            Review incident telemetry, assign dispatched security personnel, and log resolutions.
          </p>
        </div>
        <Badge variant={activeCount > 0 ? "red" : "green"} dot>
          {activeCount} Active Cases
        </Badge>
      </div>

      {/* KPI Stats */}
      <div className="grid-3">
        <StatCard
          label="Total Incident Log"
          value={items.length}
          icon={<SecurityIcon className="w-5 h-5 text-[#bf783e]" />}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />
        <StatCard
          label="Active & Dispatched"
          value={activeCount}
          change={activeCount > 0 ? "Action Req" : "Clear"}
          trend={activeCount > 0 ? "down" : "up"}
          icon={<IncidentsIcon className="w-5 h-5 text-rose-400" />}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />
        <StatCard
          label="Resolved Cases"
          value={resolvedCount}
          change="Completed"
          trend="up"
          icon={<CheckIcon className="w-5 h-5 text-emerald-400" />}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />
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
            {f === "all" ? "All Cases" : `${f} (${f === "active" ? activeCount : resolvedCount})`}
          </button>
        ))}
      </div>

      {/* Incidents Container */}
      <div className="card-flat overflow-hidden bg-[#141414] border border-white/10">
        <div className="divide-y divide-white/5">
          {filtered.length === 0 && (
            <EmptyState
              icon={<CheckIcon className="w-6 h-6 text-emerald-400" />}
              title="No security incidents in this queue"
              description="All campus zones report normal operational status under this filter."
            />
          )}

          {filtered.map((inc) => (
            <div
              key={inc.id}
              className={`p-6 transition-colors ${
                inc.status === "Resolved" ? "opacity-50 hover:opacity-100" : "hover:bg-white/[0.02]"
              } ${
                inc.severity === "critical" && inc.status !== "Resolved"
                  ? "bg-rose-950/20 border-l-4 border-l-rose-500"
                  : ""
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-xs font-bold text-white/40">{inc.id}</span>
                    <span className="text-sm font-bold text-[#f4f6d6]">{inc.title}</span>
                    <Badge variant={severityVariants[inc.severity]}>
                      {inc.severity.toUpperCase()}
                    </Badge>
                    <Badge variant={statusVariants[inc.status]} dot>
                      {inc.status}
                    </Badge>
                  </div>

                  <div className="mt-2 text-xs text-white/50 flex items-center gap-2.5 flex-wrap font-light">
                    <span>Category: <strong className="text-white/80 font-medium">{inc.category}</strong></span>
                    <span>•</span>
                    <span>Location: <strong className="text-white/80 font-medium">{inc.location}</strong></span>
                    <span>•</span>
                    <span>Reported: <strong className="text-white/80 font-medium">{inc.time}</strong></span>
                  </div>

                  <div className="mt-2 text-xs text-white/70 leading-relaxed max-w-2xl font-light">
                    {inc.description}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
                  {inc.status !== "Resolved" && (
                    <>
                      {inc.status === "Open" && (
                        <button
                          onClick={() => updateStatus(inc.id, "In Progress")}
                          className="btn-primary btn-sm"
                        >
                          Assign Unit
                        </button>
                      )}
                      <button
                        onClick={() => updateStatus(inc.id, "Resolved")}
                        className="btn-secondary btn-sm"
                      >
                        Mark Resolved
                      </button>
                    </>
                  )}
                  {inc.status === "Resolved" && (
                    <span className="text-xs font-bold text-emerald-300 px-3.5 py-1 bg-emerald-950/70 rounded-full border border-emerald-700/50 inline-flex items-center gap-1.5">
                      <CheckIcon className="w-3.5 h-3.5" />
                      <span>Resolved</span>
                    </span>
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
