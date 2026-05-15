/**
 * TabsTrigger — `<sui-tabs-trigger>` self-registering tab button.
 *
 * Registers with the parent Tabs registry via `effect()` so the indicator
 * and keyboard navigation stay in sync. We use `effect()` instead of
 * `ngAfterViewInit` because content-projected triggers do not reliably
 * receive view-init lifecycle calls in the AnalogJS+Vitest JIT test
 * environment — the effect runs as soon as both the value input and the
 * rendered <button> are visible to the signal graph.
 */
import type { AfterViewInit, ElementRef, OnDestroy } from "@angular/core";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
  computed,
  inject,
  signal,
} from "@angular/core";
import { TabsCtx } from "./context";

@Component({
  selector: "sui-tabs-trigger",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      #buttonEl
      type="button"
      role="tab"
      [id]="triggerId()"
      [attr.aria-selected]="isSelected()"
      [attr.aria-controls]="panelId()"
      [tabindex]="isSelected() ? 0 : -1"
      [disabled]="disabled()"
      [attr.data-sisyphos-tab-value]="value()"
      [class]="rootClasses()"
      (click)="select()"
    >
      @if (icon()) {
        <span class="sisyphos-tabs-trigger-icon" aria-hidden="true">{{ icon() }}</span>
      }
      <span class="sisyphos-tabs-trigger-label">
        <ng-content />
      </span>
    </button>
  `,
})
export class TabsTrigger implements AfterViewInit, OnDestroy {
  protected readonly ctx = inject(TabsCtx);

  private readonly _value = signal<string>("");
  private readonly _icon = signal<string | undefined>(undefined);
  private readonly _disabled = signal(false);

  readonly value = this._value.asReadonly();
  readonly icon = this._icon.asReadonly();
  readonly disabled = this._disabled.asReadonly();

  @Input("value") set valueInput(v: string) {
    this._value.set(v);
  }
  @Input("icon") set iconInput(v: string | undefined) {
    this._icon.set(v);
  }
  @Input("disabled") set disabledInput(v: boolean) {
    this._disabled.set(v);
  }

  // Decorator-based ViewChild — signal-based viewChild() is not picked up in
  // the AnalogJS+Vitest JIT environment (same family of issues as input()).
  @ViewChild("buttonEl") buttonElRef?: ElementRef<HTMLButtonElement>;

  readonly isSelected = computed(() => this.ctx.value() === this._value());

  readonly triggerId = computed(() => `${this.ctx.baseId()}-trigger-${this._value()}`);
  readonly panelId = computed(() => `${this.ctx.baseId()}-panel-${this._value()}`);

  readonly rootClasses = computed(() =>
    ["sisyphos-tabs-trigger", this.isSelected() && "active", this._disabled() && "disabled"]
      .filter(Boolean)
      .join(" ")
  );

  private registeredValue: string | null = null;

  ngAfterViewInit(): void {
    const v = this._value();
    const el = this.buttonElRef?.nativeElement;
    if (v && el) {
      this.ctx.registerTrigger(v, el);
      this.registeredValue = v;
    }
  }

  ngOnDestroy(): void {
    if (this.registeredValue) this.ctx.unregisterTrigger(this.registeredValue);
  }

  select(): void {
    if (this._disabled()) return;
    this.ctx.setValue(this._value());
  }
}
