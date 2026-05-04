/**
 * Popover — Angular 18 standalone interactive floating panel anchored to a
 * trigger element. Mirrors the React/Vue versions: click/hover/manual triggers,
 * auto-flip placement, outside-click + Escape close.
 *
 * Two named projection slots:
 *   - default — the trigger element (projected into the anchor wrapper)
 *   - `[popover-content]` — the floating panel content
 *
 * @example
 *   <sui-popover trigger="click" placement="bottom">
 *     <button>Open</button>
 *     <div popover-content>
 *       <p>Anything you like.</p>
 *     </div>
 *   </sui-popover>
 */
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  computed,
  effect,
  signal,
} from "@angular/core";
import { computePosition, type Placement } from "@sisyphos-ui/core/internal";

let popoverCounter = 0;

@Component({
  selector: "sui-popover",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      #anchorWrapper
      class="sisyphos-popover-anchor"
      [attr.aria-haspopup]="trigger() === 'click' ? 'dialog' : null"
      [attr.aria-expanded]="open() || null"
      [attr.aria-controls]="visible() ? popoverId : null"
      (click)="onAnchorClick($event)"
      (mouseenter)="onAnchorEnter()"
      (mouseleave)="onAnchorLeave()"
      (focusin)="onAnchorEnter()"
      (focusout)="onAnchorLeave()"
    >
      <ng-content />
    </span>
    @if (visible()) {
      <div
        #panelRef
        [id]="popoverId"
        role="dialog"
        [class]="panelClasses()"
        [style.position]="'fixed'"
        [style.left.px]="pos()?.left ?? 0"
        [style.top.px]="pos()?.top ?? 0"
        [style.opacity]="pos() ? 1 : 0"
        [style.z-index]="1100"
        (mouseenter)="onPanelEnter()"
        (mouseleave)="onPanelLeave()"
      >
        <ng-content select="[popover-content]" />
        @if (arrow()) {
          <span class="sisyphos-popover-arrow" aria-hidden="true"></span>
        }
      </div>
    }
  `,
})
export class Popover implements OnDestroy {
  readonly popoverId = `sisyphos-popover-${++popoverCounter}`;

  private readonly _open = signal(false);
  private readonly _placement = signal<Placement>("bottom");
  private readonly _offset = signal(8);
  private readonly _trigger = signal<"click" | "hover" | "manual">("click");
  private readonly _openDelay = signal(100);
  private readonly _closeDelay = signal(100);
  private readonly _arrow = signal(false);
  private readonly _disabled = signal(false);
  private readonly _closeOnEscape = signal(true);
  private readonly _closeOnOutsideClick = signal(true);
  protected readonly pos = signal<{ left: number; top: number; placement: Placement } | null>(null);

  readonly open = this._open.asReadonly();
  readonly trigger = this._trigger.asReadonly();
  readonly arrow = this._arrow.asReadonly();
  readonly visible = computed(() => this._open() && !this._disabled());

  @Input("open") set openInput(v: boolean) {
    if (typeof v === "boolean") this._open.set(v);
  }
  @Input("placement") set placementInput(v: Placement) { this._placement.set(v); }
  @Input("offset") set offsetInput(v: number) { this._offset.set(v); }
  @Input("trigger") set triggerInput(v: "click" | "hover" | "manual") { this._trigger.set(v); }
  @Input("openDelay") set openDelayInput(v: number) { this._openDelay.set(v); }
  @Input("closeDelay") set closeDelayInput(v: number) { this._closeDelay.set(v); }
  @Input("arrow") set arrowInput(v: boolean) { this._arrow.set(v); }
  @Input("disabled") set disabledInput(v: boolean) { this._disabled.set(v); }
  @Input("closeOnEscape") set closeOnEscapeInput(v: boolean) { this._closeOnEscape.set(v); }
  @Input("closeOnOutsideClick") set closeOnOutsideClickInput(v: boolean) {
    this._closeOnOutsideClick.set(v);
  }

  @Output() readonly openChange = new EventEmitter<boolean>();

  @ViewChild("anchorWrapper") anchorWrapperRef?: ElementRef<HTMLElement>;
  @ViewChild("panelRef") panelEl?: ElementRef<HTMLDivElement>;

  readonly panelClasses = computed(
    () => `sisyphos-popover ${this.pos()?.placement ?? this._placement()}`
  );

  private openTimer: ReturnType<typeof setTimeout> | null = null;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;
  private resizeListener?: () => void;
  private scrollListener?: () => void;

  constructor() {
    effect(() => {
      if (this.visible()) {
        // Defer to next paint so the panel is in the DOM and measurable.
        queueMicrotask(() => requestAnimationFrame(() => this.reposition()));
        this.installScrollListeners();
      } else {
        this.pos.set(null);
        this.removeScrollListeners();
      }
    });
  }

  ngOnDestroy(): void {
    this.clearTimers();
    this.removeScrollListeners();
  }

  // ── trigger event handlers ────────────────────────────────────────────

  onAnchorClick(_event: MouseEvent): void {
    if (this._trigger() !== "click" || this._disabled()) return;
    this.setOpen(!this._open());
  }

  onAnchorEnter(): void {
    if (this._trigger() === "hover" && !this._disabled()) {
      this.schedule(true, this._openDelay());
    }
  }

  onAnchorLeave(): void {
    if (this._trigger() === "hover") {
      this.schedule(false, this._closeDelay());
    }
  }

  onPanelEnter(): void {
    if (this._trigger() === "hover") this.clearTimers();
  }

  onPanelLeave(): void {
    if (this._trigger() === "hover") this.schedule(false, this._closeDelay());
  }

  @HostListener("document:keydown.escape")
  onEscape(): void {
    if (this.visible() && this._closeOnEscape()) this.setOpen(false);
  }

  @HostListener("document:mousedown", ["$event"])
  onDocumentMousedown(event: MouseEvent): void {
    if (!this.visible() || !this._closeOnOutsideClick()) return;
    const tgt = event.target as Node | null;
    const anchor = this.anchorWrapperRef?.nativeElement;
    const panel = this.panelEl?.nativeElement;
    if (anchor?.contains(tgt as Node)) return;
    if (panel?.contains(tgt as Node)) return;
    this.setOpen(false);
  }

  // ── internals ─────────────────────────────────────────────────────────

  private setOpen(next: boolean): void {
    if (this._open() === next) return;
    this._open.set(next);
    this.openChange.emit(next);
  }

  private clearTimers(): void {
    if (this.openTimer) { clearTimeout(this.openTimer); this.openTimer = null; }
    if (this.closeTimer) { clearTimeout(this.closeTimer); this.closeTimer = null; }
  }

  private schedule(next: boolean, delay: number): void {
    this.clearTimers();
    const timer = setTimeout(() => this.setOpen(next), delay);
    if (next) this.openTimer = timer;
    else this.closeTimer = timer;
  }

  private reposition(): void {
    const anchor = this.anchorWrapperRef?.nativeElement;
    const panel = this.panelEl?.nativeElement;
    if (!anchor || !panel) return;
    const a = anchor.getBoundingClientRect();
    const size = { width: panel.offsetWidth, height: panel.offsetHeight };
    const p = computePosition(a, size, this._placement(), this._offset());
    this.pos.set(p);
  }

  private installScrollListeners(): void {
    this.scrollListener = () => this.reposition();
    this.resizeListener = () => this.reposition();
    window.addEventListener("scroll", this.scrollListener, true);
    window.addEventListener("resize", this.resizeListener);
  }

  private removeScrollListeners(): void {
    if (this.scrollListener) {
      window.removeEventListener("scroll", this.scrollListener, true);
      this.scrollListener = undefined;
    }
    if (this.resizeListener) {
      window.removeEventListener("resize", this.resizeListener);
      this.resizeListener = undefined;
    }
  }
}
