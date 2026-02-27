import { type ReactNode } from "react";
import { useInView } from "@/hooks/useInView/useInView";

type SectionVariant =
  | "hero"
  | "skills"
  | "project-teal"
  | "project-blue"
  | "project-dark"
  | "project-purple"
  | "project-mint"
  | "publications"
  | "education"
  | "languages";

interface SectionProps {
  id?: string;
  variant: SectionVariant;
  children: ReactNode;
  className?: string;
}

export function Section({ id, variant, children, className = "" }: SectionProps) {
  const { ref, isInView } = useInView();

  return (
    <section
      id={id}
      ref={ref}
      className={`section section--${variant} ${isInView ? "section--visible" : ""} ${className}`.trim()}
    >
      <div className="section__inner">{children}</div>
    </section>
  );
}
