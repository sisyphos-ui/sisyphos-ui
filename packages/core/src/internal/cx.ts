type ClassValue = string | number | false | null | undefined;

/**
 * Tiny className builder. Accepts strings, falsy values filtered out.
 */
export function cx(...values: ClassValue[]): string {
  let out = "";
  for (const v of values) {
    if (!v) continue;
    if (out) out += " ";
    out += v;
  }
  return out;
}
