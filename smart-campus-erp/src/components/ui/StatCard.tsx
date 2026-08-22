// ============================================================
// Smart Campus ERP — StatCard Component (Editorial Aesthetic)
// ============================================================
import React from "react";
import { TrendUpIcon, TrendDownIcon } from "./Icons";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  subtitle?: string;
  iconBg?: string;
  className?: string;
}

export default function StatCard({
  label,
  value,
  change,
  trend,
  icon,
  subtitle,
  iconBg = "bg-white/5 text-[#f4f6d6] border-white/10",
  className = "",
}: StatCardProps) {
  return (
    <div
      className={`card-flat p-5 sm:p-6 relative overflow-hidden transition-all duration-200 hover:border-[#bf783e]/50 hover:-translate-y-0.5 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        {icon && (
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center border shrink-0 ${iconBg}`}
          >
            {icon}
          </div>
        )}

        {change && (
          <div
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              trend === "up"
                ? "bg-emerald-950/80 text-emerald-300 border-emerald-700/50"
                : trend === "down"
                ? "bg-rose-950/80 text-rose-300 border-rose-700/50"
                : "bg-white/10 text-white/75 border-white/15"
            }`}
          >
            {trend === "up" && <TrendUpIcon />}
            {trend === "down" && <TrendDownIcon />}
            <span>{change}</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="font-serif text-2xl sm:text-3xl font-normal text-[#f4f6d6] tracking-tight">
          {value}
        </div>
        <div className="text-xs sm:text-sm text-white/60 font-light mt-0.5">
          {label}
        </div>
        {subtitle && (
          <div className="text-xs text-white/40 mt-1">{subtitle}</div>
        )}
      </div>
    </div>
  );
}
