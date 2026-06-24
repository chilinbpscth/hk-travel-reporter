import { ArrowLeft, ArrowRight, CheckCircle2, ExternalLink, Trash2 } from "lucide-react";
import { categoryLabels } from "@/data/attractions";
import type { Attraction, Category, SessionState } from "@/lib/types";
import styles from "./travel-reporter.module.css";

export function NotesReview({
  state,
  attraction,
  onRemove,
  onAssignFact,
  onBack,
  onContinue,
}: {
  state: SessionState;
  attraction: Attraction;
  onRemove: (category: Category, id: string) => void;
  onAssignFact: (category: Category, id: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <main className={styles.contentPage}>
      <section className={styles.reviewHeading}>
        <div>
          <p className={styles.eyebrow}>Editor&apos;s desk</p>
          <h1>Check your research notes</h1>
          <p>Drag saved fact cards into the four 4R sections. Each fact came from the approved attraction database.</p>
        </div>
        <div className={styles.approvedStamp}><CheckCircle2 size={25} /><span><strong>Source-grounded</strong><small>{attraction.sources.length} approved sources</small></span></div>
      </section>

      <section className={styles.factTray}>
        <strong>Saved fact cards</strong>
        <p>Drag these into the correct section before writing your report.</p>
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
        )) : <p className={styles.emptyNote}>All saved facts are already placed.</p>}
      </section>

      <section className={styles.reviewGrid}>
        {(Object.keys(categoryLabels) as Category[]).map((category) => (
          <article
            className={styles.reviewCard}
            key={category}
            data-testid={`drop-${category}`}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              onAssignFact(category, event.dataTransfer.getData("text/plain"));
            }}
          >
            <header><small>{categoryLabels[category].title}</small><strong>{categoryLabels[category].short}</strong></header>
            <div>
              {state.notes[category].map((fact) => (
                <p key={fact.id}><span>{fact.text}</span><button type="button" onClick={() => onRemove(category, fact.id)} aria-label={`Remove ${fact.text}`}><Trash2 size={16} /></button></p>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className={styles.vocabularyBar}>
        <div><strong>Useful words</strong><span>Tap into these during your report.</span></div>
        {attraction.vocabulary.map((item) => <span className={styles.vocabChip} key={item.word} title={item.meaning}>{item.word}</span>)}
      </section>

      <details className={styles.sourceDetails}>
        <summary>Teacher source record</summary>
        {attraction.statusNotice && <p className={styles.statusNotice}>{attraction.statusNotice}</p>}
        <ul>{attraction.sources.map((source) => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.label} <ExternalLink size={13} /></a><span>Checked {source.accessed}</span></li>)}</ul>
      </details>

      <div className={styles.actionRow}>
        <button className={styles.secondaryButton} type="button" onClick={onBack}><ArrowLeft size={18} /> Back to interview</button>
        <button className={styles.primaryButton} type="button" onClick={onContinue}>Write my report <ArrowRight size={18} /></button>
      </div>
    </main>
  );
}
