import { useEffect, useRef } from "react";

const MOBILE_BREAKPOINT = 720;
/** Слоты в потоке документа (без transform) — по ним считаем «в зоне видимости» */
const SLOT_SELECTOR = ".skillsPro .sCard-slot";
const VISIBLE_CLASS = "sCard--scroll-visible";
const EXIT_LEFT_CLASS = "sCard--scroll-exit-left";
const EXIT_RIGHT_CLASS = "sCard--scroll-exit-right";

type SlideFrom = "left" | "right";

function getExitSide(from: SlideFrom): "left" | "right" {
  return from === "left" ? "right" : "left";
}

/**
 * Мобилка: карточки въезжают слева/справа и уезжают в противоположную сторону при скролле.
 * Десктоп: карточки «собираются» с разных сторон экрана только когда пользователь до них доскроллил.
 */
export function useSkillsCardsScrollAnimation(skillsRef: React.RefObject<HTMLElement | null>) {
  const directionsRef = useRef<WeakMap<Element, SlideFrom>>(new WeakMap());

  useEffect(() => {
    const root = skillsRef.current;
    if (!root) return;

    const slots = root.querySelectorAll<HTMLElement>(SLOT_SELECTOR);
    if (slots.length === 0) return;

    const getCard = (slot: HTMLElement): HTMLElement | null => slot.querySelector(".sCard");

    const isMobile = () => typeof window !== "undefined" && window.innerWidth <= MOBILE_BREAKPOINT;

    const assignDirection = (el: Element): SlideFrom => {
      let dir = directionsRef.current.get(el);
      if (!dir) {
        dir = Math.random() < 0.5 ? "left" : "right";
        directionsRef.current.set(el, dir);
        el.setAttribute("data-slide-from", dir);
      }
      return dir;
    };

    const onTransitionEnd = (e: TransitionEvent) => {
      if (e.propertyName !== "transform" && e.propertyName !== "opacity") return;
      const target = e.target as HTMLElement;
      if (!target.classList.contains(EXIT_LEFT_CLASS) && !target.classList.contains(EXIT_RIGHT_CLASS)) return;
      target.classList.remove(EXIT_LEFT_CLASS, EXIT_RIGHT_CLASS);
    };

    slots.forEach((slot) => {
      const card = getCard(slot);
      if (card) {
        assignDirection(card);
        card.addEventListener("transitionend", onTransitionEnd);
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const slot = entry.target as HTMLElement;
          const card = getCard(slot);
          if (!card) return;

          if (entry.isIntersecting) {
            card.classList.add(VISIBLE_CLASS);
            card.classList.remove(EXIT_LEFT_CLASS, EXIT_RIGHT_CLASS);
          } else {
            if (isMobile()) {
              const from = directionsRef.current.get(card) ?? assignDirection(card);
              const exitSide = getExitSide(from);
              card.classList.remove(VISIBLE_CLASS);
              card.classList.add(exitSide === "left" ? EXIT_LEFT_CLASS : EXIT_RIGHT_CLASS);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.08,
      }
    );

    slots.forEach((slot) => observer.observe(slot));

    const onResize = () => {
      if (!isMobile()) {
        slots.forEach((slot) => {
          const card = getCard(slot);
          if (card) card.classList.remove(EXIT_LEFT_CLASS, EXIT_RIGHT_CLASS);
        });
      }
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      slots.forEach((slot) => {
        observer.unobserve(slot);
        const card = getCard(slot);
        if (card) card.removeEventListener("transitionend", onTransitionEnd);
      });
    };
  }, [skillsRef]);
}
