// ============================================================
// Smart Campus ERP — Student Academics Module
// ============================================================
"use client";

import { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getSupabaseClient } from "@/lib/supabase/client";
import StatCard from "@/components/ui/StatCard";
import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import LoadingState from "@/components/ui/LoadingState";
import { AcademicCapIcon, CheckIcon } from "@/components/ui/Icons";
import type { AcademicRecord } from "@/types";

export default function StudentAcademicsPage() {
  const { studentData } = useCurrentUser();
  const [records, setRecords] = useState<AcademicRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAcademics() {
      if (!studentData?.id) return;
      try {
        const supabase = getSupabaseClient();
        const { data } = await supabase
          .from("academic_records")
          .select("*")
          .order("semester", { ascending: false });

        if (data && data.length > 0) {
          setRecords(data);
        } else {
          // Fallback sample data
          setRecords([
            { id: "1", student_id: studentData.id, semester: 4, subject: "Database Management Systems", marks: 92.5, grade: "A+", cgpa: 3.90, credits: 4 },
            { id: "2", student_id: studentData.id, semester: 4, subject: "Operating Systems Architecture", marks: 88.0, grade: "A", cgpa: 3.80, credits: 4 },
            { id: "3", student_id: studentData.id, semester: 4, subject: "Design and Analysis of Algorithms", marks: 94.0, grade: "A+", cgpa: 4.00, credits: 4 },
            { id: "4", student_id: studentData.id, semester: 4, subject: "Probability & Stochastic Processes", marks: 85.0, grade: "A-", cgpa: 3.70, credits: 3 },
            { id: "5", student_id: studentData.id, semester: 3, subject: "Object-Oriented Programming", marks: 96.0, grade: "A+", cgpa: 4.00, credits: 4 },
            { id: "6", student_id: studentData.id, semester: 3, subject: "Digital Logic & Microprocessors", marks: 89.0, grade: "A", cgpa: 3.85, credits: 4 },
          ]);
        }
      } catch (err) {
        console.warn("[StudentAcademics] Error loading records:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAcademics();
  }, [studentData?.id]);

  if (loading) return <LoadingState message="Loading academic transcripts…" />;

  const totalCredits = records.reduce((s, r) => s + (r.credits || 4), 0);
  const avgMarks = records.length > 0 ? (records.reduce((s, r) => s + Number(r.marks), 0) / records.length).toFixed(1) : "0";

  return (
    <div className="space-y-6 animate-fade-in text-[#f4f6d6]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">Academic Records & Grades</h1>
          <p className="page-subtitle">
            Semester transcripts, cumulative GPA performance, credits completed, and graded assessments.
          </p>
        </div>
        <Badge variant="blue">Cumulative GPA: {studentData?.gpa || "3.85"} / 4.00</Badge>
      </div>

      {/* KPI Stats */}
      <div className="grid-3">
        <StatCard
          label="Cumulative Grade Point Average"
          value={`${studentData?.gpa || "3.85"}`}
          change="Top 5% Cohort"
          trend="up"
          icon={<AcademicCapIcon className="w-5 h-5 text-[#bf783e]" />}
        />
        <StatCard
          label="Total Credits Earned"
          value={`${totalCredits} Units`}
          change="On Track"
          trend="up"
          icon={<CheckIcon className="w-5 h-5 text-emerald-400" />}
        />
        <StatCard
          label="Average Course Score"
          value={`${avgMarks}%`}
          change="Distinction"
          trend="up"
          icon={<span className="text-base font-bold text-[#bf783e]">🎯</span>}
        />
      </div>

      {/* Transcripts Table */}
      <DataTable
        title="Official Transcript & Grade Sheet"
        subtitle="Historical subject performance by semester"
        badgeText={`${records.length} Courses Recorded`}
        data={records}
        keyExtractor={(r) => r.id}
        columns={[
          { key: "semester", header: "Semester", render: (r) => <span className="font-semibold text-white/70">Sem {r.semester}</span> },
          { key: "subject", header: "Course / Subject", render: (r) => <span className="font-bold text-[#f4f6d6] text-sm">{r.subject}</span> },
          { key: "credits", header: "Credits", render: (r) => <span className="text-xs text-white/50">{r.credits || 4} Cr</span> },
          { key: "marks", header: "Marks Scored", render: (r) => <span className="font-mono text-sm text-[#f4f6d6] font-semibold">{r.marks}%</span> },
          {
            key: "grade",
            header: "Grade",
            render: (r) => (
              <Badge variant={r.grade.startsWith("A") ? "green" : r.grade.startsWith("B") ? "blue" : "amber"}>
                {r.grade}
              </Badge>
            ),
          },
          { key: "cgpa", header: "Term CGPA", render: (r) => <span className="font-serif text-sm text-[#bf783e] font-semibold">{Number(r.cgpa).toFixed(2)}</span> },
        ]}
      />
    </div>
  );
}
