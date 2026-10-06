-- ============================================================
-- Smart Campus ERP — Migration Script v4
-- Parent → student data isolation, student privacy, parent link integrity
-- ============================================================
-- Run this in your Supabase SQL Editor AFTER supabase-migration-v3.sql:
-- https://supabase.com/dashboard/project/_/sql
--
-- This script is idempotent and NON-DESTRUCTIVE:
--   • it drops and re-creates only the POLICIES it manages
--   • it creates two helper functions and one trigger
--   • it does NOT drop tables, does NOT delete rows, and does NOT
--     alter anything v3 relies on (incidents, announcements, profiles)
--
-- WHY THIS MIGRATION EXISTS
-- -------------------------
-- Before v4, these policies were in force:
--
--   students           SELECT USING (true)
--   attendance_records SELECT USING (true)
--   fees               SELECT USING (true)
--   academic_records   SELECT USING (true)
--   parents            SELECT USING (true)
--
-- That means ANY caller holding the anon/publishable key could read
-- every student's attendance, fee balance and transcript. Hiding the
-- navigation is not protection, so the new Parent features would have
-- rested on nothing. v4 makes the database itself enforce the rule:
--
--   ADMIN / FACULTY → all rows (unchanged staff behaviour)
--   STUDENT         → only their own rows
--   PARENT          → only the rows of the ONE student they are linked to
--   anyone else     → nothing
--
-- Write permissions are deliberately left exactly as they were.
-- ============================================================


-- ------------------------------------------------------------
-- 0. Helper functions
--
-- Both are SECURITY DEFINER on purpose. They are called from inside
-- the policies of the very tables they read, so without DEFINER the
-- policy evaluation would recurse into itself.
-- ------------------------------------------------------------

-- Uppercase role of the current user (restated so v4 is self-contained).
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT UPPER(role) FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- The students.id belonging to the signed-in student, or NULL.
CREATE OR REPLACE FUNCTION public.current_student_id()
RETURNS TEXT AS $$
  SELECT s.id
  FROM public.students s
  WHERE s.profile_id = auth.uid()
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

-- The students.id this parent is connected to, or NULL.
-- This is the single source of truth for "whose data may this parent see".
CREATE OR REPLACE FUNCTION public.current_parent_child_id()
RETURNS TEXT AS $$
  SELECT p.child_id
  FROM public.parents p
  WHERE p.profile_id = auth.uid()
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

-- Make sure RLS is on for everything v4 governs.
ALTER TABLE IF EXISTS public.students           ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.parents            ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.fees               ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.academic_records   ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- 1. STUDENTS
--    SELECT → staff, the student themselves, or their linked parent
--    WRITE  → staff, or the student themselves (unchanged from v3)
-- ============================================================
DROP POLICY IF EXISTS "Allow select students"                          ON public.students;
DROP POLICY IF EXISTS "Allow faculty/admin modify students"            ON public.students;
DROP POLICY IF EXISTS "Allow admin manage students"                    ON public.students;
DROP POLICY IF EXISTS "Students readable by owner, parent or staff"    ON public.students;

CREATE POLICY "Students readable by owner, parent or staff" ON public.students
  FOR SELECT
  TO authenticated
  USING (
    public.get_current_user_role() IN ('ADMIN', 'FACULTY')
    OR profile_id = auth.uid()
    OR id = public.current_parent_child_id()
  );

-- Write side restated verbatim from v3 so nothing staff relies on changes.
DROP POLICY IF EXISTS "Allow admin/faculty manage students" ON public.students;

CREATE POLICY "Allow admin/faculty manage students" ON public.students
  FOR ALL TO authenticated
  USING (
    public.get_current_user_role() IN ('ADMIN', 'FACULTY')
    OR auth.uid() = profile_id
  );


