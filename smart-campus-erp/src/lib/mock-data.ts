// ============================================================
// Smart Campus ERP — Mock Data
// ============================================================
import type { User, DashboardStat, RecentActivity, Alert } from "@/types";

// --- Current user (used across layouts) --------------------------------
export const currentUser: User = {
  id: "usr_001",
  name: "Dr. Sarah Mitchell",
  email: "sarah.mitchell@campus.edu",
  role: "admin",
  department: "Administration",
  avatar: undefined,
};

// --- Dashboard stats ---------------------------------------------------
export const dashboardStats: DashboardStat[] = [
  {
    label: "Total Students",
    value: "3,842",
    change: "+4.2%",
    trend: "up",
    icon: "📚",
  },
  {
    label: "Faculty Members",
    value: "218",
    change: "+2.1%",
    trend: "up",
    icon: "👨‍🏫",
  },
  {
    label: "Active Incidents",
    value: 7,
    change: "-12.5%",
    trend: "down",
    icon: "🚨",
  },
  {
    label: "Attendance Today",
    value: "94.3%",
    change: "+1.8%",
    trend: "up",
    icon: "✅",
  },
];

// --- Recent activity feed ----------------------------------------------
export const recentActivities: RecentActivity[] = [
  {
    id: "act_001",
    user: "James Rodriguez",
    action: "checked in to Campus Gate B",
    time: "2 min ago",
  },
  {
    id: "act_002",
    user: "Prof. Linda Chen",
    action: "submitted attendance for CS-301",
    time: "15 min ago",
  },
  {
    id: "act_003",
    user: "Security Team",
    action: "resolved alert — parking lot camera offline",
    time: "32 min ago",
  },
  {
    id: "act_004",
    user: "Priya Patel",
    action: "submitted fee payment — $2,400",
    time: "1 hour ago",
  },
  {
    id: "act_005",
    user: "Admin Office",
    action: "published new academic calendar",
    time: "2 hours ago",
  },
  {
    id: "act_006",
    user: "Alex Johnson",
    action: "registered for spring semester courses",
    time: "3 hours ago",
  },
];

// --- Alerts / notifications -------------------------------------------
export const alerts: Alert[] = [
  {
    id: "alt_001",
    title: "Severe Weather Warning",
    message: "Thunderstorm expected this evening. All outdoor activities cancelled.",
    severity: "danger",
    time: "1 hour ago",
  },
  {
    id: "alt_002",
    title: "Exam Schedule Published",
    message: "Final examination schedule for Fall 2026 has been released.",
    severity: "info",
    time: "3 hours ago",
  },
  {
    id: "alt_003",
    title: "Campus Maintenance",
    message: "Building C water supply will be interrupted tomorrow 9 AM – 12 PM.",
    severity: "warning",
    time: "5 hours ago",
  },
];

// --- Sidebar navigation items -----------------------------------------
export const sidebarNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { label: "Students", href: "/dashboard/students", icon: "🎓" },
  { label: "Attendance", href: "/dashboard/attendance", icon: "📋" },
  { label: "Incidents", href: "/dashboard/incidents", icon: "🚨", badge: 2 },
  { label: "Report Incident", href: "/dashboard/report-incident", icon: "📝" },
  { label: "Schedule", href: "/dashboard/schedule", icon: "📅" },
  { label: "Messages", href: "/dashboard/messages", icon: "💬", badge: 3 },
  { label: "Settings", href: "/dashboard/settings", icon: "⚙️" },
];
