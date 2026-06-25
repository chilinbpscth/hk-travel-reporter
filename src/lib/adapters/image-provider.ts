import { getAttraction } from "@/data/attractions";

export interface ImageProviderResult {
  imageUrl: string;
  provider: "mock" | "rodyssey";
}

export interface ImageProvider {
  generate(attractionId: string): Promise<ImageProviderResult>;
}

class MockImageProvider implements ImageProvider {
  async generate(attractionId: string) {
    const attraction = getAttraction(attractionId);
    if (!attraction) throw new Error("Unknown attraction");
    return { imageUrl: attraction.image, provider: "mock" as const };
  }
}

class RodysseyImageProvider implements ImageProvider {
  async generate(attractionId: string): Promise<ImageProviderResult> {
    const attraction = getAttraction(attractionId);
    const endpoint = process.env.RODYSSEY_IMAGE_URL;
    const apiKey = process.env.RODYSSEY_IMAGE_API_KEY;
    if (!attraction || !endpoint || !apiKey) {
      throw new Error("R'Odyssey image provider is not configured");
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: attraction.visualPrompt,
        aspectRatio: "4:3",
        constraints: { text: false, maps: false, logos: false },
      }),
      signal: AbortSignal.timeout(60_000),
    });

    if (!response.ok) {
      throw new Error("R'Odyssey image request failed");
    }

    const data = (await response.json()) as { imageUrl?: string; url?: string };
    const imageUrl = data.imageUrl ?? data.url;
    if (!imageUrl) throw new Error("R'Odyssey image response did not contain an image URL");
    return { imageUrl, provider: "rodyssey" };
  }
}

export function getImageProvider(): ImageProvider {
  return process.env.IMAGE_PROVIDER === "rodyssey" ? new RodysseyImageProvider() : new MockImageProvider();
}
