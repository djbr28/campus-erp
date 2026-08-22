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
        const supabase = getSupabaseClient();
        const { data } = await supabase.from("courses").select("*").order("course_code");
        if (data && data.length > 0) {
          setCourses(data);
        } else {
          setCourses([
            { id: "CS-301", course_name: "Data Structures & Algorithms", course_code: "CS-301", credits: 4, department: "Computer Science", instructor: "Dr. Alan Turing", schedule: "Mon/Wed 10:00 AM - 11:30 AM", location: "Hall B, CS Wing" },
            { id: "CS-302", course_name: "Advanced Operating Systems", course_code: "CS-302", credits: 4, department: "Computer Science", instructor: "Prof. Grace Hopper", schedule: "Tue/Thu 09:00 AM - 10:30 AM", location: "Hall 402, Science Block" },
            { id: "CS-304", course_name: "Database Management Systems", course_code: "CS-304", credits: 4, department: "Computer Science", instructor: "Dr. Edgar Codd", schedule: "Mon/Wed 02:00 PM - 03:30 PM", location: "Lab 3, CS Wing" },
            { id: "CS-305", course_name: "Computer Networks & Security", course_code: "CS-305", credits: 4, department: "Computer Science", instructor: "Prof. Vint Cerf", schedule: "Tue/Thu 01:00 PM - 02:30 PM", location: "Hall 105, Main Block" },
            { id: "MA-301", course_name: "Discrete Mathematics & Logic", course_code: "MA-301", credits: 3, department: "Mathematics", instructor: "Dr. John von Neumann", schedule: "Friday 09:00 AM - 12:00 PM", location: "Auditorium 2" },
          ]);
        }
      } catch (err) {
        console.warn("[StudentCourses] Error loading courses:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  if (loading) return <LoadingState message="Loading registered courses…" />;

  const totalCredits = courses.reduce((s, c) => s + c.credits, 0);

  return (
    <div className="space-y-6 animate-fade-in text-[#f4f6d6]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">Course Registration & Schedule</h1>
          <p className="page-subtitle">
            Active semester enrollments, lecture times, venues, and assigned professors.
          </p>
        </div>
        <Badge variant="green" dot>Semester {studentData?.semester || 5} Enrolled</Badge>
      </div>

      <div className="grid-3">
        <StatCard
          label="Registered Courses"
          value={`${courses.length} Classes`}
          change="Full Load"
          trend="up"
          icon={<BookOpenIcon className="w-5 h-5 text-[#bf783e]" />}
        />
        <StatCard
          label="Semester Credit Units"
          value={`${totalCredits} Credits`}
          change="19 Max Cap"
          trend="neutral"
          icon={<CheckIcon className="w-5 h-5 text-emerald-400" />}
        />
        <StatCard
          label="Weekly Contact Hours"
          value="24 Hours"
          change="Lecture + Lab"
          trend="up"
          icon={<span className="text-base font-bold text-[#bf783e]">⏱️</span>}
        />
      </div>

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
    </div>
  );
}
