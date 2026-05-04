/**
 * AccordionContent — disclosure panel. Hidden via `hidden` attribute when
 * closed; unmounted entirely when `forceMount=false`.
 */
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  inject,
  signal,
} from "@angular/core";
import { AccordionItemCtx } from "./context";

@Component({
  selector: "sui-accordion-content",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (shouldRender()) {
      <div
        [id]="item.contentId()"
        role="region"
        [attr.aria-labelledby]="item.triggerId()"
        [hidden]="!item.open() || null"
        class="sisyphos-accordion-content"
      >
        <div class="sisyphos-accordion-content-inner">
          <ng-content />
        </div>
      </div>
    }
  `,
})
export class AccordionContent {
  protected readonly item = inject(AccordionItemCtx);

  private readonly _forceMount = signal(true);

  @Input("forceMount") set forceMountInput(v: boolean) { this._forceMount.set(v); }

  readonly shouldRender = computed(() => this.item.open() || this._forceMount());
}
