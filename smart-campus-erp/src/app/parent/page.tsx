// ============================================================
// Smart Campus ERP — Parent Dashboard (Editorial Aesthetic)
// ============================================================
import Link from "next/link";
import {
  currentParent,
  currentStudent,
  studentFees,
  studentAttendance,
  announcements,
  parentUpcomingEvents,
} from "@/lib/mock-data-step2";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import {
  StudentsIcon,
  AttendanceIcon,
  FeesIcon,
  SecurityIcon,
  ScheduleIcon,
  ChevronRightIcon,
} from "@/components/ui/Icons";

export default function ParentDashboardPage() {
  const totalFees = studentFees.reduce((s, f) => s + f.total, 0);
  const totalPaid = studentFees
    .filter((f) => f.status === "Paid")
    .reduce((s, f) => s + f.paid, 0);
  const pendingFees = totalFees - totalPaid;
  const latestAnnouncement = announcements[0];

  const totalClasses = studentAttendance.reduce((s, a) => s + a.total, 0);
  const totalPresent = studentAttendance.reduce((s, a) => s + a.present, 0);
  const attendancePct =
    totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in text-[#f4f6d6]">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold mb-3 border border-white/15">
              <span>Parent Access Verified</span>
              <span>•</span>
              <span>Student ID: {currentStudent.id}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#f4f6d6]">
              Welcome, {currentParent.name.split(" ")[0]}! 👋
            </h1>
            <p className="mt-2 text-white/70 text-xs sm:text-sm font-light">
              Monitoring profile & progress for <span className="font-bold text-[#bf783e]">{currentParent.childName}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/student/announcements"
              className="btn-primary btn-sm"
            >
              School Announcements
            </Link>
          </div>
        </div>
      </div>

      {/* Safety Status Banner */}
      <div className="alert-banner alert-banner-success">
        <div className="w-8 h-8 rounded-full bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 flex items-center justify-center shrink-0">
          <SecurityIcon className="w-4 h-4" />
        </div>
        <div className="flex-1 text-xs sm:text-sm">
          <span className="font-bold text-emerald-200">Campus Safety Status: All Verified Clear</span>
          <span className="opacity-90 ml-1 text-emerald-300 font-light">— No active safety incidents or emergency broadcasts in your child&apos;s campus zone.</span>
        </div>
      </div>

      {/* Child KPI Stats Grid */}
      <div className="grid-2 lg:grid-4">
        <StatCard
          label="Enrolled Program"
          value={currentStudent.program}
          subtitle={`Year ${currentStudent.year} • Full Time`}
          icon={<StudentsIcon className="w-5 h-5 text-[#bf783e]" />}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />

        <StatCard
          label="Cumulative Attendance"
          value={`${attendancePct}%`}
          change={attendancePct >= 85 ? "Good Standing" : "Requires Attention"}
          trend={attendancePct >= 85 ? "up" : "down"}
          icon={<AttendanceIcon className="w-5 h-5 text-emerald-400" />}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />

        <StatCard
          label="Tuition Paid"
          value={`$${totalPaid.toLocaleString()}`}
          change={pendingFees > 0 ? `$${pendingFees.toLocaleString()} Due` : "Cleared"}
          trend={pendingFees > 0 ? "neutral" : "up"}
          icon={<FeesIcon className="w-5 h-5 text-[#bf783e]" />}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />

        <StatCard
          label="Academic Standing"
          value={`GPA ${currentStudent.gpa}`}
          change="Dean's List Track"
          trend="up"
          icon={<span className="text-lg">⭐</span>}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />
      </div>

      {/* Events and Bulletins Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Events */}
        <div className="card-flat p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-heading mb-0">Upcoming Academic Calendar</h2>
              <Badge variant="blue">Calendar</Badge>
            </div>

            <div className="space-y-3">
              {parentUpcomingEvents.map((e, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-[#181818] hover:border-[#bf783e]/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 text-[#bf783e] border border-white/10 flex items-center justify-center shrink-0">
                    <ScheduleIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-[#f4f6d6] truncate">{e.event}</div>
                    <div className="text-xs text-white/50 mt-0.5 font-light">{e.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Latest School Announcements */}
        <div className="card-flat p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-heading mb-0">Latest School Notices</h2>
              <Badge variant="blue">Broadcasts</Badge>
            </div>

            {/* Featured Notice */}
            <div className="p-5 rounded-2xl bg-[#181818] border border-white/15">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#bf783e]" />
                <h3 className="text-sm font-bold text-[#f4f6d6]">{latestAnnouncement.title}</h3>
              </div>
              <p className="text-xs text-white/70 leading-relaxed font-light">{latestAnnouncement.description}</p>
              <p className="text-[10px] text-white/40 font-medium mt-2.5">{latestAnnouncement.date}</p>
            </div>

            {/* Secondary Notices */}
            <div className="space-y-2.5 mt-3">
              {announcements.slice(1, 3).map((a) => (
                <div
                  key={a.id}
                  className="p-3.5 rounded-xl border border-white/10 hover:border-[#bf783e]/40 transition-colors bg-[#181818]"
                >
                  <div className="text-xs font-bold text-[#f4f6d6]">{a.title}</div>
                  <div className="text-[11px] text-white/40 mt-0.5 font-light">{a.date}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 mt-4">
            <Link
              href="/student/announcements"
              className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-[#bf783e] hover:underline"
            >
              <span>View All Campus Bulletins</span>
              <ChevronRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
