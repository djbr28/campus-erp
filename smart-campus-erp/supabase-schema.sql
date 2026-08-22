-- ============================================================
-- Smart Campus ERP — Complete University Supabase Database Schema & RLS
-- ============================================================
-- Instructions:
-- 1. Open your Supabase Project Dashboard: https://supabase.com/dashboard
-- 2. Go to the "SQL Editor" in the left navigation.
-- 3. Paste and run this ENTIRE script (it cleanly recreates all tables, RLS policies, triggers, and seed data).
-- ============================================================

-- 0. Drop existing tables in reverse dependency order
DROP TABLE IF EXISTS public.event_registration CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.hostel_allocations CASCADE;
DROP TABLE IF EXISTS public.hostels CASCADE;
DROP TABLE IF EXISTS public.library_transactions CASCADE;
DROP TABLE IF EXISTS public.books CASCADE;
DROP TABLE IF EXISTS public.exam_results CASCADE;
DROP TABLE IF EXISTS public.exams CASCADE;
DROP TABLE IF EXISTS public.enrollments CASCADE;
DROP TABLE IF EXISTS public.courses CASCADE;
DROP TABLE IF EXISTS public.academic_records CASCADE;
DROP TABLE IF EXISTS public.fees CASCADE;
DROP TABLE IF EXISTS public.attendance_records CASCADE;
DROP TABLE IF EXISTS public.faculty CASCADE;
DROP TABLE IF EXISTS public.parents CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.incidents CASCADE;
DROP TABLE IF EXISTS public.announcements CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 2. User Profiles Table (Linked to Supabase Auth)
-- ============================================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('STUDENT', 'PARENT', 'FACULTY', 'ADMIN', 'SECURITY')),
  department TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. Students Table
-- ============================================================
CREATE TABLE public.students (
  id TEXT PRIMARY KEY, -- e.g. UUID string or 'STU-001'
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  register_number TEXT UNIQUE,
  name TEXT NOT NULL,
  department TEXT NOT NULL DEFAULT 'Computer Science',
  program TEXT NOT NULL DEFAULT 'B.Tech Computer Science',
  year INTEGER NOT NULL DEFAULT 1,
  semester INTEGER NOT NULL DEFAULT 1,
  phone TEXT,
  email TEXT NOT NULL,
  parent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  gpa NUMERIC(3,2) DEFAULT 3.80,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'On Leave', 'Graduated', 'Suspended')),
  attendance_pct NUMERIC(5,2) DEFAULT 88.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. Parents Table
