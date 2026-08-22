// ============================================================
// Smart Campus ERP — Faculty AI Assistant
// ============================================================
"use client";

import { useEffect, useRef, useState } from "react";
import { aiInitialMessages } from "@/lib/mock-data-step2";
import type { ChatMessage } from "@/types";
import { SparklesIcon } from "@/components/ui/Icons";

const facultyQuestions = [
  "Show my student roster",
  "What incidents are pending?",
  "How many active students are enrolled?",
  "Which students have low attendance?",
  "Summarize recent announcements",
];

export default function FacultyAIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(aiInitialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    const question = text.trim();
    if (!question || isTyping) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to get a response from the AI assistant.");
      }

      const answer = typeof data?.answer === "string" ? data.answer : "The AI assistant returned an invalid response.";

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: answer,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Assistant error:", error);
      const errorMessage: ChatMessage = {
        id: `ai-error-${Date.now()}`,
        role: "assistant",
        content: "Sorry, I couldn't connect to the AI assistant right now. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const showExamples = messages.length <= 1;

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col space-y-4 animate-fade-in text-[#f4f6d6]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <span>Faculty AI Assistant</span>
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#bf783e]/20 text-[#f4f6d6] border border-[#bf783e]/40 uppercase tracking-widest font-sans">
              Groq Powered
            </span>
          </h1>
          <p className="page-subtitle">
            Query student records, attendance patterns, and campus incidents using natural language.
          </p>
        </div>
      </div>

      <div className="flex-1 card-flat flex flex-col overflow-hidden bg-[#141414] border border-white/10">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#bf783e] mb-3 shadow-xs">
                <SparklesIcon className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-lg font-normal text-[#f4f6d6]">
                How can I assist you today?
              </h3>
              <p className="text-xs text-white/50 max-w-sm mt-1 font-light">
                Ask about students, attendance, incidents, or campus records.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-[#f4f6d6] text-[#0e0e0e] flex items-center justify-center shrink-0 mr-3 mt-0.5 shadow-sm">
                  <SparklesIcon className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] px-5 py-3.5 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  message.role === "user"
                    ? "bg-[#bf783e] text-white rounded-3xl rounded-br-xs shadow-md font-medium"
                    : "bg-[#181818] text-[#f4f6d6] rounded-3xl rounded-bl-xs border border-white/10 shadow-xs font-light"
                }`}
              >
                {message.content.split(/(\*\*[^*]+\*\*)/).map((part, index) => {
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
            <div className="flex justify-start animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-[#f4f6d6] text-[#0e0e0e] flex items-center justify-center shrink-0 mr-3 shadow-sm">
                <SparklesIcon className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-[#181818] border border-white/10 px-5 py-3 rounded-3xl rounded-bl-xs flex items-center gap-2 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#bf783e] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#bf783e] animate-bounce [animation-delay:0.15s]" />
                <span className="w-2 h-2 rounded-full bg-[#bf783e] animate-bounce [animation-delay:0.3s]" />
                <span className="text-xs text-white/60 font-light ml-1">Analyzing…</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {showExamples && (
          <div className="px-4 sm:px-6 py-3 bg-[#181818] border-t border-white/10">
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/40 mb-2">
              Suggested queries:
            </p>
            <div className="flex flex-wrap gap-2">
              {facultyQuestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => sendMessage(q)}
                  disabled={isTyping}
                  className="px-3.5 py-1.5 text-xs font-medium bg-white/5 text-white/80 rounded-full border border-white/10 hover:border-[#bf783e] hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-3 sm:p-4 border-t border-white/10 bg-[#141414]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void sendMessage(input);
            }}
            className="flex gap-2.5"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about students, attendance, incidents…"
              className="input flex-1 text-xs sm:text-sm"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="btn-primary shrink-0 px-6 shadow-xs"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
