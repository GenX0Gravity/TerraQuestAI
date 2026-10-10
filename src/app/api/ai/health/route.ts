import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url") || process.env.OLLAMA_BASE_URL || "http://localhost:11434";

  const cleanUrl = targetUrl.replace(/\/$/, "");
  const startTime = Date.now();

  try {
    const res = await fetch(`${cleanUrl}/api/tags`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          ok: false,
          status: "offline",
          error: `Ollama returned HTTP ${res.status}`,
          latencyMs: Date.now() - startTime,
          models: [],
        },
        { status: 200 }
      );
    }

    const data = await res.json();
    return NextResponse.json({
      ok: true,
      status: "online",
      latencyMs: Date.now() - startTime,
      models: data.models || [],
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({
      ok: false,
      status: "offline",
      latencyMs: Date.now() - startTime,
      error: `Could not reach Ollama at ${cleanUrl}: ${msg}`,
      models: [],
    });
  }
}
