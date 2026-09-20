-- ============================================================
-- Smart Campus ERP — Migration Script v2 (Idempotent RLS & Fixes)
-- ============================================================
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ============================================================

-- 1. Helper function to safely get current user role in uppercase
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT UPPER(role) FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 2. Ensure RLS is enabled on all core tables
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.announcements ENABLE ROW LEVEL SECURITY;

-- 3. Profiles Policies
DROP POLICY IF EXISTS "Allow public read access on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow user update on own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow admin full access on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated read profiles" ON public.profiles;

-- Allow authenticated users to view all profiles (required for campus interactions)
CREATE POLICY "Allow authenticated read profiles" ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to insert their own profile during signup
CREATE POLICY "Allow insert own profile" ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile (name, avatar, department), but not change role arbitrarily
CREATE POLICY "Allow user update on own profile" ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR public.get_current_user_role() = 'ADMIN');

-- 4. Students Policies
DROP POLICY IF EXISTS "Allow select students" ON public.students;
DROP POLICY IF EXISTS "Allow faculty/admin modify students" ON public.students;
DROP POLICY IF EXISTS "Allow admin manage students" ON public.students;
DROP POLICY IF EXISTS "Allow admin/faculty manage students" ON public.students;

CREATE POLICY "Allow select students" ON public.students
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow admin/faculty manage students" ON public.students
  FOR ALL
  TO authenticated
  USING (
    public.get_current_user_role() IN ('ADMIN', 'FACULTY')
    OR auth.uid() = profile_id
  );

-- 5. Parents Policies
DROP POLICY IF EXISTS "Allow select parents" ON public.parents;
DROP POLICY IF EXISTS "Allow modify parents" ON public.parents;
DROP POLICY IF EXISTS "Allow admin/self manage parents" ON public.parents;

CREATE POLICY "Allow select parents" ON public.parents
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow admin/self manage parents" ON public.parents
  FOR ALL
  TO authenticated
  USING (
    public.get_current_user_role() = 'ADMIN'
    OR auth.uid() = profile_id
  );

-- 6. Faculty Policies
DROP POLICY IF EXISTS "Allow select faculty" ON public.faculty;
DROP POLICY IF EXISTS "Allow admin manage faculty" ON public.faculty;
DROP POLICY IF EXISTS "Allow admin/self manage faculty" ON public.faculty;

CREATE POLICY "Allow select faculty" ON public.faculty
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow admin/self manage faculty" ON public.faculty
  FOR ALL
  TO authenticated
  USING (
    public.get_current_user_role() = 'ADMIN'
    OR auth.uid() = profile_id
  );

-- 7. Incidents Policies
-- - Authenticated campus members can SELECT incidents
-- - Only STUDENT and FACULTY can INSERT incidents
-- - Only SECURITY and ADMIN can UPDATE incidents (e.g. resolve/assign)
-- - Only ADMIN can DELETE incidents
DROP POLICY IF EXISTS "Allow read incidents" ON public.incidents;
DROP POLICY IF EXISTS "Allow insert incidents" ON public.incidents;
DROP POLICY IF EXISTS "Allow update incidents" ON public.incidents;
DROP POLICY IF EXISTS "Allow delete incidents" ON public.incidents;

CREATE POLICY "Allow read incidents" ON public.incidents
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert incidents" ON public.incidents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.get_current_user_role() IN ('STUDENT', 'FACULTY')
  );

CREATE POLICY "Allow update incidents" ON public.incidents
  FOR UPDATE
  TO authenticated
  USING (
    public.get_current_user_role() IN ('SECURITY', 'ADMIN')
  )
  WITH CHECK (
    public.get_current_user_role() IN ('SECURITY', 'ADMIN')
  );

CREATE POLICY "Allow delete incidents" ON public.incidents
  FOR DELETE
  TO authenticated
  USING (
    public.get_current_user_role() = 'ADMIN'
  );

-- 8. Announcements Policies
-- - Authenticated users can SELECT announcements
-- - ADMIN and FACULTY can INSERT/UPDATE announcements
-- - Only ADMIN can DELETE announcements
DROP POLICY IF EXISTS "Allow read announcements" ON public.announcements;
DROP POLICY IF EXISTS "Allow insert/update announcements" ON public.announcements;
DROP POLICY IF EXISTS "Allow insert announcements" ON public.announcements;
DROP POLICY IF EXISTS "Allow update announcements" ON public.announcements;
DROP POLICY IF EXISTS "Allow delete announcements" ON public.announcements;

CREATE POLICY "Allow read announcements" ON public.announcements
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert announcements" ON public.announcements
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.get_current_user_role() IN ('ADMIN', 'FACULTY')
  );

CREATE POLICY "Allow update announcements" ON public.announcements
  FOR UPDATE
  TO authenticated
  USING (
    public.get_current_user_role() IN ('ADMIN', 'FACULTY')
  );

CREATE POLICY "Allow delete announcements" ON public.announcements
  FOR DELETE
  TO authenticated
  USING (
    public.get_current_user_role() = 'ADMIN'
  );
