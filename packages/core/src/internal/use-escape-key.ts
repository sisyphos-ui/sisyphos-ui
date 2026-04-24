import { useEffect } from "react";

/**
 * Fires `onEscape` when the Escape key is pressed. Skipped when `enabled` is false.
 */
export function useEscapeKey(onEscape: (event: KeyboardEvent) => void, enabled = true): void {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onEscape(e);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onEscape, enabled]);
}
