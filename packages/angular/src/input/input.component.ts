/**
 * Input — Angular 18 standalone text field with optional label, error
 * state, three visual variants, password visibility toggle, copy button,
 * character counter, and input masking.
 *
 * Two-way bind via `[(value)]`. Class names + behavior + ARIA mirror the
 * React/Vue versions exactly.
 */
import type {
  ElementRef} from "@angular/core";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input as NgInput,
  Output,
  ViewChild,
  computed,
  signal,
} from "@angular/core";
import { applyMask, getMaskPrefixLength, unmask } from "./mask";

let inputCounter = 0;

export type InputVariant = "standard" | "outlined" | "underline";
export type InputSize = "xs" | "sm" | "md" | "lg" | "xl";
export type InputRadius = "none" | "sm" | "md" | "lg" | "full";

@Component({
  selector: "sui-input",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="containerClasses()">
      @if (label()) {
        <label [attr.for]="inputId" [class]="labelClasses()">
          <span class="sisyphos-input-label-text">{{ label() }}</span>
          @if (labelTooltip()) {
            <span
              class="sisyphos-input-label-tooltip"
              role="img"
              [attr.aria-label]="labelTooltip()"
              [title]="labelTooltip()"
              [tabindex]="0"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm1 15h-2v-6h2zm0-8h-2V7h2z" />
              </svg>
            </span>
          }
        </label>
      }
      <div class="sisyphos-input-wrapper">
        @if (hasStartIcon) {
          <span class="sisyphos-input-icon sisyphos-input-icon--start">
            <ng-content select="[input-start-icon]" />
          </span>
        }
        <input
          #nativeInput
          [id]="inputId"
          [type]="effectiveType()"
          [class]="inputClasses()"
          [disabled]="disabled()"
          [readonly]="readOnly()"
          [required]="required()"
          [attr.maxlength]="maxLength() || null"
          [attr.placeholder]="placeholder() || null"
          [attr.name]="name() || null"
          [attr.autocomplete]="autocomplete() || null"
          [attr.aria-invalid]="error() || null"
          [attr.aria-describedby]="describedBy() || null"
          [value]="displayValue()"
          (focus)="onFocus($event)"
          (blur)="onBlur($event)"
          (input)="onInput($event)"
          (click)="onClick()"
          (keyup)="onKeyup()"
        />
        @if (endIconVisible()) {
          <span class="sisyphos-input-icon sisyphos-input-icon--end">
            <ng-content select="[input-end-icon]" />
          </span>
        }
        @if (copyable() && !isPassword()) {
          <button
            type="button"
            class="sisyphos-input-copy-button"
            [tabindex]="-1"
            [attr.aria-label]="copied() ? 'Copied' : 'Copy to clipboard'"
            aria-live="polite"
            (click)="copyToClipboard($event)"
          >
            @if (copied()) {
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            } @else {
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
            }
          </button>
        }
        @if (isPassword()) {
          <button
            type="button"
            class="sisyphos-input-password-toggle"
            [tabindex]="-1"
            [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
            (click)="togglePassword($event)"
          >
            @if (showPassword()) {
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            } @else {
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            }
          </button>
        }
      </div>
      @if (error() && errorMessage()) {
        <span [id]="errorId" class="sisyphos-input-error" role="alert">{{ errorMessage() }}</span>
      }
      @if (showCount() && !error()) {
        <span [id]="countId" class="sisyphos-input-character-count">
          {{ displayValue().length }} / {{ maxLength() }}
        </span>
      }
    </div>
  `,
  styles: [
    `
      .sisyphos-input-icon:empty { display: none; }
    `,
  ],
})
export class Input {
  private readonly _idCounter = ++inputCounter;
  readonly inputId = `sisyphos-input-${this._idCounter}`;
  readonly errorId = `${this.inputId}-error`;
  readonly countId = `${this.inputId}-count`;

  // Inputs ──────────────────────────────────────────────────────────────
  private readonly _value = signal<string>("");
  private readonly _label = signal<string | undefined>(undefined);
  private readonly _labelTooltip = signal<string | undefined>(undefined);
  private readonly _placeholder = signal<string | undefined>(undefined);
  private readonly _name = signal<string | undefined>(undefined);
  private readonly _autocomplete = signal<string | undefined>(undefined);
  private readonly _type = signal<string>("text");
  private readonly _variant = signal<InputVariant>("standard");
  private readonly _size = signal<InputSize>("md");
  private readonly _radius = signal<InputRadius>("sm");
  private readonly _error = signal(false);
  private readonly _errorMessage = signal<string | undefined>(undefined);
  private readonly _disabled = signal(false);
  private readonly _readOnly = signal(false);
  private readonly _required = signal(false);
  private readonly _maxLength = signal<number | undefined>(undefined);
  private readonly _showCharacterCount = signal(false);
  private readonly _fullWidth = signal(false);
  private readonly _copyable = signal(false);
  private readonly _mask = signal<string | undefined>(undefined);

  // Internal state ──────────────────────────────────────────────────────
  private readonly _focused = signal(false);
  private readonly _showPassword = signal(false);
  private readonly _copied = signal(false);

  // Public read API ─────────────────────────────────────────────────────
  readonly value = this._value.asReadonly();
  readonly label = this._label.asReadonly();
  readonly labelTooltip = this._labelTooltip.asReadonly();
  readonly placeholder = this._placeholder.asReadonly();
  readonly name = this._name.asReadonly();
  readonly autocomplete = this._autocomplete.asReadonly();
  readonly error = this._error.asReadonly();
  readonly errorMessage = this._errorMessage.asReadonly();
  readonly disabled = this._disabled.asReadonly();
  readonly readOnly = this._readOnly.asReadonly();
  readonly required = this._required.asReadonly();
  readonly maxLength = this._maxLength.asReadonly();
  readonly copyable = this._copyable.asReadonly();
  readonly showPassword = this._showPassword.asReadonly();
  readonly copied = this._copied.asReadonly();

  /** Slot presence flags — consumers set them to true when projecting. */
  hasStartIcon = false;
  hasEndIcon = false;

  @NgInput("value") set valueInput(v: string | number | null | undefined) {
    if (v === undefined || v === null) return;
    this._value.set(String(v));
  }
  @NgInput("label") set labelInput(v: string | undefined) { this._label.set(v); }
  @NgInput("labelTooltip") set labelTooltipInput(v: string | undefined) {
    this._labelTooltip.set(v);
  }
  @NgInput("placeholder") set placeholderInput(v: string | undefined) { this._placeholder.set(v); }
  @NgInput("name") set nameInput(v: string | undefined) { this._name.set(v); }
  @NgInput("autocomplete") set autocompleteInput(v: string | undefined) {
    this._autocomplete.set(v);
  }
  @NgInput("type") set typeInput(v: string) { this._type.set(v); }
  @NgInput("variant") set variantInput(v: InputVariant) { this._variant.set(v); }
  @NgInput("size") set sizeInput(v: InputSize) { this._size.set(v); }
  @NgInput("radius") set radiusInput(v: InputRadius) { this._radius.set(v); }
  @NgInput("error") set errorInput(v: boolean) { this._error.set(v); }
  @NgInput("errorMessage") set errorMessageInput(v: string | undefined) {
    this._errorMessage.set(v);
  }
  @NgInput("disabled") set disabledInput(v: boolean) { this._disabled.set(v); }
  @NgInput("readOnly") set readOnlyInput(v: boolean) { this._readOnly.set(v); }
  @NgInput("required") set requiredInput(v: boolean) { this._required.set(v); }
  @NgInput("maxLength") set maxLengthInput(v: number | undefined) { this._maxLength.set(v); }
  @NgInput("showCharacterCount") set showCharacterCountInput(v: boolean) {
    this._showCharacterCount.set(v);
  }
  @NgInput("fullWidth") set fullWidthInput(v: boolean) { this._fullWidth.set(v); }
  @NgInput("copyable") set copyableInput(v: boolean) { this._copyable.set(v); }
  @NgInput("mask") set maskInput(v: string | undefined) { this._mask.set(v); }
  @NgInput("hasStartIcon") set hasStartIconInput(v: boolean) { this.hasStartIcon = v; }
  @NgInput("hasEndIcon") set hasEndIconInput(v: boolean) { this.hasEndIcon = v; }

  /** Two-way `[(value)]` for the (masked) display value. */
  @Output() readonly valueChange = new EventEmitter<string>();
  /** Emits the unmasked raw value when `mask` is set. */
  @Output() readonly unmaskedChange = new EventEmitter<string>();
  /** Emits when copy-to-clipboard succeeds. */
  @Output() readonly copy = new EventEmitter<string>();

  @ViewChild("nativeInput") nativeInput?: ElementRef<HTMLInputElement>;

  readonly isPassword = computed(() => this._type() === "password");

  readonly effectiveType = computed(() =>
    this.isPassword() && this._showPassword() ? "text" : this._type()
  );

  readonly displayValue = computed(() => {
    const m = this._mask();
    return m ? applyMask(this._value(), m) : this._value();
  });

  readonly endIconVisible = computed(
    () => this.hasEndIcon && !this._copyable() && !this.isPassword()
  );

  readonly hasTrailingAffordance = computed(
    () => this.isPassword() || this._copyable() || this.hasEndIcon
  );

  readonly showCount = computed(
    () => Boolean(this._maxLength()) && this._showCharacterCount()
  );

  readonly describedBy = computed(() => {
    const ids: string[] = [];
    if (this._error() && this._errorMessage()) ids.push(this.errorId);
    if (this.showCount()) ids.push(this.countId);
    return ids.length > 0 ? ids.join(" ") : null;
  });

  readonly containerClasses = computed(() =>
    [
      "sisyphos-input-container",
      this._focused() && "focused",
      this._error() && "error",
      this._disabled() && "disabled",
      this._readOnly() && "read-only",
      this.hasStartIcon && "has-start-icon",
      this.hasTrailingAffordance() && "has-end-adornment",
      this._fullWidth() && "full-width",
    ]
      .filter(Boolean)
      .join(" ")
  );

  readonly inputClasses = computed(() =>
    [
      "sisyphos-input",
      this._variant(),
      this._size(),
      `radius-${this._radius()}`,
      this._focused() && "focused",
      this._error() && "error",
    ]
      .filter(Boolean)
      .join(" ")
  );

  readonly labelClasses = computed(() =>
    [
      "sisyphos-input-label",
      this._focused() && "focused",
      this._error() && "error",
      this._disabled() && "disabled",
      this._readOnly() && "read-only",
      this._required() && "required",
    ]
      .filter(Boolean)
      .join(" ")
  );

  // Event handlers ──────────────────────────────────────────────────────

  onFocus(event: FocusEvent): void {
    this._focused.set(true);
    if (this._mask() && getMaskPrefixLength(this._mask()!) > 0) {
      requestAnimationFrame(() => this.protectMaskPrefix());
    }
    void event;
  }

  onBlur(_event: FocusEvent): void {
    this._focused.set(false);
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    let next = target.value;
    const m = this._mask();
    if (m) {
      next = applyMask(next, m);
      target.value = next; // keep DOM in sync
    }
    this._value.set(next);
    this.valueChange.emit(next);
    if (m) this.unmaskedChange.emit(unmask(next, m));
    if (m && getMaskPrefixLength(m) > 0) {
      requestAnimationFrame(() => this.protectMaskPrefix());
    }
  }

  onClick(): void {
    if (this._mask() && getMaskPrefixLength(this._mask()!) > 0) {
      this.protectMaskPrefix();
    }
  }

  onKeyup(): void {
    if (this._mask() && getMaskPrefixLength(this._mask()!) > 0) {
      this.protectMaskPrefix();
    }
  }

  togglePassword(event: MouseEvent): void {
    event.preventDefault();
    this._showPassword.update((v) => !v);
  }

  async copyToClipboard(event: MouseEvent): Promise<void> {
    event.preventDefault();
    const node = this.nativeInput?.nativeElement;
    if (!node) return;
    const value = node.value ?? "";
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        node.select();
        document.execCommand("copy");
      }
      this._copied.set(true);
      this.copy.emit(value);
      setTimeout(() => this._copied.set(false), 1500);
    } catch {
      // silently ignore — caller can read .value() directly
    }
  }

  /** Prevent the caret from landing inside a fixed mask prefix. */
  private protectMaskPrefix(): void {
    const node = this.nativeInput?.nativeElement;
    const m = this._mask();
    if (!node || !m) return;
    const prefix = getMaskPrefixLength(m);
    if (prefix === 0) return;
    const start = node.selectionStart ?? 0;
    const end = node.selectionEnd ?? 0;
    if (start < prefix && start === end) {
      try {
        node.setSelectionRange(prefix, prefix);
      } catch {
        // setSelectionRange throws on non-text input types — ignore
      }
    }
  }
}
