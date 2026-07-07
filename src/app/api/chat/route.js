import { NextResponse } from "next/server";
import { chatAboutCompany } from "@/lib/aiAgent";

/**
 * POST /api/chat
 * 
 * API Route to receive a company name, its previous analysis context, the current
 * user question, and the chat history. Triggers the domain-restricted LangChain Gemini agent.
 * 
 * Perfect for interview explanations:
 * - Direct mapping of parameters matching requested endpoint structure.
 * - Extracts history array to support multi-turn conversational persistence.
 * - Centralized try-catch wrapper for error bubble handling.
 */
export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { company, previousAnalysis, message, history = [] } = body;

    // 1. Validate request payload
    if (!company || typeof company !== "string" || company.trim() === "") {
      return NextResponse.json(
        { error: "Company name is required." },
        { status: 400 }
      );
    }
    if (!previousAnalysis || typeof previousAnalysis !== "string" || previousAnalysis.trim() === "") {
      return NextResponse.json(
        { error: "Previous analysis context is required." },
        { status: 400 }
      );
    }
    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json(
        { error: "User message is required." },
        { status: 400 }
      );
    }

    // 2. Invoke the domain-restricted chat service
    const reply = await chatAboutCompany(
      company.trim(),
      previousAnalysis.trim(),
      message.trim(),
      history
    );

    // 3. Return the response
    return NextResponse.json({ success: true, reply });
  } catch (error) {
    console.error("API Route Error in POST /api/chat:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during chat reasoning." },
      { status: 500 }
    );
  }
}
