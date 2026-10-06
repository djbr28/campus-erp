// ============================================================
// Smart Campus ERP — useCurrentUser Hook (Live Supabase Profile & Entities)
//
// The `students` / `parents` / `faculty` row is the authoritative
// record. Values that exist in the database are NEVER overridden
// with defaults here — a student admitted into Year 2 / Semester 3
// must read back as Year 2 / Semester 3 everywhere in the app.
// ============================================================
"use client";

import { useState, useEffect } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { Student, Parent, Faculty } from "@/types";

export interface UserProfile {
  id: string;
  role: string;
  name: string;
  email: string;
  department?: string;
  avatar_url?: string;
}

export interface CurrentUserResult {
  profile: UserProfile | null;
  studentData: Student | null;
  parentData: Parent | null;
  facultyData: Faculty | null;
  initials: string;
  loading: boolean;
  error: string | null;
}

/** Coerces a Postgres numeric/int column to a number, preserving 0 and rejecting junk. */
function toNumberOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function useCurrentUser(): CurrentUserResult {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [parentData, setParentData] = useState<Parent | null>(null);
  const [facultyData, setFacultyData] = useState<Faculty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        const supabase = getSupabaseClient();

        // ── Step 1: Get authenticated user ──
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          if (!cancelled) {
            // Unauthenticated guest preview fallback
            setProfile(null);
            setLoading(false);
          }
          return;
        }

        const meta = user.user_metadata || {};
        const metaName = meta.name || user.email?.split("@")[0] || "User";
        const metaRole = (meta.role || "STUDENT").toUpperCase();

        // ── Step 2: Fetch profile from profiles table ──
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        const activeRole = (profileData?.role || metaRole).toUpperCase();
        const activeName = profileData?.name || metaName;
        const activeEmail = profileData?.email || user.email || "";
        const activeDept = profileData?.department || meta.department || "Computer Science";

        if (!cancelled) {
          setProfile({
            id: user.id,
            role: activeRole,
            name: activeName,
            email: activeEmail,
            department: activeDept,
            avatar_url: profileData?.avatar_url,
          });
        }

        // ── Step 3: Fetch authentic role-specific data ──
        if (activeRole === "STUDENT") {
          const { data: studentRow } = await supabase
            .from("students")
            .select("*")
            .or(`profile_id.eq.${user.id},id.eq.${user.id}`)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (!cancelled) {
            // "New student" means the registrar holds no `students` row for
            // this account yet — not that the email address looks unfamiliar.
            const hasRecord = Boolean(studentRow);

            // The seeded demo account keeps its illustrative sample data on
            // catalogue pages. Real accounts never fall back to sample rows.
            const isDemoAccount =
              activeEmail === "demo@demo.com" ||
              activeEmail.includes("demo") ||
              activeEmail.includes("vishal");

            setStudentData({
              id: studentRow?.id || user.id,
              profile_id: studentRow?.profile_id || user.id,
              register_number: studentRow?.register_number || null,
              name: studentRow?.name || activeName,
              email: studentRow?.email || activeEmail,
              department: studentRow?.department || activeDept,
              program: studentRow?.program || "Not assigned",
              // Authoritative: whatever the registrar stored, including 0.
              year: toNumberOrNull(studentRow?.year),
              semester: toNumberOrNull(studentRow?.semester),
              phone: studentRow?.phone || null,
              gpa: studentRow?.gpa != null ? String(studentRow.gpa) : "N/A",
              status: studentRow?.status || "Active",
              attendancePct: toNumberOrNull(studentRow?.attendance_pct) ?? 0,
              attendance_pct: toNumberOrNull(studentRow?.attendance_pct) ?? 0,
              isNewStudent: !hasRecord,
              isDayScholar: !hasRecord,
              isDemoAccount,
            });
          }
        } else if (activeRole === "PARENT") {
          const { data: parentRow } = await supabase
            .from("parents")
            .select("*")
            .or(`profile_id.eq.${user.id},id.eq.${user.id}`)
            .limit(1)
            .maybeSingle();

          if (!cancelled) {
            // No placeholder child. An unlinked parent is shown as unlinked
            // rather than being pointed at somebody else's student record.
            const linkedChildId = parentRow?.child_id || null;
            const linkedChildName = parentRow?.child_name || null;

            setParentData({
              id: parentRow?.id || user.id,
              profile_id: parentRow?.profile_id || user.id,
              name: parentRow?.name || activeName,
              email: parentRow?.email || activeEmail,
              phone: parentRow?.phone || null,
              child_id: linkedChildId,
              child_name: linkedChildName,
              childName: linkedChildName,
              childId: linkedChildId,
            });
          }
        } else if (activeRole === "FACULTY") {
          const { data: facultyRow } = await supabase
            .from("faculty")
            .select("*")
            .or(`profile_id.eq.${user.id},id.eq.${user.id}`)
            .limit(1)
            .maybeSingle();

          if (!cancelled) {
            setFacultyData({
              id: facultyRow?.id || user.id,
              profile_id: facultyRow?.profile_id || user.id,
              name: facultyRow?.name || activeName,
              email: facultyRow?.email || activeEmail,
              department: facultyRow?.department || activeDept,
              designation: facultyRow?.designation || meta.designation || "Faculty Member",
              phone: facultyRow?.phone || null,
            });
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load user data");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  const displayName =
    studentData?.name ||
    profile?.name ||
    facultyData?.name ||
    parentData?.name ||
    "User";

  const nameParts = displayName.trim().split(" ").filter(Boolean);
  const initials =
    nameParts.length >= 2
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
      : (displayName.slice(0, 2) || "U").toUpperCase();

  return {
    profile,
    studentData,
    parentData,
    facultyData,
    initials,
    loading,
    error,
  };
}
