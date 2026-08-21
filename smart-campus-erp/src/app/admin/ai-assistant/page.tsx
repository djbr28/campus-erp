// ============================================================
// Smart Campus ERP — AI Assistant
// Connected to server-side Groq AI
// ============================================================
"use client";

import { useEffect, useRef, useState } from "react";
import {
  aiInitialMessages,
  aiExampleQuestions,
} from "@/lib/mock-data-step2";
import type { ChatMessage } from "@/types";

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(aiInitialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    const question = text.trim();

    if (!question || isTyping) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: question,
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage,
    ]);

    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to get a response from the AI assistant."
        );
      }

      const answer =
        typeof data?.answer === "string"
          ? data.answer
          : "The AI assistant returned an invalid response.";

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: answer,
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        assistantMessage,
      ]);
    } catch (error) {
      console.error("AI Assistant error:", error);

      const errorMessage: ChatMessage = {
        id: `ai-error-${Date.now()}`,
        role: "assistant",
        content:
          "Sorry, I couldn't connect to the AI assistant right now. Please try again.",
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        errorMessage,
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const showExamples = messages.length <= 1;

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">AI Assistant</h1>

        <p className="page-subtitle">
          Ask questions about campus data, incidents, and analytics
        </p>
      </div>

      {/* Chat container */}
      <div className="flex-1 card-flat flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Empty state */}
          {showExamples && messages.length === 0 && (
            <div className="empty-state h-full">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
                  />
                </svg>
              </div>

              <h3 className="text-base font-bold text-gray-900">
                Smart Campus AI
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Ask me anything about campus data and analytics.
              </p>
            </div>
          )}

          {/* Chat messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {/* AI icon */}
              {message.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center shrink-0 mr-2 mt-0.5">
                  <svg
                    className="w-3.5 h-3.5 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09z"
                    />
                  </svg>
                </div>
              )}

              {/* Message bubble */}
              <div
                className={`max-w-[80%] sm:max-w-[70%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  message.role === "user"
                    ? "bg-blue-600 text-white rounded-2xl rounded-br-md"
                    : "bg-gray-100 text-gray-800 rounded-2xl rounded-bl-md"
                }`}
              >
                {message.content
                  .split(/(\*\*[^*]+\*\*)/)
                  .map((part, index) => {
                    if (
                      part.startsWith("**") &&
                      part.endsWith("**")
                    ) {
                      return (
                        <strong key={index}>
                          {part.slice(2, -2)}
                        </strong>
                      );
                    }

                    return <span key={index}>{part}</span>;
                  })}
              </div>
            </div>
          ))}

          {/* AI thinking indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center shrink-0 mr-2">
                <svg
                  className="w-3.5 h-3.5 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                  />
                </svg>
              </div>

              <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md text-sm text-gray-500">
                <span className="animate-pulse">
                  Thinking...
                </span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Example questions */}
        {showExamples && (
          <div className="px-4 sm:px-6 pb-3">
            <p className="text-xs font-medium text-gray-400 mb-2">
              Try asking:
            </p>

            <div className="flex flex-wrap gap-2">
              {aiExampleQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => sendMessage(question)}
                  disabled={isTyping}
                  className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-3 sm:p-4 border-t border-gray-200">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void sendMessage(input);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about students, incidents, attendance..."
              className="input flex-1"
              disabled={isTyping}
            />

            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="btn-primary"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>

              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}