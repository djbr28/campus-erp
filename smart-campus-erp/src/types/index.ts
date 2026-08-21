// ============================================================
// Smart Campus ERP — Core Types
// ============================================================

export type UserRole = "student" | "parent" | "faculty" | "admin" | "security";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  studentId?: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
}

export interface DashboardStat {
  label: string;
  value: string | number;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: string;
}

export interface RecentActivity {
  id: string;
  user: string;
  action: string;
  time: string;
  avatar?: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: "info" | "warning" | "danger" | "success";
  time: string;
}
