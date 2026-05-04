/**
 * FormControl compound parts — Label, HelperText, ErrorText.
 *
 * Each is a tiny standalone component that reads parent state via the
 * `FormControlCtx` DI token. When used outside a `<sui-form-control>`
 * ancestor, the consumer can pass the IDs explicitly via inputs and we
 * fall back gracefully (no DI lookup).
 */
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  inject,
  signal,
} from "@angular/core";
import { FormControlCtx } from "./context";

@Component({
  selector: "sui-form-label",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label
      [id]="effectiveId()"
      [attr.for]="effectiveFor()"
      [class]="labelClasses()"
    >
      <ng-content />
      @if (showRequired()) {
        <span class="sisyphos-form-label-required" aria-hidden="true">*</span>
      }
    </label>
  `,
})
export class FormLabel {
  private readonly ctx = inject(FormControlCtx, { optional: true });

  private readonly _for = signal<string | undefined>(undefined);
  private readonly _id = signal<string | undefined>(undefined);

  @Input("for") set forInput(v: string | undefined) { this._for.set(v); }
  @Input("id") set idInput(v: string | undefined) { this._id.set(v); }

  readonly effectiveId = computed(() => this._id() ?? this.ctx?.labelId() ?? null);
  readonly effectiveFor = computed(() => this._for() ?? this.ctx?.id() ?? null);

  readonly showRequired = computed(() => Boolean(this.ctx?.required()));

  readonly labelClasses = computed(() =>
    [
      "sisyphos-form-label",
      this.ctx?.disabled() && "disabled",
    ]
      .filter(Boolean)
      .join(" ")
  );
}

@Component({
  selector: "sui-form-helper-text",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <p [id]="effectiveId()" class="sisyphos-form-helper-text">
        <ng-content />
      </p>
    }
  `,
})
export class FormHelperText {
  private readonly ctx = inject(FormControlCtx, { optional: true });

  private readonly _id = signal<string | undefined>(undefined);
  @Input("id") set idInput(v: string | undefined) { this._id.set(v); }

  readonly effectiveId = computed(() => this._id() ?? this.ctx?.helperId() ?? null);
  /** Hidden when the parent FormControl is in error state — leaves room for
   * the FormErrorText sibling (matches React/Vue). Always visible when
   * standalone. */
  readonly visible = computed(() => !this.ctx?.error());
}

@Component({
  selector: "sui-form-error-text",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <p [id]="effectiveId()" role="alert" class="sisyphos-form-error-text">
        <ng-content />
      </p>
    }
  `,
})
export class FormErrorText {
  private readonly ctx = inject(FormControlCtx, { optional: true });

  private readonly _id = signal<string | undefined>(undefined);
  @Input("id") set idInput(v: string | undefined) { this._id.set(v); }

  readonly effectiveId = computed(() => this._id() ?? this.ctx?.errorId() ?? null);
  /** Visible only when the parent FormControl is in error state. Standalone
   * usage (no FormControl ancestor) always renders. */
  readonly visible = computed(() => !this.ctx || this.ctx.error());
}
