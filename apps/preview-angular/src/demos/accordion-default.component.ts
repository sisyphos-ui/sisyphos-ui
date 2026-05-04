import { ChangeDetectionStrategy, Component } from "@angular/core";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@sisyphos-ui/angular";

@Component({
  standalone: true,
  selector: "demo-accordion-default",
  imports: [Accordion, AccordionItem, AccordionTrigger, AccordionContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sui-accordion defaultValue="install">
      <sui-accordion-item value="install">
        <sui-accordion-trigger>How do I install it?</sui-accordion-trigger>
        <sui-accordion-content>
          <code>pnpm add &#64;sisyphos-ui/angular</code> and import the stylesheet once.
        </sui-accordion-content>
      </sui-accordion-item>
      <sui-accordion-item value="theme">
        <sui-accordion-trigger>Can I theme it?</sui-accordion-trigger>
        <sui-accordion-content>Yes — every token is a CSS variable.</sui-accordion-content>
      </sui-accordion-item>
      <sui-accordion-item value="a11y">
        <sui-accordion-trigger>Is it accessible?</sui-accordion-trigger>
        <sui-accordion-content>Every component targets WAI-ARIA practices.</sui-accordion-content>
      </sui-accordion-item>
    </sui-accordion>
  `,
})
export class AccordionDefaultDemo {}
