"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { ArrowLeft, Download, Expand, ImageIcon, LoaderCircle, Printer, RefreshCw } from "lucide-react";
import type { Attraction, ImageResponse, SessionState } from "@/lib/types";
import { PosterCanvas } from "./PosterCanvas";
import styles from "./travel-reporter.module.css";

export function PosterStudio({
  state,
  attraction,
  onImage,
  onBack,
}: {
  state: SessionState;
  attraction: Attraction;
  onImage: (imageUrl: string, attemptsUsed: number) => void;
  onBack: () => void;
}) {
  const posterRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const remaining = Math.max(0, 3 - state.imageAttemptsUsed);

  async function generateIllustration() {
    if (remaining <= 0 || generating) return;
    setGenerating(true);
    setError("");
    try {
      const selectedFactIds = state.savedFacts.map((fact) => fact.id);
      const response = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: state.sessionId, attractionId: attraction.id, selectedFactIds }),
      });
      if (!response.ok) throw new Error("Image failed");
      const data = (await response.json()) as ImageResponse;
      onImage(data.imageUrl, 3 - data.remainingAttempts);
    } catch {
      setError("The illustration could not be generated. Your text poster is still ready.");
    } finally {
      setGenerating(false);
    }
  }

  async function downloadPoster() {
    if (!posterRef.current || exporting) return;
    setExporting(true);
    setError("");
    try {
      const dataUrl = await toPng(posterRef.current, { pixelRatio: 1.5625, cacheBust: true, backgroundColor: "#f8f1dc" });
      const link = document.createElement("a");
      link.download = `${attraction.id}-${state.studentCode || "reporter"}-poster.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      setError("The poster could not be downloaded. You can still print it.");
    } finally {
      setExporting(false);
    }
  }

  async function present() {
    if (posterRef.current?.requestFullscreen) await posterRef.current.requestFullscreen();
  }

  return (
    <main className={styles.posterStudio}>
      <section className={styles.posterControls}>
        <p className={styles.eyebrow}>Poster studio</p>
        <h1>Your report is ready for the front page.</h1>
        <p>The illustration is generated separately. Your English and map stay clear and accurate.</p>

        <div className={styles.generationCard}>
          <span className={styles.generationIcon}><ImageIcon size={24} /></span>
          <div><strong>{state.imageUrl ? "Illustration ready" : "Generate your illustration"}</strong><p>R&apos;Odyssey adapter · no text, maps or logos in the image</p></div>
          <span className={styles.attemptBadge}>{remaining} left</span>
        </div>
        <button className={styles.primaryButton} type="button" onClick={generateIllustration} disabled={generating || remaining === 0}>
          {generating ? <><LoaderCircle className={styles.spinner} size={19} /> Drawing your illustration…</> : state.imageUrl ? <><RefreshCw size={18} /> Generate another</> : <><ImageIcon size={18} /> Generate illustration</>}
        </button>
        {error && <p className={styles.errorText}>{error}</p>}

        <div className={styles.posterActions}>
          <button type="button" onClick={downloadPoster} disabled={exporting}>{exporting ? <LoaderCircle className={styles.spinner} size={18} /> : <Download size={18} />} Download PNG</button>
          <button type="button" onClick={() => window.print()}><Printer size={18} /> Print A4</button>
          <button type="button" onClick={present}><Expand size={18} /> Present</button>
        </div>
        <button className={styles.textButton} type="button" onClick={onBack}><ArrowLeft size={17} /> Edit my report</button>

        <div className={styles.completionNote}>
          <strong>Classroom next step</strong>
          <p>Share the poster with your group. Use First, Second, Next and Finally to introduce the four 4R sections.</p>
        </div>
      </section>

      <section className={styles.posterPreview} aria-label="A4 poster preview">
        <PosterCanvas ref={posterRef} state={state} attraction={attraction} />
      </section>
    </main>
  );
}
