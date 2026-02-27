import { useEffect, useRef, useState } from "react";

const defaultOptions: IntersectionObserverInit = {
  root: null,
  rootMargin: "0px 0px -15% 0px",
  threshold: 0.1,
};

export function useInView(options: Partial<IntersectionObserverInit> = {}) {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true);
      },
      { ...defaultOptions, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [options.root, options.rootMargin, options.threshold]);

  return { ref, isInView };
}
