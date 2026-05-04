/**
 * Dialog DI token — used by `<sui-dialog-title>` / `<sui-dialog-description>` /
 * `<sui-dialog-close>` to read the parent dialog's IDs and close handler.
 */
import { InjectionToken, type Signal } from "@angular/core";

export interface DialogContextValue {
  titleId: Signal<string>;
  descriptionId: Signal<string>;
  close: () => void;
}

export const DialogCtx = new InjectionToken<DialogContextValue>("sisyphos.dialog");
