// ============================================================
// Smart Campus ERP — Faculty Timetable & Schedule (Editorial Aesthetic)
// ============================================================
"use client";

import { useState } from "react";
import Badge from "@/components/ui/Badge";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const hours = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

const scheduleData: Record<
  string,
  { time: string; course: string; name: string; room: string; color: string; dot: string }[]
> = {
  Monday: [
    { time: "8:00 AM", course: "CS-301", name: "Data Structures", room: "Lab Room 201", color: "bg-[#bf783e]/20 border-[#bf783e]/40 text-[#f4f6d6]", dot: "bg-[#bf783e]" },
    { time: "11:00 AM", course: "EE-201", name: "Circuits & Logic", room: "Hall B-105", color: "bg-purple-950/40 border-purple-700/40 text-purple-200", dot: "bg-purple-400" },
    { time: "2:00 PM", course: "CS-303", name: "AI Fundamentals", room: "Room 302", color: "bg-emerald-950/40 border-emerald-700/40 text-emerald-200", dot: "bg-emerald-400" },
  ],
  Tuesday: [
    { time: "9:00 AM", course: "CS-302", name: "Algorithms Analysis", room: "Lab Room 201", color: "bg-amber-950/40 border-amber-700/40 text-amber-200", dot: "bg-amber-400" },
    { time: "1:00 PM", course: "BA-401", name: "Marketing Tech", room: "Lecture Hall 405", color: "bg-rose-950/40 border-rose-700/40 text-rose-200", dot: "bg-rose-400" },
  ],
  Wednesday: [
    { time: "8:00 AM", course: "CS-301", name: "Data Structures", room: "Lab Room 201", color: "bg-[#bf783e]/20 border-[#bf783e]/40 text-[#f4f6d6]", dot: "bg-[#bf783e]" },
    { time: "10:00 AM", course: "CS-303", name: "AI Fundamentals", room: "Room 302", color: "bg-emerald-950/40 border-emerald-700/40 text-emerald-200", dot: "bg-emerald-400" },
    { time: "2:00 PM", course: "EE-201", name: "Circuits & Logic", room: "Hall B-105", color: "bg-purple-950/40 border-purple-700/40 text-purple-200", dot: "bg-purple-400" },
  ],
  Thursday: [
    { time: "9:00 AM", course: "CS-302", name: "Algorithms Analysis", room: "Lab Room 201", color: "bg-amber-950/40 border-amber-700/40 text-amber-200", dot: "bg-amber-400" },
    { time: "11:00 AM", course: "BA-401", name: "Marketing Tech", room: "Lecture Hall 405", color: "bg-rose-950/40 border-rose-700/40 text-rose-200", dot: "bg-rose-400" },
  ],
  Friday: [
    { time: "8:00 AM", course: "CS-301", name: "Data Structures", room: "Lab Room 201", color: "bg-[#bf783e]/20 border-[#bf783e]/40 text-[#f4f6d6]", dot: "bg-[#bf783e]" },
    { time: "10:00 AM", course: "CS-303", name: "AI Fundamentals", room: "Room 302", color: "bg-emerald-950/40 border-emerald-700/40 text-emerald-200", dot: "bg-emerald-400" },
    { time: "1:00 PM", course: "EE-201", name: "Circuits & Logic", room: "Hall B-105", color: "bg-purple-950/40 border-purple-700/40 text-purple-200", dot: "bg-purple-400" },
  ],
};

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState("Monday");

  return (
    <div className="space-y-6 animate-fade-in text-[#f4f6d6]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Class Schedule & Timetable</h1>
          <p className="page-subtitle">Weekly faculty lecture schedule and room allocations</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn-secondary btn-sm">← Prev</button>
          <Badge variant="blue">Current Term</Badge>
          <button className="btn-secondary btn-sm">Next →</button>
        </div>
      </div>

      {/* Desktop Timetable Matrix */}
      <div className="hidden md:block card-flat overflow-hidden bg-[#141414] border border-white/10">
        {/* Days Header */}
        <div className="grid grid-cols-[100px_repeat(5,1fr)] border-b border-white/10 bg-[#181818]">
          <div className="p-3.5 text-xs font-bold text-white/40 border-r border-white/10 flex items-center justify-center">
            Time
          </div>
          {days.map((d) => (
            <div
              key={d}
              className="p-3.5 text-xs font-bold text-[#f4f6d6] text-center border-r border-white/10 last:border-r-0 uppercase tracking-wider"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Time Rows */}
        {hours.map((hour) => (
          <div
            key={hour}
            className="grid grid-cols-[100px_repeat(5,1fr)] border-b border-white/5 last:border-b-0 min-h-[72px]"
          >
            <div className="p-2.5 text-xs font-mono font-bold text-white/40 border-r border-white/10 flex items-start justify-center bg-[#181818]/40">
              {hour}
            </div>

            {days.map((d) => {
              const cls = scheduleData[d]?.find((c) => c.time === hour);
              return (
                <div key={`${d}-${hour}`} className="p-1.5 border-r border-white/5 last:border-r-0">
                  {cls && (
                    <div
                      className={`h-full p-2.5 rounded-xl border transition-all duration-150 hover:scale-[1.02] ${cls.color}`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <span className={`w-1.5 h-1.5 rounded-full ${cls.dot}`} />
                        <span>{cls.course}</span>
                      </div>
                      <div className="text-[11px] font-light opacity-90 truncate mt-0.5">{cls.name}</div>
                      <div className="text-[10px] font-mono opacity-60 mt-1">{cls.room}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Mobile: Day Tabs + Course List */}
      <div className="md:hidden space-y-4">
        {/* Day Selector Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {days.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`px-4 py-2 text-xs font-bold rounded-full whitespace-nowrap transition-all ${
                selectedDay === d
                  ? "bg-[#f4f6d6] text-[#0e0e0e] shadow-sm"
                  : "bg-white/5 text-white/70 border border-white/10"
              }`}
            >
              {d.slice(0, 3)}
            </button>
          ))}
        </div>

        {/* Selected Day Courses */}
        <div className="card-flat p-5 space-y-3 bg-[#141414] border border-white/10">
          <h3 className="font-serif text-base font-normal text-[#f4f6d6] mb-3">{selectedDay} Lectures</h3>
          {scheduleData[selectedDay]?.length ? (
            scheduleData[selectedDay].map((cls, i) => (
              <div key={i} className={`p-4 rounded-2xl border ${cls.color}`}>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">{cls.course}: {cls.name}</span>
                  <span className="text-xs font-mono font-bold">{cls.time}</span>
                </div>
                <div className="text-xs opacity-70 mt-1 font-light">Location: {cls.room}</div>
              </div>
            ))
          ) : (
            <p className="text-xs text-white/40 py-4 text-center font-light">No scheduled lectures for this day.</p>
          )}
        </div>
      </div>
    </div>
  );
}
