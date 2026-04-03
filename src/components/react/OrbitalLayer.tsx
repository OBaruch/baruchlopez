import { useEffect, useState, type ComponentType } from "react";

import styles from "./HeroCommandDeck.module.css";

export default function OrbitalLayer() {
  const [Scene, setScene] = useState<ComponentType | null>(null);

  useEffect(() => {
    const supportsDesktopScene = window.matchMedia("(min-width: 1080px)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!supportsDesktopScene || reduceMotion) {
      return;
    }

    const loadScene = () => {
      import("./HeroOrbitalScene")
        .then((module) => setScene(() => module.default))
        .catch(() => setScene(null));
    };

    const idleId = window.requestIdleCallback
      ? window.requestIdleCallback(loadScene, { timeout: 1200 })
      : window.setTimeout(loadScene, 250);

    return () => {
      if (window.cancelIdleCallback && typeof idleId === "number") {
        window.cancelIdleCallback(idleId);
        return;
      }

      if (typeof idleId === "number") {
        window.clearTimeout(idleId);
      }
    };
  }, []);

  return (
    <div className={styles.orbitLayer} aria-hidden="true">
      {Scene ? <Scene /> : null}
    </div>
  );
}
