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

// --- Step 2 types -------------------------------------------------------

export interface Student {
  id: string;
  name: string;
  email: string;
  program: string;
  year: number;
  gpa: string;
  status: "Active" | "On Leave" | "Graduated";
  attendancePct: number;
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  childName: string;
  childId: string;
}

export interface FeeRecord {
  id: string;
  label: string;
  total: number;
  paid: number;
  dueDate: string;
  status: "Paid" | "Pending" | "Overdue";
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  read: boolean;
  priority: "high" | "medium" | "low";
}

export interface Incident {
  id: string;
  title: string;
  category: string;
  location: string;
  severity: "low" | "medium" | "high" | "critical";
  time: string;
  status: "Open" | "In Progress" | "Resolved";
  description: string;
}

export interface AttendanceRecord {
  subject: string;
  code: string;
  total: number;
  present: number;
  absent: number;
  pct: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}
