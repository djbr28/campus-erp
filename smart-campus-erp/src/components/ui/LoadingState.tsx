// ============================================================
// Smart Campus ERP — LoadingState Component
// ============================================================
import React from "react";

export default function LoadingState({ message = "Loading campus records…" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] p-8 text-center animate-fade-in">
      <div className="w-10 h-10 border-3 border-white/20 border-t-[#bf783e] rounded-full animate-spin mb-4" />
      <p className="text-sm font-light text-white/60 tracking-wide">{message}</p>
    </div>
  );
}
