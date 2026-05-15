/**
 * NumberInput — Angular 18 standalone numeric input with locale-aware
 * formatting, optional stepper buttons, prefix/suffix slots
 * (`[number-prefix]` / `[number-suffix]`), and `min` / `max` / `step`
 * constraints.
 *
 * Two-way bind via `[(value)]`. `null` represents an empty field.
 */
import type { ElementRef } from "@angular/core";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input as NgInput,
  Output,
  ViewChild,
  computed,
  effect,
  signal,
} from "@angular/core";

let numberCounter = 0;

function clamp(n: number, min?: number, max?: number): number {
  let v = n;
  if (min !== undefined && v < min) v = min;
  if (max !== undefined && v > max) v = max;
  return v;
}

function buildFormatter(
  locale: string | undefined,
  precision: number,
  opts?: Intl.NumberFormatOptions
): Intl.NumberFormat {
  return new Intl.NumberFormat(
    locale,
    opts ?? { minimumFractionDigits: precision, maximumFractionDigits: precision }
  );
}

function parseLocaleNumber(input: string, locale: string | undefined): number | null {
  if (input == null || input === "") return null;
  const example = (1234.5).toLocaleString(locale);
  const decimalSeparator = example.charAt(example.length - 2);
  const cleaned = input
    .replace(new RegExp(`[^\\d\\-${decimalSeparator === "." ? "." : ","}]`, "g"), "")
    .replace(decimalSeparator, ".");
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
}

