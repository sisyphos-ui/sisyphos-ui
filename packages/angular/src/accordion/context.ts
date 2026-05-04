/**
 * Accordion DI tokens — bridges Accordion → AccordionItem → Accordion
 * Trigger/Content. Item-scoped data (value, open, IDs) is provided by
 * AccordionItem itself; the root-level state (toggle, openness check, baseId,
 * single-vs-multiple mode) lives on Accordion.
 */
import { InjectionToken, type Signal } from "@angular/core";

export interface AccordionContextValue {
  baseId: Signal<string>;
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
  multiple: Signal<boolean>;
}

export interface AccordionItemContextValue {
  value: Signal<string>;
  open: Signal<boolean>;
  triggerId: Signal<string>;
  contentId: Signal<string>;
}

export const AccordionCtx = new InjectionToken<AccordionContextValue>("sisyphos.accordion");
export const AccordionItemCtx = new InjectionToken<AccordionItemContextValue>(
  "sisyphos.accordion-item"
);
