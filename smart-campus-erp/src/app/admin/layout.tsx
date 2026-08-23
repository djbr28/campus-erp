"use client";

import RoleDashboardLayout from "@/components/layout/RoleDashboardLayout";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const adminNav = [
  { label: "Dashboard", href: "/admin", icon: "📊" },
  { label: "Students", href: "/admin/students", icon: "🎓" },
  { label: "Announcements", href: "/admin/announcements", icon: "📢" },
  { label: "Incidents", href: "/admin/incidents", icon: "🚨" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, initials, loading } = useCurrentUser();

  const userName = profile?.name || "Administrator";

  return (
    <RoleDashboardLayout
      brandName="Smart Campus"
      brandIcon="🏫"
      homeHref="/admin"
      navItems={adminNav}
      userName={loading ? "Loading…" : userName}
      userRole="Administrator"
      userInitials={loading ? "…" : initials}
    >
      {children}
    </RoleDashboardLayout>
  );
}
