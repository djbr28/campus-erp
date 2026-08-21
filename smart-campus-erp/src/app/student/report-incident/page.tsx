// ============================================================
// Smart Campus ERP — Report Incident (Student)
// ============================================================
"use client";

import { useState } from "react";

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

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="text-center p-8 bg-white rounded-2xl border border-gray-100 max-w-md">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-gray-900">Incident Reported</h2>
          <p className="mt-2 text-sm text-gray-600">
            Your report has been submitted successfully. The security team will review it shortly.
          </p>
          <p className="mt-1 text-xs text-gray-400">Reference: INC-{Math.floor(Math.random() * 900 + 100)}</p>
          <button
            onClick={() => {
              setSubmitted(false);
              setCategory("");
              setLocation("");
              setDescription("");
              setSeverity("medium");
            }}
            className="mt-6 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            Report Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Report an Incident</h1>
        <p className="mt-1 text-sm text-gray-500">
          Help keep our campus safe. Describe the incident below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
          >
            <option value="">Select a category</option>
            <option value="safety">Safety Concern</option>
            <option value="harassment">Harassment</option>
            <option value="facilities">Facility Damage</option>
            <option value="theft">Theft</option>
            <option value="medical">Medical Emergency</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Building A, Room 204"
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Severity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Severity</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { value: "low", label: "Low", color: "border-green-300 bg-green-50 text-green-700" },
              { value: "medium", label: "Medium", color: "border-amber-300 bg-amber-50 text-amber-700" },
              { value: "high", label: "High", color: "border-red-300 bg-red-50 text-red-700" },
              { value: "critical", label: "Critical", color: "border-red-500 bg-red-100 text-red-800" },
            ].map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setSeverity(s.value)}
                className={`py-2 text-xs font-semibold rounded-xl border-2 transition-all ${
                  severity === s.value ? s.color : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Describe what happened, when, and any relevant details…"
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
        >
          Submit Report
        </button>
      </form>
    </div>
  );
}
