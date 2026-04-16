/**
 * Compute up-to-`max` uppercase initials from a display name.
 * "Volkan Günay" -> "VG"; "John" -> "J"; "  " -> "".
 */
export function getInitials(name: string | undefined, max = 2): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  const letters = parts.slice(0, max).map((p) => p[0]?.toUpperCase() ?? "");
  return letters.join("");
}
