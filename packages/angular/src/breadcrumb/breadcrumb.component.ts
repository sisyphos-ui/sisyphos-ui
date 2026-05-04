/**
 * Breadcrumb — Angular 18 standalone navigation trail.
 *
 * Mirrors the React/Vue versions: takes an `items` array, marks the last
 * entry as the current page (`aria-current="page"`), supports middle
 * collapse via `maxItems` + `itemsBeforeCollapse` + `itemsAfterCollapse`,
 * and lets consumers swap the separator.
 *
 * Icons accept either a string (rendered as text — emoji/Unicode glyphs)
 * or a `TemplateRef<unknown>` for rich SVG/component content. Same idea
 * as a `ReactNode` slot, expressed in Angular's idiom.
 *
 * Usage:
 *   items = [
 *     { label: 'Home', href: '/', icon: '🏠' },
 *     { label: 'Users', href: '/users' },
 *     { label: 'Volkan' },          // the last item — rendered as current page
 *   ];
 *   <sui-breadcrumb [items]="items" />
 */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  computed,
  signal,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  /** Mutually exclusive with `href`; renders the entry as a `<button>`. */
  onClick?: () => void;
  /** Inline glyph (string) or rich `<ng-template>` icon. */
  icon?: string | TemplateRef<unknown>;
  /** Stable identifier for `track` in @for. Falls back to index. */
  key?: string | number;
}

type RenderedNode = ({ kind: "item"; item: BreadcrumbItem } | { kind: "ellipsis" }) & {
  trackKey: string;
};

@Component({
  selector: "sui-breadcrumb",
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="sisyphos-breadcrumb" aria-label="breadcrumb">
      <ol class="sisyphos-breadcrumb-list">
        @for (node of rendered(); track node.trackKey; let idx = $index, isLast = $last) {
          @if (node.kind === 'ellipsis') {
            <li class="sisyphos-breadcrumb-ellipsis" aria-hidden="true">…</li>
          } @else {
            <li class="sisyphos-breadcrumb-item">
              @if (isLast) {
                <span class="sisyphos-breadcrumb-current" aria-current="page">
                  <ng-container *ngTemplateOutlet="iconTpl; context: { $implicit: node.item }" />
                  <span>{{ node.item.label }}</span>
                </span>
              } @else if (node.item.href) {
                <a
                  class="sisyphos-breadcrumb-link"
                  [attr.href]="node.item.href"
                  (click)="handleClick(node.item, $event)"
                >
                  <ng-container *ngTemplateOutlet="iconTpl; context: { $implicit: node.item }" />
                  <span>{{ node.item.label }}</span>
                </a>
              } @else if (node.item.onClick) {
                <button
                  type="button"
                  class="sisyphos-breadcrumb-link as-button"
                  (click)="handleClick(node.item, $event)"
                >
                  <ng-container *ngTemplateOutlet="iconTpl; context: { $implicit: node.item }" />
                  <span>{{ node.item.label }}</span>
                </button>
              } @else {
                <span class="sisyphos-breadcrumb-text">
                  <ng-container *ngTemplateOutlet="iconTpl; context: { $implicit: node.item }" />
                  <span>{{ node.item.label }}</span>
                </span>
              }
            </li>
          }
          @if (!isLast) {
            <li class="sisyphos-breadcrumb-separator" aria-hidden="true">
              @if (separatorTemplate()) {
                <ng-container *ngTemplateOutlet="separatorTemplate()!" />
              } @else {
                {{ separator() }}
              }
            </li>
          }
        }
      </ol>
    </nav>

    <ng-template #iconTpl let-item>
      @if (item.icon) {
        @if (isStringIcon(item.icon)) {
          <span class="sisyphos-breadcrumb-icon">{{ item.icon }}</span>
        } @else {
          <span class="sisyphos-breadcrumb-icon">
            <ng-container *ngTemplateOutlet="item.icon" />
          </span>
        }
      }
    </ng-template>
  `,
})
export class Breadcrumb {
  private readonly _items = signal<BreadcrumbItem[]>([]);
  private readonly _separator = signal<string>("/");
  private readonly _separatorTemplate = signal<TemplateRef<unknown> | undefined>(undefined);
  private readonly _maxItems = signal<number | undefined>(undefined);
  private readonly _itemsBefore = signal<number>(1);
  private readonly _itemsAfter = signal<number>(1);

  readonly separator = this._separator.asReadonly();
  readonly separatorTemplate = this._separatorTemplate.asReadonly();

  @Input("items") set itemsInput(v: BreadcrumbItem[]) { this._items.set(v ?? []); }
  @Input("separator") set separatorInput(v: string) { this._separator.set(v); }
  @Input("separatorTemplate") set separatorTemplateInput(v: TemplateRef<unknown> | undefined) {
    this._separatorTemplate.set(v);
  }
  @Input("maxItems") set maxItemsInput(v: number | undefined) { this._maxItems.set(v); }
  @Input("itemsBeforeCollapse") set itemsBeforeInput(v: number) { this._itemsBefore.set(v); }
  @Input("itemsAfterCollapse") set itemsAfterInput(v: number) { this._itemsAfter.set(v); }

  /** Emitted when an item with `onClick` is activated. Useful when consumers
   * prefer a single output handler over per-item callbacks. */
  @Output() readonly itemClick = new EventEmitter<BreadcrumbItem>();

  readonly rendered = computed<RenderedNode[]>(() => {
    const items = this._items();
    const max = this._maxItems();
    const before = this._itemsBefore();
    const after = this._itemsAfter();

    const collapsed =
      typeof max === "number" && items.length > max
        ? [
            ...items.slice(0, before).map((item, i) => ({ kind: "item" as const, item, trackKey: keyFor(item, i) })),
            { kind: "ellipsis" as const, trackKey: "__ellipsis__" },
            ...items.slice(items.length - after).map((item, i) => ({
              kind: "item" as const,
              item,
              trackKey: keyFor(item, items.length - after + i),
            })),
          ]
        : items.map((item, i) => ({ kind: "item" as const, item, trackKey: keyFor(item, i) }));

    return collapsed;
  });

  isStringIcon(icon: unknown): icon is string {
    return typeof icon === "string";
  }

  handleClick(item: BreadcrumbItem, event: Event): void {
    if (item.onClick) {
      // Prevent navigation when consumers handle clicks themselves.
      if (item.href) event.preventDefault();
      item.onClick();
    }
    this.itemClick.emit(item);
  }
}

function keyFor(item: BreadcrumbItem, idx: number): string {
  return item.key !== undefined ? String(item.key) : `idx-${idx}`;
}
