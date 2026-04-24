/**
 * Kbd — renders a keyboard key or a shortcut combination.
 *
 * Three input modes (pick one):
 * - `children` — free-form content, rendered inside a single `<kbd>`.
 * - `keys` — array of keys; each gets its own `<kbd>` with a separator between.
 * - `shortcut` — string like "cmd+k" or "ctrl shift p"; parsed into keys.
 *
 * Platform-aware: `mod` resolves to ⌘ on macOS and Ctrl elsewhere. `cmd`, `ctrl`,
 * `alt`, `shift`, arrow keys, etc. are normalized to glyphs via KEY_GLYPHS.
 */
import React, { useMemo } from "react";
import { cx } from "@sisyphos-ui/core/internal";
import "./Kbd.scss";
import { CN, DEFAULTS, KEY_GLYPHS, type Scale } from "./constants";

export interface KbdProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /** Visual style. `outlined` has a border, `soft` uses a muted background. */
  variant?: "outlined" | "soft";
  size?: Scale;
  /** Free-form content. Mutually exclusive with `keys` and `shortcut`. */
  children?: React.ReactNode;
  /** Explicit list of keys. Aliases (cmd/ctrl/shift/...) are normalized to glyphs. */
  keys?: string[];
  /** Shortcut string parsed on `+` or whitespace. e.g. "cmd+k", "ctrl shift p". */
  shortcut?: string;
  /** String or node rendered between keys when multiple. Defaults to none (visually joined). */
  separator?: React.ReactNode;
}

function isMac(): boolean {
  if (typeof navigator === "undefined") return false;
  const p = navigator.platform || "";
  return /Mac|iPhone|iPad|iPod/.test(p);
}

function normalizeKey(raw: string, mac: boolean): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const lower = trimmed.toLowerCase();
  if (lower === "mod") return mac ? KEY_GLYPHS.cmd : KEY_GLYPHS.ctrl;
  if (KEY_GLYPHS[lower]) return KEY_GLYPHS[lower];
  // Single letters uppercase for display; multi-char tokens left as-is (e.g. F1, Home).
  return trimmed.length === 1 ? trimmed.toUpperCase() : trimmed;
}

function parseShortcut(s: string): string[] {
  return s.split(/[\s+]+/).filter(Boolean);
}

export const Kbd = React.forwardRef<HTMLElement, KbdProps>(function Kbd(
  {
    children,
    className,
    variant = DEFAULTS.variant,
    size = DEFAULTS.size,
    keys,
    shortcut,
    separator,
    ...rest
  },
  ref
) {
  const resolvedKeys = useMemo<string[]>(() => {
    if (keys?.length) return keys;
    if (shortcut) return parseShortcut(shortcut);
    return [];
  }, [keys, shortcut]);

  const mac = useMemo(() => isMac(), []);

  const rootClass = cx(CN.root, variant, CN.size(size), className);

  // Single key / free-form: one <kbd>.
  if (resolvedKeys.length === 0) {
    return (
      <kbd ref={ref} className={rootClass} {...rest}>
        {children}
      </kbd>
    );
  }

  // Multi-key: group with role="group"; each key is its own <kbd>.
  return (
    <span
      ref={ref as React.Ref<HTMLSpanElement>}
      className={rootClass}
      role="group"
      {...rest}
    >
      {resolvedKeys.map((raw, i) => {
        const glyph = normalizeKey(raw, mac);
        return (
          <React.Fragment key={`${raw}-${i}`}>
            {i > 0 && separator != null && (
              <span className={CN.separator} aria-hidden="true">
                {separator}
              </span>
            )}
            <kbd className={CN.key}>{glyph}</kbd>
          </React.Fragment>
        );
      })}
    </span>
  );
});

Kbd.displayName = "Kbd";
