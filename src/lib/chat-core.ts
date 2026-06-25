import { categoryLabels, getAttraction } from "@/data/attractions";
import type { Category, ChatCategory, ChatResponse } from "@/lib/types";

const intentKeywords: Record<Category, string[]> = {
  location: ["where", "location", "located", "address", "find", "get there", "which district", "which island"],
  features: ["feature", "special", "famous", "look like", "what is it", "main", "tall", "high", "unique"],
  value: ["why", "worth", "reason", "important", "recommend", "should", "interesting"],
  activities: ["do there", "can visitors", "activity", "activities", "take photo", "see there", "what can", "things to do"],
};

export function classifyQuestion(message: string): ChatCategory {
  const normalised = message.toLowerCase().replace(/[?!.]/g, " ").replace(/\s+/g, " ").trim();
  const scores = Object.entries(intentKeywords).map(([category, keywords]) => ({
    category: category as Category,
    score: keywords.reduce((total, keyword) => total + (normalised.includes(keyword) ? keyword.length : 0), 0),
  }));
  scores.sort((a, b) => b.score - a.score);
  return scores[0]?.score > 0 ? scores[0].category : "off_topic";
}

const replyOpeners: Record<Category, string> = {
  location: "Here is where you can find it.",
  features: "These are two details that make it special.",
  value: "These details explain why people find it meaningful.",
  activities: "Here are some things visitors can do.",
};

export function buildGroundedResponse(
  attractionId: string,
  category: ChatCategory,
  shownFactIds: string[],
): ChatResponse {
  const attraction = getAttraction(attractionId);
  if (!attraction) {
    throw new Error("Unknown attraction");
  }

  if (category === "off_topic") {
    return {
      category,
      reply:
        "I only have research notes about this attraction. Ask me where it is, what is special, why people visit, or what visitors can do.",
      facts: [],
    };
  }

  const categoryFacts = attraction.facts.filter((fact) => fact.category === category);
  const unseenFacts = categoryFacts.filter((fact) => !shownFactIds.includes(fact.id));
  const facts = (unseenFacts.length > 0 ? unseenFacts : categoryFacts).slice(0, 2);

  return {
    category,
    reply: `${replyOpeners[category]} Choose the most useful fact for your reporter's notebook.`,
    facts: facts.map(({ id, text, category: factCategory }) => ({ id, text, category: factCategory })),
  };
}

export function validQuestionPrompts() {
  return Object.values(categoryLabels).map((item) => item.question);
}
