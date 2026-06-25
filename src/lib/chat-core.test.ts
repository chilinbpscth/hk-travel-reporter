import { describe, expect, it } from "vitest";
import { buildGroundedResponse, classifyQuestion } from "@/lib/chat-core";
import { getAttraction } from "@/data/attractions";

describe("question classification", () => {
  it.each([
    ["Where is the Big Buddha?", "location"],
    ["What are its main features?", "features"],
    ["Why is it worth visiting?", "value"],
    ["What can visitors do there?", "activities"],
    ["Who won the football match?", "off_topic"],
  ])("classifies %s", (question, category) => {
    expect(classifyQuestion(question)).toBe(category);
  });
});

describe("grounded response", () => {
  it("returns only approved facts for the selected attraction", () => {
    const attraction = getAttraction("big-buddha")!;
    const allowed = new Set(attraction.facts.map((fact) => fact.id));
    const response = buildGroundedResponse("big-buddha", "features", []);
    expect(response.facts.length).toBeGreaterThan(0);
    expect(response.facts.every((fact) => allowed.has(fact.id))).toBe(true);
    expect(response.facts.every((fact) => fact.category === "features")).toBe(true);
  });

  it("does not expose facts for off-topic questions", () => {
    expect(buildGroundedResponse("big-buddha", "off_topic", []).facts).toEqual([]);
  });
});
