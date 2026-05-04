/**
 * RadioGroup context — DI bridge between `<sui-radio-group>` and nested
 * `<sui-radio>` children. Mirrors the shape of the React `RadioGroupContext`
 * so the same option/selection rules apply across all three frameworks.
 */
import { InjectionToken, type Signal } from "@angular/core";

export type RadioGroupSize = "xs" | "sm" | "md" | "lg" | "xl";
export type RadioGroupColor = "primary" | "success" | "error" | "warning" | "info";
export type RadioGroupVariant = "standard" | "card" | "list";

export interface RadioGroupContextValue {
  name: Signal<string>;
  value: Signal<string | number | undefined>;
  disabled: Signal<boolean>;
  size: Signal<RadioGroupSize>;
  color: Signal<RadioGroupColor>;
  variant: Signal<RadioGroupVariant>;
  select: (next: string | number) => void;
}

export const RadioGroupCtx = new InjectionToken<RadioGroupContextValue>(
  "sisyphos.radio-group"
);
