import type { Scale, SemanticColor } from "@sisyphos-ui/core/internal";

export type { Scale, SemanticColor } from "@sisyphos-ui/core/internal";

export const CN = {
  root: "sisyphos-chip",
  avatar: "sisyphos-chip-avatar",
  iconStart: "sisyphos-chip-icon sisyphos-chip-icon--start",
  iconEnd: "sisyphos-chip-icon sisyphos-chip-icon--end",
  label: "sisyphos-chip-label",
  deleteButton: "sisyphos-chip-delete",
  size: (v: Scale) => v,
  radius: (v: Scale) => `radius-${v}`,
} as const;

export const DEFAULTS = {
  variant: "soft" as const,
  color: "primary" as SemanticColor,
  size: "md" as Scale,
  radius: "full" as Scale | "full",
} as const;
