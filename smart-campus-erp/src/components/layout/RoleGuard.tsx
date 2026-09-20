// ============================================================
// Smart Campus ERP — RoleGuard (Page-Level Authorization)
//
// Renders its children only when the signed-in user's
// profiles.role is in `allow`. This is a UX layer on top of
// middleware route protection and Supabase RLS — never the only
// thing standing between a user and an action.
// ============================================================
"use client";

import Link from "next/link";
import { useCurrentUser } from "@/hooks/useCurrentUser";

/** Uppercase role names, e.g. ["STUDENT"]. */
interface RoleGuardProps {
  allow: string[];
  children: React.ReactNode;
  /** Where the "go back" button sends a denied user. */
  fallbackHref?: string;
}

export default function RoleGuard({ allow, children, fallbackHref = "/" }: RoleGuardProps) {
  const { profile, loading } = useCurrentUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="w-9 h-9 border-3 border-white/20 border-t-[#bf783e] rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-xs text-white/50">Verifying access…</p>
        </div>
      </div>
    );
  }

  const role = (profile?.role || "").toUpperCase();

  if (!allow.includes(role)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-fade-in text-[#f4f6d6]">
        <div className="card-flat p-8 text-center max-w-md w-full bg-[#141414] border border-white/15">
          <div className="w-14 h-14 rounded-full bg-rose-950/70 border border-rose-600/40 flex items-center justify-center mx-auto mb-4 text-rose-300">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>
          <h2 className="font-serif text-2xl font-normal tracking-tight">Access Restricted</h2>
          <p className="mt-2 text-xs sm:text-sm text-white/60 leading-relaxed font-light">
            {role
              ? `This page is limited to ${allow.join(" and ")} accounts. Your role is ${role}.`
              : "We could not confirm your campus role. Please sign in again."}
          </p>
          <Link href={fallbackHref} className="btn-primary w-full py-3 mt-6 inline-block">
            Return to your dashboard
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
