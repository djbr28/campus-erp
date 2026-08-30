// ============================================================
// Smart Campus ERP — Faculty Attendance Page (Editorial Aesthetic)
// ============================================================
"use client";

import { useState } from "react";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import { AttendanceIcon, CheckIcon, ScheduleIcon } from "@/components/ui/Icons";

const initialClasses = [
  { time: "08:00 AM", course: "CS-301: Data Structures", section: "A", present: 42, total: 45, pct: 93 },
  { time: "09:30 AM", course: "CS-302: Algorithms", section: "B", present: 38, total: 40, pct: 95 },
  { time: "11:00 AM", course: "EE-201: Circuits & Systems", section: "A", present: 30, total: 35, pct: 86 },
  { time: "01:00 PM", course: "BA-401: Marketing Analytics", section: "C", present: 28, total: 30, pct: 93 },
  { time: "02:30 PM", course: "CS-303: AI Fundamentals", section: "A", present: 0, total: 38, pct: 0 },
];

export default function AttendancePage() {
  const [todayClasses, setTodayClasses] = useState(initialClasses);

  const handleMarkAttendance = (index: number) => {
    const updated = [...todayClasses];
    // Mocking an attendance marking where everyone was present
    updated[index].present = updated[index].total;
    updated[index].pct = 100;
    setTodayClasses(updated);
    alert("Register successfully saved!");
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6 animate-fade-in text-[#f4f6d6]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">Faculty Class Attendance</h1>
          <p className="page-subtitle">{currentDate} · Daily course registers</p>
        </div>
        <Badge variant="blue" dot>5 Scheduled Lectures</Badge>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid-3">
        <StatCard
          label="Total Scheduled Lectures"
          value="5 Lectures"
          icon={<ScheduleIcon className="w-5 h-5 text-[#bf783e]" />}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />
        <StatCard
          label="Cumulative Turnout"
          value="91.7%"
          change="Good"
          trend="up"
          icon={<AttendanceIcon className="w-5 h-5 text-emerald-400" />}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />
        <StatCard
          label="Attendance Pending"
          value="1 Class"
          change="2:30 PM"
          trend="neutral"
          icon={<span className="text-base text-[#bf783e]">⏳</span>}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />
      </div>

      {/* Class Register List */}
      <div className="card-flat overflow-hidden bg-[#141414] border border-white/10">
        <div className="px-6 py-4 border-b border-white/10 bg-[#181818] flex items-center justify-between">
          <div>
            <h2 className="section-heading mb-0">Today&apos;s Lecture Registers</h2>
            <p className="text-xs text-white/50 mt-0.5 font-light">Click to verify or mark real-time classroom attendance</p>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {todayClasses.map((c, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-20 text-xs font-mono font-bold text-white/70 bg-white/5 py-1.5 px-2 rounded-xl text-center shrink-0 border border-white/10">
                  {c.time}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-[#f4f6d6] text-sm truncate">{c.course}</div>
                  <div className="text-xs text-white/40 mt-0.5 font-light">Section {c.section} · Room B-102</div>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0 justify-between sm:justify-end">
                <div className="hidden md:block w-32">
                  <div className="progress-track">
                    <div
                      className={`progress-fill ${
                        c.pct >= 90
                          ? "progress-fill-green"
                          : c.pct > 0
                          ? "progress-fill-amber"
                          : "progress-fill-red"
                      }`}
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`font-serif text-base font-normal ${
                      c.pct >= 90
                        ? "text-emerald-400"
                        : c.pct > 0
                        ? "text-amber-400"
                        : "text-white/40"
                    }`}
                  >
                    {c.pct > 0 ? `${c.pct}%` : "Pending"}
                  </div>
                  <div className="text-xs text-white/40 font-medium mt-0.5">
                    {c.present}/{c.total} Students
                  </div>
                </div>

                <button
                  onClick={() => c.pct === 0 ? handleMarkAttendance(i) : alert("Viewing register details...")}
                  className={`btn-sm shrink-0 font-bold ${
                    c.pct === 0
                      ? "btn-primary"
                      : "btn-secondary"
                  }`}
                >
                  {c.pct === 0 ? "Mark Attendance" : "View Register"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
