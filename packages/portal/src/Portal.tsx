import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export interface PortalProps {
  /** DOM node or selector to render into. Defaults to `document.body`. */
  container?: Element | string | null;
  children: ReactNode;
}

function resolveContainer(container: PortalProps["container"]): Element | null {
  if (!container) return typeof document !== "undefined" ? document.body : null;
  if (typeof container === "string") return document.querySelector(container);
  return container;
}

/**
 * Renders children into a portal. SSR-safe (returns null until mount).
 */
export function Portal({ container, children }: PortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  const target = resolveContainer(container);
  if (!target) return null;
  return createPortal(children, target);
}