-- ============================================================
-- 2. PARENTS
--    SELECT → staff, the parent themselves, or their linked student
--    WRITE  → ADMIN or the parent themselves (unchanged from v3)
-- ============================================================
DROP POLICY IF EXISTS "Allow select parents"                              ON public.parents;
DROP POLICY IF EXISTS "Allow modify parents"                              ON public.parents;
DROP POLICY IF EXISTS "Parents readable by self, linked student or staff" ON public.parents;

CREATE POLICY "Parents readable by self, linked student or staff" ON public.parents
  FOR SELECT
  TO authenticated
  USING (
    public.get_current_user_role() IN ('ADMIN', 'FACULTY')
    OR profile_id = auth.uid()
    OR child_id = public.current_student_id()
  );

DROP POLICY IF EXISTS "Allow admin/self manage parents" ON public.parents;

CREATE POLICY "Allow admin/self manage parents" ON public.parents
  FOR ALL TO authenticated
  USING (
    public.get_current_user_role() = 'ADMIN'
    OR auth.uid() = profile_id
  );


-- ============================================================
-- 3. ATTENDANCE RECORDS
--    SELECT → staff, the student, or that student's parent
--    WRITE  → ADMIN / FACULTY (unchanged)
-- ============================================================
DROP POLICY IF EXISTS "Allow read attendance"                            ON public.attendance_records;
DROP POLICY IF EXISTS "Allow faculty/admin manage attendance"            ON public.attendance_records;
DROP POLICY IF EXISTS "Attendance readable by student, parent or staff"  ON public.attendance_records;

CREATE POLICY "Attendance readable by student, parent or staff" ON public.attendance_records
  FOR SELECT
  TO authenticated
  USING (
    public.get_current_user_role() IN ('ADMIN', 'FACULTY')
    OR student_id = public.current_student_id()
    OR student_id = public.current_parent_child_id()
  );

CREATE POLICY "Allow faculty/admin manage attendance" ON public.attendance_records
  FOR ALL TO authenticated
  USING (public.get_current_user_role() IN ('ADMIN', 'FACULTY'))
  WITH CHECK (public.get_current_user_role() IN ('ADMIN', 'FACULTY'));


-- ============================================================
-- 4. FEES
--    SELECT → staff, the student, or that student's parent
--    WRITE  → ADMIN (unchanged)
-- ============================================================
DROP POLICY IF EXISTS "Allow read fees"                            ON public.fees;
DROP POLICY IF EXISTS "Allow admin manage fees"                    ON public.fees;
DROP POLICY IF EXISTS "Fees readable by student, parent or staff"  ON public.fees;

CREATE POLICY "Fees readable by student, parent or staff" ON public.fees
  FOR SELECT
  TO authenticated
  USING (
    public.get_current_user_role() IN ('ADMIN', 'FACULTY')
    OR student_id = public.current_student_id()
    OR student_id = public.current_parent_child_id()
  );

CREATE POLICY "Allow admin manage fees" ON public.fees
  FOR ALL TO authenticated
  USING (public.get_current_user_role() = 'ADMIN')
  WITH CHECK (public.get_current_user_role() = 'ADMIN');


-- ============================================================
-- 5. ACADEMIC RECORDS
--    SELECT → staff, the student, or that student's parent
--    WRITE  → ADMIN / FACULTY (unchanged)
-- ============================================================
DROP POLICY IF EXISTS "Allow read academics"                            ON public.academic_records;
DROP POLICY IF EXISTS "Allow faculty/admin manage academics"            ON public.academic_records;
DROP POLICY IF EXISTS "Academics readable by student, parent or staff"  ON public.academic_records;

CREATE POLICY "Academics readable by student, parent or staff" ON public.academic_records
  FOR SELECT
  TO authenticated
  USING (
    public.get_current_user_role() IN ('ADMIN', 'FACULTY')
    OR student_id = public.current_student_id()
    OR student_id = public.current_parent_child_id()
  );

