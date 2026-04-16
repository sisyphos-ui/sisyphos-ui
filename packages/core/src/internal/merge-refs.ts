import type React from "react";

/**
 * Merges an internal ref with a forwarded ref.
 */
export function mergeRefs<T>(
  internalRef: React.MutableRefObject<T | null>,
  forwardRef: React.ForwardedRef<T>
) {
  return (el: T | null) => {
    internalRef.current = el;
    if (typeof forwardRef === "function") forwardRef(el);
    else if (forwardRef)
      (forwardRef as React.MutableRefObject<T | null>).current = el;
  };
}
