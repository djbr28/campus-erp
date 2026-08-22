// ============================================================
// Smart Campus ERP — Circular Gauge Component (Editorial Aesthetic)
// ============================================================
import React from "react";

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  subtitle?: string;
  className?: string;
}

export default function CircularProgress({
  percentage,
  size = 110,
  strokeWidth = 9,
  label,
  subtitle,
  className = "",
}: CircularProgressProps) {
  const clamped = Math.max(0, Math.min(100, percentage));
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (clamped / 100) * circumference;

  const color =
    clamped >= 85
      ? "#10b981"
      : clamped >= 75
      ? "#bf783e"
      : "#f43f5e";

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90 origin-center"
          width={size}
          height={size}
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Active progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif text-2xl sm:text-3xl font-normal text-[#f4f6d6] tracking-tight">
            {clamped}%
          </span>
          {subtitle && (
            <span className="text-[10px] uppercase tracking-wider text-white/50 font-bold">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {label && (
        <span className="mt-2 text-xs font-semibold text-white/70 text-center">
          {label}
        </span>
      )}
    </div>
  );
}
