/**
 * Textarea — Angular 18 standalone multiline text input.
 *
 * Variants, sizes, optional auto-resize, character counter, error state.
 * Two-way bind via `[(value)]`. Class names + behavior + ARIA mirror the
 * React/Vue versions.
 */
import type { ElementRef } from "@angular/core";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  computed,
  effect,
  signal,
} from "@angular/core";

let textareaCounter = 0;

@Component({
  selector: "sui-textarea",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="containerClasses()">
      @if (label()) {
        <label [attr.for]="fieldId" [class]="labelClasses()">{{ label() }}</label>
      }
      <textarea
        #nativeTextarea
        [id]="fieldId"
        [class]="textareaClasses()"
        [disabled]="disabled()"
        [readonly]="readOnly()"
        [required]="required()"
        [attr.maxlength]="maxLength() || null"
        [attr.placeholder]="placeholder() || null"
        [attr.rows]="rows() || null"
        [attr.name]="name() || null"
        [style.resize]="resize()"
        [attr.aria-invalid]="error() || null"
        [attr.aria-describedby]="describedBy() || null"
        [value]="value()"
        (focus)="onFocus()"
        (blur)="onBlur()"
        (input)="onInput($event)"
      ></textarea>
      @if (error() && errorMessage()) {
        <span [id]="errorId" class="sisyphos-textarea-error" role="alert">{{
          errorMessage()
        }}</span>
      }
      @if (showCount() && !error()) {
        <span [id]="countId" class="sisyphos-textarea-character-count">
          {{ value().length }} / {{ maxLength() }}
        </span>
      }
    </div>
  `,
})
export class Textarea {
  private readonly _idCounter = ++textareaCounter;
  readonly fieldId = `sisyphos-textarea-${this._idCounter}`;
  readonly errorId = `${this.fieldId}-error`;
  readonly countId = `${this.fieldId}-count`;

  private readonly _value = signal<string>("");
  private readonly _label = signal<string | undefined>(undefined);
  private readonly _placeholder = signal<string | undefined>(undefined);
  private readonly _name = signal<string | undefined>(undefined);
  private readonly _variant = signal<"standard" | "outlined" | "underline">("standard");
  private readonly _size = signal<"xs" | "sm" | "md" | "lg" | "xl">("md");
  private readonly _radius = signal<"none" | "sm" | "md" | "lg" | "full">("sm");
  private readonly _error = signal(false);
  private readonly _errorMessage = signal<string | undefined>(undefined);
  private readonly _disabled = signal(false);
  private readonly _readOnly = signal(false);
  private readonly _required = signal(false);
  private readonly _maxLength = signal<number | undefined>(undefined);
  private readonly _showCharacterCount = signal(false);
  private readonly _autoResize = signal(false);
  private readonly _minRows = signal(2);
  private readonly _maxRows = signal<number | undefined>(undefined);
  private readonly _rows = signal<number | undefined>(undefined);
  private readonly _resize = signal<"none" | "vertical" | "horizontal" | "both">("vertical");
  private readonly _fullWidth = signal(false);

  private readonly _focused = signal(false);

  readonly value = this._value.asReadonly();
  readonly label = this._label.asReadonly();
  readonly placeholder = this._placeholder.asReadonly();
  readonly name = this._name.asReadonly();
  readonly error = this._error.asReadonly();
  readonly errorMessage = this._errorMessage.asReadonly();
  readonly disabled = this._disabled.asReadonly();
  readonly readOnly = this._readOnly.asReadonly();
  readonly required = this._required.asReadonly();
  readonly maxLength = this._maxLength.asReadonly();
  readonly rows = this._rows.asReadonly();
  readonly resize = this._resize.asReadonly();

  @Input("value") set valueInput(v: string | number | null | undefined) {
    if (v === undefined || v === null) return;
    this._value.set(String(v));
  }
  @Input("label") set labelInput(v: string | undefined) {
    this._label.set(v);
  }
  @Input("placeholder") set placeholderInput(v: string | undefined) {
    this._placeholder.set(v);
  }
  @Input("name") set nameInput(v: string | undefined) {
    this._name.set(v);
  }
  @Input("variant") set variantInput(v: "standard" | "outlined" | "underline") {
    this._variant.set(v);
  }
  @Input("size") set sizeInput(v: "xs" | "sm" | "md" | "lg" | "xl") {
    this._size.set(v);
  }
  @Input("radius") set radiusInput(v: "none" | "sm" | "md" | "lg" | "full") {
    this._radius.set(v);
  }
  @Input("error") set errorInput(v: boolean) {
    this._error.set(v);
  }
  @Input("errorMessage") set errorMessageInput(v: string | undefined) {
    this._errorMessage.set(v);
  }
  @Input("disabled") set disabledInput(v: boolean) {
    this._disabled.set(v);
  }
  @Input("readOnly") set readOnlyInput(v: boolean) {
    this._readOnly.set(v);
  }
  @Input("required") set requiredInput(v: boolean) {
    this._required.set(v);
  }
  @Input("maxLength") set maxLengthInput(v: number | undefined) {
    this._maxLength.set(v);
  }
  @Input("showCharacterCount") set showCharacterCountInput(v: boolean) {
    this._showCharacterCount.set(v);
  }
  @Input("autoResize") set autoResizeInput(v: boolean) {
    this._autoResize.set(v);
  }
  @Input("minRows") set minRowsInput(v: number) {
    this._minRows.set(v);
  }
  @Input("maxRows") set maxRowsInput(v: number | undefined) {
    this._maxRows.set(v);
  }
  @Input("rows") set rowsInput(v: number | undefined) {
    this._rows.set(v);
  }
  @Input("resize") set resizeInput(v: "none" | "vertical" | "horizontal" | "both") {
    this._resize.set(v);
  }
  @Input("fullWidth") set fullWidthInput(v: boolean) {
    this._fullWidth.set(v);
  }

  @Output() readonly valueChange = new EventEmitter<string>();

  @ViewChild("nativeTextarea") nativeTextarea?: ElementRef<HTMLTextAreaElement>;

  readonly showCount = computed(() => Boolean(this._maxLength()) && this._showCharacterCount());

  readonly describedBy = computed(() => {
    const ids: string[] = [];
    if (this._error() && this._errorMessage()) ids.push(this.errorId);
    if (this.showCount()) ids.push(this.countId);
    return ids.length > 0 ? ids.join(" ") : null;
  });

  readonly containerClasses = computed(() =>
    [
      "sisyphos-textarea-container",
      this._focused() && "focused",
      this._error() && "error",
      this._disabled() && "disabled",
      this._readOnly() && "read-only",
      this._fullWidth() && "full-width",
    ]
      .filter(Boolean)
      .join(" ")
  );

  readonly textareaClasses = computed(() =>
    [
      "sisyphos-textarea",
      this._variant(),
      this._size(),
      `radius-${this._radius()}`,
      this._error() && "error",
    ]
      .filter(Boolean)
      .join(" ")
  );

  readonly labelClasses = computed(() =>
    [
      "sisyphos-textarea-label",
      this._focused() && "focused",
      this._error() && "error",
      this._disabled() && "disabled",
      this._required() && "required",
    ]
      .filter(Boolean)
      .join(" ")
  );

  constructor() {
    // Auto-resize when value changes (and autoResize is on).
    effect(() => {
      if (!this._autoResize()) return;
      // Track the value so this re-runs on each change.
      void this._value();
      queueMicrotask(() => this.resizeToContent());
    });
  }

  onFocus(): void {
    this._focused.set(true);
  }
  onBlur(): void {
    this._focused.set(false);
  }

  onInput(event: Event): void {
    const next = (event.target as HTMLTextAreaElement).value;
    this._value.set(next);
    this.valueChange.emit(next);
  }

  /** Recomputes textarea height from its scrollHeight, clamped between
   * minRows and maxRows. Mirrors React's `useAutosize` hook. */
  private resizeToContent(): void {
    const el = this.nativeTextarea?.nativeElement;
    if (!el) return;
    const cs = window.getComputedStyle(el);
    const lineHeightStr = cs.lineHeight;
    const lineHeight = lineHeightStr.endsWith("px")
      ? parseFloat(lineHeightStr)
      : parseFloat(cs.fontSize) * 1.2;
    const min = lineHeight * this._minRows();
    const maxRows = this._maxRows();
    const max = maxRows ? lineHeight * maxRows : Infinity;
    el.style.height = "auto";
    const next = Math.min(Math.max(el.scrollHeight, min), max);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > max ? "auto" : "hidden";
  }
}
