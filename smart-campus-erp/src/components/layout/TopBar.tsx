// ============================================================
// Smart Campus ERP — Top Bar Component
// ============================================================
"use client";

import { useState } from "react";

export default function TopBar({ title }: { title?: string }) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6">
      {/* Left: spacer for mobile hamburger + page title */}
      <div className="flex items-center gap-3">
        <div className="lg:hidden w-10" /> {/* spacer for hamburger */}
        {title && (
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        )}
      </div>

      {/* Center: search */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div
          className={`relative w-full transition-all duration-200 ${
            searchFocused ? "scale-[1.02]" : ""
          }`}
        >
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search students, classes, reports…"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all"
          />
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
          <span className="text-lg">🔔</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Quick-add */}
        <button className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
          <span>+</span>
          <span className="hidden sm:inline">New</span>
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold cursor-pointer">
          SM
        </div>
      </div>
    </header>
  );
}
