// ============================================================
// Smart Campus ERP — Student Course Enrollment Module
// ============================================================
"use client";

import { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getSupabaseClient } from "@/lib/supabase/client";
import DataTable from "@/components/ui/DataTable";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import LoadingState from "@/components/ui/LoadingState";
import { BookOpenIcon, CheckIcon } from "@/components/ui/Icons";
import type { Course } from "@/types";

export default function StudentCoursesPage() {
  const { studentData } = useCurrentUser();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        if (studentData?.isDemoAccount) {
          const saved = localStorage.getItem("demo_registered_courses");
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              setCourses(parsed.map((r: any) => ({
                id: r.course.code,
                course_code: r.course.code,
                course_name: r.course.name,
                credits: r.course.credits,
                department: "Assigned",
                instructor: r.teacher.name,
                schedule: "TBD",
                location: "TBD",
              })));
            } catch (e) {
              setCourses([]);
            }
          } else {
            setCourses([]); // Initially empty until registered in FFCS
          }
          return;
        }

        const supabase = getSupabaseClient();
        const { data } = await supabase.from("courses").select("*").order("course_code");
        if (data && data.length > 0) {
          setCourses(data);
        } else if (studentData?.isNewStudent) {
          setCourses([]);
        } else {
          setCourses([
            { id: "CS-301", course_name: "Data Structures & Algorithms", course_code: "CS-301", credits: 4, department: "Computer Science", instructor: "Dr. Alan Turing", schedule: "Mon/Wed 10:00 AM - 11:30 AM", location: "Hall B, CS Wing" },
          ]);
        }
      } catch (err) {
        console.warn("[StudentCourses] Error loading courses:", err);
      } finally {
        setLoading(false);
      }
    }

    if (studentData) {
      loadCourses();
    }
  }, [studentData]);

  if (loading) return <LoadingState message="Loading registered courses…" />;

  const totalCredits = courses.reduce((s, c) => s + c.credits, 0);
  const isNew = studentData?.isNewStudent || false;

  return (
    <div className="space-y-6 animate-fade-in text-[#f4f6d6]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">Course Registration & Schedule</h1>
          <p className="page-subtitle">
            Active semester enrollments, lecture times, venues, and assigned professors.
          </p>
        </div>
        <Badge variant={isNew ? "gray" : "green"} dot>{isNew ? "Not Enrolled" : `Semester ${studentData?.semester || 5} Enrolled`}</Badge>
      </div>

      <div className="grid-3">
        <StatCard
          label="Registered Courses"
          value={isNew ? "0 Classes" : `${courses.length} Classes`}
          change={isNew ? "Pending registration" : "Full Load"}
          trend={isNew ? "neutral" : "up"}
          icon={<BookOpenIcon className="w-5 h-5 text-[#bf783e]" />}
        />
        <StatCard
          label="Semester Credit Units"
          value={isNew ? "0 Credits" : `${totalCredits} Credits`}
          change="19 Max Cap"
          trend="neutral"
          icon={<CheckIcon className="w-5 h-5 text-emerald-400" />}
        />
        <StatCard
          label="Weekly Contact Hours"
          value={isNew ? "0 Hours" : "24 Hours"}
          change={isNew ? "N/A" : "Lecture + Lab"}
          trend={isNew ? "neutral" : "up"}
          icon={<span className="text-base font-bold text-[#bf783e]">⏱️</span>}
        />
      </div>

      {isNew ? (
        <div className="card-flat p-8 text-center text-white/50 text-sm">
          You are not registered for any courses yet. Course registration will open soon.
        </div>
      ) : (
        <DataTable
          title="Enrolled Semester Course Catalog"
          subtitle="Current academic session course curriculum"
          badgeText={`${courses.length} Registered`}
          data={courses}
          keyExtractor={(c) => c.id}
          columns={[
            {
              key: "course_code",
              header: "Code",
              render: (c) => <span className="font-mono text-xs font-bold text-[#bf783e] bg-[#bf783e]/10 px-2.5 py-1 rounded-md border border-[#bf783e]/30">{c.course_code}</span>,
            },
            {
              key: "course_name",
              header: "Course Title",
              render: (c) => (
                <div>
                  <div className="font-bold text-[#f4f6d6] text-sm">{c.course_name}</div>
                  <div className="text-[11px] text-white/40 font-light">{c.department}</div>
                </div>
              ),
            },
            { key: "credits", header: "Credits", render: (c) => <span className="text-xs font-semibold text-white/70">{c.credits} Cr</span> },
            { key: "instructor", header: "Instructor", render: (c) => <span className="text-xs text-white/80 font-medium">{c.instructor}</span> },
            { key: "schedule", header: "Weekly Schedule", render: (c) => <span className="text-xs font-light text-white/60">{c.schedule}</span> },
            { key: "location", header: "Classroom / Lab", render: (c) => <Badge variant="gray">{c.location}</Badge> },
          ]}
        />
      )}
    </div>
  );
}
