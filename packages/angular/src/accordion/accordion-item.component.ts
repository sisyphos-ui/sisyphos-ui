/**
 * AccordionItem — provides per-item context (value, open state, IDs) to its
 * trigger and content children.
 */
import { ChangeDetectionStrategy, Component, Input, computed, inject, signal } from "@angular/core";
import { AccordionCtx, AccordionItemCtx, type AccordionItemContextValue } from "./context";

@Component({
  selector: "sui-accordion-item",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: AccordionItemCtx, useExisting: AccordionItem }],
  template: `
    <div [attr.data-state]="open() ? 'open' : 'closed'" [class]="rootClasses()">
      <ng-content />
    </div>
  `,
})
export class AccordionItem implements AccordionItemContextValue {
  private readonly accordion = inject(AccordionCtx);

  private readonly _value = signal<string>("");
  private readonly _disabled = signal(false);

  readonly value = this._value.asReadonly();
  readonly open = computed(() => this.accordion.isOpen(this._value()));
  readonly triggerId = computed(() => `${this.accordion.baseId()}-${this._value()}-trigger`);
  readonly contentId = computed(() => `${this.accordion.baseId()}-${this._value()}-content`);

  @Input("value") set valueInput(v: string) {
    this._value.set(v);
  }
  @Input("disabled") set disabledInput(v: boolean) {
    this._disabled.set(v);
  }

  readonly rootClasses = computed(() =>
    ["sisyphos-accordion-item", this.open() && "open", this._disabled() && "disabled"]
      .filter(Boolean)
      .join(" ")
  );
}
