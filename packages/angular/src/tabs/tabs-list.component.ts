/**
 * TabsList — `<sui-tabs-list>` host for triggers.
 *
 * Owns:
 *   - role="tablist" + aria-orientation
 *   - Roving tabindex via arrow-key navigation (Home/End jump to first/last)
 *   - Animated indicator that tracks the active trigger's bounding box. Uses
 *     `ResizeObserver` + `window.resize` to stay in sync, exactly matching
 *     the React/Vue versions' behavior.
 */
import type {
  AfterViewInit,
  ElementRef,
  OnDestroy} from "@angular/core";
import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  effect,
  inject,
  signal,
} from "@angular/core";
import { TabsCtx } from "./context";

@Component({
  selector: "sui-tabs-list",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      #list
      role="tablist"
      [attr.aria-orientation]="ctx.orientation()"
      class="sisyphos-tabs-list"
      (keydown)="handleKeydown($event)"
    >
      @if (indicator()) {
        <span
          class="sisyphos-tabs-indicator"
          [style.transform]="indicatorTransform()"
          [style.width.px]="indicator()!.width"
          [style.height.px]="indicator()!.height"
          aria-hidden="true"
        ></span>
      }
      <ng-content />
    </div>
  `,
})
export class TabsList implements AfterViewInit, OnDestroy {
  protected readonly ctx = inject(TabsCtx);

  @ViewChild("list") listRef?: ElementRef<HTMLDivElement>;

  protected readonly indicator = signal<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  protected readonly indicatorTransform = (): string => {
    const ind = this.indicator();
    return ind ? `translate(${ind.x}px, ${ind.y}px)` : "";
  };

  private resizeObserver: ResizeObserver | null = null;
  private resizeListener?: () => void;

  constructor() {
    // Recompute indicator whenever the active value changes — matches React's
    // useLayoutEffect([ctx.value]).
    effect(() => {
      this.ctx.value();
      // Defer until next microtask so the trigger's class updates have flushed.
      queueMicrotask(() => this.measure());
    });
  }

  ngAfterViewInit(): void {
    this.measure();
    if (typeof ResizeObserver !== "undefined" && this.listRef) {
      this.resizeObserver = new ResizeObserver(() => this.measure());
      this.resizeObserver.observe(this.listRef.nativeElement);
    }
    this.resizeListener = () => this.measure();
    window.addEventListener("resize", this.resizeListener);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    if (this.resizeListener) window.removeEventListener("resize", this.resizeListener);
  }

  private measure(): void {
    const list = this.listRef?.nativeElement;
    if (!list) return;
    const value = this.ctx.value();
    if (!value) {
      this.indicator.set(null);
      return;
    }
    // Use attribute selector to find the active trigger; CSS.escape protects
    // values containing special characters.
    const escaped = typeof CSS !== "undefined" && (CSS as unknown as { escape: (v: string) => string }).escape
      ? (CSS as unknown as { escape: (v: string) => string }).escape(value)
      : value.replace(/(["\\])/g, "\\$1");
    const active = list.querySelector(`[data-sisyphos-tab-value="${escaped}"]`) as HTMLElement | null;
    if (!active) {
      this.indicator.set(null);
      return;
    }
    const aRect = active.getBoundingClientRect();
    const lRect = list.getBoundingClientRect();
    this.indicator.set({
      x: aRect.left - lRect.left,
      y: aRect.top - lRect.top,
      width: aRect.width,
      height: aRect.height,
    });
  }

  handleKeydown(event: KeyboardEvent): void {
    const horizontal = this.ctx.orientation() === "horizontal";
    const next = horizontal ? "ArrowRight" : "ArrowDown";
    const prev = horizontal ? "ArrowLeft" : "ArrowUp";
    if (event.key !== next && event.key !== prev && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const all = this.ctx.triggerValues();
    if (all.length === 0) return;
    const idx = Math.max(0, all.indexOf(this.ctx.value()));
    let nextIdx = idx;
    if (event.key === next) nextIdx = (idx + 1) % all.length;
    else if (event.key === prev) nextIdx = (idx - 1 + all.length) % all.length;
    else if (event.key === "Home") nextIdx = 0;
    else if (event.key === "End") nextIdx = all.length - 1;
    const target = all[nextIdx];
    if (target) {
      this.ctx.setValue(target);
      this.ctx.focusValue(target);
    }
  }
}
