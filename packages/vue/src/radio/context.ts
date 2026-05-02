import { type InjectionKey, inject } from "vue";

export interface RadioGroupContextValue {
  name: string;
  value: string | number | undefined;
  onChange: (next: string | number) => void;
  disabled: boolean;
  size: "xs" | "sm" | "md" | "lg" | "xl";
  color: "primary" | "success" | "error" | "warning" | "info";
  variant: "standard" | "card" | "list";
}

export const RadioGroupKey: InjectionKey<RadioGroupContextValue> = Symbol("RadioGroup");

export function useRadioGroup(): RadioGroupContextValue {
  const ctx = inject(RadioGroupKey);
  if (!ctx) {
    throw new Error("[@sisyphos-ui/vue] <Radio> must be rendered inside <RadioGroup>.");
  }
  return ctx;
}
