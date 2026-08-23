// ============================================================
// Smart Campus ERP — Top Bar v5 (Canva Editorial Aesthetic)
// ============================================================
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase/client";
import { SearchIcon, BellIcon, PlusIcon } from "@/components/ui/Icons";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface TopBarProps {
  title?: string;
  userName?: string;
  userRole?: string;
  userInitials?: string;
  homeHref?: string;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: "danger" | "warning" | "success" | "info";
  href?: string;
}

export default function TopBar({ title, userName, userRole, userInitials, homeHref }: TopBarProps) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const initials = userInitials || "U";
  const name = userName || "User";
  const role = userRole || "Campus Member";
  const home = homeHref || "/";

  // Determine announcement destination for the current role
  const normalizedRole = role.toLowerCase();
  let announcementsHref = home;
  if (normalizedRole.includes("student")) {
    announcementsHref = "/student/announcements";
  } else if (normalizedRole.includes("admin")) {
    announcementsHref = "/admin/announcements";
  } else if (normalizedRole.includes("parent")) {
    announcementsHref = "/parent/announcements";
  } else if (normalizedRole.includes("faculty")) {
    announcementsHref = "/dashboard/messages";
  } else if (normalizedRole.includes("security")) {
    announcementsHref = "/security/incidents";
  }

  // Load announcements from Supabase
  useEffect(() => {
    async function loadNotifications() {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from("announcements")
          .select("*")
          .order("date", { ascending: false })
          .limit(6);

        if (!error && data && data.length > 0) {
          const loaded: NotificationItem[] = data.map((d: any) => ({
            id: d.id,
            title: d.title,
            message: d.description,
            time: d.date || "Recent",
            unread: true,
            type: d.priority === "high" || d.priority === "critical" ? "danger" : d.priority === "medium" ? "warning" : "info",
            href: announcementsHref,
          }));
          setNotifications(loaded);
        } else {
          // Fallback initial notifications
          setNotifications([
            { id: "1", title: "Campus Safety Drill", message: "A mandatory campus safety protocol drill is scheduled for August 25.", time: "2m ago", unread: true, type: "danger", href: announcementsHref },
            { id: "2", title: "Examination Schedule", message: "Midterm examination schedule published in the academic portal.", time: "1h ago", unread: true, type: "warning", href: announcementsHref },
            { id: "3", title: "Extended Library Hours", message: "Starting Sep 1, central library will remain open 24/7 on weekdays.", time: "3h ago", unread: false, type: "info", href: announcementsHref },
          ]);
        }
      } catch (err) {
        console.warn("[TopBar] Error loading notifications:", err);
      }
    }

    loadNotifications();
  }, [announcementsHref]);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    // Hard navigate to switch=true to allow logging in with any account
    window.location.href = "/login?switch=true";
  };

  return (
    <header className="h-16 bg-[#0e0e0e]/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-30 text-[#f4f6d6]">
      {/* Left Title / Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="lg:hidden w-8" />
        {title ? (
          <h1 className="font-serif text-base sm:text-lg font-normal text-[#f4f6d6] tracking-tight truncate">
            {title}
          </h1>
        ) : (
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-white/50">
            <Link href={home} className="text-white/40 hover:text-[#bf783e] transition-colors cursor-pointer">
              Campus
            </Link>
            <span>/</span>
            <span className="text-[#f4f6d6] capitalize font-semibold">{role}</span>
          </div>
        )}
      </div>

      {/* Global Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-6 lg:mx-10">
        <div className="relative w-full group">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#bf783e] transition-colors">
            <SearchIcon className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search students, incidents, records…"
            className="input-search pr-14"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold text-white/40 bg-white/5 border border-white/10 rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Mode Switcher */}
        <ThemeToggle />

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            className="relative p-2.5 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white"
            aria-label="View notifications"
          >
            <BellIcon className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#bf783e] rounded-full ring-2 ring-[#0e0e0e] animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#141414] rounded-3xl shadow-2xl border border-white/15 z-50 overflow-hidden animate-fade-in text-[#f4f6d6]">
              <div className="px-4 py-3.5 border-b border-white/10 flex items-center justify-between bg-[#181818]">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-sm font-normal text-[#f4f6d6]">Campus Announcements</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-[#bf783e] text-white rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-semibold text-[#bf783e] hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
                {notifications.map((n) => (
                  <Link
                    key={n.id}
                    href={n.href || announcementsHref}
                    onClick={() => {
                      setNotifications((prev) =>
                        prev.map((item) => (item.id === n.id ? { ...item, unread: false } : item))
                      );
                      setNotifOpen(false);
                    }}
                    className={`block px-4 py-3.5 hover:bg-white/5 transition-colors cursor-pointer ${
                      n.unread ? "bg-white/[0.03]" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          n.unread
                            ? n.type === "danger"
                              ? "bg-rose-500 ring-2 ring-rose-900"
                              : "bg-[#bf783e] ring-2 ring-[#bf783e]/30"
                            : "bg-white/20"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-[#f4f6d6]">{n.title}</div>
                        <div className="text-xs text-white/60 mt-0.5 line-clamp-2">{n.message}</div>
                        <div className="text-[10px] text-white/40 font-medium mt-1">{n.time}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="px-4 py-2.5 border-t border-white/10 text-center bg-[#181818]">
                <Link
                  href={announcementsHref}
                  onClick={() => setNotifOpen(false)}
                  className="text-xs font-semibold text-[#bf783e] hover:underline"
                >
                  View all announcements →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Quick Action Button — only for students & faculty */}
        {(normalizedRole.includes("student") || normalizedRole.includes("faculty")) && (
          <Link
            href={`${home}/report-incident`}
            className="btn-primary btn-sm hidden sm:inline-flex"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>Report Incident</span>
          </Link>
        )}

        {/* Profile Avatar & Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
            className="w-9 h-9 rounded-full bg-[#f4f6d6] text-[#0e0e0e] flex items-center justify-center text-xs font-extrabold cursor-pointer ring-2 ring-white/20 shadow-sm hover:ring-[#bf783e] hover:scale-105 transition-all"
            aria-label="User account menu"
          >
            {initials}
          </button>

          {/* Profile Popover */}
          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-[#141414] rounded-3xl shadow-2xl border border-white/15 z-50 overflow-hidden animate-fade-in text-[#f4f6d6]">
              <div className="px-4 py-3.5 border-b border-white/10 bg-[#181818]">
                <div className="font-serif text-sm font-normal text-[#f4f6d6] truncate">{name}</div>
                <div className="text-xs text-white/50 mt-0.5 flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#bf783e]" />
                  {role}
                </div>
              </div>

              <div className="p-2 space-y-1">
                <Link
                  href={home}
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                  <span>Portal Dashboard</span>
                </Link>

                <button
                  onClick={() => {
                    setProfileOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/40 transition-colors"
                >
                  <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
