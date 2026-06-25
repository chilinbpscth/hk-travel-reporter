import { NextResponse } from "next/server";
import { getAttraction } from "@/data/attractions";
import { getChatProvider } from "@/lib/adapters/chat-provider";
import { buildGroundedResponse } from "@/lib/chat-core";
import type { ChatRequest } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ChatRequest>;
    if (!body.sessionId || !body.attractionId || !body.message?.trim() || !getAttraction(body.attractionId)) {
      return NextResponse.json({ error: "Invalid chat request" }, { status: 400 });
    }

    const category = await getChatProvider().classify(body.message);
    const response = buildGroundedResponse(body.attractionId, category, body.shownFactIds ?? []);
    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: "The local guide is unavailable. Please try again." }, { status: 503 });
  }
}
