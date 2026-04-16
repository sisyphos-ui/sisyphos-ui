import type { Scale } from "@sisyphos-ui/core/internal";

export type { Scale } from "@sisyphos-ui/core/internal";

export const CN = {
  switch: "sisyphos-switch",
  toggle: "sisyphos-switch-toggle",
  size: (v: Scale) => v,
} as const;

export const DEFAULTS = {
  color: "primary",
  size: "md" as Scale,
} as const;
