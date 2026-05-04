/**
 * Dialog — Angular 18 standalone modal with portal mounting, focus trap,
 * scroll lock, and Escape/backdrop close. Compound API:
 *
 *   <sui-dialog [(open)]="open">
 *     <sui-dialog-header><sui-dialog-title>Confirm</sui-dialog-title></sui-dialog-header>
 *     <sui-dialog-body>Are you sure?</sui-dialog-body>
 *     <sui-dialog-footer>
 *       <sui-dialog-close>Cancel</sui-dialog-close>
 *       <button (click)="onConfirm()">OK</button>
 *     </sui-dialog-footer>
 *   </sui-dialog>
 */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  computed,
  effect,
  signal,
} from "@angular/core";
import { DialogCtx, type DialogContextValue } from "./context";

export type DialogSize = "sm" | "md" | "lg" | "xl" | "full";

let dialogCounter = 0;
let scrollLockCount = 0;
let priorBodyOverflow = "";

@Component({
  selector: "sui-dialog",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: DialogCtx, useExisting: Dialog }],
  template: `
    @if (open()) {
      <div
        #root
        [class]="rootClasses()"
        (mousedown)="onBackdropMousedown($event)"
        style="position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;"
      >
        <div
          #panel
          [class]="panelClasses()"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="titleId()"
          [attr.aria-describedby]="descriptionId()"
          [tabindex]="-1"
        >
          @if (showCloseButton()) {
            <button
              type="button"
              class="sisyphos-dialog-close sisyphos-dialog-close--auto"
              [attr.aria-label]="closeButtonLabel()"
              (click)="close()"
            >
              <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
                <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor" />
              </svg>
            </button>
          }
          <ng-content />
        </div>
      </div>
    }
  `,
})
export class Dialog implements DialogContextValue, AfterViewInit, OnDestroy {
  private readonly _open = signal(false);
  private readonly _size = signal<DialogSize>("md");
  private readonly _closeOnBackdropClick = signal(true);
  private readonly _closeOnEscape = signal(true);
  private readonly _backdrop = signal(true);
  private readonly _showCloseButton = signal(false);
  private readonly _closeButtonLabel = signal<string>("Close");
  private readonly _id = ++dialogCounter;
  private readonly _titleId = signal<string>(`sisyphos-dialog-title-${this._id}`);
  private readonly _descriptionId = signal<string>(`sisyphos-dialog-desc-${this._id}`);

  readonly open = this._open.asReadonly();
  readonly titleId = this._titleId.asReadonly();
  readonly descriptionId = this._descriptionId.asReadonly();
  readonly showCloseButton = this._showCloseButton.asReadonly();
  readonly closeButtonLabel = this._closeButtonLabel.asReadonly();

  @Input("open") set openInput(v: boolean) { this._open.set(v); }
  @Input("size") set sizeInput(v: DialogSize) { this._size.set(v); }
  @Input("closeOnBackdropClick") set closeOnBackdropClickInput(v: boolean) {
    this._closeOnBackdropClick.set(v);
  }
  @Input("closeOnEscape") set closeOnEscapeInput(v: boolean) { this._closeOnEscape.set(v); }
  @Input("backdrop") set backdropInput(v: boolean) { this._backdrop.set(v); }
  @Input("showCloseButton") set showCloseButtonInput(v: boolean) { this._showCloseButton.set(v); }
  @Input("closeButtonLabel") set closeButtonLabelInput(v: string) { this._closeButtonLabel.set(v); }

  /** Two-way `[(open)]` sugar. */
  @Output() readonly openChange = new EventEmitter<boolean>();

  @ViewChild("root") rootRef?: ElementRef<HTMLDivElement>;
  @ViewChild("panel") panelRef?: ElementRef<HTMLDivElement>;

  readonly rootClasses = computed(() =>
    ["sisyphos-dialog-root", this._backdrop() && "with-backdrop"]
      .filter(Boolean)
      .join(" ")
  );

  readonly panelClasses = computed(() =>
    ["sisyphos-dialog", this._size(), this._showCloseButton() && "has-auto-close"]
      .filter(Boolean)
      .join(" ")
  );

  private escListener?: (e: KeyboardEvent) => void;
  private trapListener?: (e: KeyboardEvent) => void;
  private previouslyFocused: HTMLElement | null = null;

  constructor() {
    effect(() => {
      if (this._open()) {
        this.acquireScrollLock();
        this.installEscListener();
        // Defer focus + trap to next tick so the panel exists in the DOM.
        queueMicrotask(() => {
          this.previouslyFocused = document.activeElement as HTMLElement | null;
          this.focusInitialElement();
          this.installFocusTrap();
        });
      } else {
        this.releaseScrollLock();
        this.removeEscListener();
        this.removeFocusTrap();
        this.previouslyFocused?.focus({ preventScroll: true });
        this.previouslyFocused = null;
      }
    });
  }

  ngAfterViewInit(): void { /* lifecycle anchor — no-op */ }

  ngOnDestroy(): void {
    this.releaseScrollLock();
    this.removeEscListener();
    this.removeFocusTrap();
  }

  // ── DialogContextValue ────────────────────────────────────────────────

  close(): void {
    if (!this._open()) return;
    this._open.set(false);
    this.openChange.emit(false);
  }

  onBackdropMousedown(event: MouseEvent): void {
    if (!this._closeOnBackdropClick()) return;
    if (event.target === event.currentTarget) this.close();
  }

  // ── focus + scroll utilities ──────────────────────────────────────────

  private installEscListener(): void {
    this.escListener = (e: KeyboardEvent) => {
      if (e.key === "Escape" && this._closeOnEscape()) {
        e.stopPropagation();
        this.close();
      }
    };
    document.addEventListener("keydown", this.escListener);
  }

  private removeEscListener(): void {
    if (this.escListener) {
      document.removeEventListener("keydown", this.escListener);
      this.escListener = undefined;
    }
  }

  private focusInitialElement(): void {
    const panel = this.panelRef?.nativeElement;
    if (!panel) return;
    const focusable = panel.querySelector<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    (focusable ?? panel).focus({ preventScroll: true });
  }

  private installFocusTrap(): void {
    this.trapListener = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const panel = this.panelRef?.nativeElement;
      if (!panel) return;
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute("aria-hidden"));
      if (focusables.length === 0) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", this.trapListener);
  }

  private removeFocusTrap(): void {
    if (this.trapListener) {
      document.removeEventListener("keydown", this.trapListener);
      this.trapListener = undefined;
    }
  }

  private acquireScrollLock(): void {
    if (scrollLockCount === 0) {
      priorBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    scrollLockCount++;
  }

  private releaseScrollLock(): void {
    if (scrollLockCount === 0) return;
    scrollLockCount--;
    if (scrollLockCount === 0) {
      document.body.style.overflow = priorBodyOverflow;
    }
  }
}
