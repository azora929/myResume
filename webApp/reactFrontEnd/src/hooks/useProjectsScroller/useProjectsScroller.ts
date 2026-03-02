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

    let autoTimer: number | undefined;
    let idleTimer: number | undefined;
    let autoScrolling = false;

    const stopAuto = () => {
      if (autoTimer) {
        window.clearInterval(autoTimer);
        autoTimer = undefined;
      }
    };

    const scheduleAuto = () => {
      stopAuto();
      if (idleTimer) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        startAuto();
      }, 60000);
    };

    const scrollBySlide = (dir: number, reason: "auto" | "user") => {
      const slide = track.querySelector<HTMLElement>(".pSlide");
      const step = slide ? slide.offsetWidth : track.clientWidth;
      const count = Math.max(1, slides.length);
      const current = Math.round(track.scrollLeft / step);
      const next = (current + dir + count) % count;
      autoScrolling = reason === "auto";
      track.scrollTo({ left: next * step, behavior: "smooth" });
      window.setTimeout(() => {
        autoScrolling = false;
      }, 900);
    };

    const startAuto = () => {
      stopAuto();
      autoTimer = window.setInterval(() => {
        scrollBySlide(1, "auto");
      }, 5000);
    };

    const onTrackScroll = () => {
      if (!autoScrolling) {
        stopAuto();
        scheduleAuto();
      }
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
    const onUserInteract = () => {
      stopAuto();
      scheduleAuto();
    };

    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;
    let dragDelta = 0;
    let startIndex = 0;
    const snapType = "x mandatory";

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      onUserInteract();
      isDragging = true;
      startX = e.pageX;
      startScrollLeft = track.scrollLeft;
      dragDelta = 0;
      const slide = track.querySelector<HTMLElement>(".pSlide");
      const step = slide ? slide.offsetWidth : track.clientWidth;
      startIndex = Math.round(startScrollLeft / step);
      track.style.scrollSnapType = "none";
      track.style.scrollBehavior = "auto";
      track.classList.add("is-dragging");
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.pageX - startX;
      dragDelta = dx;
      track.scrollLeft = startScrollLeft - dx * 1.35;
    };

    const stopDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      track.classList.remove("is-dragging");
      const slide = track.querySelector<HTMLElement>(".pSlide");
      const step = slide ? slide.offsetWidth : track.clientWidth;
      const count = Math.max(1, slides.length);
      const threshold = Math.min(140, step * 0.22);
      let target = startIndex;
      if (Math.abs(dragDelta) >= threshold) {
        target = (startIndex + (dragDelta < 0 ? 1 : -1) + count) % count;
      }
      track.style.scrollSnapType = snapType;
      track.style.scrollBehavior = "smooth";
      onUserInteract();
      track.scrollTo({ left: target * step, behavior: "smooth" });
      dragDelta = 0;
    };

    track.addEventListener("scroll", onTrackScroll, { passive: true });
    track.addEventListener("mousedown", onMouseDown);
    track.addEventListener("pointerdown", onUserInteract, { passive: true });
    track.addEventListener("touchstart", onUserInteract, { passive: true });
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("blur", stopDrag);
    track.addEventListener("mouseleave", stopDrag);

    onTrackScroll();

    const stage = track.parentElement;
    const prevBtn = stage?.querySelector<HTMLButtonElement>(".projectsPro__nav--prev");
    const nextBtn = stage?.querySelector<HTMLButtonElement>(".projectsPro__nav--next");
    const onPrevClick = () => {
      onUserInteract();
      scrollBySlide(-1, "user");
    };
    const onNextClick = () => {
      onUserInteract();
      scrollBySlide(1, "user");
    };
    prevBtn?.addEventListener("click", onPrevClick);
    nextBtn?.addEventListener("click", onNextClick);
    startAuto();

    return () => {
      io.disconnect();
      track.removeEventListener("scroll", onTrackScroll);
      track.removeEventListener("pointerdown", onUserInteract);
      track.removeEventListener("touchstart", onUserInteract);
      prevBtn?.removeEventListener("click", onPrevClick);
      nextBtn?.removeEventListener("click", onNextClick);
      track.removeEventListener("mousedown", onMouseDown);
      track.removeEventListener("mouseleave", stopDrag);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("blur", stopDrag);
      stopAuto();
      if (idleTimer) window.clearTimeout(idleTimer);
    };
  }, [trackRef]);
}
