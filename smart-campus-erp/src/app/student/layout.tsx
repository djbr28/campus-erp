"use client";

import RoleDashboardLayout from "@/components/layout/RoleDashboardLayout";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const studentNav = [
  { label: "Dashboard", href: "/student", icon: "📊" },
  { label: "My Info", href: "/student/info", icon: "👤" },
  { label: "Academics", href: "/student/academics", icon: "🎓" },
  { label: "FFCS", href: "/student/ffcs", icon: "🗓️" },
  { label: "Courses", href: "/student/courses", icon: "📖" },
  { label: "Attendance", href: "/student/attendance", icon: "📋" },
  { label: "Fees", href: "/student/fees", icon: "💰" },
  { label: "Payments", href: "/student/payments", icon: "💳" },
  { label: "Examination", href: "/student/examination", icon: "📝" },
  { label: "Library", href: "/student/library", icon: "📚" },
  { label: "Hostel", href: "/student/hostel", icon: "🏛️" },
  { label: "Events", href: "/student/events", icon: "🎉" },
  { label: "Announcements", href: "/student/announcements", icon: "📢" },
  { label: "Report Incident", href: "/student/report-incident", icon: "🚨" },
  { label: "My Account", href: "/student/account", icon: "⚙️" },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { profile, studentData, initials, loading } = useCurrentUser();

  const userName = studentData?.name || profile?.name || "Student";

  return (
    <RoleDashboardLayout
      brandName="Smart Campus"
      brandIcon="🏫"
      homeHref="/student"
      navItems={studentNav}
      userName={loading ? "Loading…" : userName}
      userRole="Student"
      userInitials={loading ? "…" : initials}
    >
      {children}
    </RoleDashboardLayout>
  );
}
