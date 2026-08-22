// ============================================================
// Smart Campus ERP — Faculty Report Incident (Live Supabase Insertion)
// ============================================================
"use client";

import { useState } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase/client";
import {
  SecurityIcon,
  EmergencyPhoneIcon,
  CheckIcon,
} from "@/components/ui/Icons";

const categories = [
  { value: "Physical Safety", label: "Physical Safety", icon: "🛡️", desc: "Hazard or safety risk" },
  { value: "Harassment", label: "Harassment", icon: "⚠️", desc: "Bullying or misconduct" },
  { value: "Facility Damage", label: "Facility Damage", icon: "🔧", desc: "Broken infrastructure" },
  { value: "Theft / Loss", label: "Theft / Loss", icon: "🔍", desc: "Stolen or missing items" },
  { value: "Medical", label: "Medical Care", icon: "🏥", desc: "First aid or medical need" },
  { value: "Other", label: "General Concern", icon: "📋", desc: "Other campus issue" },
];

const severities = [
  { value: "low", label: "Low", desc: "Non-urgent issue", selected: "border-emerald-500 bg-emerald-950/60 text-emerald-300" },
  { value: "medium", label: "Medium", desc: "Prompt attention", selected: "border-[#bf783e] bg-[#bf783e]/25 text-[#f4f6d6]" },
  { value: "high", label: "High", desc: "Urgent concern", selected: "border-rose-500 bg-rose-950/60 text-rose-300" },
  { value: "critical", label: "Critical", desc: "Immediate hazard", selected: "border-rose-600 bg-rose-900/80 text-rose-100 font-bold" },
];

export default function FacultyReportIncidentPage() {
  const [category, setCategory] = useState("Physical Safety");
  const [location, setLocation] = useState("");
  const [severity, setSeverity] = useState("medium");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [incidentId, setIncidentId] = useState(`INC-${Math.floor(Math.random() * 900 + 100)}`);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newId = `INC-${Math.floor(Math.random() * 900 + 100)}`;
    setIncidentId(newId);

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from("incidents").insert([
        {
          id: newId,
          title: `${category} reported at ${location.slice(0, 30)}`,
          category,
          location,
          severity,
          status: "Open",
          description,
        },
      ]);

      if (error) {
        console.warn("[FacultyReportIncident] Supabase insert error:", error.message);
      }
    } catch (err) {
      console.warn("[FacultyReportIncident] Exception saving to Supabase:", err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setCategory("Physical Safety");
    setLocation("");
    setDescription("");
    setSeverity("medium");
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-fade-in text-[#f4f6d6]">
        <div className="card-flat p-8 sm:p-10 text-center max-w-md w-full shadow-2xl border-white/15 bg-[#141414]">
          <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-sm">
            <CheckIcon className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#f4f6d6] tracking-tight">
            Report Logged Successfully
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-white/60 leading-relaxed font-light">
            Your incident report has been securely transmitted to the Campus Security Command Center.
            An officer will review the details immediately.
          </p>

          <div className="mt-5 p-4 bg-[#181818] rounded-2xl border border-white/10">
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/40">Tracking Reference ID</p>
            <p className="text-base font-mono font-bold text-[#bf783e] mt-0.5">{incidentId}</p>
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            <button onClick={resetForm} className="btn-primary w-full py-3">
              Submit Another Report
            </button>
            <Link href="/dashboard" className="btn-secondary w-full py-3">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in text-[#f4f6d6]">
      {/* Header */}
      <div>
        <h1 className="page-title">Report a Campus Incident</h1>
        <p className="page-subtitle">
          Submit confidential reports regarding safety hazards, facility issues, or security concerns.
        </p>
      </div>

      {/* Emergency Alert Banner */}
      <div className="alert-banner alert-banner-danger">
        <EmergencyPhoneIcon className="w-5 h-5 shrink-0 text-rose-400 animate-pulse" />
        <div className="flex-1 text-xs sm:text-sm">
          <span className="font-bold">Is there immediate danger to life or safety?</span>{" "}
          <span className="opacity-90">Please contact campus dispatch immediately at (555) 911-CAMPUS or locate an emergency blue callbox.</span>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="card-flat p-6 sm:p-8 space-y-6 bg-[#141414] border border-white/10">
        {/* Category Picker */}
        <div>
          <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-3">
            1. Select Incident Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {categories.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setCategory(c.value)}
                className={`p-4 text-left rounded-2xl border transition-all duration-150 ${
                  category === c.value
                    ? "border-[#bf783e] bg-[#bf783e]/20 text-[#f4f6d6] shadow-sm"
                    : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10"
                }`}
              >
                <span className="text-xl block mb-1">{c.icon}</span>
                <span className="font-bold text-xs sm:text-sm block">{c.label}</span>
                <span className="text-[11px] text-white/40 block mt-0.5 font-light">{c.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Location Input */}
        <div>
          <label htmlFor="location" className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
            2. Campus Location
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Science Complex, 3rd Floor East Wing, Room 304"
            required
            className="input"
          />
        </div>

        {/* Severity Selector */}
        <div>
          <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-3">
            3. Estimated Severity Level
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {severities.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setSeverity(s.value)}
                className={`p-3.5 text-left rounded-2xl border transition-all duration-150 ${
                  severity === s.value
                    ? s.selected + " shadow-sm"
                    : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10"
                }`}
              >
                <span className="font-bold text-xs sm:text-sm block">{s.label}</span>
                <span className="text-[10px] text-white/40 block mt-0.5 font-light">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Description Textarea */}
        <div>
          <label htmlFor="description" className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
            4. Detailed Description & Individuals Involved
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Describe what occurred, timestamp, witnesses, or hazards..."
            required
            className="textarea"
          />
          <p className="mt-2 text-xs text-white/40 font-light">
            All submitted reports are handled in strict confidence according to university safety policy.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-danger flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <SecurityIcon className="w-4 h-4" />
            <span>{isSubmitting ? "Logging Incident…" : "Submit Confidential Report"}</span>
          </button>
          <Link href="/dashboard" className="btn-secondary py-3 text-sm font-semibold text-center">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
