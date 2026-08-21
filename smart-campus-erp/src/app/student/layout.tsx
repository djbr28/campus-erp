import RoleDashboardLayout from "@/components/layout/RoleDashboardLayout";
import { currentStudent } from "@/lib/mock-data-step2";

const studentNav = [
  { label: "Dashboard", href: "/student", icon: "📊" },
  { label: "Attendance", href: "/student/attendance", icon: "📋" },
  { label: "Fees", href: "/student/fees", icon: "💰" },
  { label: "Announcements", href: "/student/announcements", icon: "📢", badge: 3 },
  { label: "Report Incident", href: "/student/report-incident", icon: "🚨" },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleDashboardLayout
      brandName="Smart Campus"
      brandIcon="🏫"
      homeHref="/student"
      navItems={studentNav}
      userName={currentStudent.name}
      userRole="Student"
      userInitials="AJ"
    >
      {children}
    </RoleDashboardLayout>
  );
}
