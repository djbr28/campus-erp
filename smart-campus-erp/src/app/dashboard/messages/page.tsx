// ============================================================
// Smart Campus ERP — Faculty Messages (Editorial Aesthetic)
// ============================================================
"use client";

import { useState } from "react";
import { SearchIcon } from "@/components/ui/Icons";

const conversations = [
  { id: "1", name: "Prof. Linda Chen", role: "Faculty", last: "Great work on the project!", time: "10m", unread: true, initials: "LC" },
  { id: "2", name: "Security Command", role: "Security", last: "Incident #452 resolved in Lab 3.", time: "1h", unread: true, initials: "SC" },
  { id: "3", name: "Parent Portal (Alex)", role: "Parent", last: "Fee payment confirmation received.", time: "3h", unread: false, initials: "PP" },
  { id: "4", name: "Dean Williams", role: "Administration", last: "Faculty council meeting on Thursday.", time: "1d", unread: false, initials: "DW" },
  { id: "5", name: "CS Department", role: "Group", last: "New curriculum proposals due Friday.", time: "2d", unread: false, initials: "CS" },
];

const mockMessages = [
  { id: "m1", from: "Prof. Linda Chen", text: "Hi Dr. Mitchell, the CS-301 project reports are ready for your review.", time: "10:15 AM", self: false },
  { id: "m2", from: "You", text: "Thanks Linda! I'll review the submissions this afternoon after the lecture.", time: "10:22 AM", self: true },
  { id: "m3", from: "Prof. Linda Chen", text: "Great work on the project! The students showed excellent understanding of the data structures.", time: "10:30 AM", self: false },
];

export default function MessagesPage() {
  const [activeConv, setActiveConv] = useState("1");
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [messagesList, setMessagesList] = useState(mockMessages);

  const activeContact = conversations.find((c) => c.id === activeConv) || conversations[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessagesList((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        from: "You",
        text: input.trim(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        self: true,
      },
    ]);
    setInput("");
  };

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-fade-in text-[#f4f6d6]">
      <div className="page-header mb-0">
        <h1 className="page-title">Direct Messaging</h1>
        <p className="page-subtitle">Communicate seamlessly with faculty, administration, and parents</p>
      </div>

      <div className="card-flat overflow-hidden flex h-[calc(100vh-210px)] bg-[#141414] border border-white/10">
        {/* Left: Conversation List */}
        <div
          className={`${
            activeConv ? "hidden md:flex" : "flex"
          } w-full md:w-80 flex-col border-r border-white/10 shrink-0 bg-[#101010]`}
        >
          {/* Search Box */}
          <div className="p-3.5 border-b border-white/10 bg-[#141414]">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                <SearchIcon className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="input-search text-xs py-2 pl-9"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {filteredConversations.map((conv) => {
              const isSelected = activeConv === conv.id;
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConv(conv.id)}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-white/[0.04] transition-all text-left relative ${
                    isSelected ? "bg-white/[0.06] shadow-sm" : ""
                  }`}
                >
                  {isSelected && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#bf783e] rounded-r-full" />
                  )}

                  <div className="w-10 h-10 rounded-full bg-[#f4f6d6] text-[#0e0e0e] flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                    {conv.initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-[#f4f6d6] truncate">
                        {conv.name}
                      </span>
                      <span className="text-[10px] text-white/40 font-medium shrink-0 ml-1">
                        {conv.time}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 truncate mt-0.5 font-light">{conv.last}</p>
                  </div>

                  {conv.unread && (
                    <span className="w-2 h-2 bg-[#bf783e] rounded-full shrink-0 ring-2 ring-[#bf783e]/30" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat Window */}
        <div className={`${activeConv ? "flex" : "hidden md:flex"} flex-1 flex-col bg-[#141414]`}>
          {/* Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-white/10 bg-[#181818] shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveConv("")}
                className="md:hidden p-1.5 rounded-lg text-white/60 hover:bg-white/10"
              >
                ←
              </button>
              <div className="w-9 h-9 rounded-full bg-[#f4f6d6] text-[#0e0e0e] flex items-center justify-center text-xs font-bold shadow-sm">
                {activeContact.initials}
              </div>
              <div>
                <div className="text-sm font-bold text-[#f4f6d6]">{activeContact.name}</div>
                <div className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{activeContact.role} · Active Now</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#101010]">
            {messagesList.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.self ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] sm:max-w-[70%] px-5 py-3.5 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                    msg.self
                      ? "bg-[#bf783e] text-white rounded-br-xs shadow-md font-medium"
                      : "bg-[#181818] text-[#f4f6d6] rounded-bl-xs border border-white/10 shadow-xs font-light"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p
                    className={`text-[10px] mt-1 font-medium ${
                      msg.self ? "text-white/80 text-right" : "text-white/40"
                    }`}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Bar */}
          <div className="p-4 border-t border-white/10 bg-[#141414]">
            <form onSubmit={handleSend} className="flex gap-2.5">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="input flex-1 text-xs sm:text-sm"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="btn-primary shrink-0 px-6"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
