"use client";
/* eslint-disable @next/next/no-img-element */

import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, PenLine, Quote } from "lucide-react";
import { categoryLabels, sentenceStarters } from "@/data/attractions";
import { hasAllDrafts } from "@/lib/session";
import type { Attraction, Category, Drafts, SessionState } from "@/lib/types";
import styles from "./travel-reporter.module.css";

const connectors = ["First", "Second", "Next", "Finally"];

export function ReportRoom({
  state,
  attraction,
  onDrafts,
  onOrder,
  onBack,
  onContinue,
}: {
  state: SessionState;
  attraction: Attraction;
  onDrafts: (drafts: Drafts) => void;
  onOrder: (order: Category[]) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  function move(category: Category, direction: -1 | 1) {
    const currentIndex = state.speakingOrder.indexOf(category);
    const nextIndex = currentIndex + direction;
    if (nextIndex < 0 || nextIndex >= state.speakingOrder.length) return;
    const next = [...state.speakingOrder];
    [next[currentIndex], next[nextIndex]] = [next[nextIndex], next[currentIndex]];
    onOrder(next);
  }

  return (
    <main className={styles.contentPage}>
      <section className={styles.reviewHeading}>
        <div>
          <p className={styles.eyebrow}>The newsroom</p>
          <h1>Turn facts into your own report</h1>
          <p>Use the sentence frames, but write the information in your own way. Then choose your speaking order.</p>
        </div>
        <div className={styles.reportTopic}><img src={attraction.image} alt="" /><span><small>Reporting on</small><strong>{attraction.name}</strong></span></div>
      </section>

      <section className={styles.reportLayout}>
        <div className={styles.writingDesk}>
          {(Object.keys(categoryLabels) as Category[]).map((category) => (
            <article className={styles.writingCard} key={category}>
              <header><PenLine size={19} /><span><small>{categoryLabels[category].title}</small><strong>{categoryLabels[category].short}</strong></span></header>
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

        <aside className={styles.runOrder}>
          <p className={styles.cardKicker}>Speaking order</p>
          <h2>Plan your report</h2>
          <p>Move the sections into a clear order. The linking words will be added to your speaking card.</p>
          <ol>
            {state.speakingOrder.map((category, index) => (
              <li key={category}>
                <span className={styles.connector}>{connectors[index]}</span>
                <strong>{categoryLabels[category].short}</strong>
                <span className={styles.orderButtons}>
                  <button type="button" onClick={() => move(category, -1)} disabled={index === 0} aria-label={`Move ${categoryLabels[category].short} up`}><ArrowUp size={16} /></button>
                  <button type="button" onClick={() => move(category, 1)} disabled={index === state.speakingOrder.length - 1} aria-label={`Move ${categoryLabels[category].short} down`}><ArrowDown size={16} /></button>
                </span>
              </li>
            ))}
          </ol>
          <div className={styles.speakingPreview}>
            <span>Speaking preview</span>
            {state.speakingOrder.map((category, index) => (
              <p key={category}><strong>{connectors[index]},</strong> {state.drafts[category] || "your sentence will appear here"}</p>
            ))}
          </div>
        </aside>
      </section>

      <div className={styles.actionRow}>
        <button className={styles.secondaryButton} type="button" onClick={onBack}><ArrowLeft size={18} /> Back to notes</button>
        <button className={styles.primaryButton} type="button" onClick={onContinue} disabled={!hasAllDrafts(state)}>Open poster studio <ArrowRight size={18} /></button>
      </div>
    </main>
  );
}
