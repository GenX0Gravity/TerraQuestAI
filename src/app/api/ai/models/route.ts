import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url") || process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  const cleanUrl = targetUrl.replace(/\/$/, "");

  try {
    const res = await fetch(`${cleanUrl}/api/tags`, {
      method: "GET",
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) {
      return NextResponse.json({ models: [] });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ models: [] });
  }
}
