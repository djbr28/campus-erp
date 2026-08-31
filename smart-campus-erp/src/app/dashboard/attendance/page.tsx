// ============================================================
// Smart Campus ERP — Faculty Attendance Page (Editorial Aesthetic)
// ============================================================
"use client";

import { useState } from "react";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import { AttendanceIcon, CheckIcon, ScheduleIcon } from "@/components/ui/Icons";
import Modal from "@/components/ui/Modal";

const generateStudents = (total: number, presentCount: number) => {
  const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
  
  const students = [];
  for (let i = 0; i < total; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[(i + 3) % lastNames.length];
    students.push({
      id: `STU${1000 + i}`,
      name: `${fn} ${ln}`,
      isPresent: i < presentCount
    });
  }
  return students;
};

const initialClasses = [
  { time: "08:00 AM", course: "CS-301: Data Structures", section: "A", present: 42, total: 45, pct: 93, students: generateStudents(45, 42) },
  { time: "09:30 AM", course: "CS-302: Algorithms", section: "B", present: 38, total: 40, pct: 95, students: generateStudents(40, 38) },
  { time: "11:00 AM", course: "EE-201: Circuits & Systems", section: "A", present: 30, total: 35, pct: 86, students: generateStudents(35, 30) },
  { time: "01:00 PM", course: "BA-401: Marketing Analytics", section: "C", present: 28, total: 30, pct: 93, students: generateStudents(30, 28) },
  { time: "02:30 PM", course: "CS-303: AI Fundamentals", section: "A", present: 0, total: 38, pct: 0, students: generateStudents(38, 0) },
];

