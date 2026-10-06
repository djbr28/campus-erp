// ============================================================
// Smart Campus ERP — useParentChild Hook
//
// Single source for every Parent page. It calls /api/parent/child,
// which resolves the connected student server-side from the signed-in
// parent's own `parents` row. The browser never names a student id,
// so there is nothing here for a parent to tamper with.
// ============================================================
"use client";

import { useCallback, useEffect, useState } from "react";

export interface ParentChildSummary {
  attendance: {
    hasRecords: boolean;
    totalClasses: number;
    present: number;
    absent: number;
    percentage: number | null;
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
}

export interface ParentChildStudent {
  id: string;
  name: string;
  email: string;
  register_number: string | null;
  department: string | null;
  program: string | null;
  year: number | null;
  semester: number | null;
  phone: string | null;
  gpa: string | null;
  status: string | null;
  attendance_pct: number | null;
}

export interface ParentAttendanceRow {
  id: string;
  subject: string;
  code: string;
  date: string | null;
  status: string | null;
  total: number;
  present: number;
  absent: number;
  percentage: number | null;
}

export interface ParentFeeRow {
  id: string;
  label: string;
  total_amount: number;
  paid_amount: number;
  status: string;
  due_date: string | null;
  payment_date: string | null;
}

export interface ParentAcademicRow {
  id: string;
  semester: number;
  subject: string;
  marks: number;
  grade: string;
  cgpa: number;
  credits: number | null;
}

export interface UseParentChildResult {
  linked: boolean;
  childName: string | null;
  student: ParentChildStudent | null;
  attendance: ParentAttendanceRow[];
  fees: ParentFeeRow[];
  academics: ParentAcademicRow[];
  summary: ParentChildSummary | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

function toNum(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function toNumOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function useParentChild(): UseParentChildResult {
  const [linked, setLinked] = useState(false);
  const [childName, setChildName] = useState<string | null>(null);
  const [student, setStudent] = useState<ParentChildStudent | null>(null);
  const [attendance, setAttendance] = useState<ParentAttendanceRow[]>([]);
  const [fees, setFees] = useState<ParentFeeRow[]>([]);
  const [academics, setAcademics] = useState<ParentAcademicRow[]>([]);
  const [summary, setSummary] = useState<ParentChildSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/parent/child");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Could not load your child's record.");
        }

        if (cancelled) return;

        setLinked(Boolean(data.linked));
        setChildName(data.parent?.childName ?? data.student?.name ?? null);

        const s = data.student;
        setStudent(
          s
            ? {
                id: String(s.id),
                name: String(s.name ?? ""),
                email: String(s.email ?? ""),
                register_number: s.register_number ?? null,
                department: s.department ?? null,
                program: s.program ?? null,
                year: toNumOrNull(s.year),
                semester: toNumOrNull(s.semester),
                phone: s.phone ?? null,
                gpa: s.gpa != null ? String(s.gpa) : null,
                status: s.status ?? null,
                attendance_pct: toNumOrNull(s.attendance_pct),
              }
            : null
        );

        setAttendance(
          (data.attendance ?? []).map((a: Record<string, unknown>) => ({
            id: String(a.id),
            subject: String(a.subject ?? ""),
            code: String(a.code ?? ""),
            date: a.date ? String(a.date) : null,
            status: a.status ? String(a.status) : null,
            total: toNum(a.total),
            present: toNum(a.present),
            absent: toNum(a.absent),
            percentage: toNumOrNull(a.percentage),
          }))
        );

        setFees(
          (data.fees ?? []).map((f: Record<string, unknown>) => ({
            id: String(f.id),
            label: String(f.label ?? ""),
            total_amount: toNum(f.total_amount),
            paid_amount: toNum(f.paid_amount),
            status: String(f.status ?? "Pending"),
            due_date: f.due_date ? String(f.due_date) : null,
            payment_date: f.payment_date ? String(f.payment_date) : null,
          }))
        );

        setAcademics(
          (data.academics ?? []).map((r: Record<string, unknown>) => ({
            id: String(r.id),
            semester: toNum(r.semester),
            subject: String(r.subject ?? ""),
            marks: toNum(r.marks),
            grade: String(r.grade ?? ""),
            cgpa: toNum(r.cgpa),
            credits: toNumOrNull(r.credits),
          }))
        );

        setSummary(data.summary ?? null);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load your child's record.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [nonce]);

  return {
    linked,
    childName,
    student,
    attendance,
    fees,
    academics,
    summary,
    loading,
    error,
    reload,
  };
}
