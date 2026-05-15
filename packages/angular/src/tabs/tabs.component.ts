/**
 * Tabs — Angular 18 standalone tab container.
 *
 * Compound API: compose with `<sui-tabs-list>`, `<sui-tabs-trigger>`,
 * `<sui-tabs-panel>`. Works as controlled (`[value]`) or uncontrolled
 * (`[defaultValue]`).
 *
 * @example
 *   <sui-tabs [(value)]="active" variant="pill">
 *     <sui-tabs-list>
 *       <sui-tabs-trigger value="overview">Overview</sui-tabs-trigger>
 *       <sui-tabs-trigger value="usage">Usage</sui-tabs-trigger>
 *     </sui-tabs-list>
 *     <sui-tabs-panel value="overview">...</sui-tabs-panel>
 *     <sui-tabs-panel value="usage">...</sui-tabs-panel>
 *   </sui-tabs>
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
import { TabsCtx, type TabsContextValue, type TabsOrientation } from "./context";

let nextId = 0;

export type TabsVariant = "underline" | "pill" | "soft";
export type TabsSize = "sm" | "md" | "lg";

@Component({
  selector: "sui-tabs",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: TabsCtx, useExisting: Tabs }],
  template: `
    <div [attr.data-orientation]="orientation()" [class]="rootClasses()">
      <ng-content />
    </div>
  `,
})
export class Tabs implements TabsContextValue {
  private readonly _baseId = signal<string>(`sisyphos-tabs-${++nextId}`);
  private readonly _value = signal<string>("");
  private readonly _defaultValue = signal<string | undefined>(undefined);
  private readonly _orientation = signal<TabsOrientation>("horizontal");
  private readonly _variant = signal<TabsVariant>("underline");
  private readonly _size = signal<TabsSize>("md");
  private readonly _fullWidth = signal(false);

  readonly baseId = this._baseId.asReadonly();
  readonly value = this._value.asReadonly();
  readonly orientation = this._orientation.asReadonly();

  @Input("value") set valueInput(v: string | undefined) {
    if (v !== undefined) this._value.set(v);
  }
  @Input("defaultValue") set defaultValueInput(v: string | undefined) {
    this._defaultValue.set(v);
    if (v && !this._value()) this._value.set(v);
  }
  @Input("orientation") set orientationInput(v: TabsOrientation) {
    this._orientation.set(v);
  }
  @Input("variant") set variantInput(v: TabsVariant) {
    this._variant.set(v);
  }
  @Input("size") set sizeInput(v: TabsSize) {
    this._size.set(v);
  }
  @Input("fullWidth") set fullWidthInput(v: boolean) {
    this._fullWidth.set(v);
  }

  /** Two-way `[(value)]` sugar. */
  @Output() readonly valueChange = new EventEmitter<string>();

  readonly rootClasses = computed(() =>
    [
      "sisyphos-tabs",
      this._orientation(),
      this._variant(),
      this._size(),
      this._fullWidth() && "full-width",
    ]
      .filter(Boolean)
      .join(" ")
  );

  // Trigger registry — populated by `<sui-tabs-trigger>` instances on init.
  private readonly triggers = new Map<string, HTMLElement>();

  setValue(next: string): void {
    if (this._value() === next) return;
    this._value.set(next);
    this.valueChange.emit(next);
  }

  registerTrigger(value: string, el: HTMLElement): void {
    this.triggers.set(value, el);
  }

  unregisterTrigger(value: string): void {
    this.triggers.delete(value);
  }

  focusValue(value: string): void {
    this.triggers.get(value)?.focus();
  }

  triggerValues(): string[] {
    return Array.from(this.triggers.keys());
  }
}
