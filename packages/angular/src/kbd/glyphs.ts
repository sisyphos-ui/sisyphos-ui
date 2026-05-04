/**
 * Aliases → glyph map. Case-insensitive lookups via the lowercase key.
 * Identical content to the React/Vue bindings so a `keys=["cmd","K"]` input
 * renders as `⌘ K` everywhere.
 */
export const KEY_GLYPHS: Record<string, string> = {
  cmd: "⌘",
  command: "⌘",
  meta: "⌘",
  ctrl: "⌃",
  control: "⌃",
  alt: "⌥",
  option: "⌥",
  opt: "⌥",
  shift: "⇧",
  enter: "↵",
  return: "↵",
  tab: "⇥",
  backspace: "⌫",
  delete: "⌦",
  esc: "⎋",
  escape: "⎋",
  space: "␣",
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
  pageup: "⇞",
  pagedown: "⇟",
  home: "↖",
  end: "↘",
};

export function isMac(): boolean {
  if (typeof navigator === "undefined") return false;
  const p = navigator.platform || "";
  return /Mac|iPhone|iPad|iPod/.test(p);
}

export function normalizeKey(raw: string, mac: boolean): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const lower = trimmed.toLowerCase();
  if (lower === "mod") return mac ? KEY_GLYPHS["cmd"]! : KEY_GLYPHS["ctrl"]!;
  if (KEY_GLYPHS[lower]) return KEY_GLYPHS[lower]!;
  // Single letters uppercase for display; multi-char tokens left as-is (F1, Home).
  return trimmed.length === 1 ? trimmed.toUpperCase() : trimmed;
}

export function parseShortcut(s: string): string[] {
  return s.split(/[\s+]+/).filter(Boolean);
}
