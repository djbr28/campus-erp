// ============================================================
// Smart Campus ERP — Parent → Connected Student API
//
// GET /api/parent/child
//   → the academic, attendance and fee record of the ONE student
//     this parent is connected to.
//
// Two things make this safe:
//
//   1. The student id is never taken from the caller. It is read
//      from `parents.child_id` for the authenticated parent, so a
//      modified request cannot point at somebody else's child.
//   2. Every query runs through getSupabaseServer(), i.e. AS THE
//      SIGNED-IN PARENT, so Supabase RLS independently re-checks
//      each row. The service role is deliberately not used here.
// ============================================================

import { NextResponse } from "next/server";
import { getSupabaseServer, requireRole } from "@/lib/supabase/server";

export interface ParentChildPayload {
  linked: boolean;
  parent: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    childId: string | null;
    childName: string | null;
  } | null;
  student: Record<string, unknown> | null;
  attendance: Record<string, unknown>[];
  fees: Record<string, unknown>[];
  academics: Record<string, unknown>[];
  summary: {
    attendance: {
      hasRecords: boolean;
      totalClasses: number;
      present: number;
      absent: number;
      percentage: number | null;
      /** The registrar's stored students.attendance_pct, for reference. */
      recordedPct: number | null;
    };
    fees: {
      hasRecords: boolean;
      total: number;
      paid: number;
      outstanding: number;
      paidPct: number | null;
      overdueCount: number;
      pendingCount: number;
      nextDue: { label: string; dueDate: string | null; amount: number } | null;
    };
    academics: {
      hasRecords: boolean;
      courses: number;
      credits: number;
      averageMarks: number | null;
      latestSemester: number | null;
    };
  };
}

function num(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export async function GET() {
  const check = await requireRole(["PARENT"]);
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  try {
    const supabase = await getSupabaseServer();

    // ── 1. The connected student comes from the parent's OWN record ──
    const { data: parentRow, error: parentError } = await supabase
      .from("parents")
      .select("id, name, email, phone, child_id, child_name")
      .eq("profile_id", check.profile.id)
      .limit(1)
      .maybeSingle();

    if (parentError) {
      console.error("[Parent Child API] Parent lookup failed:", parentError);
      return NextResponse.json(
        { error: `Could not load your parent record: ${parentError.message}` },
        { status: 500 }
      );
    }

    const parent = parentRow
      ? {
          id: parentRow.id,
          name: parentRow.name,
          email: parentRow.email,
          phone: parentRow.phone ?? null,
          childId: parentRow.child_id ?? null,
          childName: parentRow.child_name ?? null,
        }
      : null;

    const emptySummary: ParentChildPayload["summary"] = {
      attendance: {
        hasRecords: false,
        totalClasses: 0,
        present: 0,
        absent: 0,
        percentage: null,
        recordedPct: null,
      },
      fees: {
        hasRecords: false,
        total: 0,
        paid: 0,
        outstanding: 0,
        paidPct: null,
        overdueCount: 0,
        pendingCount: 0,
        nextDue: null,
      },
      academics: {
        hasRecords: false,
        courses: 0,
        credits: 0,
        averageMarks: null,
        latestSemester: null,
      },
    };

    if (!parentRow?.child_id) {
      const payload: ParentChildPayload = {
        linked: false,
        parent,
        student: null,
        attendance: [],
        fees: [],
        academics: [],
        summary: emptySummary,
      };
      return NextResponse.json(payload);
    }

    const childId = parentRow.child_id;

    // ── 2. Every read is pinned to that one student id ──
    const [studentRes, attendanceRes, feesRes, academicsRes] = await Promise.all([
      supabase.from("students").select("*").eq("id", childId).limit(1).maybeSingle(),
      supabase
        .from("attendance_records")
        .select("*")
        .eq("student_id", childId)
        .order("date", { ascending: false }),
      supabase
        .from("fees")
        .select("*")
        .eq("student_id", childId)
        .order("due_date", { ascending: true }),
      supabase
        .from("academic_records")
        .select("*")
        .eq("student_id", childId)
        .order("semester", { ascending: false }),
    ]);

    const firstError =
      studentRes.error || attendanceRes.error || feesRes.error || academicsRes.error;
    if (firstError) {
      console.error("[Parent Child API] Child data read failed:", firstError);
      return NextResponse.json(
        { error: `Could not load your child's record: ${firstError.message}` },
        { status: 500 }
      );
    }

    const student = studentRes.data ?? null;
    const attendance = attendanceRes.data ?? [];
    const fees = feesRes.data ?? [];
    const academics = academicsRes.data ?? [];

    // ── 3. Summaries, derived only from rows that actually exist ──
    const totalClasses = attendance.reduce((s, a) => s + num(a.total), 0);
    const present = attendance.reduce((s, a) => s + num(a.present), 0);
    const absent = attendance.reduce((s, a) => s + num(a.absent), 0);

    const feeTotal = fees.reduce((s, f) => s + num(f.total_amount), 0);
    const feePaid = fees.reduce((s, f) => s + num(f.paid_amount), 0);
    const outstanding = Math.max(feeTotal - feePaid, 0);
    const unpaid = fees.filter((f) => f.status !== "Paid");
    const nextDueRow = unpaid[0] ?? null;

    const credits = academics.reduce((s, r) => s + num(r.credits), 0);
    const averageMarks =
      academics.length > 0
        ? Number((academics.reduce((s, r) => s + num(r.marks), 0) / academics.length).toFixed(1))
        : null;

    const payload: ParentChildPayload = {
      linked: true,
      parent,
      student,
      attendance,
      fees,
      academics,
      summary: {
        attendance: {
          hasRecords: attendance.length > 0,
          totalClasses,
          present,
          absent,
          percentage: totalClasses > 0 ? Math.round((present / totalClasses) * 100) : null,
          recordedPct:
            student && student.attendance_pct != null ? Number(student.attendance_pct) : null,
        },
        fees: {
          hasRecords: fees.length > 0,
          total: feeTotal,
          paid: feePaid,
          outstanding,
          paidPct: feeTotal > 0 ? Math.round((feePaid / feeTotal) * 100) : null,
          overdueCount: fees.filter((f) => f.status === "Overdue").length,
          pendingCount: fees.filter((f) => f.status === "Pending").length,
          nextDue: nextDueRow
            ? {
                label: String(nextDueRow.label ?? "Fee"),
                dueDate: nextDueRow.due_date ? String(nextDueRow.due_date) : null,
                amount: num(nextDueRow.total_amount) - num(nextDueRow.paid_amount),
              }
            : null,
        },
        academics: {
          hasRecords: academics.length > 0,
          courses: academics.length,
          credits,
          averageMarks,
          latestSemester: academics.length > 0 ? num(academics[0].semester) : null,
        },
      },
    };

    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("[Parent Child API] Exception:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
