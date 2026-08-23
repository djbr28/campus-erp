"use client";

import RoleDashboardLayout from "@/components/layout/RoleDashboardLayout";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const parentNav = [
  { label: "Dashboard", href: "/parent", icon: "📊" },
  { label: "Announcements", href: "/parent/announcements", icon: "📢" },
  { label: "Incidents", href: "/parent/incidents", icon: "🚨" },
];

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  const { profile, parentData, initials, loading } = useCurrentUser();

  const userName = parentData?.name || profile?.name || "Parent";

  return (
    <RoleDashboardLayout
      brandName="Smart Campus"
      brandIcon="🏫"
      homeHref="/parent"
      navItems={parentNav}
      userName={loading ? "Loading…" : userName}
      userRole="Parent"
      userInitials={loading ? "…" : initials}
    >
      {children}
    </RoleDashboardLayout>
  );
}