@Component({
  selector: "sui-number-input",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="rootClasses()">
      @if (label()) {
        <label [attr.for]="fieldId" [class]="labelClasses()">{{ label() }}</label>
      }
      <div [class]="wrapperClasses()">
        @if (withStepper()) {
          <button
            type="button"
            class="sisyphos-number-input-step decrement"
            [disabled]="decrementDisabled()"
            aria-label="Decrement"
            [tabindex]="-1"
            (click)="stepBy(-step())"
          >
            <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
              <path d="M5 10H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
        }
        @if (hasPrefix) {
          <span class="sisyphos-number-input-prefix">
            <ng-content select="[number-prefix]" />
          </span>
        }
        <input
          #nativeInput
          [id]="fieldId"
          type="text"
          [attr.inputmode]="precision() > 0 ? 'decimal' : 'numeric'"
          class="sisyphos-number-input-field"
          [value]="draft()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [readonly]="readOnly()"
          [required]="required()"
          [attr.aria-invalid]="error() || null"
          (focus)="onFocus()"
          (blur)="onBlur()"
          (input)="onInput($event)"
        />
        @if (hasSuffix) {
          <span class="sisyphos-number-input-suffix">
            <ng-content select="[number-suffix]" />
          </span>
        }
        @if (withStepper()) {
          <button
            type="button"
            class="sisyphos-number-input-step increment"
            [disabled]="incrementDisabled()"
            aria-label="Increment"
            [tabindex]="-1"
            (click)="stepBy(step())"
          >
            <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
              <path
                d="M10 5V15M5 10H15"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>
        }
      </div>
      @if (error() && errorMessage()) {
        <span class="sisyphos-number-input-error" role="alert">{{ errorMessage() }}</span>
      }
    </div>
  `,
})
export class NumberInput {
  readonly fieldId = `sisyphos-number-${++numberCounter}`;

  private readonly _value = signal<number | null>(null);
  private readonly _min = signal<number | undefined>(undefined);
  private readonly _max = signal<number | undefined>(undefined);
  private readonly _step = signal<number>(1);
  private readonly _precision = signal<number>(0);
  private readonly _locale = signal<string | undefined>(undefined);
  private readonly _formatOptions = signal<Intl.NumberFormatOptions | undefined>(undefined);
  private readonly _withStepper = signal(true);
  private readonly _variant = signal<"standard" | "outlined" | "underline">("outlined");
  private readonly _size = signal<"sm" | "md" | "lg">("md");
  private readonly _label = signal<string | undefined>(undefined);
  private readonly _placeholder = signal<string>("0");
  private readonly _error = signal(false);
  private readonly _errorMessage = signal<string | undefined>(undefined);
  private readonly _required = signal(false);
  private readonly _fullWidth = signal(false);
  private readonly _disabled = signal(false);
  private readonly _readOnly = signal(false);

  private readonly _focused = signal(false);
  private readonly _draft = signal<string>("");

  readonly value = this._value.asReadonly();
  readonly step = this._step.asReadonly();
  readonly precision = this._precision.asReadonly();
  readonly withStepper = this._withStepper.asReadonly();
  readonly label = this._label.asReadonly();
  readonly placeholder = this._placeholder.asReadonly();
  readonly error = this._error.asReadonly();
  readonly errorMessage = this._errorMessage.asReadonly();
  readonly disabled = this._disabled.asReadonly();
  readonly readOnly = this._readOnly.asReadonly();
  readonly required = this._required.asReadonly();
  readonly draft = this._draft.asReadonly();

  hasPrefix = false;
  hasSuffix = false;

  @NgInput("value") set valueInput(v: number | null | undefined) {
    if (v === undefined) return;
    this._value.set(v);
  }
  @NgInput("min") set minInput(v: number | undefined) {
    this._min.set(v);
  }
  @NgInput("max") set maxInput(v: number | undefined) {
    this._max.set(v);
  }
  @NgInput("step") set stepInput(v: number) {
    this._step.set(v);
  }
  @NgInput("precision") set precisionInput(v: number) {
    this._precision.set(v);
  }
  @NgInput("locale") set localeInput(v: string | undefined) {
    this._locale.set(v);
  }
  @NgInput("numberFormatOptions") set numberFormatOptionsInput(
    v: Intl.NumberFormatOptions | undefined
  ) {
    this._formatOptions.set(v);
  }
  @NgInput("withStepper") set withStepperInput(v: boolean) {
    this._withStepper.set(v);
  }
  @NgInput("variant") set variantInput(v: "standard" | "outlined" | "underline") {
    this._variant.set(v);
  }
  @NgInput("size") set sizeInput(v: "sm" | "md" | "lg") {
    this._size.set(v);
  }
  @NgInput("label") set labelInput(v: string | undefined) {
    this._label.set(v);
  }
  @NgInput("placeholder") set placeholderInput(v: string) {
    this._placeholder.set(v);
  }
  @NgInput("error") set errorInput(v: boolean) {
    this._error.set(v);
  }
  @NgInput("errorMessage") set errorMessageInput(v: string | undefined) {
    this._errorMessage.set(v);
  }
  @NgInput("required") set requiredInput(v: boolean) {
    this._required.set(v);
  }
  @NgInput("fullWidth") set fullWidthInput(v: boolean) {
    this._fullWidth.set(v);
  }
  @NgInput("disabled") set disabledInput(v: boolean) {
    this._disabled.set(v);
  }
  @NgInput("readOnly") set readOnlyInput(v: boolean) {
    this._readOnly.set(v);
  }
  @NgInput("hasPrefix") set hasPrefixInput(v: boolean) {
    this.hasPrefix = v;
  }
  @NgInput("hasSuffix") set hasSuffixInput(v: boolean) {
    this.hasSuffix = v;
  }

  @Output() readonly valueChange = new EventEmitter<number | null>();

  @ViewChild("nativeInput") nativeInput?: ElementRef<HTMLInputElement>;

  private readonly formatter = computed(() =>
    buildFormatter(this._locale(), this._precision(), this._formatOptions())
  );

  readonly decrementDisabled = computed(() => {
    const min = this._min();
    return this._disabled() || (min !== undefined && (this._value() ?? 0) <= min);
  });

  readonly incrementDisabled = computed(() => {
    const max = this._max();
    return this._disabled() || (max !== undefined && (this._value() ?? 0) >= max);
  });

  readonly rootClasses = computed(() =>
    [
      "sisyphos-number-input",
      this._size(),
      this._variant(),
      this._focused() && "focused",
      this._error() && "error",
      this._disabled() && "disabled",
      this._fullWidth() && "full-width",
    ]
      .filter(Boolean)
      .join(" ")
  );

  readonly wrapperClasses = computed(() =>
    [
      "sisyphos-number-input-wrapper",
      this._withStepper() && "has-stepper",
      this.hasSuffix && "has-suffix",
      this.hasPrefix && "has-prefix",
    ]
      .filter(Boolean)
      .join(" ")
  );

  readonly labelClasses = computed(() =>
    ["sisyphos-number-input-label", this._error() && "error", this._required() && "required"]
      .filter(Boolean)
      .join(" ")
  );

  constructor() {
    // Re-format the visible text when value or formatter changes — but only
    // while the input isn't focused (mirrors React's `if (!focused)`).
    effect(() => {
      if (this._focused()) return;
      const v = this._value();
      this._draft.set(v === null ? "" : this.formatter().format(v));
    });
  }

  onFocus(): void {
    this._focused.set(true);
  }

  onBlur(): void {
    this._focused.set(false);
    const v = this._value();
    this._draft.set(v === null ? "" : this.formatter().format(v));
  }

  onInput(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this._draft.set(text);
    const parsed = parseLocaleNumber(text, this._locale());
    const next = parsed === null ? null : clamp(parsed, this._min(), this._max());
    this._value.set(next);
    this.valueChange.emit(next);
  }

  stepBy(delta: number): void {
    if (this._disabled() || this._readOnly()) return;
    const base = this._value() ?? 0;
    const next = clamp(base + delta, this._min(), this._max());
    this._value.set(next);
    this.valueChange.emit(next);
    this._draft.set(this.formatter().format(next));
  }
}
