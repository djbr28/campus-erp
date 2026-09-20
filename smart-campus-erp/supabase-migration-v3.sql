-- ============================================================
-- Smart Campus ERP — Migration Script v3
-- Incident permissions, announcement audiences, role integrity
-- ============================================================
-- Run this in your Supabase SQL Editor AFTER supabase-schema.sql
-- (and supabase-migration-v2.sql if you ran it):
-- https://supabase.com/dashboard/project/_/sql
--
-- This script is idempotent and NON-DESTRUCTIVE:
--   • it drops and re-creates only the POLICIES it manages
--   • it does NOT drop tables and does NOT delete any data
--
-- What changes versus v2:
--   1. Only SECURITY may UPDATE incidents. ADMIN loses that right
--      (Admin keeps read-only oversight, per the requirements).
--   2. Incident INSERT additionally requires reported_by = auth.uid(),
--      so a reporter cannot attribute a report to someone else.
--   3. A trigger prevents users from escalating their own role.
-- ============================================================

-- ------------------------------------------------------------
-- 0. Helper function (uppercase role of the current user)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT UPPER(role) FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Ensure RLS is on for the tables this migration governs.
ALTER TABLE IF EXISTS public.profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.students      ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.parents       ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.faculty       ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.incidents     ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.announcements ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- 1. INCIDENTS
--    SELECT  → every authenticated campus member
--    INSERT  → STUDENT and FACULTY only, as themselves
--    UPDATE  → SECURITY only
--    DELETE  → ADMIN only
-- ============================================================
DROP POLICY IF EXISTS "Allow read incidents"   ON public.incidents;
DROP POLICY IF EXISTS "Allow insert incidents" ON public.incidents;
DROP POLICY IF EXISTS "Allow update incidents" ON public.incidents;
DROP POLICY IF EXISTS "Allow delete incidents" ON public.incidents;

CREATE POLICY "Allow read incidents" ON public.incidents
  FOR SELECT
  TO authenticated
  USING (true);

-- reported_by must be the caller: no filing reports under another identity.
CREATE POLICY "Allow insert incidents" ON public.incidents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.get_current_user_role() IN ('STUDENT', 'FACULTY')
    AND reported_by = auth.uid()
  );

-- Only Campus Security resolves incidents. This is what makes the
-- "Mark Resolved" button real rather than decorative.
CREATE POLICY "Allow update incidents" ON public.incidents
  FOR UPDATE
  TO authenticated
  USING (public.get_current_user_role() = 'SECURITY')
  WITH CHECK (public.get_current_user_role() = 'SECURITY');

CREATE POLICY "Allow delete incidents" ON public.incidents
  FOR DELETE
  TO authenticated
  USING (public.get_current_user_role() = 'ADMIN');


-- ============================================================
-- 2. ANNOUNCEMENTS
--    SELECT → any authenticated user may read announcements
--             addressed to ALL or to their own role
--    INSERT/UPDATE → ADMIN and FACULTY
--    DELETE → ADMIN only
-- ============================================================
DROP POLICY IF EXISTS "Allow read announcements"          ON public.announcements;
DROP POLICY IF EXISTS "Allow insert/update announcements" ON public.announcements;
DROP POLICY IF EXISTS "Allow insert announcements"        ON public.announcements;
DROP POLICY IF EXISTS "Allow update announcements"        ON public.announcements;
DROP POLICY IF EXISTS "Allow delete announcements"        ON public.announcements;

-- Audience-aware read. ADMIN sees everything for oversight; every
-- other role sees ALL-targeted notices plus its own.
CREATE POLICY "Allow read announcements" ON public.announcements
  FOR SELECT
  TO authenticated
  USING (
    target_role IS NULL
    OR target_role = 'ALL'
    OR target_role = public.get_current_user_role()
    OR public.get_current_user_role() = 'ADMIN'
  );

CREATE POLICY "Allow insert announcements" ON public.announcements
  FOR INSERT
  TO authenticated
  WITH CHECK (public.get_current_user_role() IN ('ADMIN', 'FACULTY'));

