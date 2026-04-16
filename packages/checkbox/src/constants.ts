import type { Scale } from "@sisyphos-ui/core/internal";

export type { Scale } from "@sisyphos-ui/core/internal";

export const CN = {
  checkbox: "sisyphos-checkbox",
  label: "sisyphos-checkbox-label",
  box: "sisyphos-checkbox-box",
  input: "sisyphos-checkbox-input",
  mark: "sisyphos-checkbox-mark",
  labelText: "sisyphos-checkbox-label-text",
  size: (v: Scale) => v,
  radius: (v: Scale) => `radius-${v}`,
} as const;

export const DEFAULTS = {
  color: "primary" as const,
  size: "md" as Scale,
  radius: "sm" as Scale,
} as const;
