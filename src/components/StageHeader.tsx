import { BookOpen, FileText, MessageCircle, Newspaper, RotateCcw } from "lucide-react";
import type { Stage } from "@/lib/types";
import styles from "./travel-reporter.module.css";

const steps: { id: Exclude<Stage, "welcome">; label: string; icon: typeof BookOpen }[] = [
  { id: "interview", label: "4R Interview", icon: MessageCircle },
  { id: "report", label: "Report", icon: FileText },
  { id: "poster", label: "Poster", icon: Newspaper },
];

export function StageHeader({
  stage,
  studentCode,
  onReset,
}: {
  stage: Stage;
  studentCode: string;
  onReset: () => void;
}) {
  if (stage === "welcome") return null;
  const active = steps.findIndex((step) => step.id === stage);

  return (
    <header className={styles.appHeader}>
      <div className={styles.wordmark}>
        <span className={styles.wordmarkMark}>HK</span>
        <span>
          <strong>Travel Reporter</strong>
          <small>{studentCode}</small>
        </span>
      </div>
      <nav className={styles.progress} aria-label="Project progress">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const state = index < active ? "done" : index === active ? "active" : "upcoming";
          return (
            <div key={step.id} className={`${styles.progressStep} ${styles[state]}`} aria-current={state === "active" ? "step" : undefined}>
              <span className={styles.progressIcon}><Icon size={17} strokeWidth={2.2} /></span>
              <span>{step.label}</span>
            </div>
          );
        })}
      </nav>
      <button className={styles.resetButton} type="button" onClick={onReset} title="Start again">
        <RotateCcw size={17} />
        Reset
      </button>
    </header>
  );
}
