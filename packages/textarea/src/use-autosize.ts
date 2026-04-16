import { useLayoutEffect, type RefObject } from "react";

/**
 * Auto-resizes a textarea based on its content, clamped to `minRows`/`maxRows`.
 * Skipped when `enabled` is false.
 */
export function useAutosize(
  ref: RefObject<HTMLTextAreaElement | null>,
  value: string,
  {
    enabled = true,
    minRows = 1,
    maxRows,
  }: { enabled?: boolean; minRows?: number; maxRows?: number } = {}
): void {
  useLayoutEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const style = window.getComputedStyle(el);
    const lineHeight = parseFloat(style.lineHeight) || 20;
    const paddingY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    const borderY = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);

    const minHeight = minRows * lineHeight + paddingY + borderY;
    const maxHeight = maxRows ? maxRows * lineHeight + paddingY + borderY : Infinity;

    el.style.height = "auto";
    const next = Math.min(Math.max(el.scrollHeight, minHeight), maxHeight);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [ref, value, enabled, minRows, maxRows]);
}
