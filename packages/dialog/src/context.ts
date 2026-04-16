import { createContext, useContext } from "react";

export interface DialogContextValue {
  titleId: string;
  descriptionId: string;
  onClose: () => void;
}

export const DialogContext = createContext<DialogContextValue | null>(null);

export function useDialogContext(): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error(
      "[@sisyphos-ui/dialog] Dialog subcomponents must be rendered inside <Dialog>."
    );
  }
  return ctx;
}
