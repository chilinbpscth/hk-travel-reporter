"use client";
/* eslint-disable @next/next/no-img-element */

import { ArrowLeft, ArrowRight, Check, PenLine, Quote, Save } from "lucide-react";
import { categoryLabels, sentenceStarters } from "@/data/attractions";
import { hasAllDrafts } from "@/lib/session";
import type { Attraction, Category, Drafts, SessionState } from "@/lib/types";
import styles from "./travel-reporter.module.css";

export function ReportRoom({
  state,
  attraction,
  onDrafts,
  onBack,
  onContinue,
}: {
  state: SessionState;
  attraction: Attraction;
  onDrafts: (drafts: Drafts) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <main className={styles.contentPage}>
      <section className={styles.reviewHeading}>
        <div>
          <p className={styles.eyebrow}>The newsroom</p>
          <h1>Turn facts into your own report</h1>
          <p>Each group member writes one sentence. Press save on your box, then refresh to see the saved group work on this device.</p>
        </div>
        <div className={styles.reportTopic}><img src={attraction.image} alt="" /><span><small>Reporting on</small><strong>{attraction.name}</strong></span></div>
      </section>

      <section className={styles.reportLayoutSingle}>
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
              <blockquote><Quote size={15} /> {state.notes[category][0]?.text}</blockquote>
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
      </section>

      <div className={styles.actionRow}>
        <button className={styles.secondaryButton} type="button" onClick={onBack}><ArrowLeft size={18} /> Back to notes</button>
        <button className={styles.primaryButton} type="button" onClick={onContinue} disabled={!hasAllDrafts(state)}>Open poster studio <ArrowRight size={18} /></button>
      </div>
    </main>
  );
}
