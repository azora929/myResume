type PIconName =
  | "monitor"
  | "id"
  | "bolt"
  | "layers"
  | "spark"
  | "server"
  | "stream"
  | "cube"
  | "education"
  | "globe"
  | "brain"
  | "code"
  | "rocket"
  | "moon"
  | "doc"
  | "grid"
  | "mail"
  | "telegram"
  | "arrow"
  | "shield"
  | "arrow-down"
  | "sun";

interface PIconProps {
  name: PIconName;
}

export function PIcon({ name }: PIconProps) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
  };

  switch (name) {
    case "monitor":
      return (
        <svg {...common}>
          <path d="M4 5h16v11H4V5z" stroke="currentColor" strokeWidth="2" />
          <path d="M8 19h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "id":
      return (
        <svg {...common}>
          <path d="M4 7h16v10H4V7z" stroke="currentColor" strokeWidth="2" />
          <path d="M8 11h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M8 14h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...common}>
          <path
            d="M13 2L3 14h8l-1 8 11-14h-8l0-6z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "layers":
      return (
        <svg {...common}>
          <path d="M12 3l9 5-9 5-9-5 9-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M3 12l9 5 9-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M3 16l9 5 9-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    case "spark":
      return (
        <svg {...common}>
          <path
            d="M12 2l1.2 5.2L18 8l-4.8 1L12 14l-1-5-5-1 5-0.8L12 2z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "server":
      return (
        <svg {...common}>
          <path d="M4 6h16v5H4V6z" stroke="currentColor" strokeWidth="2" />
          <path d="M4 13h16v5H4v-5z" stroke="currentColor" strokeWidth="2" />
          <path d="M7 8h.01M7 15h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "stream":
      return (
        <svg {...common}>
          <path d="M4 12h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M14 7l6 5-6 5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M4 7h6M4 17h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        </svg>
      );
    case "cube":
      return (
        <svg {...common}>
          <path d="M21 8l-9-5-9 5 9 5 9-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M3 8v8l9 5 9-5V8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M12 13v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "education":
      return (
        <svg {...common}>
          <path d="M12 3l10 5-10 5L2 8l10-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M6 10v6c0 1 3 3 6 3s6-2 6-3v-6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    case "globe":
      return (
        <svg {...common}>
          <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" stroke="currentColor" strokeWidth="2" />
          <path d="M3 12h18" stroke="currentColor" strokeWidth="2" />
          <path d="M12 3c3 3 3 15 0 18" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case "brain":
      return (
        <svg {...common}>
          <path d="M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0 0 6v1a3 3 0 0 0 3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M15 4a3 3 0 0 1 3 3v1a3 3 0 0 1 0 6v1a3 3 0 0 1-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M9 4h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "code":
      return (
        <svg {...common}>
          <path d="M8 9l-3 3 3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 9l3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 20l4-16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "rocket":
      return (
        <svg {...common}>
          <path d="M14 3c4 1 7 5 7 9-4 0-8-3-9-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 14c-3 3-6 3-7 3 0-1 0-4 3-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 10l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "moon":
      return (
        <svg {...common}>
          <path
            d="M16.5 3.5a8.5 8.5 0 1 0 4 13.3A7 7 0 1 1 16.5 3.5z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "doc":
      return (
        <svg {...common}>
          <path d="M7 3h7l3 3v15H7V3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M14 3v4h4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M9 12h6M9 16h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "grid":
      return (
        <svg {...common}>
          <path d="M4 4h7v7H4V4z" stroke="currentColor" strokeWidth="2" />
          <path d="M13 4h7v7h-7V4z" stroke="currentColor" strokeWidth="2" />
          <path d="M4 13h7v7H4v-7z" stroke="currentColor" strokeWidth="2" />
          <path d="M13 13h7v7h-7v-7z" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <path d="M4 6h16v12H4V6z" stroke="currentColor" strokeWidth="2" />
          <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    case "telegram":
      return (
        <svg {...common}>
          <path
            d="M4 12l16-7-4 14-5-4-3 3 1-5 7-5-9 4z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M13 7l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    case "arrow-down":
      return (
        <svg {...common}>
          <path d="M12 5v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M7 13l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path
            d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "sun":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
          <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M12 3v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}

export type { PIconName };
