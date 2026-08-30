// ============================================================
// Smart Campus ERP — FFCS (Fully Flexible Credit System)
// ============================================================
"use client";

import { useState, useEffect } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { CheckIcon, CalendarEventIcon } from "@/components/ui/Icons";

interface Faculty {
  id: string;
  name: string;
  email: string;
}

interface CourseSlot {
  code: string;
  name: string;
  credits: number;
}

const MOCK_COURSES: CourseSlot[] = [
  { code: "CS-301", name: "Data Structures", credits: 4 },
  { code: "CS-302", name: "Algorithms Analysis", credits: 4 },
  { code: "CS-303", name: "AI Fundamentals", credits: 3 },
  { code: "EE-201", name: "Circuits & Logic", credits: 3 },
  { code: "BA-401", name: "Marketing Tech", credits: 3 },
];

const MOCK_DEMO_FACULTY: Faculty[] = [
  { id: "fac_1", name: "Dr. Sarah Mitchell", email: "sarah.mitchell@campus.edu" },
  { id: "fac_2", name: "Prof. Alan Turing", email: "alan.turing@campus.edu" },
  { id: "fac_3", name: "Dr. Grace Hopper", email: "grace.hopper@campus.edu" },
];

export default function FFCSPage() {
  const { studentData, loading: userLoading } = useCurrentUser();
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [registered, setRegistered] = useState<any[]>([]);

  useEffect(() => {
    async function loadFaculty() {
      try {
        if (studentData?.isDemoAccount) {
          setFaculty(MOCK_DEMO_FACULTY);
          // Also load existing registered courses from local storage
          const saved = localStorage.getItem("demo_registered_courses");
          if (saved) {
            try {
              setRegistered(JSON.parse(saved));
            } catch (e) {
              console.error(e);
            }
          }
          return;
        }
        
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from("profiles")
          .select("id, name, email")
          .eq("role", "FACULTY");

        if (data && !error) {
          setFaculty(data as Faculty[]);
        }
      } catch (err) {
        console.error("Failed to load faculty:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFaculty();
  }, [studentData?.isDemoAccount]);

  const handleRegister = () => {
    if (!selectedCourse || !selectedFaculty) return;
    const course = MOCK_COURSES.find((c) => c.code === selectedCourse);
    const teacher = faculty.find((f) => f.id === selectedFaculty);
    
    if (course && teacher) {
      const updated = [...registered, { course, teacher }];
      setRegistered(updated);
      setSelectedCourse(null);
      setSelectedFaculty(null);
      
      if (studentData?.isDemoAccount) {
        localStorage.setItem("demo_registered_courses", JSON.stringify(updated));
      }
    }
  };

  const availableCourses = MOCK_COURSES.filter(
    (c) => !registered.some((r) => r.course.code === c.code)
  );

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-white/20 border-t-[#bf783e] rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-white/50">Loading FFCS portal…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-[#f4f6d6]">
      {/* Header */}
      <div>
        <h1 className="page-title">Fully Flexible Credit System (FFCS)</h1>
        <p className="page-subtitle">Select your preferred courses and faculty members for the upcoming semester.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Registration Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="card-flat p-6 bg-[#141414] border border-white/10 space-y-6">
            <h2 className="section-heading mb-4">Course Selection</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
                  Select Subject
                </label>
                <select
                  value={selectedCourse || ""}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="input w-full bg-[#181818]"
                >
                  <option value="">-- Choose a course --</option>
                  {availableCourses.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code}: {c.name} ({c.credits} Credits)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
                  Select Preferred Faculty
                </label>
                <select
                  value={selectedFaculty || ""}
                  onChange={(e) => setSelectedFaculty(e.target.value)}
                  disabled={!selectedCourse}
                  className="input w-full bg-[#181818]"
                >
                  <option value="">-- Choose a faculty member --</option>
                  {faculty.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
                {faculty.length === 0 && (
                  <p className="text-xs text-rose-400 mt-2 font-medium">
                    No registered faculty found in the database. 
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={handleRegister}
                  disabled={!selectedCourse || !selectedFaculty}
                  className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckIcon className="w-4 h-4 mr-2" />
                  Confirm Registration
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Registered Courses Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card-flat p-6 bg-[#181818] border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-heading mb-0">My Registration</h2>
              <Badge variant="blue">{registered.reduce((acc, curr) => acc + curr.course.credits, 0)} Credits</Badge>
            </div>

            {registered.length === 0 ? (
              <EmptyState
                icon={<CalendarEventIcon className="w-6 h-6 text-white/30" />}
                title="No courses registered"
                description="Your selected courses will appear here."
              />
            ) : (
              <div className="space-y-3">
                {registered.map((r, i) => (
                  <div key={i} className="p-4 rounded-xl border border-emerald-900/50 bg-emerald-950/20 text-emerald-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                      <CheckIcon className="w-12 h-12" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-sm text-[#f4f6d6]">{r.course.name}</span>
                        <span className="text-xs font-mono font-semibold opacity-80">{r.course.code}</span>
                      </div>
                      <div className="text-xs opacity-70 font-light mb-2">{r.course.credits} Credits</div>
                      <div className="inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-full bg-white/10 font-medium">
                        <span>👨‍🏫</span>
                        <span>{r.teacher.name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
