"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";

/**
 * Providers Component
 * 
 * Context providers wrapper for client-side hooks.
 * Wraps children in NextAuth SessionProvider.
 */
export function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
