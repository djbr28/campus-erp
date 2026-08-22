-- ============================================================
-- Smart Campus ERP — Complete Supabase Database Schema & Seed Data
-- ============================================================
-- Instructions:
-- 1. Open your Supabase Project Dashboard: https://supabase.com/dashboard
-- 2. Go to the "SQL Editor" in the left navigation.
-- 3. Paste and run this ENTIRE script (it cleanly recreates all tables with matching types and seed data).
-- ============================================================

-- 0. Drop existing tables if present to avoid type mismatches
DROP TABLE IF EXISTS public.attendance_records CASCADE;
DROP TABLE IF EXISTS public.fees CASCADE;
DROP TABLE IF EXISTS public.parents CASCADE;
DROP TABLE IF EXISTS public.announcements CASCADE;
DROP TABLE IF EXISTS public.incidents CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create User Profiles Table (Linked to Supabase Auth)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('ADMIN', 'STUDENT', 'FACULTY', 'PARENT', 'SECURITY')),
  department TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Students Table
CREATE TABLE public.students (
  id TEXT PRIMARY KEY, -- e.g. 'STU-001'
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  program TEXT NOT NULL,
  year INTEGER NOT NULL DEFAULT 1,
  gpa NUMERIC(3,2) DEFAULT 0.00,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'On Leave', 'Graduated', 'Suspended')),
  attendance_pct NUMERIC(5,2) DEFAULT 100.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Parents Table
