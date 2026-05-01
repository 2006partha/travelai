import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ reply: "API key not configured." }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are TravelAI, a friendly and concise travel planning assistant. 
Answer travel-related questions helpfully in 1-3 sentences max. Keep it conversational.
User asked: ${message}`
                }
              ]
            }
          ]
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      if (res.status === 429) {
        return NextResponse.json({ reply: "I'm a bit busy right now. Please try again in a moment!" });
      }
      throw new Error(JSON.stringify(err));
    }

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("Voice chat error:", err);
    return NextResponse.json({ reply: "Something went wrong. Please try again." });
  }
}
