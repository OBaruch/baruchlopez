import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothExperienceRuntime() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      gsap.set("[data-fx-rise]", { opacity: 1, y: 0 });
      document.documentElement.classList.add("fx-ready");
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (value) => Math.min(1, 1.001 - 2 ** (-10 * value)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
    });

    const syncLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(syncLenis);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      gsap.set("[data-fx-rise]", { opacity: 0, y: 42 });
      document.documentElement.classList.add("fx-ready");

      gsap.utils.toArray<HTMLElement>("[data-fx-rise]").forEach((node) => {
        gsap.fromTo(
          node,
          { y: 42, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: node,
              start: "top 88%",
              once: true,
            },
          },
        );
      });

      gsap.to("[data-hero-portrait]", {
        y: 44,
        autoAlpha: 0.78,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-hero-panel]",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => {
      ctx.revert();
      gsap.ticker.remove(syncLenis);
      lenis.destroy();
    };
  }, []);

  return null;
}
