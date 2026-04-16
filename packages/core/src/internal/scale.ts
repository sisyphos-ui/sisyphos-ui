export const SCALE = ["xs", "sm", "md", "lg", "xl"] as const;
export type Scale = (typeof SCALE)[number];

export type SemanticColor = "primary" | "success" | "error" | "warning" | "info";
