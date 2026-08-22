// ============================================================
// Smart Campus ERP — ErrorState Component
// ============================================================
import React from "react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = "Failed to load data",
  message = "An error occurred while connecting to the campus server. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="card-flat p-8 bg-rose-950/20 border border-rose-500/30 text-center max-w-lg mx-auto my-8 animate-fade-in">
      <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h3 className="font-serif text-lg font-normal text-rose-200">{title}</h3>
      <p className="text-xs text-rose-200/70 mt-1 font-light">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 btn-secondary text-xs px-4 py-2 hover:bg-rose-900/40 border-rose-500/40 text-rose-200"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
