// ============================================================
// Smart Campus ERP — DashboardCard Component
// ============================================================
import React from "react";

interface DashboardCardProps {
  title?: string;
  subtitle?: string;
  actionSlot?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function DashboardCard({
  title,
  subtitle,
  actionSlot,
  children,
  className = "",
}: DashboardCardProps) {
  return (
    <div className={`card-flat bg-[#141414] border border-white/10 overflow-hidden ${className}`}>
      {(title || actionSlot) && (
        <div className="px-6 py-4 border-b border-white/10 bg-[#181818] flex items-center justify-between gap-3">
          <div>
            {title && <h3 className="font-serif text-base font-normal text-[#f4f6d6] tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-white/50 font-light mt-0.5">{subtitle}</p>}
          </div>
          {actionSlot && <div>{actionSlot}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
