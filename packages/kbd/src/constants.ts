import type { Scale } from "@sisyphos-ui/core/internal";

export type { Scale } from "@sisyphos-ui/core/internal";

export const CN = {
  root: "sisyphos-kbd",
  key: "sisyphos-kbd-key",
  separator: "sisyphos-kbd-separator",
  size: (v: Scale) => v,
} as const;

export const DEFAULTS = {
  variant: "outlined" as const,
  size: "sm" as Scale,
} as const;

/**
 * Aliases → glyph map. Case-insensitive lookups use the lowercase key.
 * Platform-sensitive keys (meta/cmd/mod) resolve at render time in Kbd.tsx.
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
