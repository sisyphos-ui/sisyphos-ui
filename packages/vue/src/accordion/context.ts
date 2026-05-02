import { type InjectionKey, inject } from "vue";

export interface AccordionContextValue {
  baseId: string;
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
  multiple: boolean;
}

export const AccordionKey: InjectionKey<AccordionContextValue> = Symbol("Accordion");

export function useAccordion(): AccordionContextValue {
  const ctx = inject(AccordionKey);
  if (!ctx) throw new Error("[@sisyphos-ui/vue] Accordion subcomponent used outside <Accordion>.");
  return ctx;
}

export interface AccordionItemContextValue {
  value: string;
  triggerId: string;
  contentId: string;
}

export const AccordionItemKey: InjectionKey<AccordionItemContextValue> = Symbol("AccordionItem");

export function useAccordionItem(): AccordionItemContextValue {
  const ctx = inject(AccordionItemKey);
  if (!ctx)
    throw new Error("[@sisyphos-ui/vue] AccordionTrigger/Content must be inside <AccordionItem>.");
  return ctx;
}