export default function AttendancePage() {
  const [todayClasses, setTodayClasses] = useState(initialClasses);
  const [selectedClassIndex, setSelectedClassIndex] = useState<number | null>(null);
  const [editingStudents, setEditingStudents] = useState<any[]>([]);

  const handleOpenModal = (index: number) => {
    setSelectedClassIndex(index);
    setEditingStudents(JSON.parse(JSON.stringify(todayClasses[index].students)));
  };

  const handleToggleStudent = (studentId: string) => {
    setEditingStudents(prev => 
      prev.map(s => s.id === studentId ? { ...s, isPresent: !s.isPresent } : s)
    );
  };

  const handleSaveAttendance = () => {
    if (selectedClassIndex !== null) {
      const updatedClasses = [...todayClasses];
      const presentCount = editingStudents.filter(s => s.isPresent).length;
      const total = editingStudents.length;
      
      updatedClasses[selectedClassIndex].students = editingStudents;
      updatedClasses[selectedClassIndex].present = presentCount;
      updatedClasses[selectedClassIndex].pct = Math.round((presentCount / total) * 100);
      
      setTodayClasses(updatedClasses);
      setSelectedClassIndex(null);
      alert("Attendance successfully saved!");
    }
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalLectures = todayClasses.length;
  const markedClasses = todayClasses.filter(c => c.pct > 0);
  const totalPresent = markedClasses.reduce((sum, c) => sum + c.present, 0);
  const totalStudents = markedClasses.reduce((sum, c) => sum + c.total, 0);
  const cumulativeTurnout = totalStudents > 0 ? ((totalPresent / totalStudents) * 100).toFixed(1) : "0.0";
  
  const pendingClasses = todayClasses.filter(c => c.pct === 0);
  const pendingCount = pendingClasses.length;
  const nextPendingTime = pendingCount > 0 ? pendingClasses[0].time : "All Done";

  return (
    <div className="space-y-6 animate-fade-in text-[#f4f6d6]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">Faculty Class Attendance</h1>
          <p className="page-subtitle">{currentDate} · Daily course registers</p>
        </div>
        <Badge variant="blue" dot>{totalLectures} Scheduled Lecture{totalLectures !== 1 ? 's' : ''}</Badge>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid-3">
        <StatCard
          label="Total Scheduled Lectures"
          value={`${totalLectures} Lecture${totalLectures !== 1 ? 's' : ''}`}
          icon={<ScheduleIcon className="w-5 h-5 text-[#bf783e]" />}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />
        <StatCard
          label="Cumulative Turnout"
          value={`${cumulativeTurnout}%`}
          change={parseFloat(cumulativeTurnout) >= 85 ? "Good" : parseFloat(cumulativeTurnout) >= 70 ? "Average" : "Low"}
          trend={parseFloat(cumulativeTurnout) >= 85 ? "up" : parseFloat(cumulativeTurnout) >= 70 ? "neutral" : "down"}
          icon={<AttendanceIcon className="w-5 h-5 text-emerald-400" />}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />
        <StatCard
          label="Attendance Pending"
          value={`${pendingCount} Class${pendingCount !== 1 ? 'es' : ''}`}
          change={nextPendingTime}
          trend={pendingCount === 0 ? "up" : "neutral"}
          icon={<span className="text-base text-[#bf783e]">⏳</span>}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />
      </div>

      {/* Class Register List */}
      <div className="card-flat overflow-hidden bg-[#141414] border border-white/10">
        <div className="px-6 py-4 border-b border-white/10 bg-[#181818] flex items-center justify-between">
          <div>
            <h2 className="section-heading mb-0">Today&apos;s Lecture Registers</h2>
            <p className="text-xs text-white/50 mt-0.5 font-light">Click to verify or mark real-time classroom attendance</p>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {todayClasses.map((c, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-20 text-xs font-mono font-bold text-white/70 bg-white/5 py-1.5 px-2 rounded-xl text-center shrink-0 border border-white/10">
                  {c.time}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-[#f4f6d6] text-sm truncate">{c.course}</div>
                  <div className="text-xs text-white/40 mt-0.5 font-light">Section {c.section} · Room B-102</div>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0 justify-between sm:justify-end">
                <div className="hidden md:block w-32">
                  <div className="progress-track">
                    <div
                      className={`progress-fill ${
                        c.pct >= 90
                          ? "progress-fill-green"
                          : c.pct > 0
                          ? "progress-fill-amber"
                          : "progress-fill-red"
                      }`}
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`font-serif text-base font-normal ${
                      c.pct >= 90
                        ? "text-emerald-400"
                        : c.pct > 0
                        ? "text-amber-400"
                        : "text-white/40"
                    }`}
                  >
                    {c.pct > 0 ? `${c.pct}%` : "Pending"}
                  </div>
                  <div className="text-xs text-white/40 font-medium mt-0.5">
                    {c.present}/{c.total} Students
                  </div>
                </div>

                <button
                  onClick={() => handleOpenModal(i)}
                  className={`btn-sm shrink-0 font-bold ${
                    c.pct === 0
                      ? "btn-primary"
                      : "btn-secondary"
                  }`}
                >
                  {c.pct === 0 ? "Mark Attendance" : "View Register"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={selectedClassIndex !== null}
        onClose={() => setSelectedClassIndex(null)}
        title={selectedClassIndex !== null ? todayClasses[selectedClassIndex].course : ""}
        subtitle={selectedClassIndex !== null ? `${todayClasses[selectedClassIndex].time} · Section ${selectedClassIndex !== null ? todayClasses[selectedClassIndex].section : ""}` : ""}
        maxWidth="max-w-2xl"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setSelectedClassIndex(null)}>Cancel</button>
            <button className="btn-primary" onClick={handleSaveAttendance}>Save Attendance</button>
          </>
        }
      >
        {selectedClassIndex !== null && (
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <div className="text-sm text-white/60 mb-1">Present</div>
                <div className="text-2xl font-bold text-emerald-400">
                  {editingStudents.filter(s => s.isPresent).length} <span className="text-base text-white/40">/ {editingStudents.length}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setEditingStudents(prev => prev.map(s => ({ ...s, isPresent: true })))}
                  className="btn-secondary py-1.5 px-3 text-xs"
                >
                  Mark All Present
                </button>
                <button 
                  onClick={() => setEditingStudents(prev => prev.map(s => ({ ...s, isPresent: false })))}
                  className="btn-secondary py-1.5 px-3 text-xs"
                >
                  Mark All Absent
                </button>
              </div>
            </div>
            
            <div className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar space-y-2">
              {editingStudents.map(student => (
                <div 
                  key={student.id}
                  onClick={() => handleToggleStudent(student.id)}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${student.isPresent ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/60'}`}>
                      {student.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#f4f6d6]">{student.name}</div>
                      <div className="text-xs text-white/40 font-mono">{student.id}</div>
                    </div>
                  </div>
                  
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center border transition-colors ${student.isPresent ? 'bg-emerald-500 border-emerald-500 text-[#141414]' : 'border-white/20 text-transparent'}`}>
                    <CheckIcon className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
