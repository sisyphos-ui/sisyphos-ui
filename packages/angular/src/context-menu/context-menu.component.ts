/**
 * ContextMenu — Angular 18 standalone right-click menu anchored at the
 * pointer. Wraps a single child as its trigger; on `contextmenu` the
 * default browser menu is suppressed and a portal-style menu opens at the
 * click coordinates (clamped inside the viewport).
 *
 * Item shape matches `DropdownMenuItem` exactly — the two components are
 * interchangeable on the consumer side.
 *
 * @example
 *   <sui-context-menu [items]="rowActions">
 *     <div class="row">{{ row.name }}</div>
 *   </sui-context-menu>
 */
import type {
  ElementRef,
  OnDestroy} from "@angular/core";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
  computed,
  signal,
} from "@angular/core";
import {
  isContextMenuAction,
  type ContextMenuItem,
} from "./types";

let menuCounter = 0;

@Component({
  selector: "sui-context-menu",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      #triggerWrap
      class="sisyphos-context-menu-anchor"
      style="display:contents;"
      (contextmenu)="onContextMenu($event)"
    >
      <ng-content />
    </span>
    @if (open()) {
      <div
        #panel
        [class]="panelClasses()"
        [id]="menuId"
        [style.position]="'fixed'"
        [style.left.px]="coords()?.x ?? 0"
        [style.top.px]="coords()?.y ?? 0"
        [style.opacity]="coords() ? 1 : 0"
        [style.z-index]="1100"
      >
        @if (items().length === 0 && hasEmpty) {
          <div class="sisyphos-dropdown-menu-empty" role="note">
            <ng-content select="[menu-empty]" />
          </div>
        } @else {
          <ul
            #list
            role="menu"
            class="sisyphos-dropdown-menu-list"
            (keydown)="onMenuKeydown($event)"
          >
            @for (item of items(); track $index; let i = $index) {
              @if (item.type === 'separator') {
                <li class="sisyphos-dropdown-menu-separator" role="separator"></li>
              } @else if (item.type === 'label') {
                <li class="sisyphos-dropdown-menu-label" role="presentation">{{ item.label }}</li>
              } @else {
                <li
                  role="menuitem"
                  [tabindex]="activeIndex() === i ? 0 : -1"
                  [attr.aria-disabled]="item.disabled || null"
                  [class]="itemClasses(item)"
                  [attr.data-index]="i"
                  (mouseenter)="setActive(i)"
                  (click)="select(item, $event)"
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
      </div>
    }
  `,
})
export class ContextMenu implements OnDestroy {
  readonly menuId = `sisyphos-context-menu-${++menuCounter}`;

  private readonly _items = signal<ContextMenuItem[]>([]);
  private readonly _open = signal(false);
  private readonly _disabled = signal(false);
  private readonly _margin = signal(8);
  private readonly _coords = signal<{ x: number; y: number } | null>(null);
  private readonly _activeIndex = signal(-1);

  readonly items = this._items.asReadonly();
  readonly open = this._open.asReadonly();
  readonly coords = this._coords.asReadonly();
  readonly activeIndex = this._activeIndex.asReadonly();

  hasEmpty = false;

  @Input("items") set itemsInput(v: ContextMenuItem[]) { this._items.set(v ?? []); }
  @Input("disabled") set disabledInput(v: boolean) { this._disabled.set(v); }
  @Input("margin") set marginInput(v: number) { this._margin.set(v); }
  @Input("hasEmpty") set hasEmptyInput(v: boolean) { this.hasEmpty = v; }

  @Output() readonly openChange = new EventEmitter<boolean>();

  @ViewChild("triggerWrap") triggerWrapRef?: ElementRef<HTMLSpanElement>;
  @ViewChild("panel") panelRef?: ElementRef<HTMLDivElement>;
  @ViewChild("list") listRef?: ElementRef<HTMLUListElement>;

  private lastTrigger: HTMLElement | null = null;

  readonly panelClasses = computed(() => `sisyphos-dropdown-menu sisyphos-context-menu`);

  readonly actionIndexes = computed(() =>
    this._items()
      .map((it, i) => (isContextMenuAction(it) && !it.disabled ? i : -1))
      .filter((i) => i >= 0)
  );

  itemClasses(item: ContextMenuItem): string {
    if (!isContextMenuAction(item)) return "";
    return [
      "sisyphos-dropdown-menu-item",
      item.destructive && "destructive",
      item.disabled && "disabled",
    ]
      .filter(Boolean)
      .join(" ");
  }

  ngOnDestroy(): void { /* no-op */ }

  // ── trigger ──────────────────────────────────────────────────────────

  onContextMenu(event: MouseEvent): void {
    if (this._disabled()) return;
    event.preventDefault();
    this.lastTrigger = event.target as HTMLElement | null;
    this._coords.set({ x: event.clientX, y: event.clientY });
    this.setOpen(true);
    // Clamp inside viewport after the panel measures itself.
    queueMicrotask(() =>
      requestAnimationFrame(() => {
        const el = this.panelRef?.nativeElement;
        const c = this._coords();
        if (!el || !c) return;
        const m = this._margin();
        const { innerWidth, innerHeight } = window;
        const { width, height } = el.getBoundingClientRect();
        let x = c.x;
        let y = c.y;
        if (x + width + m > innerWidth) x = innerWidth - width - m;
        if (y + height + m > innerHeight) y = innerHeight - height - m;
        if (x < m) x = m;
        if (y < m) y = m;
        if (x !== c.x || y !== c.y) this._coords.set({ x, y });
      })
    );
  }

  setOpen(next: boolean): void {
    if (this._open() === next) return;
    this._open.set(next);
    this.openChange.emit(next);
    if (next) {
      this._activeIndex.set(this.actionIndexes()[0] ?? -1);
    } else {
      this._activeIndex.set(-1);
    }
  }

  // ── menu interactions ────────────────────────────────────────────────

  select(item: ContextMenuItem, event: Event): void {
    if (!isContextMenuAction(item) || item.disabled) return;
    item.onSelect(event);
    if (item.closeOnSelect !== false) {
      this.setOpen(false);
      this.lastTrigger?.focus?.();
    }
  }

  setActive(i: number): void {
    if (i !== this._activeIndex()) this._activeIndex.set(i);
  }

  onMenuKeydown(event: KeyboardEvent): void {
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

  @HostListener("document:keydown.escape")
  onEscape(): void {
    if (!this._open()) return;
    this.setOpen(false);
    this.lastTrigger?.focus?.();
  }

  @HostListener("document:mousedown", ["$event"])
  onDocumentMousedown(event: MouseEvent): void {
    if (!this._open()) return;
    const tgt = event.target as Node | null;
    const panel = this.panelRef?.nativeElement;
    if (panel?.contains(tgt as Node)) return;
    this.setOpen(false);
  }
}
