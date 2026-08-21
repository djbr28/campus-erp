// ============================================================
// Smart Campus ERP — Report Incident v2
// ============================================================
"use client";

import { useState } from "react";
import Link from "next/link";

const categories = [
  { value: "safety", label: "Safety Concern", icon: "🛡️" },
  { value: "harassment", label: "Harassment", icon: "⚠️" },
  { value: "facilities", label: "Facility Damage", icon: "🔧" },
  { value: "theft", label: "Theft", icon: "🔍" },
  { value: "medical", label: "Medical Emergency", icon: "🏥" },
  { value: "other", label: "Other", icon: "📋" },
];

const severities = [
  { value: "low", label: "Low", color: "badge-green", selected: "border-green-400 bg-green-50 text-green-700" },
  { value: "medium", label: "Medium", color: "badge-amber", selected: "border-amber-400 bg-amber-50 text-amber-700" },
  { value: "high", label: "High", color: "badge-red", selected: "border-red-400 bg-red-50 text-red-700" },
  { value: "critical", label: "Critical", color: "badge-red-strong", selected: "border-red-500 bg-red-100 text-red-800" },
];

export default function ReportIncidentPage() {
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [severity, setSeverity] = useState("medium");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setCategory("");
    setLocation("");
    setDescription("");
    setSeverity("medium");
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="card-flat p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Incident Reported</h2>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            Your report has been submitted successfully. The security team will review it shortly and take appropriate action.
          </p>
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-400">Reference ID</p>
            <p className="text-sm font-mono font-bold text-gray-700">INC-{Math.floor(Math.random() * 900 + 100)}</p>
          </div>
          <button onClick={resetForm} className="btn-primary mt-6">
            Report Another Incident
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="page-header">
        <h1 className="page-title">Report an Incident</h1>
        <p className="page-subtitle">
          Help keep our campus safe. Describe the incident below and our security team will respond promptly.
        </p>
      </div>

      {/* Emergency notice */}
      <div className="alert-banner alert-banner-danger">
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
        </svg>
        <div className="flex-1">
          <span className="text-sm font-semibold">Is this an emergency?</span>{" "}
          <span className="text-sm">Use the Emergency button on your dashboard for immediate response.</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card-flat p-6 space-y-6">
        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {categories.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setCategory(c.value)}
                className={`p-3 text-left text-sm rounded-lg border-2 transition-all ${
                  category === c.value
                    ? "border-blue-400 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span className="text-base mr-1.5">{c.icon}</span>
                <span className="font-medium">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Building A, Room 204"
            required
            className="input"
          />
        </div>

        {/* Severity */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Severity Level</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {severities.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setSeverity(s.value)}
                className={`py-2.5 text-sm font-semibold rounded-lg border-2 transition-all ${
                  severity === s.value
                    ? s.selected
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Describe what happened, when it occurred, and any relevant details including people involved..."
            required
            className="textarea"
          />
          <p className="mt-1.5 text-xs text-gray-400">
            Be as specific as possible to help our security team respond effectively.
          </p>
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button type="submit" className="btn-danger flex-1 py-3 text-base">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            Submit Incident Report
          </button>
          <Link
            href="/student"
            className="btn-secondary py-3"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
