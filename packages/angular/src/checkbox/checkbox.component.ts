/**
 * Checkbox — Angular 17 standalone binding.
 *
 * Two-way bind via the `checked` model signal:
 *   `<sui-checkbox [(checked)]="value" />`
 *
 * Defers the toggle/indeterminate-promotion rule to the framework-agnostic
 * `nextCheckboxStateAfterToggle` helper from `@sisyphos-ui/core`, so the
 * indeterminate→checked transition matches the React and Vue bindings exactly.
 *
 * No internal state for `checked` — the model signal IS the source of truth.
 * `indeterminate` is a one-way input mirrored to the native input's DOM
 * property via an effect (it's a property, not an attribute).
 */
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  input,
  model,
  viewChild,
} from "@angular/core";
import { nextCheckboxStateAfterToggle } from "@sisyphos-ui/core";

export type CheckboxColor = "neutral" | "primary" | "success" | "error" | "warning" | "info";
export type CheckboxSize = "sm" | "md" | "lg";
export type CheckboxRadius = "none" | "sm" | "md" | "lg" | "full";

/**
 * Note on styles: this binding does NOT use `styleUrl` for the Sass file.
 * Styles are global (`sisyphos-checkbox` class names, not Angular's view
 * encapsulation), so consumers import the bundled stylesheet once at app
 * bootstrap (`@import "@sisyphos-ui/angular/styles";`) — same model as the
 * React and Vue bindings. This also keeps tests JIT-compatible: external
 * `styleUrl` references would force callers to run `resolveComponentResources()`
 * before every TestBed run.
 */
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
          [attr.name]="name() || null"
          [attr.aria-checked]="indeterminate() ? 'mixed' : checked()"
          [attr.aria-label]="ariaLabel() || null"
          (change)="handleToggle()"
        />
        <span class="sisyphos-checkbox-indicator" aria-hidden="true">
          @if (indeterminate()) {
            <svg viewBox="0 0 16 16" width="100%" height="100%">
              <line x1="3.5" y1="8" x2="12.5" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          } @else if (checked()) {
            <svg viewBox="0 0 16 16" width="100%" height="100%" fill="none">
              <path d="M3.5 8.5l3 3 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
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
  readonly indeterminate = input(false);
  readonly disabled = input(false);
  readonly label = input<string>();
  readonly name = input<string>();
  readonly ariaLabel = input<string>();
  readonly color = input<CheckboxColor>("primary");
  readonly size = input<CheckboxSize>("md");
  readonly radius = input<CheckboxRadius>("sm");

  private readonly nativeInput = viewChild<ElementRef<HTMLInputElement>>("nativeInput");

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

  constructor() {
    // `indeterminate` is a DOM property on <input>, not an HTML attribute —
    // it must be set imperatively. Mirrors React's useEffect + ref pattern.
    effect(() => {
      const el = this.nativeInput()?.nativeElement;
      if (el) el.indeterminate = this.indeterminate();
    });
  }

  handleToggle(): void {
    const next = nextCheckboxStateAfterToggle({
      checked: this.checked(),
      indeterminate: this.indeterminate(),
      disabled: this.disabled(),
    });
    this.checked.set(next.checked);
  }
}
