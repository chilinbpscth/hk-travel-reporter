import { NextResponse } from "next/server";
import { getAttraction } from "@/data/attractions";
import { getImageProvider } from "@/lib/adapters/image-provider";
import { consumeImageAttempt } from "@/lib/image-attempts";
import type { ImageRequest, ImageResponse } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ImageRequest>;
    const attraction = body.attractionId ? getAttraction(body.attractionId) : undefined;
    if (!body.sessionId || !attraction || !Array.isArray(body.selectedFactIds)) {
      return NextResponse.json({ error: "Invalid image request" }, { status: 400 });
    }

    const validFactIds = new Set(attraction.facts.map((fact) => fact.id));
    if (body.selectedFactIds.some((id) => !validFactIds.has(id))) {
      return NextResponse.json({ error: "Unsupported fact ID" }, { status: 400 });
    }

    const attempt = consumeImageAttempt(body.sessionId);
    if (!attempt.allowed) {
      return NextResponse.json({ error: "No image attempts remaining", remainingAttempts: 0 }, { status: 429 });
    }

    const generated = await getImageProvider().generate(attraction.id);
    const response: ImageResponse = {
      imageUrl: generated.imageUrl,
      generationId: crypto.randomUUID(),
      remainingAttempts: attempt.remainingAttempts,
      provider: generated.provider,
    };
    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: "The illustration could not be generated." }, { status: 503 });
  }
}
