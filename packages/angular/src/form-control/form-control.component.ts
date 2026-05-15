/**
 * FormControl — Angular 18 standalone wrapper that coordinates id/ARIA
 * wiring between `<sui-form-label>`, the input element, `<sui-form-helper-text>`,
 * and `<sui-form-error-text>`.
 *
 * @example
 *   <sui-form-control [required]="true" [error]="!!err">
 *     <sui-form-label>Email</sui-form-label>
 *     <input type="email" formControlName="email" />
 *     <sui-form-helper-text>We'll never share it.</sui-form-helper-text>
 *     <sui-form-error-text>{{ err }}</sui-form-error-text>
 *   </sui-form-control>
 */
import { ChangeDetectionStrategy, Component, Input, computed, signal } from "@angular/core";
import { FormControlCtx, type FormControlContextValue } from "./context";

let fcCounter = 0;

@Component({
  selector: "sui-form-control",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: FormControlCtx, useExisting: FormControl }],
  template: `
    <div [class]="rootClasses()">
      <ng-content />
    </div>
  `,
})
export class FormControl implements FormControlContextValue {
  private readonly _id = signal<string>(`sisyphos-field-${++fcCounter}`);
  private readonly _disabled = signal(false);
  private readonly _required = signal(false);
  private readonly _readOnly = signal(false);
  private readonly _error = signal(false);
  private readonly _fullWidth = signal(false);

  readonly id = this._id.asReadonly();
  readonly disabled = this._disabled.asReadonly();
  readonly required = this._required.asReadonly();
  readonly readOnly = this._readOnly.asReadonly();
  readonly error = this._error.asReadonly();

  readonly labelId = computed(() => `${this._id()}-label`);
  readonly helperId = computed(() => `${this._id()}-helper`);
  readonly errorId = computed(() => `${this._id()}-error`);

  readonly describedBy = computed(() => (this._error() ? this.errorId() : this.helperId()));

  @Input("id") set idInput(v: string | undefined) {
    if (v) this._id.set(v);
  }
  @Input("disabled") set disabledInput(v: boolean) {
    this._disabled.set(v);
  }
  @Input("required") set requiredInput(v: boolean) {
    this._required.set(v);
  }
  @Input("readOnly") set readOnlyInput(v: boolean) {
    this._readOnly.set(v);
  }
  @Input("error") set errorInput(v: boolean) {
    this._error.set(v);
  }
  @Input("fullWidth") set fullWidthInput(v: boolean) {
    this._fullWidth.set(v);
  }

  readonly rootClasses = computed(() =>
    [
      "sisyphos-form-control",
      this._error() && "error",
      this._disabled() && "disabled",
      this._fullWidth() && "full-width",
    ]
      .filter(Boolean)
      .join(" ")
  );
}
