import { useEffect } from "react";
import type { RefObject } from "react";

interface UseProjectsScrollerArgs {
  trackRef: RefObject<HTMLDivElement>;
}

export function useProjectsScroller({ trackRef }: UseProjectsScrollerArgs) {
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const slides = Array.from(track.querySelectorAll<HTMLElement>(".pSlide"));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-active", entry.isIntersecting);
        });
      },
      { root: track, threshold: 0.55 }
    );
    slides.forEach((slide) => io.observe(slide));

    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

    const onTrackScroll = () => {
      const active = track.querySelector<HTMLElement>(".pSlide.is-active");
      if (!active) return;

      const img = active.querySelector<HTMLElement>(".pMedia__img");
      if (!img) return;

      const slideLeft = active.offsetLeft;
      const slideW = active.offsetWidth || 1;
      const t = (track.scrollLeft - slideLeft) / slideW;
      const local = clamp(t, 0, 1);
      const wiggle = Math.sin(local * Math.PI) * 10;
      img.style.setProperty("--imgShift", `${wiggle}px`);
    };

    track.addEventListener("scroll", onTrackScroll, { passive: true });

    onTrackScroll();

    return () => {
      io.disconnect();
      track.removeEventListener("scroll", onTrackScroll);
    };
  }, [trackRef]);
}
