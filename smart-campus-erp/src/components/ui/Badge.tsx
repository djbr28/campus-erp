// ============================================================
// Smart Campus ERP — Reusable Badge Primitive (Editorial Aesthetic)
// ============================================================
import React from "react";

export type BadgeVariant =
  | "blue"
  | "green"
  | "amber"
  | "red"
  | "red-strong"
  | "purple"
  | "gray";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, { badge: string; dot: string }> = {
  blue: {
    badge: "bg-[#bf783e]/20 text-[#f4f6d6] border-[#bf783e]/40",
    dot: "bg-[#bf783e]",
  },
  green: {
    badge: "bg-emerald-950/80 text-emerald-300 border-emerald-700/50",
    dot: "bg-emerald-400",
  },
  amber: {
    badge: "bg-amber-950/80 text-amber-300 border-amber-700/50",
    dot: "bg-amber-400",
  },
  red: {
    badge: "bg-rose-950/80 text-rose-300 border-rose-700/50",
    dot: "bg-rose-400",
  },
  "red-strong": {
    badge: "bg-rose-900/90 text-rose-100 border-rose-600/70 font-bold",
    dot: "bg-rose-300",
  },
  purple: {
    badge: "bg-purple-950/80 text-purple-300 border-purple-700/50",
    dot: "bg-purple-400",
  },
  gray: {
    badge: "bg-white/10 text-white/70 border-white/15",
    dot: "bg-white/40",
  },
};

export default function Badge({
  variant = "gray",
  dot = false,
  children,
  className = "",
  ...props
}: BadgeProps) {
  const config = variantStyles[variant] || variantStyles.gray;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold border ${config.badge} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />}
      {children}
    </span>
  );
}
