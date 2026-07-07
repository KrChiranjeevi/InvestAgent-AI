"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import SearchBox from "@/components/SearchBox";
import Loading from "@/components/Loading";
import ResultCard from "@/components/ResultCard";
import { AlertCircle, RefreshCw, Sparkles, Cpu, BarChart3, Lock, Loader2 } from "lucide-react";
import { useSession, signIn } from "next-auth/react";

/**
 * Main Home Page Component
 * 
 * Manages the state flow of the research pipeline:
 * - If not authenticated: displays an AI Gateway page describing the project features
 *   and prompting real Google Sign-In OAuth authentication.
 * - If authenticated: unlocks the core search box, loaders, and resulting dashboards.
 */
export default function Home() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const authLoading = status === "loading";

  const [company, setCompany] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleSearch = async (searchCompany) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setCompany(searchCompany);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ company: searchCompany }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Failed to analyze company. Please check your network or API key configuration.");
      }

      if (json.success && json.data) {
        setResult(json.data);
      } else {
        throw new Error("Invalid response format received from the server.");
      }
    } catch (err) {
      console.error("Analysis API error:", err);
      setError(err.message || "An unexpected error occurred. Please verify your GEMINI_API_KEY.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCompany("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/25 selection:text-emerald-400">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
        {/* Content Container */}
        <div className="w-full flex flex-col items-center z-10">
          
          {authLoading ? (
            /* Session Loading state */
            <div className="flex flex-col items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
              <p className="mt-4 text-sm text-slate-400">Verifying session...</p>
            </div>
          ) : !isAuthenticated ? (
            /* Futuristic AI Gateway Gate */
            <div className="w-full max-w-4xl flex flex-col items-center">
              {/* Header Title */}
              <div className="text-center max-w-2xl mb-12">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 text-xs font-semibold text-emerald-400 shadow-inner mb-4">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Next-Gen Investment Analyst</span>
                </div>
                <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl sm:leading-tight">
                  Automated Company Research{" "}
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                    Orchestrated by AI
                  </span>
                </h2>
                <p className="mt-4 text-base text-slate-400 leading-relaxed">
                  Sign in to access our restricted research agent. Enter any company and the agent will scour financials, compile competitor metrics, formulate SWOT grids, and rate potential returns.
                </p>
              </div>

              {/* Grid cards detailing Features */}
              <div className="grid gap-6 md:grid-cols-3 w-full mb-12">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5 backdrop-blur-md hover:border-slate-700 transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
                    <Cpu className="h-5 w-5 text-emerald-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Gemini 2.5 Reasoning</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-2">
                    Leverages LangChain orchestration and high-fidelity prompt structures to extract strict company intelligence.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5 backdrop-blur-md hover:border-slate-700 transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/20 mb-4">
                    <BarChart3 className="h-5 w-5 text-teal-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white">SWOT Analysis Grids</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-2">
                    Builds fully formatted SWOT quadrants categorizing Strengths, Weaknesses, Opportunities, and Risks.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5 backdrop-blur-md hover:border-slate-700 transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 mb-4">
                    <Lock className="h-5 w-5 text-indigo-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Follow-up AI Chat</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-2">
                    Ask questions in real time. Our domain restriction keeps responses focused entirely on finance.
                  </p>
                </div>
              </div>

              {/* Large Sign in button */}
              <button
                onClick={() => signIn("google")}
                className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 px-8 py-4 text-sm font-bold text-slate-950 shadow-xl shadow-emerald-500/10 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                {/* Google Logo Icon */}
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Unlock with Google Login</span>
              </button>
            </div>
          ) : (
            /* Authenticated Search Interface */
            <div className="w-full flex flex-col items-center">
              {!isLoading && !result && !error && (
                <div className="text-center mb-10 max-w-xl">
                  <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl sm:leading-tight">
                    AI-Driven Investment{" "}
                    <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                      Research Agent
                    </span>
                  </h2>
                  <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                    Enter any company name. Our automated agent will query Gemini to create the profiles, evaluate metrics, map competitor SWOT indices, and rate final returns.
                  </p>
                </div>
              )}

              {/* Error Alert Panel */}
              {error && (
                <div className="w-full max-w-xl mb-6 rounded-xl border border-rose-900/50 bg-rose-950/20 p-5 backdrop-blur-md">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-rose-200">Analysis Failed</h4>
                      <p className="text-xs text-rose-350 leading-relaxed mt-1.5">{error}</p>
                      
                      <div className="mt-4 flex items-center gap-3">
                        <button
                          onClick={() => handleSearch(company)}
                          className="flex items-center gap-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 px-3.5 py-1.5 text-xs font-semibold text-rose-350 transition-colors"
                        >
                          <RefreshCw className="h-3.5 w-3.5 animate-spin-reverse" />
                          <span>Try Again</span>
                        </button>
                        <button
                          onClick={handleReset}
                          className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                        >
                          Search Another Company
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Active Search & Loader Views */}
              {isLoading && <Loading company={company} />}

              {/* Search form */}
              {!isLoading && !result && !error && (
                <SearchBox onSearch={handleSearch} isLoading={isLoading} />
              )}

              {/* Results Dashboard */}
              {!isLoading && result && (
                <ResultCard data={result} onReset={handleReset} />
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="w-full border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} InvestAgent AI. Designed for interview evaluation & institutional research.</p>
      </footer>
    </div>
  );
}
