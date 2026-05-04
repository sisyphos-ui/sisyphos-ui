/**
 * Switch — Angular 18 standalone toggle with `role="switch"` semantics.
 *
 * Two-way bind via `[(checked)]`:
 *   <sui-switch [(checked)]="enabled" aria-label="Notifications" />
 *
 * Mirrors React/Vue: `checked` is the source of truth, click and Enter/Space
 * fire `(checkedChange)`. An `aria-label` is required when no visible label
 * is rendered alongside the switch.
 */
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Input,
  computed,
  model,
  signal,
} from "@angular/core";

export type SwitchColor = "neutral" | "primary" | "success" | "error" | "warning" | "info";
export type SwitchSize = "sm" | "md" | "lg";

@Component({
  selector: "sui-switch",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      role="switch"
      [class]="rootClasses()"
      [attr.aria-checked]="checked()"
      [attr.aria-label]="ariaLabel() || null"
      [attr.aria-disabled]="disabled() || null"
      [disabled]="disabled()"
      [attr.tabindex]="disabled() ? -1 : null"
      (click)="toggle()"
    >
      <span class="sisyphos-switch-toggle" aria-hidden="true"></span>
    </button>
  `,
})
export class Switch {
  readonly checked = model<boolean>(false);

  private readonly _color = signal<SwitchColor>("primary");
  private readonly _size = signal<SwitchSize>("md");
  private readonly _disabled = signal(false);
  private readonly _ariaLabel = signal<string | undefined>(undefined);

  readonly disabled = this._disabled.asReadonly();
  readonly ariaLabel = this._ariaLabel.asReadonly();

  @Input("color") set colorInput(v: SwitchColor) { this._color.set(v); }
  @Input("size") set sizeInput(v: SwitchSize) { this._size.set(v); }
  @Input("disabled") set disabledInput(v: boolean) { this._disabled.set(v); }
  @Input("aria-label") set ariaLabelInput(v: string | undefined) { this._ariaLabel.set(v); }

  readonly rootClasses = computed(() =>
    [
      "sisyphos-switch",
      this._color(),
      this._size(),
      this.checked() ? "checked" : "unchecked",
      this._disabled() && "disabled",
    ]
      .filter(Boolean)
      .join(" ")
  );

  toggle(): void {
    if (this._disabled()) return;
    this.checked.set(!this.checked());
  }

  @HostListener("keydown", ["$event"])
  handleKeydown(event: KeyboardEvent): void {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      this.toggle();
    }
  }
}
