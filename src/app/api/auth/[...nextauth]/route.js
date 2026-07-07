import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

/**
 * NextAuth Dynamic API Handler
 * 
 * Handles dynamic dynamic routing requests for Auth.js:
 * - Registers Google provider OAuth authentication flow.
 * - Extracts client variables directly from environmental variables.
 * - Maps user IDs to session scopes on successfully authenticated sessions.
 */
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
