// ============================================================
// Smart Campus ERP — Reusable Button Component (Editorial Aesthetic)
// ============================================================
import React from "react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  danger: "btn-danger",
  ghost: "btn-ghost",
  outline: "border border-white/20 bg-transparent text-[#f4f6d6] hover:bg-white/10 hover:text-white",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3.5 py-1.5 text-xs rounded-full gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-full gap-2",
  lg: "px-7 py-3.5 text-base rounded-full gap-2.5 font-bold",
};

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-semibold transition-all select-none disabled:opacity-40 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
}
