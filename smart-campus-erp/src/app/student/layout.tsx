"use client";

import RoleDashboardLayout from "@/components/layout/RoleDashboardLayout";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const studentNav = [
  { label: "Dashboard", href: "/student", icon: "📊" },
  { label: "Attendance", href: "/student/attendance", icon: "📋" },
  { label: "Fees", href: "/student/fees", icon: "💰" },
  { label: "Announcements", href: "/student/announcements", icon: "📢" },
  { label: "Incidents", href: "/student/incidents", icon: "🚨", badge: 2 },
  { label: "Report Incident", href: "/student/report-incident", icon: "📝" },
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
