/**
 * RadioGroup — Angular 18 standalone group container.
 *
 * Coordinates selection state and shared options (name, size, color, variant)
 * for nested `<sui-radio>` children via DI. The component itself implements
 * `RadioGroupContextValue` and is provided under the `RadioGroupCtx` token,
 * so children read state through `inject(RadioGroupCtx)`.
 *
 * Two consumption models:
 *
 *   1. Composition — children:
 *      <sui-radio-group [(value)]="picked">
 *        <sui-radio value="a" label="Apple" />
 *        <sui-radio value="b" label="Banana" />
 *      </sui-radio-group>
 *
 *   2. Flat options array (one-shot forms):
 *      <sui-radio-group [(value)]="picked" [options]="opts" />
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
import { Radio } from "./radio.component";
import {
  RadioGroupCtx,
  type RadioGroupColor,
  type RadioGroupContextValue,
  type RadioGroupSize,
  type RadioGroupVariant,
} from "./context";

export interface RadioOption {
  value: string | number;
  label?: string;
  description?: string;
  icon?: string;
  disabled?: boolean;
}

let nameCounter = 0;
const nextName = () => `sisyphos-radio-${++nameCounter}`;

@Component({
  selector: "sui-radio-group",
  standalone: true,
  imports: [Radio],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: RadioGroupCtx, useExisting: RadioGroup }],
  template: `
    <div class="sisyphos-radio-group">
      @if (label()) {
        <div [class]="labelClasses()">{{ label() }}</div>
      }
      <div
        role="radiogroup"
        [attr.aria-label]="label() || null"
        [attr.aria-required]="required() || null"
        [attr.aria-invalid]="error() || null"
        [class]="optionsClasses()"
      >
        @if (options() && options()!.length > 0) {
          @for (o of options(); track o.value) {
            <sui-radio
              [value]="o.value"
              [label]="o.label"
              [description]="o.description"
              [icon]="o.icon"
              [disabled]="o.disabled ?? false"
            />
          }
        } @else {
          <ng-content />
        }
      </div>
      @if (allowAddOption()) {
        <button
          type="button"
          class="sisyphos-radio-add-option"
          [disabled]="disabled()"
          (click)="addOption.emit()"
        >
          <span aria-hidden="true">+</span>
          <span>{{ addOptionLabel() }}</span>
        </button>
      }
      @if (error() && errorMessage()) {
        <span class="sisyphos-radio-group-error" role="alert">{{ errorMessage() }}</span>
      }
    </div>
  `,
})
export class RadioGroup implements RadioGroupContextValue {
  // Value is exposed via @Input setter + @Output emitter rather than model()
  // because model() two-way bindings do not propagate through the AnalogJS
  // JIT test environment. The @Input/@Output pair gives identical sugar:
  // `[(value)]="picked"` works exactly the same.
  private readonly _value = signal<string | number | undefined>(undefined);
  readonly value = this._value.asReadonly();

  @Input("value") set valueInput(v: string | number | undefined) {
    this._value.set(v);
  }
  @Output() readonly valueChange = new EventEmitter<string | number>();

  private readonly _name = signal<string>(nextName());
  private readonly _disabled = signal(false);
  private readonly _required = signal(false);
  private readonly _label = signal<string | undefined>(undefined);
  private readonly _error = signal(false);
  private readonly _errorMessage = signal<string | undefined>(undefined);
  private readonly _direction = signal<"horizontal" | "vertical">("vertical");
  private readonly _size = signal<RadioGroupSize>("md");
  private readonly _color = signal<RadioGroupColor>("primary");
  private readonly _variant = signal<RadioGroupVariant>("standard");
  private readonly _options = signal<RadioOption[] | undefined>(undefined);
  private readonly _allowAddOption = signal(false);
  private readonly _addOptionLabel = signal<string>("Add option");

  // Public read API — these satisfy the RadioGroupContextValue interface.
  readonly name = this._name.asReadonly();
  readonly disabled = this._disabled.asReadonly();
  readonly required = this._required.asReadonly();
  readonly label = this._label.asReadonly();
  readonly error = this._error.asReadonly();
  readonly errorMessage = this._errorMessage.asReadonly();
  readonly size = this._size.asReadonly();
  readonly color = this._color.asReadonly();
  readonly variant = this._variant.asReadonly();
  readonly options = this._options.asReadonly();
  readonly allowAddOption = this._allowAddOption.asReadonly();
  readonly addOptionLabel = this._addOptionLabel.asReadonly();

  @Input("name") set nameInput(v: string | undefined) {
    if (v) this._name.set(v);
  }
  @Input("disabled") set disabledInput(v: boolean) { this._disabled.set(v); }
  @Input("required") set requiredInput(v: boolean) { this._required.set(v); }
  @Input("label") set labelInput(v: string | undefined) { this._label.set(v); }
  @Input("error") set errorInput(v: boolean) { this._error.set(v); }
  @Input("errorMessage") set errorMessageInput(v: string | undefined) { this._errorMessage.set(v); }
  @Input("direction") set directionInput(v: "horizontal" | "vertical") { this._direction.set(v); }
  @Input("size") set sizeInput(v: RadioGroupSize) { this._size.set(v); }
  @Input("color") set colorInput(v: RadioGroupColor) { this._color.set(v); }
  @Input("variant") set variantInput(v: RadioGroupVariant) { this._variant.set(v); }
  @Input("options") set optionsInput(v: RadioOption[] | undefined) { this._options.set(v); }
  @Input("allowAddOption") set allowAddOptionInput(v: boolean) { this._allowAddOption.set(v); }
  @Input("addOptionLabel") set addOptionLabelInput(v: string) { this._addOptionLabel.set(v); }

  @Output() readonly addOption = new EventEmitter<void>();

  readonly labelClasses = computed(() =>
    [
      "sisyphos-radio-group-label",
      this._error() && "error",
      this._required() && "required",
    ]
      .filter(Boolean)
      .join(" ")
  );

  readonly optionsClasses = computed(
    () => `sisyphos-radio-options ${this._direction()}`
  );

  /** Implements RadioGroupContextValue — invoked by `<sui-radio>` on selection. */
  select(next: string | number): void {
    this._value.set(next);
    this.valueChange.emit(next);
  }
}
