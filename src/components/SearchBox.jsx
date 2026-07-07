"use client";

import React, { useState } from "react";
import { Search, Sparkles } from "lucide-react";

/**
 * SearchBox Component
 * 
 * Contains the company search input form. Includes:
 * - A responsive text input with focus rings and search icon.
 * - Submission handling and loading state disabling.
 * - Popular company suggestion buttons to make user testing easy.
 * 
 * @param {Function} onSearch - Callback triggered when search is submitted.
 * @param {boolean} isLoading - Disables inputs when an active search is running.
 */
export default function SearchBox({ onSearch, isLoading }) {
  const [input, setInput] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSearch(input.trim());
    }
  };

  const suggestions = ["Tesla", "NVIDIA", "Apple", "Microsoft"];

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-slate-800/80 bg-slate-900/30 p-6 backdrop-blur-md sm:p-8 hover:border-slate-700/85 transition-colors duration-300">
      <form onSubmit={handleSubmit} className="relative flex flex-col gap-3.5 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter company name (e.g. Tesla, Apple, Nike)..."
            disabled={isLoading}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-3.5 pl-12 pr-4 text-base text-white placeholder-slate-550 shadow-inner outline-none transition-all duration-300 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/10 disabled:opacity-50"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3.5 text-base font-semibold text-slate-950 shadow-md shadow-emerald-500/10 transition-all duration-300 hover:from-emerald-400 hover:to-teal-400 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:shadow-none"
        >
          <span>Analyze</span>
          <Sparkles className="h-4 w-4" />
        </button>
      </form>

      {/* Suggested Quick Searches */}
      <div className="mt-5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">Popular Searches:</span>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {suggestions.map((company) => (
            <button
              key={company}
              type="button"
              onClick={() => {
                setInput(company);
                if (!isLoading) {
                  onSearch(company);
                }
              }}
              disabled={isLoading}
              className="rounded-lg border border-slate-800/80 bg-slate-950/50 px-3.5 py-1.5 text-xs font-semibold text-slate-400 transition-all duration-300 hover:border-emerald-500/40 hover:bg-slate-900/60 hover:text-emerald-400 active:scale-95 disabled:opacity-50"
            >
              {company}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
