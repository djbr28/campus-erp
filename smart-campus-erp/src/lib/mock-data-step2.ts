// ============================================================
// Smart Campus ERP — Step 2 Mock Data
// ============================================================
import type {
  Student,
  Parent,
  FeeRecord,
  Announcement,
  Incident,
  AttendanceRecord,
  ChatMessage,
} from "@/types";

// --- Current student (mock logged-in user) --------------------------------
export const currentStudent: Student = {
  id: "STU-001",
  name: "Alex Johnson",
  email: "alex.johnson@campus.edu",
  program: "Computer Science",
  year: 3,
  gpa: "3.8",
  status: "Active",
  attendancePct: 87,
};

// --- Current parent (mock logged-in user) ----------------------------------
export const currentParent: Parent = {
  id: "PAR-001",
  name: "Robert Johnson",
  email: "robert.johnson@email.com",
  childName: "Alex Johnson",
  childId: "STU-001",
};

// --- All students (for admin views) ----------------------------------------
export const allStudents: Student[] = [
  { id: "STU-001", name: "Alex Johnson", email: "alex.johnson@campus.edu", program: "Computer Science", year: 3, gpa: "3.8", status: "Active", attendancePct: 87 },
  { id: "STU-002", name: "Priya Patel", email: "priya.patel@campus.edu", program: "Computer Science", year: 2, gpa: "3.9", status: "Active", attendancePct: 94 },
  { id: "STU-003", name: "James Rodriguez", email: "james.r@campus.edu", program: "Electrical Eng.", year: 3, gpa: "3.5", status: "Active", attendancePct: 72 },
  { id: "STU-004", name: "Li Wei", email: "li.wei@campus.edu", program: "Computer Science", year: 4, gpa: "3.7", status: "Active", attendancePct: 91 },
  { id: "STU-005", name: "Emma Watson", email: "emma.w@campus.edu", program: "Business Admin", year: 2, gpa: "3.6", status: "On Leave", attendancePct: 0 },
  { id: "STU-006", name: "Omar Hassan", email: "omar.h@campus.edu", program: "Computer Science", year: 3, gpa: "3.4", status: "Active", attendancePct: 68 },
  { id: "STU-007", name: "Sofia Martinez", email: "sofia.m@campus.edu", program: "Electrical Eng.", year: 2, gpa: "3.9", status: "Active", attendancePct: 96 },
];

// --- Student attendance breakdown ------------------------------------------
export const studentAttendance: AttendanceRecord[] = [
  { subject: "Data Structures", code: "CS-301", total: 30, present: 26, absent: 4, pct: 87 },
  { subject: "Algorithms", code: "CS-302", total: 28, present: 25, absent: 3, pct: 89 },
  { subject: "Operating Systems", code: "CS-304", total: 26, present: 21, absent: 5, pct: 81 },
  { subject: "Database Systems", code: "CS-305", total: 30, present: 28, absent: 2, pct: 93 },
  { subject: "Mathematics III", code: "MA-301", total: 28, present: 24, absent: 4, pct: 86 },
];

// --- Student fee records ---------------------------------------------------
export const studentFees: FeeRecord[] = [
  { id: "FEE-001", label: "Tuition Fee — Fall 2026", total: 8500, paid: 8500, dueDate: "2026-08-01", status: "Paid" },
  { id: "FEE-002", label: "Hostel Accommodation", total: 3200, paid: 3200, dueDate: "2026-08-01", status: "Paid" },
  { id: "FEE-003", label: "Lab & Library Fee", total: 800, paid: 800, dueDate: "2026-08-15", status: "Paid" },
  { id: "FEE-004", label: "Student Activities Fee", total: 400, paid: 0, dueDate: "2026-09-01", status: "Pending" },
  { id: "FEE-005", label: "Exam Fee — Midterms", total: 300, paid: 0, dueDate: "2026-10-15", status: "Pending" },
];

// --- Announcements ---------------------------------------------------------
export const announcements: Announcement[] = [
  { id: "ANN-001", title: "Campus Maintenance — Building C", description: "Water supply will be interrupted in Building C on August 22 from 9 AM to 12 PM. Please plan accordingly.", date: "2026-08-20", read: false, priority: "high" },
  { id: "ANN-002", title: "Final Exam Schedule Published", description: "The final examination schedule for Fall 2026 has been posted. Please check the academic portal for your personal timetable.", date: "2026-08-19", read: false, priority: "medium" },
  { id: "ANN-003", title: "New Library Hours", description: "Starting September 1, the main library will be open from 7 AM to 11 PM on weekdays and 9 AM to 8 PM on weekends.", date: "2026-08-18", read: true, priority: "low" },
  { id: "ANN-004", title: "Career Fair — October 10", description: "Annual career fair featuring 50+ companies. Register through the career portal by September 25.", date: "2026-08-17", read: true, priority: "medium" },
  { id: "ANN-005", title: "Campus Safety Drill", description: "A campus-wide safety drill will be conducted on August 25 at 2 PM. All students and staff are required to participate.", date: "2026-08-16", read: false, priority: "high" },
  { id: "ANN-006", title: "Scholarship Applications Open", description: "Merit-based scholarship applications for Spring 2027 are now open. Deadline: October 1.", date: "2026-08-15", read: true, priority: "low" },
];

