import { classifyQuestion } from "@/lib/chat-core";
import type { ChatCategory } from "@/lib/types";

export interface ChatProvider {
  classify(message: string): Promise<ChatCategory>;
}

class MockChatProvider implements ChatProvider {
  async classify(message: string) {
    return classifyQuestion(message);
  }
}

class RodysseyChatProvider implements ChatProvider {
  async classify(message: string): Promise<ChatCategory> {
    const endpoint = process.env.RODYSSEY_CHAT_URL;
    const apiKey = process.env.RODYSSEY_CHAT_API_KEY;
    if (!endpoint || !apiKey) {
      throw new Error("R'Odyssey chat provider is not configured");
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task: "classify_attraction_question",
        allowedCategories: ["location", "features", "value", "activities", "off_topic"],
        message,
      }),
      signal: AbortSignal.timeout(12_000),
    });

    if (!response.ok) {
      throw new Error("R'Odyssey chat request failed");
    }

    const data = (await response.json()) as { category?: ChatCategory };
    const allowed: ChatCategory[] = ["location", "features", "value", "activities", "off_topic"];
    return data.category && allowed.includes(data.category) ? data.category : "off_topic";
  }
}

export function getChatProvider(): ChatProvider {
  return process.env.CHAT_PROVIDER === "rodyssey" ? new RodysseyChatProvider() : new MockChatProvider();
}
