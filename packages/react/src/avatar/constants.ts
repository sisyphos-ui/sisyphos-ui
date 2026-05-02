import type { Scale, SemanticColor } from "@sisyphos-ui/core/internal";

export type { Scale, SemanticColor } from "@sisyphos-ui/core/internal";

export type AvatarColor = SemanticColor | "neutral";
export type AvatarShape = "circular" | "rounded" | "square";

export const CN = {
  root: "sisyphos-avatar",
  image: "sisyphos-avatar-image",
  fallback: "sisyphos-avatar-fallback",
  group: "sisyphos-avatar-group",
  groupOverflow: "sisyphos-avatar-group-overflow",
} as const;

export const DEFAULTS = {
  size: "md" as Scale,
  color: "neutral" as AvatarColor,
  shape: "circular" as AvatarShape,
} as const;
