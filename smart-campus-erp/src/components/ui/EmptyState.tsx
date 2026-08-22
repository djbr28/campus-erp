// ============================================================
// Smart Campus ERP — Empty State Component (Editorial Aesthetic)
// ============================================================
import React from "react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`empty-state py-12 px-4 ${className}`}>
      {icon ? (
        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/60 mb-3.5 border border-white/10">
          {icon}
        </div>
      ) : (
        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#bf783e] mb-3 border border-white/10">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
      )}
      <h3 className="font-serif text-base font-normal text-[#f4f6d6]">{title}</h3>
      {description && (
        <p className="text-xs text-white/50 max-w-sm mt-1 leading-relaxed font-light">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
