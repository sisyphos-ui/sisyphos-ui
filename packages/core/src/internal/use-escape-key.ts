import { useEffect, useRef } from "react";

/**
 * Module-level stack of active Escape handlers. Each call to `useEscapeKey`
 * pushes a stable wrapper onto this array while the hook is enabled and
 * mounted. Only the topmost (most recently registered) entry receives the
 * Escape event so nested overlays — e.g. a Popover opened inside a Dialog —
 * close one at a time instead of collapsing every layer at once.
 */
type EscapeHandler = (event: KeyboardEvent) => void;
const escapeStack: EscapeHandler[] = [];
let listenerInstalled = false;

function ensureGlobalListener() {
  if (listenerInstalled || typeof document === "undefined") return;
  listenerInstalled = true;
  document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key !== "Escape") return;
    const top = escapeStack[escapeStack.length - 1];
    if (top) top(event);
  });
}

/**
 * Fires `onEscape` when the Escape key is pressed, but only when this hook
 * is the **topmost** registered handler. Skipped when `enabled` is false.
 *
 * The handler is wrapped in a stable function so React re-renders don't
 * churn the stack — the latest callback is always invoked via a ref.
 */
export function useEscapeKey(onEscape: EscapeHandler, enabled = true): void {
  const callbackRef = useRef(onEscape);
  useEffect(() => {
    callbackRef.current = onEscape;
  }, [onEscape]);

  useEffect(() => {
    if (!enabled) return;
    ensureGlobalListener();
    const stable: EscapeHandler = (event) => callbackRef.current(event);
    escapeStack.push(stable);
    return () => {
      const idx = escapeStack.lastIndexOf(stable);
      if (idx !== -1) escapeStack.splice(idx, 1);
    };
  }, [enabled]);
}
