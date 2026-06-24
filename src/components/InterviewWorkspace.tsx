"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, LoaderCircle, MapPinned, NotebookPen, Send, Sparkles } from "lucide-react";
import { categoryLabels } from "@/data/attractions";
import { hasAllNotes } from "@/lib/session";
import type { Attraction, Category, ChatMessage, ChatResponse, Fact, SessionState } from "@/lib/types";
import { MiniLessonPanel } from "./WelcomeLearn";
import styles from "./travel-reporter.module.css";

export function InterviewWorkspace({
  state,
  attraction,
  onMessages,
  onSaveFact,
  onAssignFact,
  onContinue,
}: {
  state: SessionState;
  attraction: Attraction;
  onMessages: (messages: ChatMessage[]) => void;
  onSaveFact: (fact: Pick<Fact, "id" | "text" | "category">) => void;
  onAssignFact: (category: Category, id: string) => void;
  onContinue: () => void;
}) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const chatLogRef = useRef<HTMLDivElement>(null);
  const savedIds = new Set([...state.savedFacts, ...Object.values(state.notes).flat()].map((fact) => fact.id));
  const shownFactIds = state.messages.flatMap((item) => item.facts?.map((fact) => fact.id) ?? []);

  useEffect(() => {
    const log = chatLogRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [state.messages]);

  async function sendQuestion(question = message) {
    const clean = question.trim();
    if (!clean || sending) return;
    setSending(true);
    setError("");
    const studentMessage: ChatMessage = { id: crypto.randomUUID(), role: "student", text: clean };
    const nextMessages = [...state.messages, studentMessage];
    onMessages(nextMessages);
    setMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: state.sessionId,
          attractionId: attraction.id,
          message: clean,
          shownFactIds,
        }),
      });
      if (!response.ok) throw new Error("Chat failed");
      const data = (await response.json()) as ChatResponse;
      onMessages([
        ...nextMessages,
        { id: crypto.randomUUID(), role: "guide", text: data.reply, facts: data.facts },
      ]);
    } catch {
      setError("The local guide could not answer. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className={styles.workspacePage}>
      <MiniLessonPanel attraction={attraction} />
      <section className={styles.workspaceTitle}>
        <div>
          <p className={styles.eyebrow}>Field interview</p>
          <h1>Interview your local guide</h1>
          <p>Ask questions, read carefully and save useful facts to your notebook.</p>
        </div>
        <div className={styles.topicBadge}>
          <MapPinned size={22} />
          <span><small>Researching</small><strong>{attraction.shortName}</strong></span>
        </div>
      </section>

      <section className={styles.interviewGrid}>
        <div className={styles.chatPanel}>
          <div className={styles.panelHeading}>
            <span className={styles.guideAvatar}>HK</span>
            <span><strong>Local guide</strong><small>Answers use teacher-approved facts</small></span>
            <span className={styles.onlineDot}>Online</span>
          </div>
          <div className={styles.chatLog} ref={chatLogRef} aria-live="polite">
            {state.messages.map((item) => (
              <article key={item.id} className={`${styles.chatMessage} ${item.role === "student" ? styles.studentMessage : styles.guideMessage}`}>
                <span className={styles.messageRole}>{item.role === "student" ? "You" : "Local guide"}</span>
                <p>{item.text}</p>
                {item.facts?.map((fact) => {
                  const saved = savedIds.has(fact.id);
                  return (
                    <div className={styles.factCard} key={fact.id}>
                      <span>{fact.text}</span>
                      <button type="button" onClick={() => onSaveFact(fact)} disabled={saved}>
                        {saved ? <><Check size={16} /> Saved</> : <><NotebookPen size={16} /> Save fact</>}
                      </button>
                    </div>
                  );
                })}
              </article>
            ))}
            {sending && <div className={styles.typing}><LoaderCircle size={17} className={styles.spinner} /> The guide is checking the research notes…</div>}
          </div>
          <form className={styles.chatComposer} onSubmit={(event) => { event.preventDefault(); sendQuestion(); }}>
            <label htmlFor="question">Ask your own question</label>
            <div>
              <input id="question" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="What would you like to know?" />
              <button type="submit" aria-label="Send question" disabled={!message.trim() || sending}><Send size={19} /></button>
            </div>
            {error && <p className={styles.errorText}>{error}</p>}
          </form>
        </div>

        <aside className={styles.notebookPanel}>
          <div className={styles.notebookBinding} aria-hidden="true" />
          <div className={styles.notebookHeader}>
            <div><NotebookPen size={23} /><span><strong>Reporter&apos;s Notebook</strong><small>Collect one fact in each section.</small></span></div>
            <span>{savedIds.size} saved</span>
          </div>
          <section className={styles.factTray} aria-label="Saved fact cards">
            <strong>Saved fact cards</strong>
            <p>Drag each card into the best notebook section.</p>
            {state.savedFacts.length ? state.savedFacts.map((fact) => (
              <button
                type="button"
                className={styles.draggableFact}
                key={fact.id}
                data-testid={`saved-fact-${fact.id}`}
                draggable
                onDragStart={(event) => event.dataTransfer.setData("text/plain", fact.id)}
              >
                {fact.text}
              </button>
            )) : <p className={styles.emptyNote}>Save facts from the chat first.</p>}
          </section>
          <div className={styles.noteSections}>
            {Object.entries(categoryLabels).map(([category, label]) => {
              const facts = state.notes[category as keyof typeof state.notes];
              return (
                <section
                  key={category}
                  className={styles.noteSection}
                  data-testid={`drop-${category}`}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    onAssignFact(category as Category, event.dataTransfer.getData("text/plain"));
                  }}
                >
                  <header><span>{label.short}</span>{facts.length > 0 && <Check size={17} />}</header>
                  {facts.length ? facts.map((fact) => (
                    <button
                      type="button"
                      className={styles.droppedFact}
                      key={fact.id}
                      data-testid={`placed-fact-${fact.id}`}
                      draggable
                      onDragStart={(event) => event.dataTransfer.setData("text/plain", fact.id)}
                    >
                      {fact.text}
                    </button>
                  )) : <p className={styles.emptyNote}>Drop a fact here.</p>}
                </section>
              );
            })}
          </div>
          <button className={styles.primaryButton} type="button" onClick={onContinue} disabled={!hasAllNotes(state)}>
            Review my notes <ArrowRight size={18} />
          </button>
          {!hasAllNotes(state) && <p className={styles.notebookHint}><Sparkles size={15} /> Ask about all four topics to continue.</p>}
        </aside>
      </section>
    </main>
  );
}
