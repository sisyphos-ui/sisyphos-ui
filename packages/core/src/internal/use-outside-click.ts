import { useEffect, type RefObject } from "react";

/**
 * Fires `onOutside` when a pointerdown/mousedown occurs outside the ref element.
 * Skipped when `enabled` is false.
 */
export function useOutsideClick(
  ref: RefObject<HTMLElement | null>,
  onOutside: (event: MouseEvent) => void,
  enabled = true
): void {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: MouseEvent) => {
      const el = ref.current;
      if (el && !el.contains(e.target as Node)) onOutside(e);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onOutside, enabled]);
}
