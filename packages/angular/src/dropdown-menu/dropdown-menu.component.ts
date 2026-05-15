/**
 * DropdownMenu — Angular 18 standalone action menu following the WAI-ARIA
 * menu-button pattern.
 *
 * Click the trigger to open; navigate with Arrow/Home/End, activate with
 * Enter/Space, close with Escape or outside click. Item list comes from
 * the `[items]` array. Mirrors the React/Vue versions exactly.
 *
 * @example
 *   <sui-dropdown-menu [items]="items">
 *     <button>Actions</button>
 *   </sui-dropdown-menu>
 */
import type { ElementRef, OnDestroy } from "@angular/core";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
  computed,
  effect,
  signal,
} from "@angular/core";
import { computePosition, type Placement } from "@sisyphos-ui/core/internal";
import { isDropdownMenuAction, type DropdownMenuItem } from "./types";

let menuCounter = 0;

@Component({
  selector: "sui-dropdown-menu",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      #anchor
      class="sisyphos-dropdown-anchor"
      aria-haspopup="menu"
      [attr.aria-expanded]="open() || null"
      [attr.aria-controls]="open() ? menuId : null"
      (click)="toggle()"
      (keydown)="onAnchorKeydown($event)"
    >
      <ng-content />
    </span>
    @if (visible()) {
      <div
        #panel
        [class]="panelClasses()"
        [style.position]="'fixed'"
        [style.left.px]="pos()?.left ?? 0"
        [style.top.px]="pos()?.top ?? 0"
        [style.opacity]="pos() ? 1 : 0"
        [style.max-height]="maxHeight()"
        [style.z-index]="1100"
        (scroll)="onPanelScroll($event)"
      >
        @if (hasHeader) {
          <div class="sisyphos-dropdown-menu-header">
            <ng-content select="[menu-header]" />
          </div>
        }
        @if (items().length === 0 && hasEmpty) {
          <div class="sisyphos-dropdown-menu-empty" role="note">
            <ng-content select="[menu-empty]" />
          </div>
        } @else {
          <ul
            #list
            [id]="menuId"
            role="menu"
            class="sisyphos-dropdown-menu-list"
            (keydown)="onMenuKeydown($event)"
          >
            @for (item of items(); track $index; let i = $index) {
              @if (item.type === "separator") {
                <li class="sisyphos-dropdown-menu-separator" role="separator"></li>
              } @else if (item.type === "label") {
                <li class="sisyphos-dropdown-menu-label" role="presentation">{{ item.label }}</li>
              } @else {
                <li
                  role="menuitem"
                  [tabindex]="activeIndex() === i ? 0 : -1"
                  [attr.aria-disabled]="item.disabled || null"
                  [class]="itemClasses(item)"
                  (mouseenter)="setActive(i)"
                  (click)="select(item, $event)"
                  [attr.data-index]="i"
                >
                  @if (item.icon) {
                    <span class="sisyphos-dropdown-menu-item-icon">{{ item.icon }}</span>
                  }
                  <span class="sisyphos-dropdown-menu-item-label">{{ item.label }}</span>
                  @if (item.shortcut) {
                    <span class="sisyphos-dropdown-menu-item-shortcut">{{ item.shortcut }}</span>
                  }
                </li>
              }
            }
          </ul>
        }
        @if (hasFooter) {
          <div class="sisyphos-dropdown-menu-footer">
            <ng-content select="[menu-footer]" />
          </div>
        }
      </div>
    }
  `,
})
export class DropdownMenu implements OnDestroy {
  readonly menuId = `sisyphos-menu-${++menuCounter}`;

  private readonly _items = signal<DropdownMenuItem[]>([]);
  private readonly _open = signal(false);
  private readonly _placement = signal<Placement>("bottom-start");
  private readonly _offset = signal(4);
  private readonly _disabled = signal(false);
  private readonly _maxHeight = signal<string | null>(null);
  private readonly _scrollEndThreshold = signal(48);
  protected readonly pos = signal<{ left: number; top: number; placement: Placement } | null>(null);
  private readonly _activeIndex = signal(-1);

  readonly items = this._items.asReadonly();
  readonly open = this._open.asReadonly();
  readonly visible = computed(() => this._open() && !this._disabled());
  readonly maxHeight = this._maxHeight.asReadonly();
  readonly activeIndex = this._activeIndex.asReadonly();

  /** Boolean flags toggled via attribute presence on the host element so we
   * can opt-out of rendering empty header/footer/empty wrappers. */
  hasHeader = false;
  hasFooter = false;
  hasEmpty = false;

  @Input("items") set itemsInput(v: DropdownMenuItem[]) {
    this._items.set(v ?? []);
  }
  @Input("open") set openInput(v: boolean) {
    if (typeof v !== "boolean") return;
    const wasOpen = this._open();
    this._open.set(v);
    if (v && !wasOpen) {
      // Seed active index eagerly when opening — keeps DOM focus/tabindex
      // wiring synchronous (the effect-based path requires a second change
      // detection pass to flush, which tests can't always trigger).
      const first = this.actionIndexes()[0] ?? -1;
      this._activeIndex.set(first);
    } else if (!v) {
      this._activeIndex.set(-1);
    }
  }
  @Input("placement") set placementInput(v: Placement) {
    this._placement.set(v);
  }
  @Input("offset") set offsetInput(v: number) {
    this._offset.set(v);
  }
  @Input("disabled") set disabledInput(v: boolean) {
    this._disabled.set(v);
  }
  @Input("maxHeight") set maxHeightInput(v: number | string | null) {
    this._maxHeight.set(typeof v === "number" ? `${v}px` : v);
  }
  @Input("scrollEndThreshold") set scrollEndThresholdInput(v: number) {
    this._scrollEndThreshold.set(v);
  }
  @Input("hasHeader") set hasHeaderInput(v: boolean) {
    this.hasHeader = v;
  }
  @Input("hasFooter") set hasFooterInput(v: boolean) {
    this.hasFooter = v;
  }
  @Input("hasEmpty") set hasEmptyInput(v: boolean) {
    this.hasEmpty = v;
  }

  @Output() readonly openChange = new EventEmitter<boolean>();
  @Output() readonly scrollEnd = new EventEmitter<void>();

  @ViewChild("anchor") anchorRef?: ElementRef<HTMLSpanElement>;
  @ViewChild("panel") panelRef?: ElementRef<HTMLDivElement>;
  @ViewChild("list") listRef?: ElementRef<HTMLUListElement>;

  readonly panelClasses = computed(() =>
    [
      "sisyphos-dropdown-menu",
      this.pos()?.placement ?? this._placement(),
      (this.hasHeader || this.hasFooter) && "rich",
    ]
      .filter(Boolean)
      .join(" ")
  );

  readonly actionIndexes = computed(() =>
    this._items()
      .map((it, i) => (isDropdownMenuAction(it) && !it.disabled ? i : -1))
      .filter((i) => i >= 0)
  );

  itemClasses(item: DropdownMenuItem): string {
    if (!isDropdownMenuAction(item)) return "";
    return [
      "sisyphos-dropdown-menu-item",
      item.destructive && "destructive",
      item.disabled && "disabled",
    ]
      .filter(Boolean)
      .join(" ");
  }

  private resizeListener?: () => void;
  private scrollListener?: () => void;

  constructor() {
    effect(() => {
      if (this.visible()) {
        // Reset focus to first action whenever the menu opens.
        const first = this.actionIndexes()[0] ?? -1;
        this._activeIndex.set(first);
        queueMicrotask(() => requestAnimationFrame(() => this.reposition()));
        this.installScrollListeners();
      } else {
        this.pos.set(null);
        this._activeIndex.set(-1);
        this.removeScrollListeners();
      }
    });

    // Move DOM focus to the active item when the menu is open.
    effect(() => {
      if (!this.visible()) return;
      const idx = this._activeIndex();
      if (idx < 0) return;
      queueMicrotask(() => {
        const li = this.listRef?.nativeElement.querySelector<HTMLLIElement>(
          `li[data-index="${idx}"]`
        );
        li?.focus();
      });
    });
  }

  ngOnDestroy(): void {
    this.removeScrollListeners();
  }

  // ── public API ────────────────────────────────────────────────────────

  toggle(): void {
    if (this._disabled()) return;
    this.setOpen(!this._open());
  }

  setOpen(next: boolean): void {
    if (this._open() === next) return;
    this._open.set(next);
    this.openChange.emit(next);
  }

  select(item: DropdownMenuItem, event: Event): void {
    if (!isDropdownMenuAction(item) || item.disabled) return;
    item.onSelect(event);
    if (item.closeOnSelect !== false) {
      this.setOpen(false);
      this.anchorRef?.nativeElement.focus();
    }
  }

  setActive(i: number): void {
    if (i !== this._activeIndex()) this._activeIndex.set(i);
  }

  // ── keyboard ──────────────────────────────────────────────────────────

  onAnchorKeydown(event: KeyboardEvent): void {
    if (!this._open()) {
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.setOpen(true);
      }
      return;
    }
    this.handleMenuKey(event);
  }

  onMenuKeydown(event: KeyboardEvent): void {
    this.handleMenuKey(event);
  }

  private handleMenuKey(event: KeyboardEvent): void {
    const pool = this.actionIndexes();
    if (event.key === "ArrowDown") {
      event.preventDefault();
      this.moveFocus(1, pool);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      this.moveFocus(-1, pool);
    } else if (event.key === "Home") {
      event.preventDefault();
      if (pool.length) this._activeIndex.set(pool[0]!);
    } else if (event.key === "End") {
      event.preventDefault();
      if (pool.length) this._activeIndex.set(pool[pool.length - 1]!);
    } else if ((event.key === "Enter" || event.key === " ") && this._activeIndex() >= 0) {
      event.preventDefault();
      const item = this._items()[this._activeIndex()];
      if (item) this.select(item, event);
    } else if (event.key === "Tab") {
      this.setOpen(false);
    }
  }

  private moveFocus(direction: 1 | -1, pool: number[]): void {
    if (pool.length === 0) return;
    const current = this._activeIndex();
    if (current === -1) {
      this._activeIndex.set(direction === 1 ? pool[0]! : pool[pool.length - 1]!);
      return;
    }
    const idx = pool.indexOf(current);
    if (idx === -1) {
      this._activeIndex.set(pool[0]!);
      return;
    }
    const next = pool[(idx + direction + pool.length) % pool.length]!;
    this._activeIndex.set(next);
  }

  // ── outside-click + escape via document listeners ─────────────────────

  @HostListener("document:keydown.escape")
  onEscape(): void {
    if (!this.visible()) return;
    this.setOpen(false);
    this.anchorRef?.nativeElement.focus();
  }

  @HostListener("document:mousedown", ["$event"])
  onDocumentMousedown(event: MouseEvent): void {
    if (!this.visible()) return;
    const tgt = event.target as Node | null;
    const anchor = this.anchorRef?.nativeElement;
    const panel = this.panelRef?.nativeElement;
    if (anchor?.contains(tgt as Node)) return;
    if (panel?.contains(tgt as Node)) return;
    this.setOpen(false);
  }

  // ── scroll-end emission for infinite lists ────────────────────────────

  onPanelScroll(event: Event): void {
    const el = event.currentTarget as HTMLElement;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distance <= this._scrollEndThreshold()) this.scrollEnd.emit();
  }

  // ── positioning ───────────────────────────────────────────────────────

  private reposition(): void {
    const anchor = this.anchorRef?.nativeElement;
    const panel = this.panelRef?.nativeElement;
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
