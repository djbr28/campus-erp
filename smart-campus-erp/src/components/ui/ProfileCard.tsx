// ============================================================
// Smart Campus ERP — ProfileCard Component (Editorial Aesthetic)
// ============================================================
import React from "react";
import Badge from "./Badge";

interface ProfileCardProps {
  name: string;
  role: string;
  email: string;
  idNumber?: string;
  department?: string;
  program?: string;
  year?: number | string;
  semester?: number | string;
  phone?: string;
  status?: string;
  avatarUrl?: string;
  initials?: string;
  className?: string;
}

export default function ProfileCard({
  name,
  role,
  email,
  idNumber,
  department,
  program,
  year,
  semester,
  phone,
  status = "Active",
  avatarUrl,
  initials = "AJ",
  className = "",
}: ProfileCardProps) {
  return (
    <div className={`card-flat p-6 sm:p-8 bg-[#141414] border border-white/10 relative overflow-hidden ${className}`}>
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#bf783e]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={name}
              className="w-16 h-16 rounded-3xl object-cover ring-2 ring-[#bf783e]/40 shadow-lg"
            />
          ) : (
            <div className="w-16 h-16 rounded-3xl bg-[#f4f6d6] text-[#0e0e0e] flex items-center justify-center font-serif text-xl font-bold ring-2 ring-white/20 shadow-lg shrink-0">
              {initials}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#f4f6d6] tracking-tight">
                {name}
              </h2>
              <Badge variant={status === "Active" ? "green" : "amber"} dot>
                {status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/50 mt-1 flex-wrap font-light">
              <span className="text-[#bf783e] font-semibold">{role}</span>
              {idNumber && (
                <>
                  <span>•</span>
                  <span className="font-mono text-white/70">{idNumber}</span>
                </>
              )}
              {department && (
                <>
                  <span>•</span>
                  <span>{department}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Contact & Details */}
        <div className="flex flex-col sm:items-end gap-1.5 text-xs text-white/60">
          <div className="flex items-center gap-1.5">
            <span className="text-white/40">Email:</span>
            <span className="text-[#f4f6d6] font-medium">{email}</span>
          </div>
          {phone && (
            <div className="flex items-center gap-1.5">
              <span className="text-white/40">Phone:</span>
              <span className="text-[#f4f6d6] font-medium">{phone}</span>
            </div>
          )}
          {program && (
            <div className="flex items-center gap-1.5 text-[11px] text-[#bf783e] font-semibold">
              <span>{program}</span>
              {year && <span>(Yr {year}{semester ? `, Sem ${semester}` : ""})</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
