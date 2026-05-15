/**
 * FormControl context — DI bridge between `<sui-form-control>` and its
 * compound children (label, helper, error). Mirrors the React/Vue shape so
 * the same composition reads natively in Angular templates.
 */
import { InjectionToken, type Signal } from "@angular/core";

export interface FormControlContextValue {
  id: Signal<string>;
  labelId: Signal<string>;
  helperId: Signal<string>;
  errorId: Signal<string>;
  disabled: Signal<boolean>;
  required: Signal<boolean>;
  readOnly: Signal<boolean>;
  error: Signal<boolean>;
  /** `errorId` when in error state, otherwise `helperId`. Used as the
   * `aria-describedby` on the input. */
  describedBy: Signal<string>;
}

export const FormControlCtx = new InjectionToken<FormControlContextValue>("sisyphos.form-control");
