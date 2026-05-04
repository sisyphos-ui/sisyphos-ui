/**
 * Minimal input-mask implementation. No external deps.
 *
 * Tokens:
 *   `#` — any digit [0-9]
 *   `A` — any letter [A-Za-z]
 *   `*` — alphanumeric [A-Za-z0-9]
 * Anything else is a literal (separator/prefix).
 *
 * Presets:
 *   `tel-tr` → "+90 (5##) ### ## ##"
 *   `tel`    → "(###) ### ####"  (US-ish)
 *   `card`   → "#### #### #### ####"
 *   `date`   → "##/##/####"
 */

export const MASK_PRESETS: Record<string, string> = {
  "tel-tr": "+90 (5##) ### ## ##",
  tel: "(###) ### ####",
  card: "#### #### #### ####",
  date: "##/##/####",
};

function resolvePattern(mask: string): string {
  return MASK_PRESETS[mask] ?? mask;
}

function matchToken(token: string, ch: string): boolean {
  if (token === "#") return /\d/.test(ch);
  if (token === "A") return /[A-Za-z]/.test(ch);
  if (token === "*") return /[A-Za-z0-9]/.test(ch);
  return false;
}

function isMaskToken(t: string): boolean {
  return t === "#" || t === "A" || t === "*";
}

/**
 * Produce the formatted (masked) value from a raw user string.
 * Non-matching characters are skipped. Literal chars are auto-inserted.
 */
export function applyMask(raw: string, maskSpec: string): string {
  const pattern = resolvePattern(maskSpec);
  let out = "";
  let ri = 0;
  for (let pi = 0; pi < pattern.length; pi++) {
    const p = pattern[pi];
    if (isMaskToken(p)) {
      // Consume raw chars until we find one that satisfies the token.
      while (ri < raw.length && !matchToken(p, raw[ri])) ri++;
      if (ri >= raw.length) break;
      out += raw[ri];
      ri++;
    } else {
      // Literal — auto-insert only if we haven't exhausted the raw input yet.
      if (ri >= raw.length) {
        // Still output the literal IF there's more raw waiting behind it — but
        // if we've fully consumed the input we stop to avoid trailing garbage.
        break;
      }
      // If the user typed the literal themselves, consume it; otherwise insert.
      if (raw[ri] === p) ri++;
      out += p;
    }
  }
  return out;
}

/**
 * Index of the first editable token in a mask pattern.
 *
 * Use this to prevent the caret from being placed inside a fixed prefix
 * (e.g. `+90 ` in `tel-tr`). Returns `0` for masks with no leading literals.
 */
export function getMaskPrefixLength(maskSpec: string): number {
  const pattern = resolvePattern(maskSpec);
  for (let i = 0; i < pattern.length; i++) {
    if (isMaskToken(pattern[i])) return i;
  }
  return 0;
}

/** Strip a masked value back to just the raw token characters. */
export function unmask(masked: string, maskSpec: string): string {
  const pattern = resolvePattern(maskSpec);
  let out = "";
  let mi = 0;
  for (let pi = 0; pi < pattern.length && mi < masked.length; pi++) {
    const p = pattern[pi];
    if (isMaskToken(p)) {
      if (mi < masked.length && matchToken(p, masked[mi])) {
        out += masked[mi];
      }
      mi++;
    } else {
      // Literal — advance past it if present.
      if (masked[mi] === p) mi++;
    }
  }
  return out;
}
