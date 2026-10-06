// ============================================================
// Smart Campus ERP — Admin User Management API
//
// GET   /api/admin/users?role=ALL|STUDENT|FACULTY|PARENT|SECURITY|ADMIN
//       → the real user directory, read with the service role so
//         Admin sees every account regardless of RLS.
//
// POST  /api/admin/users
//       → Supabase Auth user + profiles row + role-specific row.
//
// PATCH /api/admin/users
//       → edit an existing account: profile fields, role-specific
//         fields, the Auth email, and (ADMIN only) the role itself.
//
// Every handler verifies the CALLER is an authenticated ADMIN before
// touching the service-role client. Passwords are only ever handed
// to Supabase Auth — never stored in an application table. The
// service-role key stays server-side and is never echoed back.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/supabase/server";

// Mirrors the CHECK constraint on public.profiles.role.
const VALID_ROLES = ["STUDENT", "PARENT", "FACULTY", "ADMIN", "SECURITY"] as const;
type Role = (typeof VALID_ROLES)[number];

// Mirrors the CHECK constraint on public.students.status.
const VALID_STUDENT_STATUSES = ["Active", "On Leave", "Graduated", "Suspended"] as const;

export interface DirectoryUser {
  /** profiles.id when the user has an Auth account, otherwise the role-table id. */
  id: string;
  /** Role-specific table id (STU-001, FAC-001, PAR-001) when one exists. */
  recordId: string | null;
  name: string;
  email: string;
  role: Role;
  department: string | null;
  phone: string | null;
  created_at: string | null;
  /** False for legacy/seeded rows that have no linked Auth account. */
  hasAuthAccount: boolean;
  // Role-specific extras (present only where meaningful)
  registerNumber?: string | null;
  program?: string | null;
  year?: number | null;
  semester?: number | null;
  gpa?: string | null;
  status?: string | null;
  attendancePct?: number | null;
  designation?: string | null;
  childId?: string | null;
  childName?: string | null;
}

/** The columns this route reads from each role table. */
interface StudentRow {
  id: string;
  profile_id: string | null;
  register_number: string | null;
  name: string;
  email: string;
  department: string | null;
  program: string | null;
  year: number | null;
  semester: number | null;
  phone: string | null;
  gpa: number | string | null;
  status: string | null;
  attendance_pct: number | string | null;
  created_at: string | null;
}

interface FacultyRow {
  id: string;
  profile_id: string | null;
  name: string;
  email: string;
  department: string | null;
  designation: string | null;
  phone: string | null;
  created_at: string | null;
}

interface ParentRow {
  id: string;
  profile_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  child_id: string | null;
  child_name: string | null;
  created_at: string | null;
}

/** Trims a value to a non-empty string, or returns null. */
function str(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Parses an optional positive integer field.
 * - `undefined` / `null` / "" → `undefined` (meaning "leave unchanged")
 * - a valid integer in range  → the number
 * - anything else             → `"invalid"`
 */
function optionalInt(value: unknown, min: number, max: number): number | undefined | "invalid" {
  if (value === undefined || value === null || value === "") return undefined;
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) return "invalid";
  return n;
}

type AdminClient = ReturnType<typeof getSupabaseAdmin>;

/**
 * Finds a detached role row that clearly belongs to this person, so that
 * re-roling a user back to a role they previously held re-attaches their
 * original record instead of inserting a duplicate (which would collide on
 * students.register_number) and stranding their history.
 */
async function findDetachedRoleRow(
  supabaseAdmin: AdminClient,
  table: "students" | "faculty" | "parents",
  email: string
): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from(table)
    .select("id")
    .is("profile_id", null)
    .eq("email", email)
    .limit(1)
    .maybeSingle();

  return data?.id ?? null;
}

/**
 * Resolves a Student ID typed by an administrator to the canonical
 * `students` row. Accepts either the primary key (STU-001) or the
 * register number, so Admin does not have to know which is which.
 *
 * Returns null when no such student exists — the caller must then
 * refuse to create or link a Parent.
 */
