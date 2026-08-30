// ============================================================
// Smart Campus ERP — useCurrentUser Hook (Live Supabase Profile & Entities)
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
            // Demo account has mock data, everyone else is considered new by default (if no DB data exists).
            const isDemoAccount = activeEmail === "demo@demo.com" || activeEmail.includes("demo") || activeEmail.includes("vishal");
            
            setStudentData({
              id: studentRow?.id || user.id,
              profile_id: studentRow?.profile_id || user.id,
              register_number: studentRow?.register_number || meta.register_number || `REG2026CS${user.id.slice(0, 4).toUpperCase()}`,
              name: studentRow?.name || activeName,
              email: studentRow?.email || activeEmail,
              department: studentRow?.department || activeDept,
              program: studentRow?.program || meta.program || "B.Tech Computer Science",
              year: isDemoAccount ? Number(studentRow?.year || meta.year || 3) : 1, // Demo is year 3, new is year 1
              semester: isDemoAccount ? Number(studentRow?.semester || meta.semester || 5) : 1, // Demo is sem 5, new is sem 1
              phone: studentRow?.phone || meta.phone || "+1 (555) 019-2834",
              gpa: isDemoAccount ? (studentRow?.gpa ? String(studentRow.gpa) : "9.2") : "N/A", // Demo gets 9.2, new gets N/A
              status: studentRow?.status || "Active",
              attendancePct: isDemoAccount ? Number(studentRow?.attendance_pct || 92.5) : 0,
              attendance_pct: isDemoAccount ? Number(studentRow?.attendance_pct || 92.5) : 0,
              isNewStudent: !isDemoAccount, // If not demo, default to new student (empty states)
              isDayScholar: !isDemoAccount, // New students default to day scholar for now
              isDemoAccount: isDemoAccount,
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
            setParentData({
              id: parentRow?.id || user.id,
              profile_id: parentRow?.profile_id || user.id,
              name: parentRow?.name || activeName,
              email: parentRow?.email || activeEmail,
              phone: parentRow?.phone || meta.phone || "+1 (555) 234-5678",
              child_id: parentRow?.child_id || meta.childId || "STU-001",
              child_name: parentRow?.child_name || meta.childName || "Alex Johnson",
              childName: parentRow?.child_name || meta.childName || "Alex Johnson",
              childId: parentRow?.child_id || meta.childId || "STU-001",
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
              designation: facultyRow?.designation || meta.designation || "Professor",
              phone: facultyRow?.phone || meta.phone || "+1 (555) 876-5432",
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