CREATE POLICY "Allow faculty/admin manage academics" ON public.academic_records
  FOR ALL TO authenticated
  USING (public.get_current_user_role() IN ('ADMIN', 'FACULTY'))
  WITH CHECK (public.get_current_user_role() IN ('ADMIN', 'FACULTY'));


-- ============================================================
-- 6. PARENT LINK INTEGRITY
--
-- The FK parents.child_id → students(id) already rejects a Student ID
-- that does not exist. What it does not reject is NO Student ID at all,
-- which is exactly how an orphan parent account gets created.
--
-- A BEFORE INSERT trigger closes that gap. INSERT only, deliberately:
-- the FK is declared ON DELETE SET NULL, and blocking UPDATE too would
-- make deleting a student fail instead of detaching the parent.
-- ============================================================
CREATE OR REPLACE FUNCTION public.require_parent_child_link()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.child_id IS NULL THEN
    RAISE EXCEPTION 'A parent record must be linked to a student (child_id is required).';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_require_parent_child_link ON public.parents;
CREATE TRIGGER trg_require_parent_child_link
  BEFORE INSERT ON public.parents
  FOR EACH ROW
  EXECUTE FUNCTION public.require_parent_child_link();


-- ============================================================
-- 7. THE SAME LEAK IN THE REMAINING PER-STUDENT TABLES
--
-- Found while verifying the above. These five tables carry the same
-- base-schema policy shape — SELECT USING (true) with no TO clause —
-- so they were readable by anyone holding the publishable key, with
-- no login at all. Measured against the live database before v4:
--
--   exam_results          2 rows readable anonymously
--   library_transactions  2 rows readable anonymously
--   hostel_allocations    1 row  readable anonymously
--   event_registration    2 rows readable anonymously
--   enrollments           5 rows readable anonymously
--
-- They get the identical rule: staff, the student, or that student's
-- parent. No application page is narrowed by this — student pages that
-- read these tables did so WITHOUT a student_id filter, so tightening
-- here also fixes students seeing each other's results and loans.
-- ============================================================

-- ── exam_results ──
DROP POLICY IF EXISTS "Allow read exam results"                             ON public.exam_results;
DROP POLICY IF EXISTS "Allow manage exam results"                           ON public.exam_results;
DROP POLICY IF EXISTS "Exam results readable by student, parent or staff"   ON public.exam_results;

ALTER TABLE IF EXISTS public.exam_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Exam results readable by student, parent or staff" ON public.exam_results
  FOR SELECT TO authenticated
  USING (
    public.get_current_user_role() IN ('ADMIN', 'FACULTY')
    OR student_id = public.current_student_id()
    OR student_id = public.current_parent_child_id()
  );

CREATE POLICY "Allow manage exam results" ON public.exam_results
  FOR ALL TO authenticated
  USING (public.get_current_user_role() IN ('ADMIN', 'FACULTY'))
  WITH CHECK (public.get_current_user_role() IN ('ADMIN', 'FACULTY'));


-- ── library_transactions ──
-- The old write policy was: USING (role = 'ADMIN' OR auth.uid() IS NOT NULL),
-- i.e. ANY signed-in user could insert, update or delete loan records.
-- Writes are now staff-only. No application page writes this table.
DROP POLICY IF EXISTS "Allow read library transactions"                  ON public.library_transactions;
DROP POLICY IF EXISTS "Allow manage library transactions"                ON public.library_transactions;
DROP POLICY IF EXISTS "Loans readable by student, parent or staff"       ON public.library_transactions;

ALTER TABLE IF EXISTS public.library_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Loans readable by student, parent or staff" ON public.library_transactions
  FOR SELECT TO authenticated
  USING (
    public.get_current_user_role() IN ('ADMIN', 'FACULTY')
    OR student_id = public.current_student_id()
    OR student_id = public.current_parent_child_id()
  );

CREATE POLICY "Allow manage library transactions" ON public.library_transactions
  FOR ALL TO authenticated
  USING (public.get_current_user_role() IN ('ADMIN', 'FACULTY'))
  WITH CHECK (public.get_current_user_role() IN ('ADMIN', 'FACULTY'));