CREATE POLICY "Allow update announcements" ON public.announcements
  FOR UPDATE
  TO authenticated
  USING (public.get_current_user_role() IN ('ADMIN', 'FACULTY'))
  WITH CHECK (public.get_current_user_role() IN ('ADMIN', 'FACULTY'));

CREATE POLICY "Allow delete announcements" ON public.announcements
  FOR DELETE
  TO authenticated
  USING (public.get_current_user_role() = 'ADMIN');


-- ============================================================
-- 3. PROFILES
--    SELECT → all authenticated users
--    INSERT → your own profile (public signup)
--    UPDATE → your own profile, or any profile if ADMIN
--    Role changes by non-admins are blocked by trigger (below).
-- ============================================================
DROP POLICY IF EXISTS "Allow public read access on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated read profiles"    ON public.profiles;
DROP POLICY IF EXISTS "Allow insert own profile"             ON public.profiles;
DROP POLICY IF EXISTS "Allow user update on own profile"     ON public.profiles;
DROP POLICY IF EXISTS "Allow admin full access on profiles"  ON public.profiles;

CREATE POLICY "Allow authenticated read profiles" ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert own profile" ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow user update on own profile" ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR public.get_current_user_role() = 'ADMIN')
  WITH CHECK (auth.uid() = id OR public.get_current_user_role() = 'ADMIN');

-- RLS WITH CHECK cannot compare NEW.role against OLD.role, so role
-- integrity is enforced with a trigger instead.
CREATE OR REPLACE FUNCTION public.prevent_role_self_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- auth.uid() is NULL for the service role (server-side Admin API),
    -- which is allowed to assign roles.
    IF auth.uid() IS NOT NULL AND public.get_current_user_role() <> 'ADMIN' THEN
      RAISE EXCEPTION 'You are not permitted to change your own role.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_role_self_change ON public.profiles;
CREATE TRIGGER trg_prevent_role_self_change
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_self_change();


-- ============================================================
-- 4. ROLE-SPECIFIC TABLES (unchanged from v2, restated so this
--    migration is self-contained if v2 was never run)
--    SELECT → all authenticated users
--    WRITE  → ADMIN, or the owner of the linked profile
-- ============================================================
DROP POLICY IF EXISTS "Allow select students"               ON public.students;
DROP POLICY IF EXISTS "Allow faculty/admin modify students" ON public.students;
DROP POLICY IF EXISTS "Allow admin manage students"         ON public.students;
DROP POLICY IF EXISTS "Allow admin/faculty manage students" ON public.students;

CREATE POLICY "Allow select students" ON public.students
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow admin/faculty manage students" ON public.students
  FOR ALL TO authenticated
  USING (
    public.get_current_user_role() IN ('ADMIN', 'FACULTY')
    OR auth.uid() = profile_id
  );

DROP POLICY IF EXISTS "Allow select parents"            ON public.parents;
DROP POLICY IF EXISTS "Allow modify parents"            ON public.parents;
DROP POLICY IF EXISTS "Allow admin/self manage parents" ON public.parents;

CREATE POLICY "Allow select parents" ON public.parents
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow admin/self manage parents" ON public.parents
  FOR ALL TO authenticated
  USING (
    public.get_current_user_role() = 'ADMIN'
    OR auth.uid() = profile_id
  );

DROP POLICY IF EXISTS "Allow select faculty"            ON public.faculty;
DROP POLICY IF EXISTS "Allow admin manage faculty"      ON public.faculty;
DROP POLICY IF EXISTS "Allow admin/self manage faculty" ON public.faculty;

CREATE POLICY "Allow select faculty" ON public.faculty
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow admin/self manage faculty" ON public.faculty
  FOR ALL TO authenticated
  USING (
    public.get_current_user_role() = 'ADMIN'
    OR auth.uid() = profile_id
  );

-- ============================================================
-- Done. No tables dropped, no rows deleted.
-- ============================================================