async function resolveStudent(
  supabaseAdmin: AdminClient,
  rawId: string
): Promise<{ id: string; name: string } | null> {
  const needle = rawId.trim();
  if (!needle) return null;

  // Two plain equality lookups rather than one interpolated .or() filter:
  // a value containing a comma would otherwise be parsed as extra PostgREST
  // conditions and could resolve to a student the admin never named.
  const byId = await supabaseAdmin
    .from("students")
    .select("id, name")
    .eq("id", needle)
    .limit(1)
    .maybeSingle();

  if (byId.data) return { id: byId.data.id, name: byId.data.name };

  const byRegister = await supabaseAdmin
    .from("students")
    .select("id, name")
    .eq("register_number", needle)
    .limit(1)
    .maybeSingle();

  if (byRegister.data) return { id: byRegister.data.id, name: byRegister.data.name };

  return null;
}

// ============================================================
// GET — the directory
// ============================================================
export async function GET(req: NextRequest) {
  const check = await requireRole(["ADMIN"]);
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const requested = (req.nextUrl.searchParams.get("role") || "ALL").toUpperCase();

  try {
    const supabaseAdmin = getSupabaseAdmin();

    const [profilesRes, studentsRes, facultyRes, parentsRes] = await Promise.all([
      supabaseAdmin.from("profiles").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("students").select("*"),
      supabaseAdmin.from("faculty").select("*"),
      supabaseAdmin.from("parents").select("*"),
    ]);

    const firstError =
      profilesRes.error || studentsRes.error || facultyRes.error || parentsRes.error;
    if (firstError) {
      console.error("[Admin Users API] Directory read failed:", firstError);
      return NextResponse.json(
        { error: `Failed to load the user directory: ${firstError.message}` },
        { status: 500 }
      );
    }

    const students = studentsRes.data ?? [];
    const faculty = facultyRes.data ?? [];
    const parents = parentsRes.data ?? [];

    const studentByProfile = new Map<string, StudentRow>();
    for (const s of students) if (s.profile_id) studentByProfile.set(s.profile_id, s);

    const facultyByProfile = new Map<string, FacultyRow>();
    for (const f of faculty) if (f.profile_id) facultyByProfile.set(f.profile_id, f);

    const parentByProfile = new Map<string, ParentRow>();
    for (const p of parents) if (p.profile_id) parentByProfile.set(p.profile_id, p);

    const users: DirectoryUser[] = [];

    // ── 1. Every real Auth-backed account, enriched from its role table ──
    for (const p of profilesRes.data ?? []) {
      const role = String(p.role || "STUDENT").toUpperCase() as Role;
      const base: DirectoryUser = {
        id: p.id,
        recordId: null,
        name: p.name,
        email: p.email,
        role,
        department: p.department ?? null,
        phone: null,
        created_at: p.created_at ?? null,
        hasAuthAccount: true,
      };

      if (role === "STUDENT") {
        const s = studentByProfile.get(p.id);
        users.push({
          ...base,
          recordId: s?.id ?? null,
          department: s?.department ?? base.department,
          phone: s?.phone ?? null,
          registerNumber: s?.register_number ?? null,
          program: s?.program ?? null,
          year: s?.year ?? null,
          semester: s?.semester ?? null,
          gpa: s?.gpa != null ? String(s.gpa) : null,
          status: s?.status ?? null,
          attendancePct: s?.attendance_pct != null ? Number(s.attendance_pct) : null,
        });
      } else if (role === "FACULTY") {
        const f = facultyByProfile.get(p.id);
        users.push({
          ...base,
          recordId: f?.id ?? null,
          department: f?.department ?? base.department,
          phone: f?.phone ?? null,
          designation: f?.designation ?? null,
        });
      } else if (role === "PARENT") {
        const pa = parentByProfile.get(p.id);
        users.push({
          ...base,
          recordId: pa?.id ?? null,
          phone: pa?.phone ?? null,
          childId: pa?.child_id ?? null,
          childName: pa?.child_name ?? null,
        });
      } else {
        users.push(base);
      }
    }

    const linkedProfileIds = new Set((profilesRes.data ?? []).map((p) => p.id));

    // ── 2. Legacy/seeded role rows that predate Auth accounts ──
    for (const s of students) {
      if (s.profile_id && linkedProfileIds.has(s.profile_id)) continue;
      users.push({
        id: s.id,
        recordId: s.id,
        name: s.name,
        email: s.email,
        role: "STUDENT",
        department: s.department ?? null,
        phone: s.phone ?? null,
        created_at: s.created_at ?? null,
        hasAuthAccount: false,
        registerNumber: s.register_number ?? null,
        program: s.program ?? null,
        year: s.year ?? null,
        semester: s.semester ?? null,
        gpa: s.gpa != null ? String(s.gpa) : null,
        status: s.status ?? null,
        attendancePct: s.attendance_pct != null ? Number(s.attendance_pct) : null,
      });
    }

    for (const f of faculty) {
      if (f.profile_id && linkedProfileIds.has(f.profile_id)) continue;
      users.push({
        id: f.id,
        recordId: f.id,
        name: f.name,
        email: f.email,
        role: "FACULTY",
        department: f.department ?? null,
        phone: f.phone ?? null,
        created_at: f.created_at ?? null,
        hasAuthAccount: false,
        designation: f.designation ?? null,
      });
    }

    for (const pa of parents) {
      if (pa.profile_id && linkedProfileIds.has(pa.profile_id)) continue;
      users.push({
        id: pa.id,
        recordId: pa.id,
        name: pa.name,
        email: pa.email,
        role: "PARENT",
        department: null,
        phone: pa.phone ?? null,
        created_at: pa.created_at ?? null,
        hasAuthAccount: false,
        childId: pa.child_id ?? null,
        childName: pa.child_name ?? null,
      });
    }

    // Per-role tallies for the whole directory, independent of the filter,
    // so the Admin UI can label every tab even while a filter is applied.
    const counts: Record<string, number> = { ALL: users.length };
    for (const role of VALID_ROLES) {
      counts[role] = users.filter((u) => u.role === role).length;
    }

    const filtered =
      requested === "ALL" ? users : users.filter((u) => u.role === requested);

    return NextResponse.json({ users: filtered, total: users.length, counts });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("[Admin Users API] GET exception:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ============================================================
// POST — create an account
// ============================================================
export async function POST(req: NextRequest) {
  // ── Requester must be an authenticated ADMIN ──
  const check = await requireRole(["ADMIN"]);
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  try {
    const body = await req.json();
    const { role, name, email, password, ...details } = body;

    if (!role || !name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields (role, name, email, password)." },
        { status: 400 }
      );
    }

    const normalizedRole = String(role).toUpperCase();
    if (!(VALID_ROLES as readonly string[]).includes(normalizedRole)) {
      return NextResponse.json(
        { error: `Role must be one of: ${VALID_ROLES.join(", ")}.` },
        { status: 400 }
      );
    }

    if (String(password).length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    // ── Student academic fields are validated before anything is created ──
    let year: number | undefined;
    let semester: number | undefined;

    if (normalizedRole === "STUDENT") {
      const parsedYear = optionalInt(details.year, 1, 10);
      const parsedSemester = optionalInt(details.semester, 1, 20);

      if (parsedYear === "invalid") {
        return NextResponse.json({ error: "Year must be a whole number between 1 and 10." }, { status: 400 });
      }
      if (parsedSemester === "invalid") {
        return NextResponse.json({ error: "Semester must be a whole number between 1 and 20." }, { status: 400 });
      }
      year = parsedYear;
      semester = parsedSemester;
    }

    // ── A Parent MUST be attached to a real student. This is checked
    //    BEFORE the Auth user exists, so a bad Student ID can never
    //    leave an orphan account behind. ──
    let linkedChild: { id: string; name: string } | null = null;

    if (normalizedRole === "PARENT") {
      const childIdInput = str(details.childId);
      if (!childIdInput) {
        return NextResponse.json(
          { error: "A Student ID is required to create a Parent account." },
          { status: 400 }
        );
      }

      linkedChild = await resolveStudent(supabaseAdmin, childIdInput);
      if (!linkedChild) {
        return NextResponse.json(
          { error: `No student matches "${childIdInput}". Enter an existing Student ID or register number.` },
          { status: 400 }
        );
      }
    }

    // ── Create the Auth user (Supabase Auth owns the password) ──
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role: normalizedRole },
    });

    if (authError || !authData.user) {
      console.error("[CreateUser] Auth Error:", authError?.message);
      return NextResponse.json(
        { error: authError?.message || "Failed to create the user in Supabase Auth." },
        { status: 400 }
      );
    }

    const userId = authData.user.id;

    /**
     * Roll the Auth user back so a half-created account never lingers.
     * Deleting the Auth user cascades to `profiles` (FK ON DELETE CASCADE)
     * and from there to `parents` — so only `students`, which is
     * ON DELETE SET NULL, needs explicit cleanup.
     */
    const rollback = async (reason: string, detail: string) => {
      if (normalizedRole === "STUDENT") {
        await supabaseAdmin.from("students").delete().eq("profile_id", userId);
      }

      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (deleteError) {
        console.error("[CreateUser] Rollback failed, orphaned Auth user:", userId, deleteError.message);
        return NextResponse.json(
          {
            error: `${reason}: ${detail}. The Auth account could not be rolled back — user id ${userId} may need manual cleanup.`,
          },
          { status: 500 }
        );
      }
      return NextResponse.json({ error: `${reason}: ${detail}` }, { status: 500 });
    };

    // ── profiles row (id is FK → auth.users, cascades on delete) ──
    const { error: profileError } = await supabaseAdmin.from("profiles").upsert(
      {
        id: userId,
        name,
        email,
        role: normalizedRole,
        department: str(details.department),
      },
      { onConflict: "id" }
    );

    if (profileError) {
      console.error("[CreateUser] Profile Insert Error:", profileError);
      return rollback("Failed to create the user profile", profileError.message);
    }

    // ── Role-specific row. ADMIN and SECURITY have no side table
    //    in this schema — profiles is their record of truth. ──
    let roleInsertError: { message: string } | null = null;

    if (normalizedRole === "STUDENT") {
      const studentId = str(details.registerNumber) || `STU-${Date.now().toString().slice(-6)}`;
      const { error } = await supabaseAdmin.from("students").insert({
        id: studentId,
        profile_id: userId,
        register_number: str(details.registerNumber),
        name,
        email,
        department: str(details.department) || "Computer Science",
        program: str(details.program) || "B.Tech Computer Science",
        // No silent "|| 1". The admin's value is stored verbatim; the
        // column default only applies when the admin left it blank.
        ...(year !== undefined ? { year } : {}),
        ...(semester !== undefined ? { semester } : {}),
        phone: str(details.phone),
        status: "Active",
      });
      roleInsertError = error;
    } else if (normalizedRole === "FACULTY") {
      const facultyId = `FAC-${Date.now().toString().slice(-6)}`;
      const { error } = await supabaseAdmin.from("faculty").insert({
        id: facultyId,
        profile_id: userId,
        name,
        email,
        department: str(details.department) || "Computer Science",
        designation: str(details.designation) || "Assistant Professor",
        phone: str(details.phone),
      });
      roleInsertError = error;
    } else if (normalizedRole === "PARENT") {
      // linkedChild is non-null here — validated before the Auth user existed.
      const parentId = `PAR-${Date.now().toString().slice(-6)}`;
      const { error } = await supabaseAdmin.from("parents").insert({
        id: parentId,
        profile_id: userId,
        name,
        email,
        phone: str(details.phone),
        child_id: linkedChild!.id,
        child_name: linkedChild!.name,
      });
      roleInsertError = error;

      // Link the student back to this parent profile. If this fails the
      // relationship would be half-formed, so the whole creation is undone.
      if (!error) {
        const { error: linkError } = await supabaseAdmin
          .from("students")
          .update({ parent_id: userId })
          .eq("id", linkedChild!.id);

        if (linkError) {
          console.error("[CreateUser] Parent created but child link failed:", linkError.message);
          await supabaseAdmin.from("parents").delete().eq("profile_id", userId);
          return rollback("Failed to link the parent to the student", linkError.message);
        }
      }
    }

    // ── Safe failure handling ──
    if (roleInsertError) {
      console.error("[CreateUser] Role Table Insert Error:", roleInsertError);
      return rollback(
        `Failed to create the ${normalizedRole.toLowerCase()} record`,
        roleInsertError.message
      );
    }

    return NextResponse.json({
      success: true,
      userId,
      role: normalizedRole,
      linkedStudentId: linkedChild?.id ?? null,
      message: `${name} was created in Supabase Auth and can now sign in.`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("[CreateUser] Exception:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ============================================================
// PATCH — edit an existing account
// ============================================================
export async function PATCH(req: NextRequest) {
  // Only an authenticated ADMIN reaches past this line. An ordinary user
  // calling this endpoint gets 401/403 and never touches the service role,
  // so there is no path here for a user to elevate their own role.
  const check = await requireRole(["ADMIN"]);
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  try {
    const body = await req.json();
    const userId = str(body.userId);

    if (!userId) {
      return NextResponse.json({ error: "A userId is required." }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // ── Load the account being edited ──
    const { data: existing, error: loadError } = await supabaseAdmin
      .from("profiles")
      .select("id, name, email, role, department")
      .eq("id", userId)
      .maybeSingle();

    if (loadError) {
      return NextResponse.json(
        { error: `Could not load that account: ${loadError.message}` },
        { status: 500 }
      );
    }

    if (!existing) {
      return NextResponse.json(
        {
          error:
            "That record has no Auth account, so it cannot be edited here. Only accounts with a login can be modified.",
        },
        { status: 404 }
      );
    }

    const currentRole = String(existing.role || "").toUpperCase() as Role;

    // ── Role change rules ──
    let nextRole: Role = currentRole;
    const requestedRole = str(body.role)?.toUpperCase();

    if (requestedRole && requestedRole !== currentRole) {
      if (!(VALID_ROLES as readonly string[]).includes(requestedRole)) {
        return NextResponse.json(
          { error: `Role must be one of: ${VALID_ROLES.join(", ")}.` },
          { status: 400 }
        );
      }

      // An admin may re-role anyone except themselves. Self-editing one's own
      // role is the one shape of this request that could lock the institution
      // out of its own admin tooling, so it is refused outright.
      if (userId === check.profile.id) {
        return NextResponse.json(
          { error: "You cannot change your own role. Ask another administrator to do it." },
          { status: 403 }
        );
      }

      nextRole = requestedRole as Role;
    }

    const name = str(body.name) ?? existing.name;
    const email = str(body.email) ?? existing.email;
    const department = body.department === undefined ? existing.department : str(body.department);
    const phone = body.phone === undefined ? undefined : str(body.phone);

    // ── Validate student academic fields before writing anything ──
    const parsedYear = optionalInt(body.year, 1, 10);
    const parsedSemester = optionalInt(body.semester, 1, 20);

    if (parsedYear === "invalid") {
      return NextResponse.json({ error: "Year must be a whole number between 1 and 10." }, { status: 400 });
    }
    if (parsedSemester === "invalid") {
      return NextResponse.json({ error: "Semester must be a whole number between 1 and 20." }, { status: 400 });
    }

    const status = str(body.status);
    if (status && !(VALID_STUDENT_STATUSES as readonly string[]).includes(status)) {
      return NextResponse.json(
        { error: `Status must be one of: ${VALID_STUDENT_STATUSES.join(", ")}.` },
        { status: 400 }
      );
    }

    // ── A Parent still MUST point at a real student, on edit as on create ──
    let linkedChild: { id: string; name: string } | null = null;

    if (nextRole === "PARENT") {
      const childIdInput = str(body.childId);

      if (childIdInput) {
        linkedChild = await resolveStudent(supabaseAdmin, childIdInput);
        if (!linkedChild) {
          return NextResponse.json(
            { error: `No student matches "${childIdInput}". Enter an existing Student ID or register number.` },
            { status: 400 }
          );
        }
      } else {
        // No new value supplied — an existing link is fine, a missing one is not.
        const { data: existingParent } = await supabaseAdmin
          .from("parents")
          .select("child_id, child_name")
          .eq("profile_id", userId)
          .maybeSingle();

        if (existingParent?.child_id) {
          linkedChild = {
            id: existingParent.child_id,
            name: existingParent.child_name || "",
          };
        } else {
          return NextResponse.json(
            { error: "A Student ID is required for a Parent account." },
            { status: 400 }
          );
        }
      }
    }

    // ── Supabase Auth email (server-side Admin API; key never leaves here) ──
    if (email !== existing.email) {
      const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        email,
        email_confirm: true,
        user_metadata: { name, role: nextRole },
      });

      if (authUpdateError) {
        return NextResponse.json(
          { error: `Could not update the sign-in email: ${authUpdateError.message}` },
          { status: 400 }
        );
      }
    } else {
      // Keep the Auth metadata in step with the profile even when the
      // email is unchanged, so the login path reports the right role.
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: { name, role: nextRole },
      });
    }

    // ── profiles ──
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({ name, email, role: nextRole, department })
      .eq("id", userId);

    if (profileError) {
      console.error("[EditUser] Profile update failed:", profileError);
      return NextResponse.json(
        { error: `Failed to update the profile: ${profileError.message}` },
        { status: 500 }
      );
    }

    // ── When the role changed, detach the previous role record.
    //    Rows are UNLINKED, never deleted: deleting a `students` row
    //    would cascade away its attendance, fees and academic history. ──
    if (nextRole !== currentRole) {
      const previousTable =
        currentRole === "STUDENT" ? "students" : currentRole === "FACULTY" ? "faculty" : currentRole === "PARENT" ? "parents" : null;

      if (previousTable) {
        const { error: unlinkError } = await supabaseAdmin
          .from(previousTable)
          .update({ profile_id: null })
          .eq("profile_id", userId);

        if (unlinkError) {
          console.error("[EditUser] Could not detach previous role record:", unlinkError);
          return NextResponse.json(
            { error: `Failed to detach the previous ${currentRole.toLowerCase()} record: ${unlinkError.message}` },
            { status: 500 }
          );
        }
      }
    }

    // ── Role-specific record for the new role ──
    let roleError: { message: string } | null = null;

    if (nextRole === "STUDENT") {
      const { data: attached } = await supabaseAdmin
        .from("students")
        .select("id")
        .eq("profile_id", userId)
        .maybeSingle();

      // Re-attach a record this person previously held, if one is detached.
      const reattachId = attached ? null : await findDetachedRoleRow(supabaseAdmin, "students", email);
      if (reattachId) {
        await supabaseAdmin.from("students").update({ profile_id: userId }).eq("id", reattachId);
      }

      const studentRow = attached ?? (reattachId ? { id: reattachId } : null);

      const studentFields: Record<string, unknown> = {
        name,
        email,
        ...(department !== undefined ? { department: department || "Computer Science" } : {}),
        ...(str(body.program) ? { program: str(body.program) } : {}),
        ...(parsedYear !== undefined ? { year: parsedYear } : {}),
        ...(parsedSemester !== undefined ? { semester: parsedSemester } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(status ? { status } : {}),
        ...(body.registerNumber !== undefined ? { register_number: str(body.registerNumber) } : {}),
      };

      if (studentRow) {
        // students.id is the primary key other tables reference, so it is
        // never rewritten here — register_number carries the editable value.
        const { error } = await supabaseAdmin
          .from("students")
          .update(studentFields)
          .eq("id", studentRow.id);
        roleError = error;
      } else {
        const newId = str(body.registerNumber) || `STU-${Date.now().toString().slice(-6)}`;
        const { error } = await supabaseAdmin.from("students").insert({
          id: newId,
          profile_id: userId,
          register_number: str(body.registerNumber),
          name,
          email,
          department: department || "Computer Science",
          program: str(body.program) || "B.Tech Computer Science",
          ...(parsedYear !== undefined ? { year: parsedYear } : {}),
          ...(parsedSemester !== undefined ? { semester: parsedSemester } : {}),
          phone: phone ?? null,
          status: status || "Active",
        });
        roleError = error;
      }
    } else if (nextRole === "FACULTY") {
      const { data: attachedFaculty } = await supabaseAdmin
        .from("faculty")
        .select("id")
        .eq("profile_id", userId)
        .maybeSingle();

      const reattachFacultyId = attachedFaculty
        ? null
        : await findDetachedRoleRow(supabaseAdmin, "faculty", email);
      if (reattachFacultyId) {
        await supabaseAdmin.from("faculty").update({ profile_id: userId }).eq("id", reattachFacultyId);
      }

      const facultyRow = attachedFaculty ?? (reattachFacultyId ? { id: reattachFacultyId } : null);

      const facultyFields: Record<string, unknown> = {
        name,
        email,
        ...(department !== undefined ? { department: department || "Computer Science" } : {}),
        ...(str(body.designation) ? { designation: str(body.designation) } : {}),
        ...(phone !== undefined ? { phone } : {}),
      };

      if (facultyRow) {
        const { error } = await supabaseAdmin
          .from("faculty")
          .update(facultyFields)
          .eq("id", facultyRow.id);
        roleError = error;
      } else {
        const { error } = await supabaseAdmin.from("faculty").insert({
          id: `FAC-${Date.now().toString().slice(-6)}`,
          profile_id: userId,
          name,
          email,
          department: department || "Computer Science",
          designation: str(body.designation) || "Assistant Professor",
          phone: phone ?? null,
        });
        roleError = error;
      }
    } else if (nextRole === "PARENT") {
      const { data: attachedParent } = await supabaseAdmin
        .from("parents")
        .select("id, child_id")
        .eq("profile_id", userId)
        .maybeSingle();

      let parentRow = attachedParent;

      if (!parentRow) {
        const reattachParentId = await findDetachedRoleRow(supabaseAdmin, "parents", email);
        if (reattachParentId) {
          await supabaseAdmin
            .from("parents")
            .update({ profile_id: userId })
            .eq("id", reattachParentId);
          const { data: reattached } = await supabaseAdmin
            .from("parents")
            .select("id, child_id")
            .eq("id", reattachParentId)
            .maybeSingle();
          parentRow = reattached;
        }
      }

      // linkedChild is non-null here — enforced above for every PARENT edit.
      const child = linkedChild!;

      // child_name is only overwritten when we actually resolved a name.
      const parentFields: Record<string, unknown> = {
        name,
        email,
        child_id: child.id,
        ...(child.name ? { child_name: child.name } : {}),
        ...(phone !== undefined ? { phone } : {}),
      };

      if (parentRow) {
        const { error } = await supabaseAdmin
          .from("parents")
          .update(parentFields)
          .eq("id", parentRow.id);
        roleError = error;

        // Release the previous student when the link moved.
        if (!error && parentRow.child_id && parentRow.child_id !== child.id) {
          await supabaseAdmin
            .from("students")
            .update({ parent_id: null })
            .eq("id", parentRow.child_id)
            .eq("parent_id", userId);
        }
      } else {
        const { error } = await supabaseAdmin.from("parents").insert({
          id: `PAR-${Date.now().toString().slice(-6)}`,
          profile_id: userId,
          name,
          email,
          phone: phone ?? null,
          child_id: child.id,
          child_name: child.name || null,
        });
        roleError = error;
      }

      if (!roleError) {
        const { error: linkError } = await supabaseAdmin
          .from("students")
          .update({ parent_id: userId })
          .eq("id", child.id);
        if (linkError) {
          console.warn("[EditUser] Parent saved but student back-link failed:", linkError.message);
        }
      }
    }

    if (roleError) {
      console.error("[EditUser] Role record update failed:", roleError);
      return NextResponse.json(
        {
          error: `The profile was saved, but the ${nextRole.toLowerCase()} record could not be updated: ${roleError.message}`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      userId,
      role: nextRole,
      roleChanged: nextRole !== currentRole,
      message: `${name} was updated.`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("[EditUser] Exception:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
