import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { baseUrl = "http://localhost:11434", model = "qwen2.5:3b", messages, prompt, images, temperature = 0.7 } = body;

    const cleanBaseUrl = baseUrl.replace(/\/$/, "");

    // Check if it's a generate call (e.g. for vision with images)
    if (images && images.length > 0) {
      const res = await fetch(`${cleanBaseUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          prompt,
          images,
          stream: false,
          options: { temperature },
        }),
        signal: AbortSignal.timeout(45000),
      });

      if (!res.ok) {
        return NextResponse.json(
          { error: `Ollama generate error: HTTP ${res.status}` },
          { status: res.status }
        );
      }

      const data = await res.json();
      return NextResponse.json(data);
    }

    // Standard chat call
    const res = await fetch(`${cleanBaseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
        options: { temperature },
      }),
      signal: AbortSignal.timeout(45000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Ollama chat error: HTTP ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Failed to contact local AI engine: ${msg}`, fallback: true },
      { status: 503 }
    );
  }
}
