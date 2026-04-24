import type { Scale, SemanticColor } from "@sisyphos-ui/core/internal";

export type { Scale, SemanticColor } from "@sisyphos-ui/core/internal";
export type SpinnerColor = SemanticColor | "neutral" | "inherit";

export const CN = {
  spinner: "sisyphos-spinner",
  svg: "sisyphos-spinner-svg",
  svgInner: "sisyphos-spinner-svg--inner",
  arc: "sisyphos-spinner-arc",
  arcInner: "sisyphos-spinner-arc--inner",
  overlay: "sisyphos-loading-overlay",
  backdrop: "sisyphos-loading-overlay-backdrop",
  content: "sisyphos-loading-overlay-content",
  text: "sisyphos-loading-overlay-text",
} as const;

export const DEFAULTS = {
  size: "md" as Scale,
  color: "primary" as SpinnerColor,
  thickness: 3,
  variant: "inline" as const,
} as const;
