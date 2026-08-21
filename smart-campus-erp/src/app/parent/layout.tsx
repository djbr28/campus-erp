import RoleDashboardLayout from "@/components/layout/RoleDashboardLayout";
import { currentParent } from "@/lib/mock-data-step2";

const parentNav = [
  { label: "Dashboard", href: "/parent", icon: "📊" },
  { label: "Announcements", href: "/student/announcements", icon: "📢" },
];

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleDashboardLayout
      brandName="Smart Campus"
      brandIcon="🏫"
      homeHref="/parent"
      navItems={parentNav}
      userName={currentParent.name}
      userRole="Parent"
      userInitials="RJ"
    >
      {children}
    </RoleDashboardLayout>
  );
}
