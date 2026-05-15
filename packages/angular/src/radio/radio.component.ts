/**
 * Radio — Angular 18 standalone radio option. Must be rendered inside a
 * `<sui-radio-group>` to coordinate selection state, shared name, size,
 * color, and variant. Mirrors the React/Vue Radio API, including the
 * "expand on selection" pattern via projected children.
 */
import { ChangeDetectionStrategy, Component, Input, computed, inject, signal } from "@angular/core";
import { RadioGroupCtx } from "./context";

@Component({
  selector: "sui-radio",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label [class]="rootClasses()">
      <span class="sisyphos-radio-row">
        <input
          type="radio"
          class="sisyphos-radio-input"
          [name]="group.name()"
          [value]="value()"
          [checked]="isChecked()"
          [disabled]="effectiveDisabled()"
          [id]="id()"
          (change)="select()"
        />
        <span class="sisyphos-radio-control" aria-hidden="true">
          <span class="sisyphos-radio-inner"></span>
        </span>
        @if (label() || description()) {
          <span class="sisyphos-radio-content">
            @if (icon()) {
              <span class="sisyphos-radio-icon">{{ icon() }}</span>
            }
            <span class="sisyphos-radio-text">
              @if (label()) {
                <span class="sisyphos-radio-label">{{ label() }}</span>
              }
              @if (description()) {
                <span class="sisyphos-radio-description">{{ description() }}</span>
              }
            </span>
          </span>
        }
      </span>
      @if (isChecked()) {
        <span class="sisyphos-radio-nested" (click)="$event.stopPropagation()">
          <ng-content />
        </span>
      }
    </label>
  `,
})
export class Radio {
  protected readonly group = inject(RadioGroupCtx);

  private readonly _value = signal<string | number>("");
  private readonly _label = signal<string | undefined>(undefined);
  private readonly _description = signal<string | undefined>(undefined);
  private readonly _icon = signal<string | undefined>(undefined);
  private readonly _disabled = signal(false);
  private readonly _id = signal<string | undefined>(undefined);

  readonly value = this._value.asReadonly();
  readonly label = this._label.asReadonly();
  readonly description = this._description.asReadonly();
  readonly icon = this._icon.asReadonly();
  readonly id = this._id.asReadonly();

  @Input("value") set valueInput(v: string | number) {
    this._value.set(v);
  }
  @Input("label") set labelInput(v: string | undefined) {
    this._label.set(v);
  }
  @Input("description") set descriptionInput(v: string | undefined) {
    this._description.set(v);
  }
  @Input("icon") set iconInput(v: string | undefined) {
    this._icon.set(v);
  }
  @Input("disabled") set disabledInput(v: boolean) {
    this._disabled.set(v);
  }
  @Input("id") set idInput(v: string | undefined) {
    this._id.set(v);
  }

  readonly effectiveDisabled = computed(() => this._disabled() || this.group.disabled());
  readonly isChecked = computed(() => this.group.value() === this._value());

  readonly rootClasses = computed(() =>
    [
      "sisyphos-radio",
      this.group.variant(),
      this.group.size(),
      this.group.color(),
      this.isChecked() && "checked",
      this.effectiveDisabled() && "disabled",
    ]
      .filter(Boolean)
      .join(" ")
  );

  select(): void {
    if (this.effectiveDisabled()) return;
    this.group.select(this._value());
  }
}
