// ============================================================
// Smart Campus ERP — Security Dashboard (Editorial Aesthetic)
// ============================================================
"use client";

import { useState } from "react";
import Link from "next/link";
import { incidents } from "@/lib/mock-data-step2";
import type { Incident } from "@/types";
import StatCard from "@/components/ui/StatCard";
import Badge, { type BadgeVariant } from "@/components/ui/Badge";
import {
  SecurityIcon,
  IncidentsIcon,
  CheckIcon,
  ChevronRightIcon,
} from "@/components/ui/Icons";

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

export default function SecurityDashboardPage() {
  const [items, setItems] = useState<Incident[]>(incidents);

  const activeIncidents = items.filter((i) => i.status !== "Resolved");
  const criticalCount = activeIncidents.filter(
    (i) => i.severity === "critical" || i.severity === "high"
  ).length;

  const updateStatus = (id: string, status: Incident["status"]) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  return (
    <div className="space-y-6 animate-fade-in text-[#f4f6d6]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <span>Security Command Center</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-950 animate-pulse" />
          </h1>
          <p className="page-subtitle">
            Officer Daniel Park on duty · Real-time dispatch, surveillance logs, and incident resolution.
          </p>
        </div>

        <Link
          href="/security/incidents"
          className="btn-primary btn-sm self-start sm:self-auto"
        >
          <IncidentsIcon className="w-4 h-4" />
          <span>Incident Operations Queue</span>
        </Link>
      </div>

      {/* Emergency Active Banner */}
      {criticalCount > 0 && (
        <div className="alert-banner alert-banner-danger flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-950/80 border border-rose-600/50 flex items-center justify-center text-rose-300 shrink-0 animate-pulse">
              <IncidentsIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-rose-200">
                ACTIVE EMERGENCY: {criticalCount} High-Priority Report(s)
              </div>
              <div className="text-xs text-rose-300/80 mt-0.5 font-light">
                Immediate officer dispatch or incident assessment required on campus grounds.
              </div>
            </div>
          </div>
          <Link href="/security/incidents" className="btn-danger btn-sm shrink-0">
            Dispatch Now
          </Link>
        </div>
      )}

      {/* Stats Summary Grid */}
      <div className="grid-3">
        <StatCard
          label="Active Incidents"
          value={activeIncidents.length}
          change={activeIncidents.length > 0 ? "Requires Action" : "All Clear"}
          trend={activeIncidents.length > 0 ? "down" : "up"}
          icon={<IncidentsIcon className="w-5 h-5 text-rose-400" />}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />

        <StatCard
          label="High / Critical Severity"
          value={criticalCount}
          change={criticalCount > 0 ? "High Priority" : "Zero Critical"}
          trend={criticalCount > 0 ? "down" : "up"}
          icon={<SecurityIcon className="w-5 h-5 text-[#bf783e]" />}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />

        <StatCard
          label="Resolved Today"
          value={items.filter((i) => i.status === "Resolved").length}
          change="Cases Closed"
          trend="up"
          icon={<CheckIcon className="w-5 h-5 text-emerald-400" />}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />
      </div>

      {/* Live Incident Dispatch Queue */}
      <div className="card-flat overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 bg-[#181818] flex items-center justify-between">
          <div>
            <h2 className="section-heading mb-0">Live Incident Stream</h2>
            <p className="text-xs text-white/50 mt-0.5 font-light">Assigned security tickets and status dispatch</p>
          </div>
          <Badge variant="blue">{items.length} Records</Badge>
        </div>

        <div className="divide-y divide-white/5">
          {items.map((inc) => (
            <div
              key={inc.id}
              className={`p-6 transition-colors ${
                inc.status === "Resolved"
                  ? "opacity-50 hover:opacity-100 hover:bg-white/[0.02]"
                  : "hover:bg-white/[0.03]"
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

                  <div className="mt-2 flex items-center gap-3 text-xs text-white/50 flex-wrap font-light">
                    <span>Category: <strong className="text-white/80 font-medium">{inc.category}</strong></span>
                    <span>•</span>
                    <span>Location: <strong className="text-white/80 font-medium">{inc.location}</strong></span>
                    <span>•</span>
                    <span>Logged: <strong className="text-white/80 font-medium">{inc.time}</strong></span>
                  </div>

                  <p className="mt-2 text-xs text-white/70 leading-relaxed max-w-2xl font-light">
                    {inc.description}
                  </p>
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
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 px-3.5 py-1 bg-emerald-950/70 rounded-full border border-emerald-700/50">
                      <CheckIcon className="w-3.5 h-3.5" />
                      <span>Case Closed</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/10 bg-[#181818]/60 text-center">
          <Link
            href="/security/incidents"
            className="text-xs font-bold text-[#bf783e] hover:underline inline-flex items-center gap-1"
          >
            <span>Open Advanced Incident Operations View</span>
            <ChevronRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
