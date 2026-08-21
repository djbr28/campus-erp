import RoleDashboardLayout from "@/components/layout/RoleDashboardLayout";

const securityNav = [
  { label: "Dashboard", href: "/security", icon: "📊" },
  { label: "Incidents", href: "/admin/incidents", icon: "🚨", badge: 2 },
];

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleDashboardLayout
      brandName="Smart Campus"
      brandIcon="🏫"
      homeHref="/security"
      navItems={securityNav}
      userName="Officer Daniel Park"
      userRole="Security"
      userInitials="DP"
    >
      {children}
    </RoleDashboardLayout>
  );
}
