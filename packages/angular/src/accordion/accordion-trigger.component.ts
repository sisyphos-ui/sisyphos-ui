/**
 * AccordionTrigger — `<button>` inside an `<h3>` that toggles the parent
 * AccordionItem's open state. Inherits `aria-expanded`, `aria-controls`,
 * and the chevron icon from the React/Vue versions.
 */
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  inject,
  signal,
} from "@angular/core";
import { AccordionCtx, AccordionItemCtx } from "./context";

@Component({
  selector: "sui-accordion-trigger",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h3 class="sisyphos-accordion-heading">
      <button
        type="button"
        [id]="item.triggerId()"
        [attr.aria-expanded]="item.open()"
        [attr.aria-controls]="item.contentId()"
        [disabled]="disabled()"
        [class]="buttonClasses()"
        (click)="onClick()"
      >
        <span class="sisyphos-accordion-trigger-label">
          <ng-content />
        </span>
        <span [class]="iconClasses()" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M7 10l5 5 5-5z" fill="currentColor" />
          </svg>
        </span>
      </button>
    </h3>
  `,
})
export class AccordionTrigger {
  protected readonly accordion = inject(AccordionCtx);
  protected readonly item = inject(AccordionItemCtx);

  private readonly _disabled = signal(false);
  readonly disabled = this._disabled.asReadonly();

  @Input("disabled") set disabledInput(v: boolean) { this._disabled.set(v); }

  readonly buttonClasses = computed(() =>
    [
      "sisyphos-accordion-trigger",
      this.item.open() && "open",
    ]
      .filter(Boolean)
      .join(" ")
  );

  readonly iconClasses = computed(() =>
    [
      "sisyphos-accordion-trigger-icon",
      this.item.open() && "rotated",
    ]
      .filter(Boolean)
      .join(" ")
  );

  onClick(): void {
    if (this._disabled()) return;
    this.accordion.toggle(this.item.value());
  }
}