-- ============================================================
CREATE TABLE public.parents (
  id TEXT PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  child_id TEXT REFERENCES public.students(id) ON DELETE SET NULL,
  child_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. Faculty Table
-- ============================================================
CREATE TABLE public.faculty (
  id TEXT PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  department TEXT NOT NULL DEFAULT 'Computer Science',
  designation TEXT NOT NULL DEFAULT 'Associate Professor',
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. Attendance Records Table
-- ============================================================
CREATE TABLE public.attendance_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  code TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'Present' CHECK (status IN ('Present', 'Absent', 'Late')),
  percentage NUMERIC(5,2) DEFAULT 100.00,
  total INTEGER NOT NULL DEFAULT 30,
  present INTEGER NOT NULL DEFAULT 28,
  absent INTEGER NOT NULL DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. Fees & Payments Table
-- ============================================================
CREATE TABLE public.fees (
  id TEXT PRIMARY KEY, -- e.g. 'FEE-001'
  student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  paid_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Paid', 'Pending', 'Overdue')),
  payment_date DATE,
  due_date DATE NOT NULL DEFAULT CURRENT_DATE,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 8. Academic Records Table
-- ============================================================
CREATE TABLE public.academic_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
  semester INTEGER NOT NULL DEFAULT 1,
  subject TEXT NOT NULL,
  marks NUMERIC(5,2) NOT NULL DEFAULT 0.00,
  grade TEXT NOT NULL DEFAULT 'A',
  cgpa NUMERIC(3,2) NOT NULL DEFAULT 3.80,
  credits INTEGER NOT NULL DEFAULT 4,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 9. Courses & Enrollments
-- ============================================================
CREATE TABLE public.courses (
  id TEXT PRIMARY KEY, -- e.g. 'CS-301'
  course_name TEXT NOT NULL,
  course_code TEXT UNIQUE NOT NULL,
  credits INTEGER NOT NULL DEFAULT 4,
  department TEXT NOT NULL DEFAULT 'Computer Science',
  instructor TEXT NOT NULL DEFAULT 'Dr. Alan Turing',
  schedule TEXT NOT NULL DEFAULT 'Mon/Wed 10:00 AM - 11:30 AM',
  location TEXT NOT NULL DEFAULT 'Hall B, CS Wing',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.enrollments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
  course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
  semester INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'Enrolled' CHECK (status IN ('Enrolled', 'Completed', 'Dropped')),
  enrolled_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 10. Examination & Results
-- ============================================================
CREATE TABLE public.exams (
  id TEXT PRIMARY KEY, -- e.g. 'EXAM-001'
  subject TEXT NOT NULL,
  exam_date TIMESTAMPTZ NOT NULL,
  room TEXT NOT NULL,
  duration TEXT NOT NULL DEFAULT '3 Hours',
  total_marks NUMERIC(5,2) NOT NULL DEFAULT 100.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.exam_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
  exam_id TEXT REFERENCES public.exams(id) ON DELETE CASCADE,
  marks NUMERIC(5,2) NOT NULL,
  grade TEXT NOT NULL,
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 11. Library & Transactions
-- ============================================================
CREATE TABLE public.books (
  id TEXT PRIMARY KEY, -- e.g. 'BK-001'
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Engineering',
  isbn TEXT,
  available_count INTEGER NOT NULL DEFAULT 1,
  total_copies INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.library_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
  book_id TEXT REFERENCES public.books(id) ON DELETE CASCADE,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  return_date DATE,
  due_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '14 days'),
  status TEXT NOT NULL DEFAULT 'Issued' CHECK (status IN ('Issued', 'Returned', 'Overdue')),
  fine_amount NUMERIC(8,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 12. Hostel & Allocations
-- ============================================================
CREATE TABLE public.hostels (
  id TEXT PRIMARY KEY, -- e.g. 'HST-001'
  block TEXT NOT NULL,
  room_number TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 2,
  occupied INTEGER NOT NULL DEFAULT 1,
  type TEXT NOT NULL DEFAULT 'Double Sharing AC',
  warden_name TEXT NOT NULL DEFAULT 'Mr. Robert Vance',
  warden_phone TEXT DEFAULT '+1 (555) 432-8765',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.hostel_allocations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
  hostel_id TEXT REFERENCES public.hostels(id) ON DELETE CASCADE,
  allocated_date DATE DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Vacated')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 13. Events & Registration
-- ============================================================
CREATE TABLE public.events (
  id TEXT PRIMARY KEY, -- e.g. 'EVT-001'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Academic',
  banner_url TEXT,
  organizer TEXT NOT NULL DEFAULT 'Campus Activity Council',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.event_registration (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
  event_id TEXT REFERENCES public.events(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'Confirmed' CHECK (status IN ('Confirmed', 'Waitlisted', 'Cancelled')),
  registered_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 14. Incident Management System (Security Module)
-- ============================================================
CREATE TABLE public.incidents (
  id TEXT PRIMARY KEY, -- e.g. 'INC-001'
  reported_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Facility Damage',
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- ============================================================
-- 15. Announcement System
-- ============================================================
CREATE TABLE public.announcements (
  id TEXT PRIMARY KEY, -- e.g. 'ANN-001'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  target_role TEXT NOT NULL DEFAULT 'ALL' CHECK (target_role IN ('ALL', 'STUDENT', 'FACULTY', 'PARENT', 'ADMIN', 'SECURITY')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registration ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Profiles: Users can read all profiles; users can update their own profile; admins can manage all
CREATE POLICY "Allow public read access on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow user update on own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);

-- Students:
CREATE POLICY "Allow select students" ON public.students FOR SELECT USING (
  auth.uid() IS NOT NULL OR true
);
CREATE POLICY "Allow faculty/admin modify students" ON public.students FOR ALL USING (
  public.get_current_user_role() IN ('ADMIN', 'FACULTY') OR auth.uid() = profile_id
);

-- Parents:
CREATE POLICY "Allow select parents" ON public.parents FOR SELECT USING (true);
CREATE POLICY "Allow modify parents" ON public.parents FOR ALL USING (
  public.get_current_user_role() = 'ADMIN' OR auth.uid() = profile_id
);

-- Faculty:
CREATE POLICY "Allow select faculty" ON public.faculty FOR SELECT USING (true);
CREATE POLICY "Allow admin manage faculty" ON public.faculty FOR ALL USING (
  public.get_current_user_role() = 'ADMIN' OR auth.uid() = profile_id
);

-- Attendance:
CREATE POLICY "Allow read attendance" ON public.attendance_records FOR SELECT USING (true);
CREATE POLICY "Allow faculty/admin manage attendance" ON public.attendance_records FOR ALL USING (
  public.get_current_user_role() IN ('ADMIN', 'FACULTY')
);

-- Fees:
CREATE POLICY "Allow read fees" ON public.fees FOR SELECT USING (true);
CREATE POLICY "Allow admin manage fees" ON public.fees FOR ALL USING (
  public.get_current_user_role() = 'ADMIN'
);

-- Academic Records:
CREATE POLICY "Allow read academics" ON public.academic_records FOR SELECT USING (true);
CREATE POLICY "Allow faculty/admin manage academics" ON public.academic_records FOR ALL USING (
  public.get_current_user_role() IN ('ADMIN', 'FACULTY')
);

-- Courses:
CREATE POLICY "Allow read courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Allow admin/faculty manage courses" ON public.courses FOR ALL USING (
  public.get_current_user_role() IN ('ADMIN', 'FACULTY')
);

-- Enrollments:
CREATE POLICY "Allow read enrollments" ON public.enrollments FOR SELECT USING (true);
CREATE POLICY "Allow insert enrollments" ON public.enrollments FOR INSERT WITH CHECK (true);

-- Exams & Results:
CREATE POLICY "Allow read exams" ON public.exams FOR SELECT USING (true);
CREATE POLICY "Allow manage exams" ON public.exams FOR ALL USING (
  public.get_current_user_role() IN ('ADMIN', 'FACULTY')
);
CREATE POLICY "Allow read exam results" ON public.exam_results FOR SELECT USING (true);
CREATE POLICY "Allow manage exam results" ON public.exam_results FOR ALL USING (
  public.get_current_user_role() IN ('ADMIN', 'FACULTY')
);

-- Books & Library:
CREATE POLICY "Allow read books" ON public.books FOR SELECT USING (true);
CREATE POLICY "Allow manage books" ON public.books FOR ALL USING (
  public.get_current_user_role() = 'ADMIN'
);
CREATE POLICY "Allow read library transactions" ON public.library_transactions FOR SELECT USING (true);
CREATE POLICY "Allow manage library transactions" ON public.library_transactions FOR ALL USING (
  public.get_current_user_role() = 'ADMIN' OR auth.uid() IS NOT NULL
);

-- Hostels & Allocations:
CREATE POLICY "Allow read hostels" ON public.hostels FOR SELECT USING (true);
CREATE POLICY "Allow read hostel allocations" ON public.hostel_allocations FOR SELECT USING (true);
CREATE POLICY "Allow admin manage hostels" ON public.hostels FOR ALL USING (
  public.get_current_user_role() = 'ADMIN'
);

-- Events & Registration:
CREATE POLICY "Allow read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Allow manage events" ON public.events FOR ALL USING (
  public.get_current_user_role() IN ('ADMIN', 'FACULTY')
);
CREATE POLICY "Allow read event registrations" ON public.event_registration FOR SELECT USING (true);
CREATE POLICY "Allow insert event registrations" ON public.event_registration FOR INSERT WITH CHECK (true);

-- Incidents:
CREATE POLICY "Allow read incidents" ON public.incidents FOR SELECT USING (true);
CREATE POLICY "Allow insert incidents" ON public.incidents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update incidents" ON public.incidents FOR UPDATE USING (
  public.get_current_user_role() IN ('SECURITY', 'ADMIN') OR auth.uid() = reported_by
);

-- Announcements:
CREATE POLICY "Allow read announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Allow insert/update announcements" ON public.announcements FOR ALL USING (
  public.get_current_user_role() IN ('ADMIN', 'FACULTY')
);

-- ============================================================
-- INITIAL DATA SEEDING
-- ============================================================

-- Sample Students
INSERT INTO public.students (id, name, email, register_number, department, program, year, semester, gpa, status, attendance_pct, phone)
VALUES
  ('STU-001', 'Alex Johnson', 'alex.johnson@campus.edu', 'REG2024CS001', 'Computer Science', 'B.Tech Computer Science', 3, 5, 3.85, 'Active', 89.50, '+1 (555) 019-2834'),
  ('STU-002', 'Priya Patel', 'priya.patel@campus.edu', 'REG2024CS002', 'Computer Science', 'B.Tech Computer Science', 2, 3, 3.92, 'Active', 94.00, '+1 (555) 019-5821'),
  ('STU-003', 'James Rodriguez', 'james.r@campus.edu', 'REG2024EE003', 'Electrical Engineering', 'B.Tech Electrical Eng.', 3, 5, 3.50, 'Active', 78.00, '+1 (555) 019-9482'),
  ('STU-004', 'Li Wei', 'li.wei@campus.edu', 'REG2024CS004', 'Computer Science', 'B.Tech Computer Science', 4, 7, 3.75, 'Active', 91.00, '+1 (555) 019-3329'),
  ('STU-005', 'Emma Watson', 'emma.w@campus.edu', 'REG2024BA005', 'Business Administration', 'BBA Management', 2, 3, 3.60, 'On Leave', 0.00, '+1 (555) 019-8812'),
  ('STU-006', 'Omar Hassan', 'omar.h@campus.edu', 'REG2024CS006', 'Computer Science', 'B.Tech Computer Science', 3, 5, 3.40, 'Active', 82.00, '+1 (555) 019-4451'),
  ('STU-007', 'Sofia Martinez', 'sofia.m@campus.edu', 'REG2024EE007', 'Electrical Engineering', 'B.Tech Electrical Eng.', 2, 3, 3.90, 'Active', 96.00, '+1 (555) 019-7723');

-- Sample Parents
INSERT INTO public.parents (id, name, email, phone, child_id, child_name)
VALUES
  ('PAR-001', 'David Johnson', 'david.johnson@example.com', '+1 (555) 234-5678', 'STU-001', 'Alex Johnson');

-- Sample Faculty
INSERT INTO public.faculty (id, name, email, department, designation, phone)
VALUES
  ('FAC-001', 'Dr. Alan Turing', 'alan.turing@campus.edu', 'Computer Science', 'Department Chair & Professor', '+1 (555) 876-5432');

-- Sample Attendance
INSERT INTO public.attendance_records (student_id, subject, code, total, present, absent, percentage, status)
VALUES
  ('STU-001', 'Data Structures & Algorithms', 'CS-301', 30, 27, 3, 90.00, 'Present'),
  ('STU-001', 'Advanced Operating Systems', 'CS-302', 28, 25, 3, 89.29, 'Present'),
  ('STU-001', 'Database Management Systems', 'CS-304', 32, 30, 2, 93.75, 'Present'),
  ('STU-001', 'Computer Networks & Security', 'CS-305', 26, 21, 5, 80.77, 'Present'),
  ('STU-001', 'Discrete Mathematics & Logic', 'MA-301', 28, 24, 4, 85.71, 'Present');

-- Sample Fees
INSERT INTO public.fees (id, student_id, label, total_amount, paid_amount, status, payment_date, due_date)
VALUES
  ('FEE-001', 'STU-001', 'Tuition Fee — Fall Semester 2026', 8500.00, 8500.00, 'Paid', '2026-08-01', '2026-08-01'),
  ('FEE-002', 'STU-001', 'Hostel Accommodation & Dining Fee', 3200.00, 3200.00, 'Paid', '2026-08-05', '2026-08-05'),
  ('FEE-003', 'STU-001', 'Laboratory & Research Access Fee', 800.00, 800.00, 'Paid', '2026-08-15', '2026-08-15'),
  ('FEE-004', 'STU-001', 'Campus Student Activities & Sports', 400.00, 0.00, 'Pending', NULL, '2026-09-15'),
  ('FEE-005', 'STU-001', 'Mid-Term Examination & Assessment Fee', 300.00, 0.00, 'Pending', NULL, '2026-10-15');

-- Sample Academic Records
INSERT INTO public.academic_records (student_id, semester, subject, marks, grade, cgpa, credits)
VALUES
  ('STU-001', 4, 'Database Management Systems', 92.50, 'A+', 3.90, 4),
  ('STU-001', 4, 'Operating Systems Architecture', 88.00, 'A', 3.80, 4),
  ('STU-001', 4, 'Design and Analysis of Algorithms', 94.00, 'A+', 4.00, 4),
  ('STU-001', 4, 'Probability & Stochastic Processes', 85.00, 'A-', 3.70, 3),
  ('STU-001', 3, 'Object-Oriented Programming (Java/C++)', 96.00, 'A+', 4.00, 4),
  ('STU-001', 3, 'Digital Logic & Microprocessors', 89.00, 'A', 3.85, 4);

-- Sample Courses
INSERT INTO public.courses (id, course_name, course_code, credits, department, instructor, schedule, location)
VALUES
  ('CS-301', 'Data Structures & Algorithms', 'CS-301', 4, 'Computer Science', 'Dr. Alan Turing', 'Mon/Wed 10:00 AM - 11:30 AM', 'Hall B, CS Wing'),
  ('CS-302', 'Advanced Operating Systems', 'CS-302', 4, 'Computer Science', 'Prof. Grace Hopper', 'Tue/Thu 09:00 AM - 10:30 AM', 'Hall 402, Science Block'),
  ('CS-304', 'Database Management Systems', 'CS-304', 4, 'Computer Science', 'Dr. Edgar Codd', 'Mon/Wed 02:00 PM - 03:30 PM', 'Lab 3, CS Wing'),
  ('CS-305', 'Computer Networks & Security', 'CS-305', 4, 'Computer Science', 'Prof. Vint Cerf', 'Tue/Thu 01:00 PM - 02:30 PM', 'Hall 105, Main Block'),
  ('MA-301', 'Discrete Mathematics & Logic', 'MA-301', 3, 'Mathematics', 'Dr. John von Neumann', 'Friday 09:00 AM - 12:00 PM', 'Auditorium 2');

-- Sample Enrollments
INSERT INTO public.enrollments (student_id, course_id, semester, status)
VALUES
  ('STU-001', 'CS-301', 5, 'Enrolled'),
  ('STU-001', 'CS-302', 5, 'Enrolled'),
  ('STU-001', 'CS-304', 5, 'Enrolled'),
  ('STU-001', 'CS-305', 5, 'Enrolled'),
  ('STU-001', 'MA-301', 5, 'Enrolled');

-- Sample Exams & Results
INSERT INTO public.exams (id, subject, exam_date, room, duration, total_marks)
VALUES
  ('EXAM-001', 'Data Structures & Algorithms Final', '2026-10-10 09:00:00+00', 'Hall A (Seats 1-60)', '3 Hours', 100.00),
  ('EXAM-002', 'Advanced Operating Systems Midterm', '2026-10-12 14:00:00+00', 'Hall B (Seats 1-50)', '2 Hours', 50.00),
  ('EXAM-003', 'Database Management Systems Practical', '2026-10-15 10:00:00+00', 'CS Lab 3', '3 Hours', 100.00),
  ('EXAM-004', 'Computer Networks Theory', '2026-10-18 09:00:00+00', 'Hall 201', '3 Hours', 100.00);

INSERT INTO public.exam_results (student_id, exam_id, marks, grade, remarks)
VALUES
  ('STU-001', 'EXAM-001', 94.00, 'A+', 'Outstanding performance in algorithmic problem solving'),
  ('STU-001', 'EXAM-002', 46.50, 'A+', 'Clean kernel simulation analysis');

-- Sample Books & Library Transactions
INSERT INTO public.books (id, title, author, category, isbn, available_count, total_copies)
VALUES
  ('BK-001', 'Introduction to Algorithms (CLRS)', 'Thomas H. Cormen et al.', 'Computer Science', '978-0262033848', 4, 8),
  ('BK-002', 'Operating System Concepts (Dinosaur Book)', 'Abraham Silberschatz', 'Computer Science', '978-1118063330', 2, 5),
  ('BK-003', 'Database System Concepts', 'Abraham Silberschatz', 'Computer Science', '978-0073523323', 5, 6),
  ('BK-004', 'Computer Networking: A Top-Down Approach', 'James Kurose', 'Networking', '978-0133594140', 3, 5),
  ('BK-005', 'Design Patterns: Elements of Reusable Object-Oriented Software', 'Erich Gamma et al.', 'Software Engineering', '978-0201633610', 1, 4);

INSERT INTO public.library_transactions (student_id, book_id, issue_date, due_date, status, fine_amount)
VALUES
  ('STU-001', 'BK-001', '2026-08-10', '2026-08-24', 'Issued', 0.00),
  ('STU-001', 'BK-004', '2026-08-12', '2026-08-26', 'Issued', 0.00);

-- Sample Hostels & Allocations
INSERT INTO public.hostels (id, block, room_number, capacity, occupied, type, warden_name, warden_phone)
VALUES
  ('HST-001', 'Block Alpha (North Wing)', 'Room 304-B', 2, 2, 'Double Deluxe Sharing AC', 'Mr. Robert Vance', '+1 (555) 432-8765'),
  ('HST-002', 'Block Beta (South Wing)', 'Room 102-A', 2, 1, 'Double Standard Sharing', 'Mrs. Eleanor Hayes', '+1 (555) 432-1199'),
  ('HST-003', 'Block Gamma (East Wing)', 'Room 410-C', 3, 2, 'Triple Sharing Studio', 'Dr. Marcus Bennett', '+1 (555) 432-9900');

INSERT INTO public.hostel_allocations (student_id, hostel_id, allocated_date, status)
VALUES
  ('STU-001', 'HST-001', '2026-07-25', 'Active');

-- Sample Events & Registration
INSERT INTO public.events (id, title, description, date, location, category, organizer)
VALUES
  ('EVT-001', 'Annual University Hackathon 2026', '48-hour continuous software prototyping marathon with $25,000 prize pool.', '2026-09-20 09:00:00+00', 'Main Campus Auditorium & Tech Hub', 'Hackathon & Tech', 'Campus Innovation Cell'),
  ('EVT-002', 'Distinguished AI Keynote: The Future of Intelligence', 'Special guest seminar discussing next-gen autonomous neural agent architectures.', '2026-09-25 14:00:00+00', 'Science Block Amphitheatre', 'Guest Seminar', 'Dept. of Computer Science'),
  ('EVT-003', 'Fall Campus Sports & Athletics Meet', 'Inter-departmental track, football, basketball and swimming tournament.', '2026-10-05 08:00:00+00', 'University Sports Complex', 'Sports & Fitness', 'Athletics Department');

INSERT INTO public.event_registration (student_id, event_id, status)
VALUES
  ('STU-001', 'EVT-001', 'Confirmed'),
  ('STU-001', 'EVT-002', 'Confirmed');

-- Sample Announcements
INSERT INTO public.announcements (id, title, description, date, priority, target_role)
VALUES
  ('ANN-001', 'Campus Maintenance — Building C & Science Wing', 'Water supply and power grid calibration will occur in Building C on August 22 from 9 AM to 12 PM.', '2026-08-20', 'high', 'ALL'),
  ('ANN-002', 'Fall 2026 Midterm Examination Schedule Published', 'Official examination timetables have been released. Check your student examination module for room allotments.', '2026-08-19', 'medium', 'STUDENT'),
  ('ANN-003', 'New Extended Library Hours for Exam Season', 'Starting September 1, the main library will be open 24/7 on weekdays and 8 AM to 10 PM on weekends.', '2026-08-18', 'low', 'ALL'),
  ('ANN-004', 'Global Campus Career & Internship Fair', 'Over 75 Tier-1 companies will conduct direct on-campus interviews on October 10. Registration mandatory.', '2026-08-17', 'medium', 'STUDENT'),
  ('ANN-005', 'Campus Safety & Emergency Drill Notification', 'A mandatory campus safety protocol drill is scheduled for August 25 at 2:00 PM.', '2026-08-16', 'high', 'ALL');

-- Sample Incidents
INSERT INTO public.incidents (id, title, category, location, priority, status, description)
VALUES
  ('INC-001', 'Broken window in Science Block Room 204', 'Facility Damage', 'Science Block, Room 204', 'medium', 'Open', 'A window pane was found broken during early morning inspection. No injuries reported.'),
  ('INC-002', 'Suspicious person near Gate B', 'Unauthorized Access', 'Campus Gate B', 'high', 'In Progress', 'Unidentified individual attempting entry without university badge. Security patrol dispatched.'),
  ('INC-003', 'Fire alarm triggered — Dining Hall', 'Fire Safety', 'Campus Dining Hall', 'critical', 'Resolved', 'False alarm triggered by kitchen steam sensor. Verified clear and reset.'),
  ('INC-004', 'Water pipe leakage in North Garage', 'Facility Damage', 'North Parking Garage Level B1', 'low', 'Resolved', 'Pipe joint leak repaired by facility management team.'),
  ('INC-005', 'Lost student RFID Access Card', 'Lost & Found', 'Central Library 2nd Floor', 'low', 'Open', 'Student reported missing student access card. Reported to security desk.');
