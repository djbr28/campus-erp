// ============================================================
// Smart Campus ERP — Faculty Announcements (Live Supabase)
// ============================================================
"use client";

import { useState, useEffect, useCallback } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { Announcement } from "@/types";
import Badge, { type BadgeVariant } from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { CheckIcon, AnnouncementsIcon } from "@/components/ui/Icons";

/** Priority → badge colour and left border accent. */
const priorityVariants: Record<string, { badge: BadgeVariant; border: string }> = {
  critical: { badge: "red", border: "border-l-rose-500" },
  high: { badge: "red", border: "border-l-rose-500" },
  medium: { badge: "amber", border: "border-l-[#bf783e]" },
  low: { badge: "blue", border: "border-l-[#f4f6d6]" },
};

export default function FacultyAnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnnouncements = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const supabase = getSupabaseClient();

      // Faculty see campus-wide notices plus anything aimed at FACULTY.
      const { data, error: queryError } = await supabase
        .from("announcements")
        .select("*")
        .or("target_role.eq.ALL,target_role.eq.FACULTY,target_role.is.null")
        .order("date", { ascending: false });

      if (queryError) throw new Error(queryError.message);

      const mapped: Announcement[] = (data || []).map((d: any) => ({
        id: d.id,
        title: d.title,
        description: d.description,
        date: d.date,
        read: false,
        priority: d.priority || "medium",
      }));
      setItems(mapped);
    } catch (err: any) {
      console.error("[FacultyAnnouncements] Error loading announcements:", err);
      setError(err?.message || "Failed to load announcements from the database.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  const markRead = (id: string) => {
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  const markAllRead = () => {
    setItems((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const unreadCount = items.filter((a) => !a.read).length;
  const filtered = filter === "unread" ? items.filter((a) => !a.read) : items;

  return (
    <div className="space-y-6 animate-fade-in text-[#f4f6d6]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Campus Announcements</h1>
          <p className="page-subtitle">
            Department notices, academic bulletins, and campus-wide communications.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <>
              <Badge variant="blue" dot>{unreadCount} Unread</Badge>
              <button onClick={markAllRead} className="btn-secondary btn-sm">
                Mark all read
              </button>
            </>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-rose-950/60 border border-rose-600/50 rounded-2xl text-xs text-rose-200 flex items-center justify-between gap-3">
          <span>{error}</span>
          <button
            onClick={loadAnnouncements}
            className="px-3 py-1 bg-rose-800/60 hover:bg-rose-700/60 rounded-lg text-white font-medium transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-1.5 p-1 bg-white/5 border border-white/10 rounded-full w-fit">
        {(["all", "unread"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all capitalize ${
              filter === f
                ? "bg-[#f4f6d6] text-[#0e0e0e] shadow-sm"
                : "text-white/60 hover:text-white"
            }`}
          >
            {f === "all" ? "All Notices" : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-9 h-9 border-3 border-white/20 border-t-[#bf783e] rounded-full animate-spin mx-auto" />
            <p className="mt-3 text-xs text-white/50">Fetching campus broadcasts…</p>
          </div>
        </div>
      ) : (
        /* Announcements Stream */
        <div className="space-y-3.5">
          {filtered.length === 0 && (
            <div className="card-flat">
              <EmptyState
                icon={<CheckIcon className="w-6 h-6 text-emerald-400" />}
                title={
                  filter === "unread"
                    ? "You're completely caught up!"
                    : "No announcements recorded"
                }
                description="Check back later for department notices, academic bulletins, and campus updates."
              />
            </div>
          )}

          {filtered.map((a) => {
            const config = priorityVariants[a.priority] || priorityVariants.low;
            return (
              <div
                key={a.id}
                onClick={() => markRead(a.id)}
                className={`w-full text-left card-flat p-5 sm:p-6 transition-all duration-150 border-l-4 cursor-pointer hover:border-l-[#bf783e] hover:bg-white/[0.02] ${
                  config.border
                } ${!a.read ? "bg-white/[0.04] border-white/15" : "bg-[#141414]"}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {!a.read && (
                        <span className="w-2 h-2 rounded-full bg-[#bf783e] shrink-0 ring-2 ring-[#bf783e]/30 animate-pulse" />
                      )}
                      <h3
                        className={`text-sm sm:text-base font-bold tracking-tight ${
                          a.read ? "text-white/70" : "text-[#f4f6d6]"
                        }`}
                      >
                        {a.title}
                      </h3>
                      <Badge variant={config.badge}>{a.priority.toUpperCase()} PRIORITY</Badge>
                      {!a.read && <Badge variant="blue">NEW</Badge>}
                    </div>

                    <p className="mt-2 text-xs sm:text-sm text-white/60 leading-relaxed font-light">
                      {a.description}
                    </p>

                    <div className="mt-3 flex items-center gap-2 text-xs text-white/40 font-medium">
                      <AnnouncementsIcon className="w-3.5 h-3.5 text-[#bf783e]" />
                      <span>{a.date}</span>
                      <span>•</span>
                      <span>Verified Broadcast</span>
                    </div>
                  </div>

                  <div className="text-white/30 hover:text-white transition-colors shrink-0 mt-1">
                    {a.read ? (
                      <span className="text-[11px] font-medium text-white/40">Read</span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markRead(a.id);
                        }}
                        className="text-xs font-bold text-[#bf783e] hover:underline"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
