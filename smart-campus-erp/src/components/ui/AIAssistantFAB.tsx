// ============================================================
// Smart Campus ERP — Global Floating AI Assistant (FAB)
// ============================================================
"use client";

import { useState, useRef, useEffect } from "react";
import { SparklesIcon } from "@/components/ui/Icons";
import type { ChatMessage } from "@/types";

interface AIAssistantFABProps {
  userRole?: string;
  userName?: string;
}

const defaultPromptsByRole: Record<string, string[]> = {
  student: [
    "What is the minimum attendance requirement?",
    "How can I report a campus safety issue?",
    "When are Fall term fees due?",
    "How do I access course schedules?",
  ],
  admin: [
    "Summarize open campus incidents",
    "What is the current student enrollment count?",
    "Check institutional attendance averages",
    "Show security status overview",
  ],
  faculty: [
    "How do I record class attendance?",
    "Review student attendance regulations",
    "How to submit department announcements?",
  ],
  parent: [
    "How can I check my child's attendance?",
    "When is the next parent-teacher conference?",
    "How do I view pending tuition invoices?",
  ],
  security: [
    "What are high-priority active incidents?",
    "Standard protocol for unauthorized access?",
    "How to resolve a logged incident report?",
  ],
};

export default function AIAssistantFAB({ userRole = "Student", userName = "Member" }: AIAssistantFABProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "intro-1",
      role: "assistant",
      content: `Hello ${userName.split(" ")[0]}! 👋 I'm your **Smart Campus AI Assistant**. Ask me anything about courses, attendance, fees, safety, or university operations.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const roleKey = userRole.toLowerCase().includes("admin")
    ? "admin"
    : userRole.toLowerCase().includes("fac")
    ? "faculty"
    : userRole.toLowerCase().includes("par")
    ? "parent"
    : userRole.toLowerCase().includes("sec")
    ? "security"
    : "student";

  const starterPrompts = defaultPromptsByRole[roleKey] || defaultPromptsByRole.student;

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "AI assistant encountered an error.");
      }

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: data.answer || "I received your query but couldn't generate a response.",
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: "Sorry, I couldn't reach the AI service right now. Please try again shortly.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Campus AI Assistant"
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-[#bf783e] hover:bg-[#a6642e] text-white rounded-full shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 border border-white/20"
        >
          <div className="relative">
            <SparklesIcon className="w-5 h-5 animate-pulse text-[#f4f6d6]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0e0e0e]" />
          </div>
          <span className="text-xs font-bold font-serif tracking-wide hidden sm:inline text-[#f4f6d6]">
            Campus AI
          </span>
        </button>
      </div>

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[540px] max-h-[80vh] bg-[#141414] border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in text-[#f4f6d6]">
          {/* Header */}
          <div className="px-4 py-3.5 bg-[#181818] border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#f4f6d6] text-[#0e0e0e] flex items-center justify-center font-bold">
                <SparklesIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-[#f4f6d6]">Campus AI Assistant</h3>
                <p className="text-[10px] text-white/50 font-medium">Smart Campus · {userRole}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([messages[0]])}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors text-xs"
                title="Clear Chat"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                aria-label="Close AI chat"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#111111]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                {m.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-[#f4f6d6] text-[#0e0e0e] flex items-center justify-center shrink-0 mr-2 mt-0.5 shadow-sm text-[10px]">
                    ✨
                  </div>
                )}
                <div
                  className={`max-w-[82%] px-4 py-2.5 text-xs leading-relaxed rounded-2xl ${
                    m.role === "user"
                      ? "bg-[#bf783e] text-white rounded-br-xs font-medium"
                      : "bg-[#181818] text-[#f4f6d6] border border-white/10 rounded-bl-xs font-light"
                  }`}
                >
                  {m.content.split(/(\*\*[^*]+\*\*)/).map((part, index) => {
                    if (part.startsWith("**") && part.endsWith("**")) {
                      return (
                        <strong key={index} className="font-bold text-white">
                          {part.slice(2, -2)}
                        </strong>
                      );
                    }
                    return <span key={index}>{part}</span>;
                  })}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start animate-fade-in items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#f4f6d6] text-[#0e0e0e] flex items-center justify-center shrink-0 text-[10px]">
                  ✨
                </div>
                <div className="bg-[#181818] border border-white/10 px-3.5 py-2 rounded-2xl rounded-bl-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#bf783e] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#bf783e] animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#bf783e] animate-bounce [animation-delay:0.3s]" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Starter Chips */}
          {messages.length <= 2 && (
            <div className="p-2.5 bg-[#141414] border-t border-white/5 overflow-x-auto flex gap-1.5 shrink-0 scrollbar-none">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  disabled={isTyping}
                  className="px-2.5 py-1 text-[11px] bg-white/5 hover:bg-white/10 text-white/80 rounded-full border border-white/10 whitespace-nowrap transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSend();
            }}
            className="p-3 bg-[#181818] border-t border-white/10 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about campus..."
              disabled={isTyping}
              className="flex-1 bg-[#0e0e0e] border border-white/15 rounded-full px-3.5 py-2 text-xs text-[#f4f6d6] placeholder:text-white/30 focus:border-[#bf783e] focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-8 h-8 rounded-full bg-[#f4f6d6] text-[#0e0e0e] flex items-center justify-center shrink-0 disabled:opacity-40 hover:scale-105 active:scale-95 transition-all font-bold"
              aria-label="Send query"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
