// ============================================================
// Smart Campus ERP — Role Dashboard Layout
// ============================================================
"use client";

import RoleSidebar, { type SidebarNavItem } from "./RoleSidebar";
import TopBar from "./TopBar";

interface RoleDashboardLayoutProps {
  brandName: string;
  brandIcon: string;
  homeHref: string;
  navItems: SidebarNavItem[];
  userName: string;
  userRole: string;
  userInitials: string;
  children: React.ReactNode;
}

export default function RoleDashboardLayout({
  brandName,
  brandIcon,
  homeHref,
  navItems,
  userName,
  userRole,
  userInitials,
  children,
}: RoleDashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0e0e0e] text-[#f4f6d6]">
      <RoleSidebar
        brandName={brandName}
        brandIcon={brandIcon}
        homeHref={homeHref}
        navItems={navItems}
        userName={userName}
        userRole={userRole}
        userInitials={userInitials}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          userName={userName}
          userRole={userRole}
          userInitials={userInitials}
          homeHref={homeHref}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
