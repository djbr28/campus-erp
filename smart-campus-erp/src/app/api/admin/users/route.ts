// ============================================================
// Smart Campus ERP — Admin User Management API
//
// GET  /api/admin/users?role=ALL|STUDENT|FACULTY|PARENT|SECURITY|ADMIN
//      → the real user directory, read with the service role so
//        Admin sees every account regardless of RLS.
//
// POST /api/admin/users
//      → Supabase Auth user + profiles row + role-specific row.
//
// Both handlers verify the CALLER is an authenticated ADMIN before
// touching the service-role client. Passwords are only ever handed
// to Supabase Auth — never stored in an application table.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/supabase/server";

// Mirrors the CHECK constraint on public.profiles.role.
const VALID_ROLES = ["STUDENT", "PARENT", "FACULTY", "ADMIN", "SECURITY"] as const;
type Role = (typeof VALID_ROLES)[number];

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

    const studentByProfile = new Map<string, any>();
    for (const s of students) if (s.profile_id) studentByProfile.set(s.profile_id, s);

    const facultyByProfile = new Map<string, any>();
    for (const f of faculty) if (f.profile_id) facultyByProfile.set(f.profile_id, f);

    const parentByProfile = new Map<string, any>();
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

    const filtered =
      requested === "ALL" ? users : users.filter((u) => u.role === requested);

    return NextResponse.json({ users: filtered, total: users.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("[Admin Users API] GET exception:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // ── 1 & 2. Requester must be an authenticated ADMIN ──
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

    // ── 4. Create the Auth user (Supabase Auth owns the password) ──
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

    /** Roll the Auth user back so a half-created account never lingers. */
    const rollback = async (reason: string, detail: string) => {
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

    // ── 7. profiles row (id is FK → auth.users, cascades on delete) ──
    const { error: profileError } = await supabaseAdmin.from("profiles").upsert(
      {
        id: userId,
        name,
        email,
        role: normalizedRole,
        department: details.department || null,
      },
      { onConflict: "id" }
    );

    if (profileError) {
      console.error("[CreateUser] Profile Insert Error:", profileError);
      return rollback("Failed to create the user profile", profileError.message);
    }

    // ── 8 & 9. Role-specific row. ADMIN and SECURITY have no side table
    //           in this schema — profiles is their record of truth. ──
    let roleInsertError: { message: string } | null = null;

    if (normalizedRole === "STUDENT") {
      const studentId = details.registerNumber || `STU-${Date.now().toString().slice(-6)}`;
      const { error } = await supabaseAdmin.from("students").insert({
        id: studentId,
        profile_id: userId,
        register_number: details.registerNumber || null,
        name,
        email,
        department: details.department || "Computer Science",
        program: details.program || "B.Tech Computer Science",
        year: parseInt(details.year) || 1,
        semester: parseInt(details.semester) || 1,
        phone: details.phone || null,
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
        department: details.department || "Computer Science",
        designation: details.designation || "Assistant Professor",
        phone: details.phone || null,
      });
      roleInsertError = error;
    } else if (normalizedRole === "PARENT") {
      const parentId = `PAR-${Date.now().toString().slice(-6)}`;
      const { error } = await supabaseAdmin.from("parents").insert({
        id: parentId,
        profile_id: userId,
        name,
        email,
        phone: details.phone || null,
        child_id: details.childId || null,
      });
      roleInsertError = error;

      // Link the student back to this parent profile when a child was given.
      if (!error && details.childId) {
        const { error: linkError } = await supabaseAdmin
          .from("students")
          .update({ parent_id: userId })
          .eq("id", details.childId);
        if (linkError) {
          console.warn("[CreateUser] Parent created but child link failed:", linkError.message);
        }
      }
    }

    // ── 10. Safe failure handling ──
    if (roleInsertError) {
      console.error("[CreateUser] Role Table Insert Error:", roleInsertError);
      return rollback(
        `Failed to create the ${normalizedRole.toLowerCase()} record`,
        roleInsertError.message
      );
    }

    // ── 11. Accurate success response ──
    return NextResponse.json({
      success: true,
      userId,
      role: normalizedRole,
      message: `${name} was created in Supabase Auth and can now sign in.`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("[CreateUser] Exception:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
