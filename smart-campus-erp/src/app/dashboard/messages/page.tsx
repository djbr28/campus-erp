// ============================================================
// Smart Campus ERP — Messages Page
// ============================================================
"use client";

import { useState } from "react";

const conversations = [
  { id: "1", name: "Prof. Linda Chen", role: "Faculty", last: "Great work on the project!", time: "10m", unread: true, initials: "LC" },
  { id: "2", name: "Security Team", role: "System", last: "Incident #452 resolved.", time: "1h", unread: true, initials: "ST" },
  { id: "3", name: "Parent Portal", role: "System", last: "Fee payment confirmed.", time: "3h", unread: true, initials: "PP" },
  { id: "4", name: "Dean Williams", role: "Admin", last: "Meeting rescheduled to Thursday.", time: "1d", unread: false, initials: "DW" },
  { id: "5", name: "CS Department", role: "Group", last: "New course proposals due Friday.", time: "2d", unread: false, initials: "CS" },
];

const mockMessages = [
  { id: "m1", from: "Prof. Linda Chen", text: "Hi Dr. Mitchell, the CS-301 project reports are ready for review.", time: "10:15 AM", self: false },
  { id: "m2", from: "You", text: "Thanks Linda! I'll review them this afternoon.", time: "10:22 AM", self: true },
  { id: "m3", from: "Prof. Linda Chen", text: "Great work on the project! The students showed excellent understanding.", time: "10:30 AM", self: false },
];

export default function MessagesPage() {
  const [activeConv, setActiveConv] = useState("1");

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="mt-1 text-sm text-gray-500">Communicate with faculty, students, and parents</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex h-[calc(100vh-220px)]">
        {/* Conversation list */}
        <div className={`${activeConv ? "hidden md:flex" : "flex"} w-full md:w-80 flex-col border-r border-gray-100`}>
          <div className="p-3 border-b border-gray-100">
            <input
              type="text"
              placeholder="Search messages…"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConv(conv.id)}
                className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left ${
                  activeConv === conv.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {conv.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 truncate">{conv.name}</span>
                    <span className="text-xs text-gray-400 shrink-0 ml-2">{conv.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{conv.last}</p>
                </div>
                {conv.unread && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Chat view */}
        <div className={`${activeConv ? "flex" : "hidden md:flex"} flex-1 flex-col`}>
          <div className="h-14 px-4 flex items-center gap-3 border-b border-gray-100">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold">
              LC
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Prof. Linda Chen</div>
              <div className="text-xs text-green-500">Online</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mockMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.self ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                    msg.self
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-gray-100 text-gray-800 rounded-bl-md"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.self ? "text-blue-200" : "text-gray-400"}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message…"
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
