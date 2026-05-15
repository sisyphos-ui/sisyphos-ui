/**
 * FormControl context — Vue 3 provide/inject equivalent of the React
 * createContext/useContext pair. Mirrors the same shape so docs and types
 * stay in sync across the two bindings.
 */
import { inject, type ComputedRef, type InjectionKey } from "vue";

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

/** Reactive variant — what FormControl actually provides under the hood. */
export type FormControlContextRef = ComputedRef<FormControlContextValue>;

export const FormControlInjectionKey: InjectionKey<FormControlContextRef> =
  Symbol("sisyphos.form-control");

/**
 * Read FormControl state from a nested label/helper/input. Returns `undefined`
 * outside a `<FormControl>` ancestor. The returned ComputedRef stays in sync
 * with the parent FormControl's props (error, required, disabled).
 */
export function useFormControl(): FormControlContextRef | undefined {
  return inject(FormControlInjectionKey, undefined);
}
