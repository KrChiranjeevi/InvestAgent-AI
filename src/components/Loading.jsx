"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

/**
 * Loading Component
 * 
 * Renders a premium loader when the AI agent is researching a company.
 * Features:
 * - A revolving list of status messages indicating what the agent is "thinking" about.
 * - Glassmorphic dark panel styles.
 * - Double-pulse radar circle animation overlaying a rotating Lucide spinner.
 * 
 * @param {string} company - Name of the company currently being researched.
 */
export default function Loading({ company }) {
  const [statusIndex, setStatusIndex] = useState(0);

  const statuses = [
    `Initializing Investment Agent research for ${company}...`,
    `Fetching company overview and market data...`,
    `Analyzing revenue streams and business model...`,
    `Scanning competitor landscape and market share...`,
    `Performing SWOT analysis (Strengths & Weaknesses)...`,
    `Evaluating growth opportunities and regulatory risks...`,
    `Formulating final investment recommendation and score...`,
    `Structuring report... almost ready!`
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prevIndex) => (prevIndex + 1) % statuses.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [statuses.length]);

  return (
    <div className="flex w-full max-w-xl flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/30 p-10 text-center backdrop-blur-md">
      {/* Premium Radar Pulse Animation */}
      <div className="relative flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/10 opacity-75"></div>
        <div className="absolute h-16 w-16 animate-pulse rounded-full bg-emerald-500/20"></div>
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-md shadow-emerald-500/20">
          <Loader2 className="h-6 w-6 animate-spin text-slate-950 stroke-[2.5]" />
        </div>
      </div>

      <h3 className="mt-6 text-lg font-semibold text-white">Researching {company}</h3>
      <p className="mt-2 min-h-[40px] text-sm text-slate-400 transition-all duration-500">
        {statuses[statusIndex]}
      </p>

      {/* Modern thin loader bar */}
      <div className="mt-8 h-1.5 w-48 overflow-hidden rounded-full bg-slate-800">
        <div className="h-full w-full origin-left animate-pulse bg-gradient-to-r from-emerald-500 to-teal-400"></div>
      </div>
    </div>
  );
}
