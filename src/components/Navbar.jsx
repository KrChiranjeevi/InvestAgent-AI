"use client";

import React, { useState } from "react";
import { TrendingUp, Sparkles, LogOut } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";

/**
 * Navbar Component
 * 
 * Responsive glassmorphic navigation header.
 * - Consumes next-auth session context using `useSession()`.
 * - Displays user profile details (name, email, and Google avatar image) when authenticated.
 * - Triggers real Google OAuth redirections via NextAuth `signIn("google")` and `signOut()`.
 */
export default function Navbar() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const user = session?.user;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-2 shadow-lg shadow-emerald-500/20">
            <TrendingUp className="h-6 w-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
              InvestAgent <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">AI</span>
            </h1>
            <p className="hidden text-[10px] text-slate-400 sm:block">Automated Investment Research</p>
          </div>
        </div>

        {/* Action / Auth Section */}
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-1.5 rounded-full border border-slate-850 bg-slate-900/30 px-3 py-1 text-[10px] font-medium text-slate-400 shadow-inner sm:flex">
            <Sparkles className="h-3 w-3 text-teal-400 animate-pulse" />
            <span>Gemini 2.5 Engine</span>
          </div>

          {isAuthenticated ? (
            /* User Logged In State */
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 rounded-full border border-slate-800 bg-slate-950/60 p-1.5 pr-3.5 transition-all duration-300 hover:border-slate-700 hover:bg-slate-900 active:scale-98"
              >
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User Avatar"}
                    className="h-7 w-7 rounded-full object-cover border border-emerald-500/30 shadow-md shadow-emerald-500/5"
                  />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-slate-850 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <span className="text-xs font-semibold text-slate-200 hidden sm:inline truncate max-w-[120px]">
                  {user?.name || "User"}
                </span>
              </button>

              {/* Profile Dropdown Panel */}
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)}></div>
                  <div className="absolute right-0 mt-2.5 w-56 origin-top-right rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-2xl z-20 animate-fade-in">
                    <div className="px-3.5 py-2.5 border-b border-slate-850">
                      <div className="text-xs font-bold text-white truncate">{user?.name}</div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">{user?.email}</div>
                    </div>
                    <div className="mt-1.5 space-y-0.5">
                      <button
                        onClick={() => {
                          signOut();
                          setDropdownOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-rose-450 hover:bg-rose-950/20 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* User Logged Out State (Sign In Button) */
            <button
              onClick={() => signIn("google")}
              className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all duration-300 hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:shadow-emerald-500/5 active:scale-98"
            >
              {/* Inline Official Google Icon SVG */}
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
