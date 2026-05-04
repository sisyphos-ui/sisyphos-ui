/**
 * Compute up-to-`max` uppercase initials from a display name.
 * Mirrors the React binding's `getInitials` exactly so the same `name` input
 * produces the same letters across all three frameworks.
 */
export function getInitials(name: string | undefined | null, max = 2): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  return parts
    .slice(0, max)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
