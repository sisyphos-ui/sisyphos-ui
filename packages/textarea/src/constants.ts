import type { Scale } from "@sisyphos-ui/core/internal";

export type { Scale } from "@sisyphos-ui/core/internal";

export const CN = {
  container: "sisyphos-textarea-container",
  wrapper: "sisyphos-textarea-wrapper",
  textarea: "sisyphos-textarea",
  label: "sisyphos-textarea-label",
  error: "sisyphos-textarea-error",
  characterCount: "sisyphos-textarea-character-count",
  size: (v: Scale) => v,
  radius: (v: Scale) => `radius-${v}`,
} as const;

export const DEFAULTS = {
  variant: "outlined",
  size: "md" as Scale,
  radius: "sm" as Scale,
  minRows: 3,
  resize: "vertical",
} as const;
