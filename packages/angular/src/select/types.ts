/**
 * Item shapes for the Select API. Mirrors the React/Vue bindings exactly so
 * the same `[options]` array works across all three frameworks.
 */
export type SelectValue = string | number;

export interface SelectOption {
  value: SelectValue;
  label: string;
  disabled?: boolean;
  /** Stringy glyph (emoji/short text). For rich icons, use a templateRef-based
   * extension instead. */
  icon?: string;
  description?: string;
}
