/* eslint-disable @next/next/no-img-element */
import { forwardRef } from "react";
import { Camera, Compass, MapPin, Sparkles, Star } from "lucide-react";
import { categoryLabels } from "@/data/attractions";
import type { Attraction, Category, SessionState } from "@/lib/types";
import styles from "./travel-reporter.module.css";

const icons = { features: Camera, value: Star, location: MapPin, activities: Compass };
const connectors = ["First", "Second", "Next", "Finally"];

export const PosterCanvas = forwardRef<HTMLDivElement, { state: SessionState; attraction: Attraction }>(
  function PosterCanvas({ state, attraction }, ref) {
    const imageUrl = state.imageUrl;
    return (
      <div className={styles.posterCanvas} ref={ref} data-testid="poster-canvas" style={{ "--poster-accent": attraction.accent } as React.CSSProperties}>
        <div className={styles.posterBorder}>
          <header className={styles.posterHeader}>
            <span>Hong Kong Attractions</span>
            <h1>{attraction.shortName}</h1>
            <p>{attraction.district}</p>
          </header>

          <div className={`${styles.posterHero} ${!imageUrl ? styles.posterHeroEmpty : ""}`}>
            {imageUrl ? <img src={imageUrl} alt={`AI illustration for ${attraction.name}`} /> : <div><Sparkles size={42} /><strong>Your illustration will appear here</strong><span>Generate it after checking your report.</span></div>}
            {imageUrl && <small>AI-generated illustration</small>}
          </div>

          <div className={styles.posterInformation}>
            <div className={styles.posterFacts}>
              {(["features", "value", "location", "activities"] as Category[]).map((category) => {
                const Icon = icons[category];
                return (
                  <section key={category}>
                    <span className={styles.posterFactIcon}><Icon size={25} /></span>
                    <div><strong>{categoryLabels[category].short}</strong><p>{state.drafts[category]}</p></div>
                  </section>
                );
              })}
            </div>
            <div className={styles.posterMapColumn}>
              <section className={styles.posterMap}>
                <header>Location map</header>
                <div className={styles.mapTiles}>
                  {attraction.mapTiles.map((tile, index) => <img src={tile} alt="" key={tile} className={styles[`tile${index}`]} />)}
                  <span className={styles.mapPin} style={{ left: `${attraction.mapPin.x}%`, top: `${attraction.mapPin.y}%` }}><MapPin size={30} fill="currentColor" /></span>
                  <span className={styles.mapLabel}>{attraction.shortName}</span>
                </div>
                <small>© OpenStreetMap contributors</small>
              </section>
              <section className={styles.posterTip}><strong>Travel tip</strong><p>{attraction.transportTip}</p></section>
            </div>
          </div>

          <footer className={styles.posterFooter}>
            <span>Reported by {state.studentCode}</span>
            <span>{state.speakingOrder.map((category, index) => `${connectors[index]}: ${categoryLabels[category].short}`).join(" · ")}</span>
          </footer>
        </div>
      </div>
    );
  },
);
