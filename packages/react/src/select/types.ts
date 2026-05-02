import type { Scale } from "@sisyphos-ui/core/internal";

export type { Scale };

export type SelectValue = string | number;

export interface SelectOption {
  value: SelectValue;
  label: string;
  disabled?: boolean;
  /** Optional icon rendered before the label in the list (not in the control). */
  icon?: React.ReactNode;
  /** Optional description shown beneath the label. */
  description?: React.ReactNode;
}
