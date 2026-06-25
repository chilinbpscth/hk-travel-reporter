"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, ExternalLink, LoaderCircle, MapPinned, NotebookPen, PenLine, Quote, Save, Send } from "lucide-react";
import { categoryLabels, sentenceStarters } from "@/data/attractions";
import { hasAllDrafts } from "@/lib/session";
import type { Attraction, Category, ChatMessage, ChatResponse, Drafts, Fact, SessionState } from "@/lib/types";
import { MiniLessonPanel } from "./WelcomeLearn";
import styles from "./travel-reporter.module.css";

export function InterviewWorkspace({
  state,
  attraction,
  onMessages,
  onSaveFact,
  onDrafts,
  onContinue,
}: {
  state: SessionState;
  attraction: Attraction;
  onMessages: (messages: ChatMessage[]) => void;
  onSaveFact: (fact: Pick<Fact, "id" | "text" | "category">) => void;
  onDrafts: (drafts: Drafts) => void;
  onContinue: () => void;
}) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const chatLogRef = useRef<HTMLDivElement>(null);
  const savedIds = new Set(state.savedFacts.map((fact) => fact.id));
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
          <p>Ask questions, save useful notes, then use the notes to write four reporter sentences.</p>
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
          <section className={styles.savedNotesPanel} aria-label="Saved notes">
            <strong>Saved notes</strong>
            <p>Read these notes and choose the useful details for your four sentences.</p>
            {state.savedFacts.length ? state.savedFacts.map((fact) => (
              <p
                className={styles.savedNote}
                key={fact.id}
                data-testid={`saved-fact-${fact.id}`}
              >
                {fact.text}
              </p>
            )) : <p className={styles.emptyNote}>Save facts from the chat first.</p>}
          </section>
          <section className={styles.notebookSupport}>
            <div className={styles.vocabularyMini}>
              <strong>Useful words</strong>
              <div>
                {attraction.vocabulary.map((item) => <span key={item.word} title={item.meaning}>{item.word}</span>)}
              </div>
            </div>
            <details className={styles.sourceMini}>
              <summary>Teacher source record · {attraction.sources.length} approved sources</summary>
              {attraction.sources.map((source) => (
                <a href={source.url} target="_blank" rel="noreferrer" key={source.id}>
                  {source.label} <ExternalLink size={12} /> <span>Checked {source.accessed}</span>
                </a>
              ))}
            </details>
          </section>
        </aside>
      </section>

      <section className={styles.inlineWritingSection}>
        <div className={styles.reviewHeading}>
          <div>
            <p className={styles.eyebrow}>The newsroom</p>
            <h1>Write from your saved notes</h1>
            <p>Look back at your saved notes. Choose the useful details and write one sentence for each 4R question.</p>
          </div>
          <div className={styles.reportTopic}><img src={attraction.image} alt="" /><span><small>Reporting on</small><strong>{attraction.name}</strong></span></div>
        </div>

        <div className={styles.writingDesk}>
          {(Object.keys(categoryLabels) as Category[]).map((category) => (
            <article className={styles.writingCard} key={category}>
              <header>
                <PenLine size={19} />
                <span><small>{categoryLabels[category].title}</small><strong>{categoryLabels[category].short}</strong></span>
                <button
                  className={styles.saveDraftButton}
                  type="button"
                  onClick={() => onDrafts({ ...state.drafts })}
                  aria-label={`Save ${categoryLabels[category].short} sentence`}
                >
                  {state.drafts[category].trim() ? <Check size={16} /> : <Save size={16} />}
                  Save
                </button>
              </header>
              <blockquote><Quote size={15} /> Choose a useful detail from your saved notes.</blockquote>
              <div className={styles.starterRow}>
                <span>Sentence starter</span>
                <button
                  type="button"
                  onClick={() => {
                    if (!state.drafts[category]) onDrafts({ ...state.drafts, [category]: sentenceStarters[category] });
                  }}
                >
                  {sentenceStarters[category]}…
                </button>
              </div>
              <label htmlFor={`draft-${category}`}>Your sentence</label>
              <textarea
                id={`draft-${category}`}
                value={state.drafts[category]}
                onChange={(event) => onDrafts({ ...state.drafts, [category]: event.target.value })}
                placeholder={`${sentenceStarters[category]}…`}
                rows={3}
              />
              <small className={styles.characterCount}>{state.drafts[category].trim().length} characters</small>
            </article>
          ))}
        </div>

        <div className={styles.actionRow}>
          <p className={styles.notebookHint}>Need more information? Ask the local guide again and save more notes.</p>
          <button className={styles.primaryButton} type="button" onClick={onContinue} disabled={!hasAllDrafts(state)}>
            Open poster studio <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </main>
  );
}
