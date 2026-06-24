"use client";

import { useEffect, useMemo, useState } from "react";
import { attractions, getAttraction } from "@/data/attractions";
import { createEmptySession, readStoredSession, STORAGE_KEY } from "@/lib/session";
import type { Category, ChatMessage, Fact, SessionState, Stage } from "@/lib/types";
import { StageHeader } from "./StageHeader";
import { WelcomeStep } from "./WelcomeLearn";
import { InterviewWorkspace } from "./InterviewWorkspace";
import { NotesReview } from "./NotesReview";
import { ReportRoom } from "./ReportRoom";
import { PosterStudio } from "./PosterStudio";
import styles from "./travel-reporter.module.css";

export default function TravelReporterApp() {
  const [state, setState] = useState<SessionState>(() => createEmptySession());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const restored = readStoredSession(window.localStorage.getItem(STORAGE_KEY));
      setState(restored ?? createEmptySession(crypto.randomUUID()));
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const attraction = useMemo(() => getAttraction(state.attractionId) ?? attractions[0], [state.attractionId]);

  function patchState(patch: Partial<SessionState>) {
    setState((current) => ({ ...current, ...patch }));
  }

  function setStage(stage: Stage) {
    patchState({ stage });
  }

  function startInterview() {
    const welcome: ChatMessage = {
      id: crypto.randomUUID(),
      role: "guide",
      text: `Hello! I am a Hong Kong local guide. You are researching ${attraction.name}. What would you like to know?`,
    };
    patchState({ stage: "interview", messages: state.messages.length ? state.messages : [welcome] });
  }

  function saveFact(fact: Pick<Fact, "id" | "text" | "category">) {
    const fullFact = attraction.facts.find((candidate) => candidate.id === fact.id);
    if (!fullFact) return;
    setState((current) => {
      if (current.savedFacts.some((item) => item.id === fullFact.id)) return current;
      if (Object.values(current.notes).flat().some((item) => item.id === fullFact.id)) return current;
      return { ...current, savedFacts: [...current.savedFacts, fullFact] };
    });
  }

  function assignFact(category: Category, id: string) {
    setState((current) => {
      const fact = current.savedFacts.find((item) => item.id === id) ?? Object.values(current.notes).flat().find((item) => item.id === id);
      if (!fact) return current;
      const nextNotes = {
        location: current.notes.location.filter((item) => item.id !== id),
        features: current.notes.features.filter((item) => item.id !== id),
        value: current.notes.value.filter((item) => item.id !== id),
        activities: current.notes.activities.filter((item) => item.id !== id),
      };
      return {
        ...current,
        savedFacts: current.savedFacts.filter((item) => item.id !== id),
        notes: { ...nextNotes, [category]: [...nextNotes[category], fact] },
      };
    });
  }

  function removeFact(category: Category, id: string) {
    setState((current) => ({
      ...current,
      notes: { ...current.notes, [category]: current.notes[category].filter((fact) => fact.id !== id) },
      savedFacts: [...current.savedFacts, ...current.notes[category].filter((fact) => fact.id === id)],
    }));
  }

  function reset() {
    if (!window.confirm("Start a new mission? Your current work will be cleared.")) return;
    window.localStorage.removeItem(STORAGE_KEY);
    setState(createEmptySession(crypto.randomUUID()));
  }

  if (!hydrated) {
    return <div className={styles.loadingPage}><div className={styles.loadingStamp}>Preparing your press pass…</div></div>;
  }

  return (
    <div className={styles.appShell}>
      <StageHeader stage={state.stage} studentCode={state.studentCode} onReset={reset} />
      {state.stage === "welcome" && (
        <WelcomeStep
          studentCode={state.studentCode}
          attractionId={state.attractionId}
          onStudentCode={(studentCode) => patchState({ studentCode })}
          onAttraction={(attractionId) => patchState({ attractionId })}
          onContinue={startInterview}
        />
      )}
      {state.stage === "interview" && (
        <InterviewWorkspace
          state={state}
          attraction={attraction}
          onMessages={(messages) => patchState({ messages })}
          onSaveFact={saveFact}
          onAssignFact={assignFact}
          onContinue={() => setStage("notes")}
        />
      )}
      {state.stage === "notes" && (
        <NotesReview
          state={state}
          attraction={attraction}
          onRemove={removeFact}
          onAssignFact={assignFact}
          onBack={() => setStage("interview")}
          onContinue={() => setStage("report")}
        />
      )}
      {state.stage === "report" && (
        <ReportRoom
          state={state}
          attraction={attraction}
          onDrafts={(drafts) => patchState({ drafts })}
          onBack={() => setStage("notes")}
          onContinue={() => setStage("poster")}
        />
      )}
      {state.stage === "poster" && (
        <PosterStudio
          state={state}
          attraction={attraction}
          onImage={(imageUrl, imageAttemptsUsed) => patchState({ imageUrl, imageAttemptsUsed })}
          onBack={() => setStage("report")}
        />
      )}
    </div>
  );
}
