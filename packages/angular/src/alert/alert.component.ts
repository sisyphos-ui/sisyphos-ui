/**
 * Alert — Angular 18 standalone inline callout for persistent messages.
 * For transient notifications use Toast.
 *
 * Slots: title, description, projected children, named [alert-icon] override
 * (set `[hideIcon]="true"` to omit), [alert-actions]. Optional close button
 * via `(close)` output. `[autoCloseDuration]` ms triggers `(close)` after
 * the timer elapses (mirrors React's autoCloseDuration behavior).
 */
import type { OnDestroy } from "@angular/core";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  effect,
  signal,
} from "@angular/core";

export type AlertColor = "primary" | "success" | "error" | "warning" | "info";
export type AlertVariant = "contained" | "outlined" | "soft";

@Component({
  selector: "sui-alert",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="rootClasses()" [attr.role]="effectiveRole()">
      @if (!hideIcon()) {
        <div class="sisyphos-alert-icon">
          <ng-content select="[alert-icon]" />
          @if (!hasCustomIcon) {
            @switch (color()) {
              @case ("primary") {
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <polygon points="12 2 15 9 22 10 17 15 18 22 12 18 6 22 7 15 2 10 9 9 12 2" />
                </svg>
              }
              @case ("success") {
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              }
              @case ("error") {
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              }
              @case ("warning") {
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path
                    d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                  />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              }
              @case ("info") {
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              }
            }
          }
        </div>
      }
      <div class="sisyphos-alert-body">
        @if (title()) {
          <div class="sisyphos-alert-title">{{ title() }}</div>
        }
        @if (description()) {
          <div class="sisyphos-alert-description">{{ description() }}</div>
        }
        <ng-content />
        <div class="sisyphos-alert-actions">
          <ng-content select="[alert-actions]" />
        </div>
      </div>
      @if (closable()) {
        <button
          type="button"
          class="sisyphos-alert-close"
          [attr.aria-label]="closeAriaLabel()"
          (click)="closeAlert($event)"
        >
          <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
            <path
              d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              fill="currentColor"
            />
          </svg>
        </button>
      }
    </div>
  `,
  styles: [
    `
      .sisyphos-alert-actions:empty {
        display: none;
      }
    `,
  ],
})
export class Alert implements OnDestroy {
  private readonly _variant = signal<AlertVariant>("soft");
  private readonly _color = signal<AlertColor>("info");
  private readonly _title = signal<string | undefined>(undefined);
  private readonly _description = signal<string | undefined>(undefined);
  private readonly _hideIcon = signal(false);
  private readonly _closable = signal(false);
  private readonly _closeAriaLabel = signal<string>("Close");
  private readonly _autoCloseDuration = signal<number | undefined>(undefined);
  private readonly _role = signal<string | undefined>(undefined);

  readonly color = this._color.asReadonly();
  readonly title = this._title.asReadonly();
  readonly description = this._description.asReadonly();
  readonly hideIcon = this._hideIcon.asReadonly();
  readonly closable = this._closable.asReadonly();
  readonly closeAriaLabel = this._closeAriaLabel.asReadonly();

  /** Set to `true` when the consumer projects custom content into [alert-icon]
   * — toggles off the default semantic glyph. We can't easily detect projection
   * presence in the template, so the consumer signals it via the boolean. */
  hasCustomIcon = false;

  @Input("variant") set variantInput(v: AlertVariant) {
    this._variant.set(v);
  }
  @Input("color") set colorInput(v: AlertColor) {
    this._color.set(v);
  }
  @Input("title") set titleInput(v: string | undefined) {
    this._title.set(v);
  }
  @Input("description") set descriptionInput(v: string | undefined) {
    this._description.set(v);
  }
  @Input("hideIcon") set hideIconInput(v: boolean) {
    this._hideIcon.set(v);
  }
  @Input("closable") set closableInput(v: boolean) {
    this._closable.set(v);
  }
  @Input("closeAriaLabel") set closeAriaLabelInput(v: string) {
    this._closeAriaLabel.set(v);
  }
  @Input("autoCloseDuration") set autoCloseDurationInput(v: number | undefined) {
    this._autoCloseDuration.set(v);
  }
  @Input("role") set roleInput(v: string | undefined) {
    this._role.set(v);
  }
  @Input("hasCustomIcon") set hasCustomIconInput(v: boolean) {
    this.hasCustomIcon = v;
  }

  /** Emitted when the close button is clicked or autoCloseDuration elapses. */
  @Output() readonly close = new EventEmitter<void>();

  readonly rootClasses = computed(() => `sisyphos-alert ${this._variant()} ${this._color()}`);

  readonly effectiveRole = computed(
    () => this._role() ?? (this._color() === "error" ? "alert" : "status")
  );

  private autoCloseTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // Re-arm the auto-close timer whenever the duration changes.
    effect(() => {
      const dur = this._autoCloseDuration();
      if (this.autoCloseTimer) {
        clearTimeout(this.autoCloseTimer);
        this.autoCloseTimer = null;
      }
      if (dur && dur > 0) {
        this.autoCloseTimer = setTimeout(() => {
          this.close.emit();
        }, dur);
      }
    });
  }

  closeAlert(event?: MouseEvent): void {
    void event;
    this.close.emit();
  }

  ngOnDestroy(): void {
    if (this.autoCloseTimer) clearTimeout(this.autoCloseTimer);
  }
}
