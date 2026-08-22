// ============================================================
// Smart Campus ERP — useCurrentUser Hook
//
// Fetches the authenticated user's profile and role-specific
// data from Supabase. Replaces all mock user data across
// dashboards.
// ============================================================
"use client";

import { useState, useEffect } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

export interface UserProfile {
  id: string;
  role: string;
  name: string;
  email: string;
}

export interface StudentData {
  id: string;
  name: string;
  email: string;
  program: string;
  year: number;
  gpa: string;
  status: "Active" | "On Leave" | "Graduated";
  attendancePct: number;
}

export interface ParentData {
  id: string;
  name: string;
  email: string;
  childName: string;
  childId: string;
}

export interface FacultyData {
  id: string;
  name: string;
  email: string;
  department: string;
}

export interface CurrentUserResult {
  profile: UserProfile | null;
  studentData: StudentData | null;
  parentData: ParentData | null;
  facultyData: FacultyData | null;
  initials: string;
  loading: boolean;
  error: string | null;
}

export function useCurrentUser(): CurrentUserResult {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [parentData, setParentData] = useState<ParentData | null>(null);
  const [facultyData, setFacultyData] = useState<FacultyData | null>(null);
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
            setError("Not authenticated");
            setLoading(false);
          }
          return;
        }

        // ── Step 2: Fetch profile ──
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError || !profileData) {
          if (!cancelled) {
            setError("Profile not found");
            setLoading(false);
          }
          return;
        }

        if (!cancelled) {
          setProfile({
            id: profileData.id,
            role: profileData.role,
            name: profileData.name || user.email || "User",
            email: profileData.email || user.email || "",
          });
        }

        // ── Step 3: Fetch role-specific data ──
        const role = profileData.role?.toUpperCase();

        if (role === "STUDENT") {
          const { data: studentRow } = await supabase
            .from("students")
            .select("*")
            .eq("id", user.id)
            .single();

          if (!cancelled && studentRow) {
            setStudentData({
              id: studentRow.id,
              name: studentRow.name || profileData.name || "Student",
              email: studentRow.email || user.email || "",
              program: studentRow.program || "Undeclared",
              year: studentRow.year || 1,
              gpa: studentRow.gpa || "0.0",
              status: studentRow.status || "Active",
              attendancePct: studentRow.attendancePct || 0,
            });
          }
        } else if (role === "PARENT") {
          const { data: parentRow } = await supabase
            .from("parents")
            .select("*")
            .eq("id", user.id)
            .single();

          if (!cancelled && parentRow) {
            setParentData({
              id: parentRow.id,
              name: parentRow.name || profileData.name || "Parent",
              email: parentRow.email || user.email || "",
              childName: parentRow.childName || "",
              childId: parentRow.childId || "",
            });
          }
        } else if (role === "FACULTY") {
          const { data: facultyRow } = await supabase
            .from("faculty")
            .select("*")
            .eq("id", user.id)
            .single();

          if (!cancelled && facultyRow) {
            setFacultyData({
              id: facultyRow.id,
              name: facultyRow.name || profileData.name || "Faculty",
              email: facultyRow.email || user.email || "",
              department: facultyRow.department || "General",
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

  const name = profile?.name || studentData?.name || parentData?.name || facultyData?.name || "User";
  const nameParts = name.split(" ").filter(Boolean);
  const initials = nameParts.length >= 2
    ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();

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
