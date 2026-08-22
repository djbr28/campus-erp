// ============================================================
// Smart Campus ERP — Student Campus Events Module
// ============================================================
"use client";

import { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getSupabaseClient } from "@/lib/supabase/client";
import DataTable from "@/components/ui/DataTable";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import LoadingState from "@/components/ui/LoadingState";
import { CalendarEventIcon, CheckIcon } from "@/components/ui/Icons";
import type { CampusEvent } from "@/types";

export default function StudentEventsPage() {
  const { studentData } = useCurrentUser();
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>(["EVT-001", "EVT-002"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const supabase = getSupabaseClient();
        const { data } = await supabase.from("events").select("*").order("date", { ascending: true });
        if (data && data.length > 0) {
          setEvents(data);
        } else {
          setEvents([
            { id: "EVT-001", title: "Annual University Hackathon 2026", description: "48-hour continuous software prototyping marathon with $25,000 prize pool.", date: "2026-09-20 09:00:00+00", location: "Main Campus Auditorium & Tech Hub", category: "Hackathon & Tech", organizer: "Campus Innovation Cell" },
            { id: "EVT-002", title: "Distinguished AI Keynote: The Future of Intelligence", description: "Special guest seminar discussing next-gen autonomous neural agent architectures.", date: "2026-09-25 14:00:00+00", location: "Science Block Amphitheatre", category: "Guest Seminar", organizer: "Dept. of Computer Science" },
            { id: "EVT-003", title: "Fall Campus Sports & Athletics Meet", description: "Inter-departmental track, football, basketball and swimming tournament.", date: "2026-10-05 08:00:00+00", location: "University Sports Complex", category: "Sports & Fitness", organizer: "Athletics Department" },
          ]);
        }
      } catch (err) {
        console.warn("[StudentEvents] Error loading events:", err);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  const handleRegister = (eventId: string) => {
    if (registeredEventIds.includes(eventId)) {
      setRegisteredEventIds((prev) => prev.filter((id) => id !== eventId));
    } else {
      setRegisteredEventIds((prev) => [...prev, eventId]);
    }
  };

  if (loading) return <LoadingState message="Loading upcoming campus events…" />;

  return (
    <div className="space-y-6 animate-fade-in text-[#f4f6d6]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">Campus Events & Activities</h1>
          <p className="page-subtitle">
            Workshops, hackathons, guest lectures, cultural festivals, and university athletic meets.
          </p>
        </div>
        <Badge variant="blue">{registeredEventIds.length} Events Registered</Badge>
      </div>

      <div className="grid-3">
        <StatCard
          label="Upcoming Campus Events"
          value={`${events.length} Events`}
          change="This Quarter"
          trend="neutral"
          icon={<CalendarEventIcon className="w-5 h-5 text-[#bf783e]" />}
        />
        <StatCard
          label="My Confirmed Passes"
          value={`${registeredEventIds.length} Passes`}
          change="VIP Access"
          trend="up"
          icon={<CheckIcon className="w-5 h-5 text-emerald-400" />}
        />
        <StatCard
          label="Activity Credits"
          value="+15 Points"
          change="Honors Record"
          trend="up"
          icon={<span className="text-base font-bold text-[#bf783e]">⭐</span>}
        />
      </div>

      <DataTable
        title="Campus Event Calendar & Registration"
        subtitle="Reserve entry passes and earn extracurricular activity credits"
        badgeText={`${events.length} Total Events`}
        data={events}
        keyExtractor={(e) => e.id}
        columns={[
          {
            key: "title",
            header: "Event",
            render: (e) => (
              <div>
                <div className="font-bold text-[#f4f6d6] text-sm">{e.title}</div>
                <div className="text-xs text-white/50 font-light mt-0.5 line-clamp-1">{e.description}</div>
              </div>
            ),
          },
          { key: "category", header: "Category", render: (e) => <Badge variant="gray">{e.category || "Campus"}</Badge> },
          { key: "date", header: "Date & Time", render: (e) => <span className="text-xs text-white/70">{new Date(e.date).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</span> },
          { key: "location", header: "Venue", render: (e) => <span className="text-xs text-white/80">{e.location}</span> },
          {
            key: "action",
            header: "Registration",
            render: (e) => {
              const isRegistered = registeredEventIds.includes(e.id);
              return (
                <button
                  onClick={() => handleRegister(e.id)}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                    isRegistered
                      ? "bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 hover:bg-rose-950 hover:text-rose-300 hover:border-rose-700"
                      : "bg-[#f4f6d6] text-[#0e0e0e] hover:bg-white"
                  }`}
                >
                  {isRegistered ? "Registered ✓" : "Register Now"}
                </button>
              );
            },
          },
        ]}
      />
    </div>
  );
}
