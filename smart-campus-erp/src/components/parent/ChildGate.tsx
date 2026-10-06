// ============================================================
// Smart Campus ERP — ChildGate
//
// The shared loading / error / not-linked shell every Parent page
// sits behind, so an unlinked parent sees an honest explanation
// instead of a page full of zeroes or somebody else's student.
// ============================================================
"use client";

import React from "react";
import EmptyState from "@/components/ui/EmptyState";
import LoadingState from "@/components/ui/LoadingState";
import { StudentsIcon } from "@/components/ui/Icons";

interface ChildGateProps {
  loading: boolean;
  error: string | null;
  linked: boolean;
  loadingMessage?: string;
  onRetry?: () => void;
  children: React.ReactNode;
}

export default function ChildGate({
  loading,
  error,
  linked,
  loadingMessage = "Loading your child's record…",
  onRetry,
  children,
}: ChildGateProps) {
  if (loading) return <LoadingState message={loadingMessage} />;

  if (error) {
    return (
      <div className="p-4 bg-rose-950/60 border border-rose-600/50 rounded-2xl text-xs text-rose-200 flex items-center justify-between gap-3">
        <span>{error}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1 bg-rose-800/60 hover:bg-rose-700/60 rounded-lg text-white font-medium transition-colors cursor-pointer shrink-0"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (!linked) {
    return (
      <div className="card-flat bg-[#141414] border border-white/10">
        <EmptyState
          icon={<StudentsIcon className="w-6 h-6 text-white/40" />}
          title="No student is linked to your account"
          description="Your parent account is not yet connected to a student record. Contact the campus administrator, who can link it to your child's Student ID."
        />
      </div>
    );
  }

  return <>{children}</>;
}
