"use client";

import React from "react";
import {
  CheckCircle2,
  XCircle,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ShieldAlert,
  Users,
  Award,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Info
} from "lucide-react";
import InvestmentChat from "./InvestmentChat";

/**
 * ResultCard Component
 * 
 * Displays the complete investment agent's report in a dashboard layout.
 * Features:
 * - A final recommendation badge with dynamic green/red gradients.
 * - An SVG Circular Progress Gauge representing the investment score out of 10.
 * - Multi-column cards for Company Overview, Business Model, and Industry Position.
 * - A grid-based SWOT quadrant mapping Strengths, Weaknesses, Opportunities, and Risks.
 * - A bottom section for the overall detailed Investment Thesis.
 * - Follow-up chat panel integrated at the bottom of the card.
 * 
 * @param {Object} data - The parsed analysis JSON from the API.
 * @param {Function} onReset - Callback to clear results and research a new company.
 */
export default function ResultCard({ data, onReset }) {
  const {
    companyName,
    overview,
    businessModel,
    industryAnalysis,
    competitors = [],
    strengths = [],
    weaknesses = [],
    growthOpportunities = [],
    investmentRisks = [],
    investmentScore,
    recommendation,
    reasoning
  } = data;

  const isInvest = recommendation?.toUpperCase() === "INVEST";

  // Score circular SVG helpers
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * (investmentScore || 0)) / 10;

  const getScoreStrokeColor = (score) => {
    if (score >= 8) return "stroke-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.4)]";
    if (score >= 5) return "stroke-yellow-450 drop-shadow-[0_0_6px_rgba(250,204,21,0.4)]";
    return "stroke-rose-500 drop-shadow-[0_0_6px_rgba(244,63,94,0.4)]";
  };

  return (
    <div className="w-full max-w-5xl rounded-3xl border border-slate-800/80 bg-slate-900/20 p-6 backdrop-blur-xl sm:p-8 hover:border-slate-850 transition-all duration-500">
      {/* Back Button */}
      <button
        onClick={onReset}
        className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-450 hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Analyze another company</span>
      </button>

      {/* Report Header */}
      <div className="flex flex-col gap-6 border-b border-slate-850 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            Investment Research Agent Report
          </span>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl mt-1 tracking-tight">{companyName}</h2>
        </div>

        {/* Recommendation Badge */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
              Final Recommendation
            </span>
            <div
              className={`mt-2.5 flex items-center gap-2 rounded-2xl px-6 py-3.5 text-base font-extrabold shadow-lg transition-transform duration-300 hover:scale-102 ${
                isInvest
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-emerald-500/10"
                  : "bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-rose-500/10"
              }`}
            >
              {isInvest ? (
                <>
                  <ThumbsUp className="h-5 w-5 fill-current" />
                  <span>INVEST</span>
                </>
              ) : (
                <>
                  <ThumbsDown className="h-5 w-5 fill-current" />
                  <span>PASS</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overview & Score Row */}
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {/* Core Profile Card */}
        <div className="md:col-span-2 rounded-2xl border border-slate-850 bg-slate-950/40 p-5 hover:border-slate-800 transition-colors duration-300">
          <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Info className="h-4.5 w-4.5 text-emerald-400" />
            <span>Company Overview</span>
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">{overview}</p>
        </div>

        {/* Score gauge Card */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-850 bg-slate-950/40 p-5 text-center hover:border-slate-800 transition-colors duration-300 relative overflow-hidden group">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Investment Score
          </span>
          
          {/* Circular Progress Ring */}
          <div className="relative mt-5 flex items-center justify-center h-28 w-28">
            <svg className="h-full w-full -rotate-90">
              <circle
                cx="56"
                cy="56"
                r={radius}
                className="stroke-slate-850 fill-transparent"
                strokeWidth="6"
              />
              <circle
                cx="56"
                cy="56"
                r={radius}
                className={`fill-transparent transition-all duration-1000 ${getScoreStrokeColor(investmentScore)}`}
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-white leading-none">{investmentScore}</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Score</span>
            </div>
          </div>

          <p className="mt-4 text-[10px] text-slate-450 leading-relaxed">
            Based on qualitative SWOT risk & growth metrics.
          </p>
        </div>
      </div>

      {/* Business Model & Industry position */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-850 bg-slate-950/40 p-5 hover:border-slate-800 transition-colors duration-300">
          <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Award className="h-4.5 w-4.5 text-emerald-400" />
            <span>Business Model & Revenue Streams</span>
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">{businessModel}</p>
        </div>

        <div className="rounded-2xl border border-slate-850 bg-slate-950/40 p-5 hover:border-slate-800 transition-colors duration-300">
          <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Users className="h-4.5 w-4.5 text-emerald-400" />
            <span>Industry Position & Competitors</span>
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">{industryAnalysis}</p>
          
          {competitors && competitors.length > 0 && (
            <div className="mt-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Key Competitors</span>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {competitors.map((comp) => (
                  <span
                    key={comp}
                    className="rounded-lg bg-slate-900 border border-slate-850 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-700 transition-colors"
                  >
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SWOT Quadrant Matrix */}
      <div className="mt-8">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Strategic SWOT Analysis</h3>
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Strengths */}
          <div className="rounded-2xl border border-emerald-950/80 bg-emerald-950/5 p-5 hover:bg-emerald-950/10 hover:border-emerald-900/60 transition-all duration-300 hover:scale-[1.01]">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <CheckCircle2 className="h-4.5 w-4.5" />
              <span>Strengths</span>
            </h4>
            <ul className="mt-4 space-y-2.5">
              {strengths && strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500 shadow shadow-emerald-500/50"></span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="rounded-2xl border border-rose-950/80 bg-rose-950/5 p-5 hover:bg-rose-950/10 hover:border-rose-900/60 transition-all duration-300 hover:scale-[1.01]">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-450">
              <XCircle className="h-4.5 w-4.5" />
              <span>Weaknesses</span>
            </h4>
            <ul className="mt-4 space-y-2.5">
              {weaknesses && weaknesses.map((weak, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500 shadow shadow-rose-500/50"></span>
                  <span>{weak}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="rounded-2xl border border-teal-950/80 bg-teal-950/5 p-5 hover:bg-teal-950/10 hover:border-teal-900/60 transition-all duration-300 hover:scale-[1.01]">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400">
              <Lightbulb className="h-4.5 w-4.5" />
              <span>Growth Opportunities</span>
            </h4>
            <ul className="mt-4 space-y-2.5">
              {growthOpportunities && growthOpportunities.map((opp, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400 shadow shadow-teal-400/50"></span>
                  <span>{opp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Risks */}
          <div className="rounded-2xl border border-orange-950/80 bg-orange-950/5 p-5 hover:bg-orange-950/10 hover:border-orange-900/60 transition-all duration-300 hover:scale-[1.01]">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
              <ShieldAlert className="h-4.5 w-4.5" />
              <span>Investment Risks</span>
            </h4>
            <ul className="mt-4 space-y-2.5">
              {investmentRisks && investmentRisks.map((risk, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500 shadow shadow-orange-500/50"></span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Final Thesis / Reasoning */}
      <div className="mt-8 rounded-2xl border border-slate-850 bg-gradient-to-r from-slate-900/40 to-slate-950/60 p-5 hover:border-slate-800 transition-colors duration-300">
        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <TrendingUp className="h-4 w-4 text-emerald-400" />
          <span>Detailed Investment Thesis</span>
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-slate-300 whitespace-pre-line">
          {reasoning}
        </p>
      </div>

      {/* Follow-up Investment Chat Section */}
      <InvestmentChat company={companyName} previousAnalysis={JSON.stringify(data)} />
    </div>
  );
}
