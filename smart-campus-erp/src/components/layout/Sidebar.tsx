// ============================================================
// Smart Campus ERP — Sidebar v4 (Canva Editorial Aesthetic)
// ============================================================
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { sidebarNavItems } from "@/lib/mock-data";
import { DynamicNavIcon } from "@/components/ui/Icons";

interface SidebarProps {
  userName?: string;
  userRole?: string;
  userInitials?: string;
}

export default function Sidebar({ userName = "Faculty", userRole = "Faculty", userInitials = "F" }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <div className="flex flex-col h-full bg-[#0e0e0e] text-[#f4f6d6] select-none border-r border-white/10">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-[#f4f6d6] text-[#0e0e0e] flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform shrink-0">
            <DynamicNavIcon name="🏫" className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-serif text-sm font-bold tracking-tight text-[#f4f6d6] whitespace-nowrap">
                Smart Campus
              </span>
              <span className="text-[10px] font-semibold text-[#bf783e] uppercase tracking-wider">
                Faculty Workspace
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${
              collapsed ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {sidebarNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm transition-all duration-150 relative ${
                isActive
                  ? "bg-white/10 text-[#f4f6d6] font-bold border border-[#bf783e]/40 shadow-sm"
                  : "text-white/60 hover:bg-white/5 hover:text-[#f4f6d6]"
              }`}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <span className="absolute left-0 top-2.5 bottom-2.5 w-1 bg-[#bf783e] rounded-r-full" />
              )}
              <span
                className={`shrink-0 transition-colors ${
                  isActive ? "text-[#bf783e]" : "text-white/40 group-hover:text-white/80"
                }`}
              >
                <DynamicNavIcon name={item.icon} className="w-5 h-5" />
              </span>
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 min-w-[20px] text-center text-[10px] font-bold bg-[#bf783e] text-white rounded-full shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User card */}
      {!collapsed && (
        <div className="p-3 border-t border-white/10 shrink-0 bg-[#141414]">
          <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/10">
            <div className="w-9 h-9 rounded-full bg-[#f4f6d6] text-[#0e0e0e] flex items-center justify-center text-xs font-extrabold shrink-0 shadow-sm">
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-[#f4f6d6] truncate">{userName}</div>
              <div className="text-xs text-white/50 truncate flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#bf783e]" />
                {userRole}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-40 p-2.5 bg-[#141414] rounded-xl shadow-md border border-white/10 text-white/80 hover:bg-white/10 transition-colors"
        aria-label="Open navigation menu"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-[264px] bg-[#0e0e0e] border-r border-white/10 shadow-2xl transform transition-transform duration-200 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navContent}
      </aside>

      <aside
        className={`hidden lg:block shrink-0 border-r border-white/10 transition-all duration-200 ease-in-out bg-[#0e0e0e] ${
          collapsed ? "w-[76px]" : "w-[264px]"
        }`}
      >
        {navContent}
      </aside>
    </>
  );
}
