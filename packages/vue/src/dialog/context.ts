import { type InjectionKey, inject } from "vue";

export interface DialogContextValue {
  titleId: string;
  close: () => void;
}

export const DialogKey: InjectionKey<DialogContextValue> = Symbol("Dialog");

export function useDialog(): DialogContextValue {
  const ctx = inject(DialogKey);
  if (!ctx) throw new Error("[@sisyphos-ui/vue] Dialog subcomponent used outside <Dialog>.");
  return ctx;
}
