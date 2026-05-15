/**
 * Tooltip — Angular 18 standalone attribute directive.
 *
 * Mounts a portal-style div on `document.body` when the host receives
 * pointerenter or focus, with auto-flip placement matching the React/Vue
 * versions. The directive form is the idiomatic Angular shape for this
 * kind of behavioral attachment (Material, ng-bootstrap, CDK all do
 * tooltips this way) — and keeps the consumer template free of wrapper
 * elements:
 *
 *   <button sui-tooltip="Save changes" placement="bottom">Save</button>
 */
import type { OnDestroy, OnInit } from "@angular/core";
import { Directive, ElementRef, HostListener, Input, effect, inject, signal } from "@angular/core";
import { computePosition, type Placement } from "@sisyphos-ui/core/internal";

let tooltipCounter = 0;

@Directive({
  selector: "[sui-tooltip]",
  standalone: true,
})
export class TooltipDirective implements OnInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Tooltip text. Empty/null disables the tooltip. */
  @Input("sui-tooltip") set contentInput(v: string | null | undefined) {
    this._content.set(v ?? "");
  }
  @Input("placement") set placementInput(v: Placement) {
    this._placement.set(v);
  }
  @Input("offset") set offsetInput(v: number) {
    this._offset.set(v);
  }
  @Input("openDelay") set openDelayInput(v: number) {
    this._openDelay.set(v);
  }
  @Input("closeDelay") set closeDelayInput(v: number) {
    this._closeDelay.set(v);
  }
  @Input("disabled") set disabledInput(v: boolean) {
    this._disabled.set(v);
  }
  @Input("arrow") set arrowInput(v: boolean) {
    this._arrow.set(v);
  }

  private readonly _content = signal<string>("");
  private readonly _placement = signal<Placement>("top");
  private readonly _offset = signal<number>(8);
  private readonly _openDelay = signal<number>(200);
  private readonly _closeDelay = signal<number>(100);
  private readonly _disabled = signal<boolean>(false);
  private readonly _arrow = signal<boolean>(true);

  private readonly visible = signal(false);

  private element: HTMLDivElement | null = null;
  private openTimer: ReturnType<typeof setTimeout> | null = null;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;
  private resizeListener?: () => void;
  private scrollListener?: () => void;
  private escListener?: (e: KeyboardEvent) => void;
  private readonly tooltipId = `sisyphos-tooltip-${++tooltipCounter}`;

  constructor() {
    // Observe visibility to mount/unmount the tooltip element.
    effect(() => {
      const show = this.visible() && !!this._content() && !this._disabled();
      if (show) this.mount();
      else this.unmount();
    });
    effect(() => {
      // Update the rendered text and position whenever inputs change.
      if (!this.element) return;
      const text = this._content();
      this.element.firstChild!.textContent = text;
      this.reposition();
    });
  }

  ngOnInit(): void {
    // No-op; pointer/focus listeners are wired via @HostListener.
  }

  ngOnDestroy(): void {
    this.clearTimers();
    this.unmount();
  }

  // ── pointer + focus on the host ────────────────────────────────────────

  @HostListener("mouseenter")
  onMouseEnter(): void {
    this.scheduleOpen();
  }

  @HostListener("mouseleave")
  onMouseLeave(): void {
    this.scheduleClose();
  }

  @HostListener("focus")
  onFocus(): void {
    this.scheduleOpen();
  }

  @HostListener("blur")
  onBlur(): void {
    this.scheduleClose();
  }

  // ── timers ─────────────────────────────────────────────────────────────

  private clearTimers(): void {
    if (this.openTimer) {
      clearTimeout(this.openTimer);
      this.openTimer = null;
    }
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }

  private scheduleOpen(): void {
    if (this._disabled() || !this._content()) return;
    this.clearTimers();
    this.openTimer = setTimeout(() => this.visible.set(true), this._openDelay());
  }

  private scheduleClose(): void {
    this.clearTimers();
    this.closeTimer = setTimeout(() => this.visible.set(false), this._closeDelay());
  }

  // ── element lifecycle ──────────────────────────────────────────────────

  private mount(): void {
    if (this.element) return;
    const div = document.createElement("div");
    div.id = this.tooltipId;
    div.role = "tooltip";
    div.className = `sisyphos-tooltip ${this._placement()}`;
    div.style.position = "fixed";
    div.style.left = "0";
    div.style.top = "0";
    div.style.opacity = "0";
    const text = document.createTextNode(this._content());
    div.appendChild(text);
    if (this._arrow()) {
      const arrow = document.createElement("span");
      arrow.className = "sisyphos-tooltip-arrow";
      arrow.setAttribute("aria-hidden", "true");
      div.appendChild(arrow);
    }
    div.addEventListener("mouseenter", () => this.clearTimers());
    div.addEventListener("mouseleave", () => this.scheduleClose());
    document.body.appendChild(div);
    this.element = div;

    // ARIA wiring on the host.
    const existing = this.host.nativeElement.getAttribute("aria-describedby");
    this.host.nativeElement.setAttribute(
      "aria-describedby",
      [existing, this.tooltipId].filter(Boolean).join(" ")
    );

    // Reposition + listeners.
    requestAnimationFrame(() => requestAnimationFrame(() => this.reposition()));
    this.scrollListener = () => this.reposition();
    this.resizeListener = () => this.reposition();
    window.addEventListener("scroll", this.scrollListener, true);
    window.addEventListener("resize", this.resizeListener);

    // Escape closes the tooltip globally.
    this.escListener = (e: KeyboardEvent) => {
      if (e.key === "Escape") this.visible.set(false);
    };
    document.addEventListener("keydown", this.escListener);
  }

  private unmount(): void {
    if (!this.element) return;
    this.element.remove();
    this.element = null;
    if (this.scrollListener) window.removeEventListener("scroll", this.scrollListener, true);
    if (this.resizeListener) window.removeEventListener("resize", this.resizeListener);
    if (this.escListener) document.removeEventListener("keydown", this.escListener);

    // Cleanup ARIA — strip the tooltip id, keep anything else.
    const existing = this.host.nativeElement.getAttribute("aria-describedby") ?? "";
    const cleaned = existing
      .split(/\s+/)
      .filter((id) => id && id !== this.tooltipId)
      .join(" ");
    if (cleaned) this.host.nativeElement.setAttribute("aria-describedby", cleaned);
    else this.host.nativeElement.removeAttribute("aria-describedby");
  }

  private reposition(): void {
    const el = this.element;
    if (!el) return;
    const anchor = this.host.nativeElement.getBoundingClientRect();
    const size = { width: el.offsetWidth, height: el.offsetHeight };
    const p = computePosition(anchor, size, this._placement(), this._offset());
    el.style.left = `${p.left}px`;
    el.style.top = `${p.top}px`;
    el.style.opacity = "1";
    el.className = `sisyphos-tooltip ${p.placement}`;
  }
}
