export function formatBytes(bytes: number): string {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/**
 * Checks `file` against an HTML `accept` attribute.
 * Supports MIME types (`image/*`), extensions (`.pdf`), wildcard (`*`).
 */
export function matchesAccept(file: File, accept?: string): boolean {
  if (!accept || accept === "*" || accept === "*/*") return true;
  const tokens = accept.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
  const fileName = file.name.toLowerCase();
  const mime = (file.type || "").toLowerCase();
  return tokens.some((t) => {
    if (t.startsWith(".")) return fileName.endsWith(t);
    if (t.endsWith("/*")) {
      const prefix = t.slice(0, -1);
      return mime.startsWith(prefix);
    }
    return mime === t;
  });
}

export function createId(): string {
  return `f-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Returns an object URL for images (not stored — consumers should revoke if desired). */
export function imagePreview(file: File): string | undefined {
  if (!file.type.startsWith("image/")) return undefined;
  if (typeof URL === "undefined" || typeof URL.createObjectURL !== "function") return undefined;
  return URL.createObjectURL(file);
}
