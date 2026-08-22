// ============================================================
// Smart Campus ERP — Modal Dialog Component (Editorial Aesthetic)
// ============================================================
"use client";

import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

const widthStyles = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = "lg",
}: ModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in text-[#f4f6d6]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full ${widthStyles[maxWidth]} bg-[#141414] rounded-3xl shadow-2xl border border-white/15 overflow-hidden transform transition-all`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-start justify-between bg-[#181818]">
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-normal text-[#f4f6d6] tracking-tight">{title}</h2>
            {subtitle && <p className="text-xs text-white/50 mt-0.5 font-light">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[calc(85vh-130px)] overflow-y-auto text-[#f4f6d6]">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-3.5 border-t border-white/10 bg-[#181818] flex items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
