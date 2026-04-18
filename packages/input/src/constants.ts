import type { Scale } from "@sisyphos-ui/core/internal";

export type { Scale } from "@sisyphos-ui/core/internal";

export const CN = {
  container: "sisyphos-input-container",
  wrapper: "sisyphos-input-wrapper",
  input: "sisyphos-input",
  label: "sisyphos-input-label",
  labelText: "sisyphos-input-label-text",
  labelTooltip: "sisyphos-input-label-tooltip",
  labelTooltipPopover: "sisyphos-input-label-tooltip-popover",
  startIcon: "sisyphos-input-icon sisyphos-input-icon--start",
  endIcon: "sisyphos-input-icon sisyphos-input-icon--end",
  error: "sisyphos-input-error",
  characterCount: "sisyphos-input-character-count",
  passwordToggle: "sisyphos-input-password-toggle",
  copyButton: "sisyphos-input-copy-button",
  size: (v: Scale) => v,
  radius: (v: Scale) => `radius-${v}`,
} as const;

export const DEFAULTS = {
  variant: "standard",
  size: "md" as Scale,
  type: "text",
  radius: "sm" as Scale,
} as const;
