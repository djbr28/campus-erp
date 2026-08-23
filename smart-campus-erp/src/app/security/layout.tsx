"use client";

import RoleDashboardLayout from "@/components/layout/RoleDashboardLayout";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const securityNav = [
  { label: "Dashboard", href: "/security", icon: "📊" },
  { label: "Incidents", href: "/security/incidents", icon: "🚨" },
];

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  const { profile, initials, loading } = useCurrentUser();

  const userName = profile?.name || "Security Officer";

  return (
    <RoleDashboardLayout
      brandName="Smart Campus"
      brandIcon="🏫"
      homeHref="/security"
      navItems={securityNav}
      userName={loading ? "Loading…" : userName}
      userRole="Security"
      userInitials={loading ? "…" : initials}
    >
      {children}
    </RoleDashboardLayout>
  );
}
