import RoleDashboardLayout from "@/components/layout/RoleDashboardLayout";

const adminNav = [
  { label: "Dashboard", href: "/admin", icon: "📊" },
  { label: "Students", href: "/admin/students", icon: "🎓" },
  { label: "Incidents", href: "/admin/incidents", icon: "🚨", badge: 2 },
  { label: "AI Assistant", href: "/admin/ai-assistant", icon: "🤖" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleDashboardLayout
      brandName="Smart Campus"
      brandIcon="🏫"
      homeHref="/admin"
      navItems={adminNav}
      userName="Dr. Sarah Mitchell"
      userRole="Administrator"
      userInitials="SM"
    >
      {children}
    </RoleDashboardLayout>
  );
}
