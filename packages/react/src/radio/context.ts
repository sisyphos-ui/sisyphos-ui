import { createContext, useContext } from "react";
import type { Scale, SemanticColor } from "@sisyphos-ui/core/internal";

export interface RadioGroupContextValue {
  name: string;
  value: string | number | undefined;
  onChange: (next: string | number) => void;
  disabled: boolean;
  size: Scale;
  color: SemanticColor;
  variant: "standard" | "card" | "list";
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export function useRadioGroup(): RadioGroupContextValue {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) {
    throw new Error("[@sisyphos-ui/radio] <Radio> must be rendered inside <RadioGroup>.");
  }
  return ctx;
}
