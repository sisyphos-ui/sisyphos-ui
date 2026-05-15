/**
 * Checkbox — Angular 18 standalone binding.
 *
 * Two-way bind via the `checked` model signal:
 *   `<sui-checkbox [(checked)]="value" />`
 *
 * Defers the toggle/indeterminate-promotion rule to the framework-agnostic
 * `nextCheckboxStateAfterToggle` helper from `@sisyphos-ui/core`, so the
 * indeterminate→checked transition matches the React and Vue bindings exactly.
 *
 * On the API surface:
 *   - `model()` for `checked` (two-way) — set via `[(checked)]` or `.set()`
 *   - aliased `@Input()` setters for one-way props, with the public read
 *     surface exposed as readonly signals (`size()`, `disabled()`, etc.)
 *
 * The hybrid keeps every prop on a signal — so computeds, templates, and
 * effects stay reactive — while routing writes through @Input setters that
 * the AnalogJS+Vitest test runner accepts (signal `input()` does not work
 * in that JIT environment).
 *
 * Note on styles: this binding does NOT use `styleUrl`. Styles are global
 * (`sisyphos-checkbox` class names, no view encapsulation) and consumers
 * import the bundled stylesheet once at app bootstrap — same model as the
 * React and Vue bindings.
 */
import { ChangeDetectionStrategy, Component, Input, computed, model, signal } from "@angular/core";
import { nextCheckboxStateAfterToggle } from "@sisyphos-ui/core";

export type CheckboxColor = "neutral" | "primary" | "success" | "error" | "warning" | "info";
export type CheckboxSize = "sm" | "md" | "lg";
export type CheckboxRadius = "none" | "sm" | "md" | "lg" | "full";

@Component({
  selector: "sui-checkbox",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label [class]="containerClasses()">
      <span class="sisyphos-checkbox-box">
        <input
          #nativeInput
          type="checkbox"
          class="sisyphos-checkbox-native"
          [checked]="checked()"
          [disabled]="disabled()"
          [indeterminate]="indeterminate()"
          [attr.name]="name() || null"
          [attr.aria-checked]="indeterminate() ? 'mixed' : checked()"
          [attr.aria-label]="ariaLabel() || null"
          (change)="handleToggle()"
        />
        <span class="sisyphos-checkbox-indicator" aria-hidden="true">
          @if (indeterminate()) {
            <svg viewBox="0 0 16 16" width="100%" height="100%">
              <line
                x1="3.5"
                y1="8"
                x2="12.5"
                y2="8"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          } @else if (checked()) {
            <svg viewBox="0 0 16 16" width="100%" height="100%" fill="none">
              <path
                d="M3.5 8.5l3 3 6-6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          }
        </span>
      </span>
      @if (label()) {
        <span class="sisyphos-checkbox-label">{{ label() }}</span>
      }
    </label>
  `,
})
export class Checkbox {
  readonly checked = model<boolean>(false);

  // Backing signals.
  private readonly _indeterminate = signal(false);
  private readonly _disabled = signal(false);
  private readonly _label = signal<string | undefined>(undefined);
  private readonly _name = signal<string | undefined>(undefined);
  private readonly _ariaLabel = signal<string | undefined>(undefined);
  private readonly _color = signal<CheckboxColor>("primary");
  private readonly _size = signal<CheckboxSize>("md");
  private readonly _radius = signal<CheckboxRadius>("sm");

  // Public read API — readonly signals consumed by templates and computeds.
  readonly indeterminate = this._indeterminate.asReadonly();
  readonly disabled = this._disabled.asReadonly();
  readonly label = this._label.asReadonly();
  readonly name = this._name.asReadonly();
  readonly ariaLabel = this._ariaLabel.asReadonly();
  readonly color = this._color.asReadonly();
  readonly size = this._size.asReadonly();
  readonly radius = this._radius.asReadonly();

  // @Input aliases — the public binding name is the alias (e.g. `[size]`),
  // the setter method has a different name to avoid colliding with the
  // signal property of the same public name.
  @Input("indeterminate") set indeterminateInput(v: boolean) {
    this._indeterminate.set(v);
  }
  @Input("disabled") set disabledInput(v: boolean) {
    this._disabled.set(v);
  }
  @Input("label") set labelInput(v: string | undefined) {
    this._label.set(v);
  }
  @Input("name") set nameInput(v: string | undefined) {
    this._name.set(v);
  }
  @Input("aria-label") set ariaLabelInput(v: string | undefined) {
    this._ariaLabel.set(v);
  }
  @Input("color") set colorInput(v: CheckboxColor) {
    this._color.set(v);
  }
  @Input("size") set sizeInput(v: CheckboxSize) {
    this._size.set(v);
  }
  @Input("radius") set radiusInput(v: CheckboxRadius) {
    this._radius.set(v);
  }

  readonly containerClasses = computed(() =>
    [
      "sisyphos-checkbox",
      this.size(),
      this.color(),
      `radius-${this.radius()}`,
      this.disabled() && "disabled",
      this.checked() && "checked",
      this.indeterminate() && "indeterminate",
    ]
      .filter(Boolean)
      .join(" ")
  );

  handleToggle(): void {
    const next = nextCheckboxStateAfterToggle({
      checked: this.checked(),
      indeterminate: this.indeterminate(),
      disabled: this.disabled(),
    });
    this.checked.set(next.checked);
  }
}
