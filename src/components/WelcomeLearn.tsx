/* eslint-disable @next/next/no-img-element */
import { ArrowRight, BookOpenText, MapPin, MessageSquareText, Mic2, Newspaper } from "lucide-react";
import { attractions, categoryLabels, sentenceStarters } from "@/data/attractions";
import type { Attraction, Category } from "@/lib/types";
import styles from "./travel-reporter.module.css";

export function WelcomeStep({
  studentCode,
  attractionId,
  onStudentCode,
  onAttraction,
  onContinue,
}: {
  studentCode: string;
  attractionId: string;
  onStudentCode: (value: string) => void;
  onAttraction: (id: string) => void;
  onContinue: () => void;
}) {
  return (
    <main className={styles.welcomePage}>
      <section className={styles.welcomeHero}>
        <div className={styles.welcomeCopy}>
          <p className={styles.eyebrow}>English field mission · Hong Kong</p>
          <h1>Become a<br /><em>Travel Reporter</em></h1>
          <p className={styles.heroLead}>
            Interview a Hong Kong local, collect useful facts, write your own report and create an attraction poster.
          </p>
          <div className={styles.missionStrip}>
            <span><MessageSquareText size={20} /> Interview</span>
            <span><BookOpenText size={20} /> Take notes</span>
            <span><Mic2 size={20} /> Report</span>
            <span><Newspaper size={20} /> Make a poster</span>
          </div>
        </div>
        <div className={styles.startCard}>
          <p className={styles.cardKicker}>Reporter check-in</p>
          <fieldset className={styles.groupFieldset}>
            <legend>Choose your group</legend>
            <div className={styles.groupChoices}>
              {["Group 1", "Group 2", "Group 3", "Group 4", "Group 5", "Group 6"].map((group) => (
                <button
                  key={group}
                  type="button"
                  className={`${styles.groupChoice} ${studentCode === group ? styles.selectedChoice : ""}`}
                  onClick={() => onStudentCode(group)}
                  aria-pressed={studentCode === group}
                >
                  {group}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className={styles.attractionFieldset}>
            <legend>Choose one attraction</legend>
            <div className={styles.attractionChoices}>
              {attractions.map((attraction) => (
                <button
                  key={attraction.id}
                  type="button"
                  className={`${styles.attractionChoice} ${attractionId === attraction.id ? styles.selectedChoice : ""}`}
                  onClick={() => onAttraction(attraction.id)}
                  aria-pressed={attractionId === attraction.id}
                >
                  <img src={attraction.image} alt="" />
                  <span><strong>{attraction.shortName}</strong><small>{attraction.district}</small></span>
                </button>
              ))}
            </div>
          </fieldset>
          <button
            className={styles.primaryButton}
            type="button"
            onClick={onContinue}
            disabled={!studentCode.trim() || !attractionId}
          >
            Start the mission <ArrowRight size={19} />
          </button>
          <p className={styles.privacyNote}>Your progress stays on this device.</p>
        </div>
      </section>
    </main>
  );
}

export function LearnStep({ attraction, onContinue }: { attraction: Attraction; onContinue: () => void }) {
  const order: Category[] = ["location", "features", "value", "activities"];
  return (
    <main className={styles.contentPage}>
      <section className={styles.lessonIntro}>
        <div>
          <p className={styles.eyebrow}>Mini lesson · 3 minutes</p>
          <h1>How do reporters introduce a place?</h1>
          <p>A clear attraction report answers four questions. Read each sentence frame before your interview.</p>
        </div>
        <div className={styles.lessonAttraction} style={{ "--accent": attraction.accent } as React.CSSProperties}>
          <img src={attraction.image} alt={attraction.name} />
          <span><small>Your topic</small><strong>{attraction.name}</strong><em>{attraction.district}</em></span>
        </div>
      </section>

      <section className={styles.frameGrid}>
        {order.map((category, index) => (
          <article className={styles.frameCard} key={category}>
            <span className={styles.frameNumber}>0{index + 1}</span>
            <p>{categoryLabels[category].title}</p>
            <strong>{sentenceStarters[category]}<mark>______</mark>.</strong>
          </article>
        ))}
      </section>

      <section className={styles.lessonExample}>
        <MapPin size={24} />
        <div>
          <span>Model sentence</span>
          <p><strong>It is located in</strong> Ngong Ping on Lantau Island.</p>
        </div>
        <button className={styles.primaryButton} type="button" onClick={onContinue}>
          Meet the local guide <ArrowRight size={19} />
        </button>
      </section>
    </main>
  );
}

export function MiniLessonPanel({ attraction }: { attraction: Attraction }) {
  const order: Category[] = ["location", "features", "value", "activities"];
  return (
    <section className={styles.inlineLesson}>
      <div className={styles.inlineLessonHeader}>
        <div>
          <p className={styles.eyebrow}>4R mini lesson</p>
          <h2>Read · Research · Record · Report</h2>
          <p>Use these four sentence frames when you interview the local guide.</p>
        </div>
        <div className={styles.lessonAttraction} style={{ "--accent": attraction.accent } as React.CSSProperties}>
          <img src={attraction.image} alt={attraction.name} />
          <span><small>Your topic</small><strong>{attraction.name}</strong><em>{attraction.district}</em></span>
        </div>
      </div>
      <div className={styles.frameGrid}>
        {order.map((category, index) => (
          <article className={styles.frameCard} key={category}>
            <span className={styles.frameNumber}>0{index + 1}</span>
            <p>{categoryLabels[category].title}</p>
            <strong>{sentenceStarters[category]}<mark>______</mark>.</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
