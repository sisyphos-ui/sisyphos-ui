import { createContext, useContext } from "react";

export interface AccordionContextValue {
  baseId: string;
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
  multiple: boolean;
}

export const AccordionContext = createContext<AccordionContextValue | null>(null);

export function useAccordion(): AccordionContextValue {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("[@sisyphos-ui/accordion] subcomponent used outside <Accordion>.");
  return ctx;
}

export interface AccordionItemContextValue {
  value: string;
  open: boolean;
  triggerId: string;
  contentId: string;
}

export const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

export function useAccordionItem(): AccordionItemContextValue {
  const ctx = useContext(AccordionItemContext);
  if (!ctx) throw new Error("[@sisyphos-ui/accordion] Trigger/Content must be inside <Accordion.Item>.");
  return ctx;
}