CREATE TABLE public.parents (
  id TEXT PRIMARY KEY, -- e.g. 'PAR-001'
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  child_id TEXT REFERENCES public.students(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Attendance Records Table
CREATE TABLE public.attendance_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  code TEXT NOT NULL,
  total INTEGER NOT NULL DEFAULT 0,
  present INTEGER NOT NULL DEFAULT 0,
  absent INTEGER NOT NULL DEFAULT 0,
  pct NUMERIC(5,2) GENERATED ALWAYS AS (
    CASE WHEN total > 0 THEN ROUND((present::numeric / total::numeric) * 100, 2) ELSE 0.00 END
  ) STORED,
  date DATE DEFAULT CURRENT_DATE
);

-- 6. Create Fees Table
CREATE TABLE public.fees (
  id TEXT PRIMARY KEY, -- e.g. 'FEE-001'
  student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  paid NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Paid', 'Pending', 'Overdue')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create Announcements Table
CREATE TABLE public.announcements (
  id TEXT PRIMARY KEY, -- e.g. 'ANN-001'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Create Incidents Table (Security & Campus Triage)
CREATE TABLE public.incidents (
  id TEXT PRIMARY KEY, -- e.g. 'INC-001'
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved')),
  description TEXT NOT NULL,
  reported_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security (RLS) Configuration
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

-- Allow read access on public tables
CREATE POLICY "Allow public read access on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow authenticated updates on own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow read access on students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow read access on parents" ON public.parents FOR SELECT USING (true);
CREATE POLICY "Allow read access on attendance_records" ON public.attendance_records FOR SELECT USING (true);
CREATE POLICY "Allow read access on fees" ON public.fees FOR SELECT USING (true);
CREATE POLICY "Allow read access on announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Allow read access on incidents" ON public.incidents FOR SELECT USING (true);

-- Allow authenticated/anon insert & update for incidents
CREATE POLICY "Allow insert incidents" ON public.incidents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update incidents" ON public.incidents FOR UPDATE USING (true);

-- ============================================================
-- Initial Data Seeding
-- ============================================================

-- Insert sample students
INSERT INTO public.students (id, name, email, program, year, gpa, status, attendance_pct)
VALUES
  ('STU-001', 'Alex Johnson', 'alex.johnson@campus.edu', 'Computer Science', 3, 3.80, 'Active', 87.00),
  ('STU-002', 'Priya Patel', 'priya.patel@campus.edu', 'Computer Science', 2, 3.90, 'Active', 94.00),
  ('STU-003', 'James Rodriguez', 'james.r@campus.edu', 'Electrical Eng.', 3, 3.50, 'Active', 72.00),
  ('STU-004', 'Li Wei', 'li.wei@campus.edu', 'Computer Science', 4, 3.70, 'Active', 91.00),
  ('STU-005', 'Emma Watson', 'emma.w@campus.edu', 'Business Admin', 2, 3.60, 'On Leave', 0.00),
  ('STU-006', 'Omar Hassan', 'omar.h@campus.edu', 'Computer Science', 3, 3.40, 'Active', 68.00),
  ('STU-007', 'Sofia Martinez', 'sofia.m@campus.edu', 'Electrical Eng.', 2, 3.90, 'Active', 96.00);

-- Insert sample attendance records
INSERT INTO public.attendance_records (student_id, subject, code, total, present, absent)
VALUES
  ('STU-001', 'Data Structures', 'CS-301', 30, 26, 4),
  ('STU-001', 'Algorithms', 'CS-302', 28, 25, 3),
  ('STU-001', 'Operating Systems', 'CS-304', 26, 21, 5),
  ('STU-001', 'Database Systems', 'CS-305', 30, 28, 2),
  ('STU-001', 'Mathematics III', 'MA-301', 28, 24, 4);

-- Insert sample fees
INSERT INTO public.fees (id, student_id, label, total, paid, due_date, status)
VALUES
  ('FEE-001', 'STU-001', 'Tuition Fee — Fall 2026', 8500.00, 8500.00, '2026-08-01', 'Paid'),
  ('FEE-002', 'STU-001', 'Hostel Accommodation', 3200.00, 3200.00, '2026-08-01', 'Paid'),
  ('FEE-003', 'STU-001', 'Lab & Library Fee', 800.00, 800.00, '2026-08-15', 'Paid'),
  ('FEE-004', 'STU-001', 'Student Activities Fee', 400.00, 0.00, '2026-09-01', 'Pending'),
  ('FEE-005', 'STU-001', 'Exam Fee — Midterms', 300.00, 0.00, '2026-10-15', 'Pending');

-- Insert sample announcements
INSERT INTO public.announcements (id, title, description, date, priority)
VALUES
  ('ANN-001', 'Campus Maintenance — Building C', 'Water supply will be interrupted in Building C on August 22 from 9 AM to 12 PM. Please plan accordingly.', '2026-08-20', 'high'),
  ('ANN-002', 'Final Exam Schedule Published', 'The final examination schedule for Fall 2026 has been posted. Please check the academic portal for your personal timetable.', '2026-08-19', 'medium'),
  ('ANN-003', 'New Library Hours', 'Starting September 1, the main library will be open from 7 AM to 11 PM on weekdays and 9 AM to 8 PM on weekends.', '2026-08-18', 'low'),
  ('ANN-004', 'Career Fair — October 10', 'Annual career fair featuring 50+ companies. Register through the career portal by September 25.', '2026-08-17', 'medium'),
  ('ANN-005', 'Campus Safety Drill', 'A campus-wide safety drill will be conducted on August 25 at 2 PM. All students and staff are required to participate.', '2026-08-16', 'high'),
  ('ANN-006', 'Scholarship Applications Open', 'Merit-based scholarship applications for Spring 2027 are now open. Deadline: October 1.', '2026-08-15', 'low');

-- Insert sample incidents
INSERT INTO public.incidents (id, title, category, location, severity, status, description)
VALUES
  ('INC-001', 'Broken window in Room 204', 'Facility Damage', 'Building A, Room 204', 'medium', 'Open', 'A window was found broken during morning inspection. No injuries reported.'),
  ('INC-002', 'Suspicious person near Gate B', 'Unauthorized Access', 'Campus Gate B', 'high', 'In Progress', 'Unidentified individual attempting to enter campus without ID badge. Security dispatched.'),
  ('INC-003', 'Fire alarm triggered — Building D', 'Fire Safety', 'Building D', 'critical', 'Resolved', 'False alarm triggered by burnt toast in the staff lounge. System reset completed.'),
  ('INC-004', 'Water leak in parking garage', 'Facility Damage', 'Parking Garage Level B2', 'low', 'Resolved', 'Minor water leak from a pipe joint. Maintenance team repaired it.'),
  ('INC-005', 'Lost student ID card', 'Lost & Found', 'Library', 'low', 'Open', 'Student reported losing ID card in the library. Card has been found at the front desk.'),
  ('INC-006', 'Power outage — Science Block', 'Electrical', 'Science Block, Floors 1-3', 'high', 'In Progress', 'Partial power outage affecting labs and classrooms. Backup generators active.'),
  ('INC-007', 'Medical emergency — Gymnasium', 'Medical', 'Gymnasium', 'critical', 'Resolved', 'Student experienced heat exhaustion during sports practice. First aid administered, student stable.');
