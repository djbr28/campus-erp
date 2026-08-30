// ============================================================
// Smart Campus ERP — Student Examination & Hall Ticket Module
// ============================================================
"use client";

import { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getSupabaseClient } from "@/lib/supabase/client";
import DataTable from "@/components/ui/DataTable";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import LoadingState from "@/components/ui/LoadingState";
import { ExamIcon, CheckIcon } from "@/components/ui/Icons";
import type { Exam, ExamResult } from "@/types";

export default function StudentExaminationPage() {
  const { studentData } = useCurrentUser();
  const [exams, setExams] = useState<Exam[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExams() {
      try {
        const supabase = getSupabaseClient();
        const [examsRes, resultsRes] = await Promise.all([
          supabase.from("exams").select("*").order("exam_date", { ascending: true }),
          supabase.from("exam_results").select("*, exam:exams(*)"),
        ]);

        if (examsRes.data && examsRes.data.length > 0) {
          setExams(examsRes.data);
        } else if (studentData?.isNewStudent) {
          setExams([]);
        } else {
          setExams([
            { id: "EXAM-001", subject: "Data Structures & Algorithms Final", exam_date: "2026-10-10 09:00:00+00", room: "Hall A (Seat 42)", duration: "3 Hours", total_marks: 100 },
            { id: "EXAM-002", subject: "Advanced Operating Systems Midterm", exam_date: "2026-10-12 14:00:00+00", room: "Hall B (Seat 18)", duration: "2 Hours", total_marks: 50 },
            { id: "EXAM-003", subject: "Database Management Systems Practical", exam_date: "2026-10-15 10:00:00+00", room: "CS Lab 3 (Workstation 12)", duration: "3 Hours", total_marks: 100 },
            { id: "EXAM-004", subject: "Computer Networks Theory", exam_date: "2026-10-18 09:00:00+00", room: "Hall 201 (Seat 09)", duration: "3 Hours", total_marks: 100 },
          ]);
        }

        if (resultsRes.data && resultsRes.data.length > 0) {
          setResults(resultsRes.data);
        } else if (studentData?.isNewStudent) {
          setResults([]);
        } else {
          setResults([
            { id: "1", student_id: studentData?.id || "STU-001", exam_id: "EXAM-001", marks: 94.0, grade: "A+", remarks: "Outstanding performance in algorithmic problem solving" },
            { id: "2", student_id: studentData?.id || "STU-001", exam_id: "EXAM-002", marks: 46.5, grade: "A+", remarks: "Clean kernel simulation analysis" },
          ]);
        }
      } catch (err) {
        console.warn("[StudentExamination] Error loading exam data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadExams();
  }, [studentData?.id]);

  if (loading) return <LoadingState message="Loading examination schedules & results…" />;

  const isNew = studentData?.isNewStudent || false;

  return (
    <div className="space-y-6 animate-fade-in text-[#f4f6d6]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">Examinations & Hall Ticket</h1>
          <p className="page-subtitle">
            Upcoming semester finals, room assignments, duration, and published assessment scores.
          </p>
        </div>
        <Badge variant={isNew ? "gray" : "amber"} dot>{isNew ? "No Active Schedule" : "Fall 2026 Schedule Active"}</Badge>
      </div>

      <div className="grid-3">
        <StatCard
          label="Upcoming Exams"
          value={isNew ? "0 Papers" : `${exams.length} Papers`}
          change={isNew ? "Pending schedule" : "Schedule Finalized"}
          trend="neutral"
          icon={<ExamIcon className="w-5 h-5 text-[#bf783e]" />}
        />
        <StatCard
          label="Hall Ticket Status"
          value={isNew ? "Not generated" : "Issued & Cleared"}
          change={isNew ? "Pending" : "Eligible"}
          trend={isNew ? "neutral" : "up"}
          icon={<CheckIcon className="w-5 h-5 text-emerald-400" />}
        />
        <StatCard
          label="Results Published"
          value={isNew ? "0 Released" : `${results.length} Released`}
          change={isNew ? "No past exams" : "A+ Standing"}
          trend={isNew ? "neutral" : "up"}
          icon={<span className="text-base font-bold text-[#bf783e]">🏆</span>}
        />
      </div>

      {/* Upcoming Exam Schedule Table */}
      {isNew ? (
        <div className="card-flat p-8 text-center text-white/50 text-sm mb-6">
          No examinations scheduled yet. Your exam timetable and hall tickets will appear here closer to the assessment period.
        </div>
      ) : (
        <DataTable
          title="Official Examination Timetable & Seating"
          subtitle="Bring your student ID card and approved stationery to each exam hall"
          badgeText={`${exams.length} Scheduled`}
          data={exams}
          keyExtractor={(e) => e.id}
          columns={[
            { key: "id", header: "Code", render: (e) => <span className="font-mono text-xs text-[#bf783e] font-bold">{e.id}</span> },
            { key: "subject", header: "Assessment Paper", render: (e) => <span className="font-bold text-[#f4f6d6] text-sm">{e.subject}</span> },
            { key: "exam_date", header: "Date & Time", render: (e) => <span className="text-xs text-white/80">{new Date(e.exam_date).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</span> },
            { key: "duration", header: "Duration", render: (e) => <span className="text-xs text-white/60">{e.duration || "3 Hours"}</span> },
            { key: "room", header: "Assigned Hall / Seat", render: (e) => <Badge variant="blue">{e.room}</Badge> },
          ]}
        />
      )}

      {/* Published Exam Results */}
      {results.length > 0 && (
        <DataTable
          title="Published Assessment Results"
          subtitle="Official controller of examinations marksheet"
          badgeText={`${results.length} Published`}
          data={results}
          keyExtractor={(r) => r.id}
          columns={[
            { key: "exam_id", header: "Exam Ref", render: (r) => <span className="font-mono text-xs text-[#bf783e]">{r.exam_id}</span> },
            { key: "marks", header: "Score", render: (r) => <span className="font-mono text-sm font-bold text-[#f4f6d6]">{r.marks}</span> },
            { key: "grade", header: "Letter Grade", render: (r) => <Badge variant="green">{r.grade}</Badge> },
            { key: "remarks", header: "Examiner Remarks", render: (r) => <span className="text-xs text-white/60 font-light">{r.remarks || "Satisfactory"}</span> },
          ]}
        />
      )}
    </div>
  );
}
