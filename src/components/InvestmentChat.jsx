"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Sparkles, Loader2, AlertCircle } from "lucide-react";

/**
 * InvestmentChat Component
 * 
 * Renders the Follow-up AI Chat Assistant at the bottom of the analysis report.
 * Features:
 * - Session-based message history state containing user and assistant turns.
 * - Dynamic quick-suggestion chips that inject questions directly.
 * - Auto-scrolling window ref to slide down to new messages.
 * - Glassmorphic styling matching the dark theme layout.
 * - API integration with POST /api/chat.
 * 
 * @param {string} company - Name of the company analyzed (e.g. "Tesla").
 * @param {string} previousAnalysis - Stringified analytical report context for Gemini.
 */
export default function InvestmentChat({ company, previousAnalysis }) {
  // 1. Manage state for the message thread
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hello! I am your follow-up InvestAgent AI assistant. Ask me any detailed questions about ${company}'s revenue streams, business metrics, competitors, SWOT properties, or growth outlook!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2. Ref to handle auto-scrolling to the bottom of the conversation
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // 3. Definition of domain-specific quick suggestions
  const quickPrompts = [
    `Why is ${company} risky?`,
    `Who are ${company} competitors?`,
    `Explain ${company} revenue sources.`,
    `Should long term investors consider ${company}?`,
  ];

  // 4. Triggered when sending a message
  const handleSendMessage = async (textToSend) => {
    const text = textToSend?.trim() || input.trim();
    if (!text || isLoading) return;

    // Add user message to history
    const userMessage = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      // Map message history to a lightweight format the API can digest
      const apiHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Call API endpoint POST /api/chat
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company,
          previousAnalysis,
          message: text,
          history: apiHistory,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Failed to receive a reply from InvestAgent AI.");
      }

      // Add assistant response to history
      setMessages((prev) => [...prev, { role: "assistant", content: json.reply }]);
    } catch (err) {
      console.error("Chat message error:", err);
      setError(err.message || "An unexpected error occurred during chat reasoning.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="mt-10 border-t border-slate-800/80 pt-8 w-full">
      {/* Header Title */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 p-1.5 border border-emerald-500/20">
          <MessageSquare className="h-4.5 w-4.5 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Ask Investment AI</h3>
          <p className="text-xs text-slate-400">Ask deep-dive follow-up questions about {company}</p>
        </div>
      </div>

      {/* Chat History Panel */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 min-h-[300px] flex flex-col justify-between">
        <div className="max-h-[320px] overflow-y-auto mb-4 space-y-4 pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-slate-800 text-slate-100 rounded-br-none"
                    : "bg-emerald-950/15 border border-emerald-900/40 text-slate-300 rounded-bl-none"
                }`}
              >
                {/* Meta indicator */}
                <span className="block text-[10px] font-semibold tracking-wider text-slate-550 mb-1">
                  {msg.role === "user" ? "YOU" : "INVESTAGENT AI"}
                </span>
                <p className="whitespace-pre-line">{msg.content}</p>
              </div>
            </div>
          ))}

          {/* Loading Animation Bubble */}
          {isLoading && (
            <div className="flex w-full justify-start">
              <div className="max-w-[85%] rounded-xl px-4 py-3 text-sm bg-emerald-950/10 border border-emerald-900/20 text-slate-400 rounded-bl-none flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                <span>InvestAgent AI is thinking...</span>
              </div>
            </div>
          )}

          {/* Error Message Indicator */}
          {error && (
            <div className="flex w-full justify-start">
              <div className="max-w-[85%] rounded-xl px-4 py-3 text-xs bg-rose-950/20 border border-rose-900/40 text-rose-300 rounded-bl-none flex gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <p>{error}</p>
                  <button
                    onClick={() => handleSendMessage(messages[messages.length - 1]?.content)}
                    className="mt-2 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 underline"
                  >
                    Retry last question
                  </button>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="border-t border-slate-900/60 pt-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-2">
            Suggested Follow-ups
          </span>
          <div className="flex flex-wrap gap-2 mb-3">
            {quickPrompts.map((promptText, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(promptText)}
                disabled={isLoading}
                className="rounded-lg border border-slate-800/80 bg-slate-950/80 px-2.5 py-1.5 text-xs text-slate-400 hover:border-slate-700 hover:text-emerald-400 transition-all duration-300 disabled:opacity-50 text-left"
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* Text Input Row */}
          <div className="flex items-center gap-2 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={`Ask about ${company}'s financials, competitors, risks...`}
              disabled={isLoading}
              className="w-full rounded-lg border border-slate-800 bg-slate-900/50 py-3 pl-4 pr-12 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/10 disabled:opacity-50"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !input.trim()}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors disabled:bg-slate-800 disabled:text-slate-500"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
