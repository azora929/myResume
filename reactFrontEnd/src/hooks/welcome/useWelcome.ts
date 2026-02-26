import { useState } from "react";

/**
 * Хук области welcome (пример для структуры).
 * Можно расширить под логику приветственной страницы.
 */
export function useWelcome() {
  const [mounted] = useState(true);
  return { mounted };
}
