// ============================================================
// Smart Campus ERP — Core Types & Module Interfaces
// ============================================================

export type UserRole = "STUDENT" | "PARENT" | "FACULTY" | "ADMIN" | "SECURITY" | "student" | "parent" | "faculty" | "admin" | "security";

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

// --- Student & ERP Entities ----------------------------------

export interface Student {
  id: string;
  profile_id?: string;
  register_number?: string;
  name: string;
  department?: string;
  program: string;
  year: number;
  semester?: number;
  phone?: string;
  email: string;
  parent_id?: string;
  gpa: number | string;
  status: "Active" | "On Leave" | "Graduated" | "Suspended";
  attendance_pct?: number;
  attendancePct?: number;
  created_at?: string;
}

export interface Parent {
  id: string;
  profile_id?: string;
  name: string;
  email: string;
  phone?: string;
  child_id?: string;
  child_name?: string;
  childName?: string;
  childId?: string;
}

export interface Faculty {
  id: string;
  profile_id?: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  phone?: string;
  created_at?: string;
}

export interface AttendanceRecord {
  id?: string;
  student_id?: string;
  subject: string;
  code: string;
  date?: string;
  status?: "Present" | "Absent" | "Late";
  percentage?: number;
  pct: number;
  total: number;
  present: number;
  absent: number;
}

export interface FeeRecord {
  id: string;
  student_id?: string;
  label?: string;
  total_amount?: number;
  paid_amount?: number;
  total: number;
  paid: number;
  status: "Paid" | "Pending" | "Overdue";
  payment_date?: string;
  due_date?: string;
  dueDate?: string;
  receipt_url?: string;
}

export interface AcademicRecord {
  id: string;
  student_id: string;
  semester: number;
  subject: string;
  marks: number;
  grade: string;
  cgpa: number;
  credits?: number;
  created_at?: string;
}

export interface Course {
  id: string;
  course_name: string;
  course_code: string;
  credits: number;
  department?: string;
  instructor?: string;
  schedule?: string;
  location?: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  semester: number;
  status?: string;
  enrolled_at?: string;
  course?: Course;
}

export interface Exam {
  id: string;
  subject: string;
  exam_date: string;
  room: string;
  duration?: string;
  total_marks?: number;
}

export interface ExamResult {
  id: string;
  student_id: string;
  exam_id: string;
  marks: number;
  grade: string;
  remarks?: string;
  exam?: Exam;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category?: string;
  isbn?: string;
  available_count: number;
  total_copies?: number;
}

export interface LibraryTransaction {
  id: string;
  student_id: string;
  book_id: string;
  issue_date: string;
  return_date?: string;
  due_date?: string;
  status: "Issued" | "Returned" | "Overdue";
  fine_amount?: number;
  book?: Book;
}

export interface Hostel {
  id: string;
  block: string;
  room_number: string;
  capacity: number;
  occupied?: number;
  type?: string;
  warden_name?: string;
  warden_phone?: string;
}

export interface HostelAllocation {
  id: string;
  student_id: string;
  hostel_id: string;
  allocated_date?: string;
  status?: string;
  hostel?: Hostel;
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category?: string;
  banner_url?: string;
  organizer?: string;
}

export interface EventRegistration {
  id: string;
  student_id: string;
  event_id: string;
  status: "Confirmed" | "Waitlisted" | "Cancelled";
  registered_at?: string;
  event?: CampusEvent;
}

export interface Incident {
  id: string;
  reported_by?: string;
  title: string;
  description: string;
  location: string;
  category?: string;
  priority?: "low" | "medium" | "high" | "critical";
  severity: "low" | "medium" | "high" | "critical";
  status: "Open" | "In Progress" | "Resolved";
  time?: string;
  created_at?: string;
  resolved_at?: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  created_by?: string;
  target_role?: string;
  date?: string;
  created_at?: string;
  read?: boolean;
  priority: "high" | "medium" | "low" | "critical";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}
