/**
 * Accordion — Angular 18 standalone disclosure list with single- or
 * multi-expand modes. Compound API:
 *   <sui-accordion>
 *     <sui-accordion-item value="a"><sui-accordion-trigger>...</sui-accordion-trigger>
 *       <sui-accordion-content>...</sui-accordion-content>
 *     </sui-accordion-item>
 *   </sui-accordion>
 */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  signal,
} from "@angular/core";
import { AccordionCtx, type AccordionContextValue } from "./context";

let nextId = 0;

export type AccordionVariant = "outlined" | "ghost";

@Component({
  selector: "sui-accordion",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: AccordionCtx, useExisting: Accordion }],
  template: `
    <div [class]="rootClasses()">
      <ng-content />
    </div>
  `,
})
export class Accordion implements AccordionContextValue {
  private readonly _baseId = signal<string>(`sisyphos-accordion-${++nextId}`);
  private readonly _variant = signal<AccordionVariant>("outlined");
  private readonly _multiple = signal(false);
  private readonly _value = signal<string | null>(null);
  private readonly _values = signal<string[]>([]);

  readonly baseId = this._baseId.asReadonly();
  readonly multiple = this._multiple.asReadonly();

  @Input("variant") set variantInput(v: AccordionVariant) {
    this._variant.set(v);
  }
  @Input("multiple") set multipleInput(v: boolean) {
    this._multiple.set(v);
  }

  /** Single-mode active value. Use only when multiple=false. */
  @Input("value") set valueInput(v: string | null | undefined) {
    if (v !== undefined) this._value.set(v);
  }
  /** Multi-mode active values. Use only when multiple=true. */
  @Input("values") set valuesInput(v: string[] | undefined) {
    if (v !== undefined) this._values.set(v);
  }

  /** Two-way `[(value)]` for single-mode. */
  @Output() readonly valueChange = new EventEmitter<string | null>();
  /** Two-way `[(values)]` for multi-mode. */
  @Output() readonly valuesChange = new EventEmitter<string[]>();

  readonly rootClasses = computed(() => `sisyphos-accordion ${this._variant()}`);

  isOpen(v: string): boolean {
    return this._multiple() ? this._values().includes(v) : this._value() === v;
  }

  toggle(v: string): void {
    if (this._multiple()) {
      const curr = this._values();
      const next = curr.includes(v) ? curr.filter((x) => x !== v) : [...curr, v];
      this._values.set(next);
      this.valuesChange.emit(next);
    } else {
      const next = this._value() === v ? null : v;
      this._value.set(next);
      this.valueChange.emit(next);
    }
  }
}
