import { NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string" || query.trim().length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error("[Kryptos] GROQ_API_KEY is not set in environment variables.");
      return NextResponse.json(
        { suggestions: [], error: "API key not configured" },
        { status: 500 }
      );
    }

    const groqResponse = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              'You are a medical search autocomplete engine. The user will provide a partial medical term. You must return exactly 5 highly relevant, advanced medical search suggestions (e.g., diseases, scan types, symptoms). Output ONLY a valid JSON array of strings. Do not include markdown formatting, backticks, or any other text. Example output: ["Term 1", "Term 2"].',
          },
          {
            role: "user",
            content: query,
          },
        ],
        temperature: 0.4,
        max_tokens: 200,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error("[Kryptos] Groq API error:", groqResponse.status, errorText);
      return NextResponse.json(
        { suggestions: [], error: "Groq API request failed" },
        { status: groqResponse.status }
      );
    }

    const data = await groqResponse.json();
    const rawContent = data.choices?.[0]?.message?.content?.trim() ?? "[]";

    // Parse and validate the JSON array
    let suggestions: string[] = [];
    try {
      const parsed = JSON.parse(rawContent);
      if (Array.isArray(parsed)) {
        suggestions = parsed.filter((s: unknown) => typeof s === "string").slice(0, 5);
      }
    } catch {
      console.warn("[Kryptos] Failed to parse Groq response as JSON:", rawContent);
      suggestions = [];
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("[Kryptos] Autocomplete route error:", error);
    return NextResponse.json(
      { suggestions: [], error: "Internal server error" },
      { status: 500 }
    );
  }
}
