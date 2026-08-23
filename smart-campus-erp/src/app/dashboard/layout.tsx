"use client";

// ============================================================
// Smart Campus ERP — Dashboard Layout (Live Supabase Data)
// ============================================================
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import AIAssistantFAB from "@/components/ui/AIAssistantFAB";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, facultyData, initials, loading } = useCurrentUser();

  const userName = facultyData?.name || profile?.name || "Faculty";

  return (
    <div className="flex h-screen overflow-hidden bg-[#0e0e0e] text-[#f4f6d6] relative">
      <Sidebar
        userName={loading ? "Loading…" : userName}
        userRole="Faculty"
        userInitials={loading ? "…" : initials}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          userName={loading ? "Loading…" : userName}
          userRole="Faculty"
          userInitials={loading ? "…" : initials}
          homeHref="/dashboard"
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      <AIAssistantFAB userRole="Faculty" userName={userName} />
    </div>
  );
}
