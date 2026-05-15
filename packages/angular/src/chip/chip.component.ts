/**
 * Chip — Angular 18 standalone compact label.
 *
 * Optional avatar/start icon, end icon, and a separate delete button so
 * activating the chip itself does not trigger deletion. Class names and
 * keyboard semantics match the React/Vue versions exactly.
 *
 * Slots are projected via attribute selectors:
 *   <sui-chip clickable [color]="'primary'">
 *     <span chip-avatar>VG</span>     <!-- or -->
 *     <svg chip-start-icon>...</svg>
 *     My label
 *     <svg chip-end-icon>...</svg>
 *   </sui-chip>
 *
 * For deletable chips, listen on `(delete)` — the chip emits whenever the
 * embedded delete button is activated.
 */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  computed,
  signal,
} from "@angular/core";

export type ChipVariant = "contained" | "outlined" | "soft";
export type ChipColor = "primary" | "success" | "error" | "warning" | "info";
export type ChipSize = "xs" | "sm" | "md" | "lg" | "xl";
export type ChipRadius = ChipSize | "full";

@Component({
  selector: "sui-chip",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="rootClasses()"
      [attr.role]="isInteractive() ? 'button' : null"
      [attr.tabindex]="isInteractive() ? 0 : null"
      [attr.aria-disabled]="disabled() || null"
      (click)="handleHostClick($event)"
    >
      <span class="sisyphos-chip-avatar" aria-hidden="true">
        <ng-content select="[chip-avatar]" />
      </span>
      <span class="sisyphos-chip-icon sisyphos-chip-icon--start" aria-hidden="true">
        <ng-content select="[chip-start-icon]" />
      </span>
      <span class="sisyphos-chip-label">
        <ng-content />
      </span>
      @if (deletable()) {
        <button
          type="button"
          class="sisyphos-chip-delete"
          [attr.aria-label]="deleteAriaLabel()"
          [disabled]="disabled()"
          [attr.tabindex]="disabled() ? -1 : 0"
          (click)="handleDelete($event)"
        >
          <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
            <path
              d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              fill="currentColor"
            />
          </svg>
        </button>
      } @else {
        <span class="sisyphos-chip-icon sisyphos-chip-icon--end" aria-hidden="true">
          <ng-content select="[chip-end-icon]" />
        </span>
      }
    </div>
  `,
  styles: [
    `
      .sisyphos-chip-avatar:empty,
      .sisyphos-chip-icon:empty {
        display: none;
      }
    `,
  ],
})
export class Chip {
  private readonly _variant = signal<ChipVariant>("soft");
  private readonly _color = signal<ChipColor>("primary");
  private readonly _size = signal<ChipSize>("md");
  private readonly _radius = signal<ChipRadius>("full");
  private readonly _disabled = signal(false);
  private readonly _clickable = signal(false);
  private readonly _deletable = signal(false);
  private readonly _deleteAriaLabel = signal("Remove");

  readonly disabled = this._disabled.asReadonly();
  readonly deletable = this._deletable.asReadonly();
  readonly deleteAriaLabel = this._deleteAriaLabel.asReadonly();

  @Input("variant") set variantInput(v: ChipVariant) {
    this._variant.set(v);
  }
  @Input("color") set colorInput(v: ChipColor) {
    this._color.set(v);
  }
  @Input("size") set sizeInput(v: ChipSize) {
    this._size.set(v);
  }
  @Input("radius") set radiusInput(v: ChipRadius) {
    this._radius.set(v);
  }
  @Input("disabled") set disabledInput(v: boolean) {
    this._disabled.set(v);
  }
  @Input("clickable") set clickableInput(v: boolean) {
    this._clickable.set(v);
  }
  @Input("deletable") set deletableInput(v: boolean) {
    this._deletable.set(v);
  }
  @Input("deleteAriaLabel") set deleteAriaLabelInput(v: string) {
    this._deleteAriaLabel.set(v);
  }

  /** Fires when the embedded delete button is activated. */
  @Output() readonly delete = new EventEmitter<MouseEvent>();

  /** Fires when an interactive chip is activated via click or Enter/Space. */
  @Output() readonly chipClick = new EventEmitter<Event>();

  readonly isInteractive = computed(() => this._clickable() && !this._disabled());

  readonly rootClasses = computed(() =>
    [
      "sisyphos-chip",
      this._variant(),
      this._color(),
      this._size(),
      this._radius() === "full" ? "radius-full" : `radius-${this._radius()}`,
      this._disabled() && "disabled",
      this.isInteractive() && "clickable",
      this._deletable() && "has-delete",
    ]
      .filter(Boolean)
      .join(" ")
  );

  handleHostClick(event: MouseEvent): void {
    if (!this.isInteractive()) return;
    this.chipClick.emit(event);
  }

  handleDelete(event: MouseEvent): void {
    event.stopPropagation();
    if (this._disabled()) return;
    this.delete.emit(event);
  }

  @HostListener("keydown", ["$event"])
  handleKeydown(event: KeyboardEvent): void {
    if (!this.isInteractive()) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.chipClick.emit(event);
    }
  }
}
