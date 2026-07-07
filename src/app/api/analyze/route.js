import { NextResponse } from "next/server";
import { analyzeCompany } from "@/lib/aiAgent";

/**
 * POST /api/analyze
 * 
 * API Route to receive a company name, trigger the LangChain Gemini Research Agent,
 * and return the structured investment evaluation.
 * 
 * Perfect for interview explanations:
 * - Next.js App Router API design using NextResponse.
 * - Extracts and validates input body payloads.
 * - Centralizes error catching to distinguish client input errors (400) from backend/LLM issues (500).
 */
export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { company } = body;

    // 1. Validate request payload
    if (!company || typeof company !== "string" || company.trim() === "") {
      return NextResponse.json(
        { error: "Company name is required and must be a valid string." },
        { status: 400 }
      );
    }

    // 2. Execute company analysis using LangChain + Gemini
    const analysisResult = await analyzeCompany(company.trim());

    // 3. Return the structured analysis back to the client
    return NextResponse.json({ success: true, data: analysisResult });
  } catch (error) {
    console.error("API Route Error in POST /api/analyze:", error);
    
    // Provide clean and descriptive error messages for developers and users
    return NextResponse.json(
      { 
        error: error.message || "An unexpected error occurred during company analysis.",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined 
      },
      { status: 500 }
    );
  }
}
