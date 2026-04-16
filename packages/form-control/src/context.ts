import { createContext, useContext } from "react";

export interface FormControlContextValue {
  id: string;
  labelId: string;
  helperId: string;
  errorId: string;
  disabled: boolean;
  required: boolean;
  readOnly: boolean;
  error: boolean;
  describedBy: string | undefined;
}

export const FormControlContext = createContext<FormControlContextValue | null>(null);

/**
 * Access FormControl state from nested Label/HelperText/Input. Returns null outside provider.
 */
export function useFormControl(): FormControlContextValue | null {
  return useContext(FormControlContext);
}
