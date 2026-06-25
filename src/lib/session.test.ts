import { describe, expect, it } from "vitest";
import { createEmptySession, hasAllDrafts, readStoredSession } from "@/lib/session";

describe("session state", () => {
  it("restores a versioned session", () => {
    const session = createEmptySession("abc");
    session.studentCode = "4A-12";
    expect(readStoredSession(JSON.stringify(session))?.studentCode).toBe("4A-12");
    expect(readStoredSession("not-json")).toBeNull();
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
