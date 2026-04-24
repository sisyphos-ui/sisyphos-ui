export type Placement =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-start"
  | "top-end"
  | "bottom-start"
  | "bottom-end";

export interface Position {
  left: number;
  top: number;
  /** Resolved placement; may differ from the requested one after auto-flip. */
  placement: Placement;
}

interface Rect {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

/**
 * Compute fixed-position coordinates for `tooltipSize` anchored around `anchor`
 * for the requested `placement`, with auto-flip inside `viewport`.
 */
export function computePosition(
  anchor: Rect,
  tooltipSize: { width: number; height: number },
  placement: Placement,
  offset = 8,
  viewport: { width: number; height: number } = {
    width: typeof window === "undefined" ? 1024 : window.innerWidth,
    height: typeof window === "undefined" ? 768 : window.innerHeight,
  }
): Position {
  const [main, align = "center"] = placement.split("-") as [string, string?];

  const fits = (p: Placement): boolean => {
    const { left, top } = rawPosition(anchor, tooltipSize, p, offset);
    return (
      left >= 0 &&
      top >= 0 &&
      left + tooltipSize.width <= viewport.width &&
      top + tooltipSize.height <= viewport.height
    );
  };

  const opposite: Record<string, string> = {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left",
  };
  let resolved = placement;
  if (!fits(resolved)) {
    const flipped = `${opposite[main]}${align === "center" ? "" : `-${align}`}` as Placement;
    if (fits(flipped)) resolved = flipped;
  }

  return { ...rawPosition(anchor, tooltipSize, resolved, offset), placement: resolved };
}

function rawPosition(
  anchor: Rect,
  size: { width: number; height: number },
  placement: Placement,
  offset: number
): { left: number; top: number } {
  const [main, align = "center"] = placement.split("-") as [string, string?];
  let left = 0;
  let top = 0;

  switch (main) {
    case "top":
      top = anchor.top - size.height - offset;
      break;
    case "bottom":
      top = anchor.bottom + offset;
      break;
    case "left":
      left = anchor.left - size.width - offset;
      break;
    case "right":
      left = anchor.right + offset;
      break;
  }

  if (main === "top" || main === "bottom") {
    if (align === "start") left = anchor.left;
    else if (align === "end") left = anchor.right - size.width;
    else left = anchor.left + anchor.width / 2 - size.width / 2;
  }

  if (main === "left" || main === "right") {
    top = anchor.top + anchor.height / 2 - size.height / 2;
  }

  return { left, top };
}
