// ============================================================
// Smart Campus ERP — Student Profile / My Info
// ============================================================
"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import ProfileCard from "@/components/ui/ProfileCard";
import DashboardCard from "@/components/ui/DashboardCard";
import Badge from "@/components/ui/Badge";
import LoadingState from "@/components/ui/LoadingState";

export default function StudentInfoPage() {
  const { studentData, initials, loading } = useCurrentUser();

  if (loading) return <LoadingState message="Loading student information…" />;

  return (
    <div className="space-y-6 animate-fade-in text-[#f4f6d6]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">Student Information & Profile</h1>
          <p className="page-subtitle">
            Official university registration record, primary degree tracking, and contact details.
          </p>
        </div>
        <Badge variant="green" dot>Active University Enrollment</Badge>
      </div>

      {/* Main Profile Header */}
      <ProfileCard
        name={studentData?.name || "Student"}
        role="Student"
        email={studentData?.email || ""}
        idNumber={studentData?.register_number || studentData?.id || "REG2026CS001"}
        department={studentData?.department || "Computer Science"}
        program={studentData?.program || "B.Tech Computer Science"}
        year={studentData?.year || 1}
        semester={studentData?.semester || 1}
        phone={studentData?.phone || "+1 (555) 019-2834"}
        status={studentData?.status || "Active"}
        initials={initials}
      />

      {/* 2-Column Details Grid */}
      <div className="grid-2">
        {/* Academic Program Information */}
        <DashboardCard title="Academic Matriculation" subtitle="Registered program degree & timeline">
          <div className="space-y-4 text-xs">
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/50">Registration Number</span>
              <span className="font-mono text-[#f4f6d6] font-semibold">{studentData?.register_number || studentData?.id}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/50">Degree Program</span>
              <span className="text-[#f4f6d6] font-medium">{studentData?.program || "B.Tech Computer Science"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/50">Department / Faculty</span>
              <span className="text-[#f4f6d6] font-medium">{studentData?.department || "Computer Science"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/50">Current Academic Year</span>
              <span className="text-[#bf783e] font-bold">Year {studentData?.year || 1} (Semester {studentData?.semester || 1})</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-white/50">Cumulative GPA (CGPA)</span>
              <span className="font-serif text-base text-[#f4f6d6] font-normal">{studentData?.gpa || "3.85"} / 4.00</span>
            </div>
          </div>
        </DashboardCard>

        {/* Contact & Guardian Information */}
        <DashboardCard title="Contact & Guardian Record" subtitle="Emergency contacts and registered parent">
          <div className="space-y-4 text-xs">
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/50">Campus Email</span>
              <span className="text-[#f4f6d6] font-medium">{studentData?.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/50">Direct Phone</span>
              <span className="text-[#f4f6d6] font-medium">{studentData?.phone || "Not provided"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/50">Primary Guardian / Parent</span>
              <span className="text-[#f4f6d6] font-medium">Registered Guardian</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/50">Enrollment Status</span>
              <span className="text-emerald-400 font-medium">Verified Active Student</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-white/50">Campus Safety Clearance</span>
              <Badge variant="green" dot>Verified & Cleared</Badge>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