// --- Incidents (shared for admin + security) --------------------------------
export const incidents: Incident[] = [
  { id: "INC-001", title: "Broken window in Room 204", category: "Facility Damage", location: "Building A, Room 204", severity: "medium", time: "2 hours ago", status: "Open", description: "A window was found broken during morning inspection. No injuries reported." },
  { id: "INC-002", title: "Suspicious person near Gate B", category: "Unauthorized Access", location: "Campus Gate B", severity: "high", time: "45 min ago", status: "In Progress", description: "Unidentified individual attempting to enter campus without ID badge. Security dispatched." },
  { id: "INC-003", title: "Fire alarm triggered — Building D", category: "Fire Safety", location: "Building D", severity: "critical", time: "3 hours ago", status: "Resolved", description: "False alarm triggered by burnt toast in the staff lounge. System reset completed." },
  { id: "INC-004", title: "Water leak in parking garage", category: "Facility Damage", location: "Parking Garage Level B2", severity: "low", time: "1 day ago", status: "Resolved", description: "Minor water leak from a pipe joint. Maintenance team repaired it." },
  { id: "INC-005", title: "Lost student ID card", category: "Lost & Found", location: "Library", severity: "low", time: "5 hours ago", status: "Open", description: "Student reported losing ID card in the library. Card has been found at the front desk." },
  { id: "INC-006", title: "Power outage — Science Block", category: "Electrical", location: "Science Block, Floors 1-3", severity: "high", time: "6 hours ago", status: "In Progress", description: "Partial power outage affecting labs and classrooms. Backup generators active." },
  { id: "INC-007", title: "Medical emergency — Gymnasium", category: "Medical", location: "Gymnasium", severity: "critical", time: "4 hours ago", status: "Resolved", description: "Student experienced heat exhaustion during sports practice. First aid administered, student stable." },
];

// --- Parent view of child's upcoming events --------------------------------
export const parentUpcomingEvents = [
  { event: "Midterm Exams Begin", date: "Oct 15, 2026" },
  { event: "Parent-Teacher Conference", date: "Oct 22, 2026" },
  { event: "Fall Break Starts", date: "Nov 20, 2026" },
];

// --- AI Assistant mock conversation ----------------------------------------
export const aiInitialMessages: ChatMessage[] = [
  {
    id: "ai-1",
    role: "assistant",
    content: "Hello! I'm the Smart Campus AI Assistant. I can help you with campus data, analytics, and reports. Try asking me something!",
  },
];

export const aiExampleQuestions = [
  "Summarize today's incidents",
  "Which incidents are high priority?",
  "Which students have attendance below 75%?",
  "What is the overall campus attendance rate?",
  "Show me unpaid fees",
];

export const aiMockResponses: Record<string, string> = {
  "summarize today's incidents": "Today there are **3 active incidents**: 1 critical (fire alarm in Building D — now resolved), 1 high (suspicious person near Gate B — in progress), and 1 medium (broken window in Room 204 — open). 2 incidents have been resolved today.",
  "which incidents are high priority?": "There are **2 high/critical incidents**:\n1. **Suspicious person near Gate B** — In Progress\n2. **Power outage — Science Block** — In Progress\n\nAdditionally, 2 critical incidents from earlier today have been resolved (fire alarm and medical emergency).",
  "which students have attendance below 75%?": "Based on current records:\n- **James Rodriguez** (STU-003) — 72% attendance\n- **Omar Hassan** (STU-006) — 68% attendance\n\nBoth are below the 75% threshold. Consider reaching out to them.",
  "what is the overall campus attendance rate?": "The overall campus attendance rate today is **94.3%**, up 1.8% from last week. The highest attendance is in EE-201 (96%) and the lowest is in CS-303 (82%).",
  "show me unpaid fees": "There are **2 pending fee records**:\n1. **Student Activities Fee** — $400 due Sep 1\n2. **Exam Fee — Midterms** — $300 due Oct 15\n\nTotal pending: **$700** across all students.",
};
