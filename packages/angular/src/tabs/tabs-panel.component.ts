/**
 * TabsPanel — `<sui-tabs-panel>`. Hidden via the `hidden` attribute when
 * inactive; unmounted entirely when `forceMount=false`.
 */
import { ChangeDetectionStrategy, Component, Input, computed, inject, signal } from "@angular/core";
import { TabsCtx } from "./context";

@Component({
  selector: "sui-tabs-panel",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (shouldRender()) {
      <div
        role="tabpanel"
        [id]="panelId()"
        [attr.aria-labelledby]="triggerId()"
        [hidden]="!isSelected() || null"
        [tabindex]="0"
        class="sisyphos-tabs-panel"
      >
        <ng-content />
      </div>
    }
  `,
})
export class TabsPanel {
  protected readonly ctx = inject(TabsCtx);

  private readonly _value = signal<string>("");
  private readonly _forceMount = signal(true);

  @Input("value") set valueInput(v: string) {
    this._value.set(v);
  }
  @Input("forceMount") set forceMountInput(v: boolean) {
    this._forceMount.set(v);
  }

  readonly isSelected = computed(() => this.ctx.value() === this._value());
  readonly shouldRender = computed(() => this.isSelected() || this._forceMount());

  readonly panelId = computed(() => `${this.ctx.baseId()}-panel-${this._value()}`);
  readonly triggerId = computed(() => `${this.ctx.baseId()}-trigger-${this._value()}`);
}