-- ── hostel_allocations ──
DROP POLICY IF EXISTS "Allow read hostel allocations"                        ON public.hostel_allocations;
DROP POLICY IF EXISTS "Allow manage hostel allocations"                      ON public.hostel_allocations;
DROP POLICY IF EXISTS "Hostel allocations readable by student, parent or staff" ON public.hostel_allocations;

ALTER TABLE IF EXISTS public.hostel_allocations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hostel allocations readable by student, parent or staff" ON public.hostel_allocations
  FOR SELECT TO authenticated
  USING (
    public.get_current_user_role() IN ('ADMIN', 'FACULTY')
    OR student_id = public.current_student_id()
    OR student_id = public.current_parent_child_id()
  );

CREATE POLICY "Allow manage hostel allocations" ON public.hostel_allocations
  FOR ALL TO authenticated
  USING (public.get_current_user_role() = 'ADMIN')
  WITH CHECK (public.get_current_user_role() = 'ADMIN');


-- ── event_registration ──
DROP POLICY IF EXISTS "Allow read event registrations"                        ON public.event_registration;
DROP POLICY IF EXISTS "Allow insert event registrations"                      ON public.event_registration;
DROP POLICY IF EXISTS "Event registrations readable by student, parent or staff" ON public.event_registration;

ALTER TABLE IF EXISTS public.event_registration ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event registrations readable by student, parent or staff" ON public.event_registration
  FOR SELECT TO authenticated
  USING (
    public.get_current_user_role() IN ('ADMIN', 'FACULTY')
    OR student_id = public.current_student_id()
    OR student_id = public.current_parent_child_id()
  );

-- A student may register themselves; staff may register anyone.
CREATE POLICY "Allow insert event registrations" ON public.event_registration
  FOR INSERT TO authenticated
  WITH CHECK (
    public.get_current_user_role() IN ('ADMIN', 'FACULTY')
    OR student_id = public.current_student_id()
  );


-- ── enrollments ──
DROP POLICY IF EXISTS "Allow read enrollments"                        ON public.enrollments;
DROP POLICY IF EXISTS "Allow insert enrollments"                      ON public.enrollments;
DROP POLICY IF EXISTS "Enrollments readable by student, parent or staff" ON public.enrollments;

ALTER TABLE IF EXISTS public.enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrollments readable by student, parent or staff" ON public.enrollments
  FOR SELECT TO authenticated
  USING (
    public.get_current_user_role() IN ('ADMIN', 'FACULTY')
    OR student_id = public.current_student_id()
    OR student_id = public.current_parent_child_id()
  );

CREATE POLICY "Allow insert enrollments" ON public.enrollments
  FOR INSERT TO authenticated
  WITH CHECK (
    public.get_current_user_role() IN ('ADMIN', 'FACULTY')
    OR student_id = public.current_student_id()
  );


-- ============================================================
-- 8. Verification helpers (read-only — run these to confirm)
-- ============================================================
-- Every policy now in force on the five tables v4 governs:
--
--   SELECT tablename, policyname, cmd, roles
--   FROM pg_policies
--   WHERE schemaname = 'public'
--     AND tablename IN ('students','parents','attendance_records','fees',
--                       'academic_records','exam_results','library_transactions',
--                       'hostel_allocations','event_registration','enrollments')
--   ORDER BY tablename, cmd, policyname;
--
-- Any policy still open to anonymous callers (should return 0 rows for the
-- per-student tables above):
--
--   SELECT tablename, policyname, roles
--   FROM pg_policies
--   WHERE schemaname = 'public' AND 'anon' = ANY(roles);
--
-- Any parent row missing its student link (should return 0 rows):
--
--   SELECT id, name, email FROM public.parents WHERE child_id IS NULL;
--
-- ============================================================
-- Done. No tables dropped, no rows deleted, v3 untouched.
-- ============================================================
