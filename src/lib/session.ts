import type { Category, SessionState } from "@/lib/types";

export const STORAGE_KEY = "hk-travel-reporter-session-v1";

export function createEmptySession(sessionId = "pending"): SessionState {
  return {
    version: 1,
    sessionId,
    studentCode: "",
    attractionId: "",
    stage: "welcome",
    messages: [],
    savedFacts: [],
    notes: { location: [], features: [], value: [], activities: [] },
    drafts: { location: "", features: "", value: "", activities: "" },
    speakingOrder: ["location", "features", "value", "activities"],
    imageUrl: "",
    imageAttemptsUsed: 0,
  };
}

export function readStoredSession(value: string | null): SessionState | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<SessionState>;
    if (parsed.version !== 1 || typeof parsed.sessionId !== "string") return null;
    return { ...createEmptySession(parsed.sessionId), ...parsed } as SessionState;
  } catch {
    return null;
  }
}

export function hasAllNotes(state: SessionState) {
  return (Object.keys(state.notes) as Category[]).every((category) => state.notes[category].length > 0);
}

export function hasAllDrafts(state: SessionState) {
  return (Object.keys(state.drafts) as Category[]).every((category) => state.drafts[category].trim().length >= 8);
}
