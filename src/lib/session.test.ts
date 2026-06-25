import { describe, expect, it } from "vitest";
import { createEmptySession, hasAllDrafts, hasAllNotes, readStoredSession } from "@/lib/session";
import { getAttraction } from "@/data/attractions";

describe("session state", () => {
  it("restores a versioned session", () => {
    const session = createEmptySession("abc");
    session.studentCode = "4A-12";
    expect(readStoredSession(JSON.stringify(session))?.studentCode).toBe("4A-12");
    expect(readStoredSession("not-json")).toBeNull();
  });

  it("requires all four note categories", () => {
    const session = createEmptySession("abc");
    const attraction = getAttraction("big-buddha")!;
    for (const category of ["location", "features", "value", "activities"] as const) {
      session.notes[category] = [attraction.facts.find((fact) => fact.category === category)!];
    }
    expect(hasAllNotes(session)).toBe(true);
  });

  it("requires four student-written sentences", () => {
    const session = createEmptySession("abc");
    session.drafts = {
      location: "It is located on Lantau Island.",
      features: "It is famous for a bronze statue.",
      value: "It is worth visiting because it is peaceful.",
      activities: "Visitors can climb the steps.",
    };
    expect(hasAllDrafts(session)).toBe(true);
  });
});
