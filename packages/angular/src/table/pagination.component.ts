/**
 * Pagination — Angular 18 standalone prev/next + numeric pages with ellipsis
 * elision. Designed as a companion to `<sui-table>` but usable anywhere a
 * pager is needed. Pure same logic as the React/Vue versions.
 */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input as NgInput,
  Output,
  computed,
  signal,
} from "@angular/core";

export function getPageItems(
  page: number,
  pageCount: number,
  siblings = 1,
  boundaries = 1
): Array<number | "ellipsis"> {
  const total = pageCount;
  if (total <= 1) return [1];
  const totalNumbers = boundaries * 2 + siblings * 2 + 3;
  if (totalNumbers >= total) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const left = Math.max(page - siblings, boundaries + 2);
  const right = Math.min(page + siblings, total - boundaries - 1);

  const items: Array<number | "ellipsis"> = [];
  for (let i = 1; i <= boundaries; i++) items.push(i);
  if (left > boundaries + 1) items.push("ellipsis");
  for (let i = left; i <= right; i++) items.push(i);
  if (right < total - boundaries) items.push("ellipsis");
  for (let i = total - boundaries + 1; i <= total; i++) items.push(i);
  return items;
}

@Component({
  selector: "sui-pagination",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav [class]="rootClasses()" aria-label="Pagination">
      <button
        type="button"
        class="sisyphos-pagination-arrow"
        [disabled]="page() <= 1"
        aria-label="Previous page"
        (click)="goTo(page() - 1)"
      >
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <path
            d="M10 4l-4 4 4 4"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <ul class="sisyphos-pagination-list">
        @for (it of items(); track $index) {
          @if (it === "ellipsis") {
            <li class="sisyphos-pagination-ellipsis" aria-hidden="true">…</li>
          } @else {
            <li>
              <button
                type="button"
                [class]="'sisyphos-pagination-page' + (it === page() ? ' active' : '')"
                [attr.aria-current]="it === page() ? 'page' : null"
                (click)="goTo(it)"
              >
                {{ it }}
              </button>
            </li>
          }
        }
      </ul>
      <button
        type="button"
        class="sisyphos-pagination-arrow"
        [disabled]="page() >= pageCount()"
        aria-label="Next page"
        (click)="goTo(page() + 1)"
      >
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <path
            d="M6 4l4 4-4 4"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </nav>
  `,
})
export class Pagination {
  private readonly _page = signal(1);
  private readonly _pageCount = signal(1);
  private readonly _siblings = signal(1);
  private readonly _boundaries = signal(1);
  private readonly _size = signal<"sm" | "md" | "lg">("md");

  readonly page = this._page.asReadonly();
  readonly pageCount = this._pageCount.asReadonly();

  @NgInput("page") set pageInput(v: number) {
    this._page.set(v);
  }
  @NgInput("pageCount") set pageCountInput(v: number) {
    this._pageCount.set(v);
  }
  @NgInput("siblings") set siblingsInput(v: number) {
    this._siblings.set(v);
  }
  @NgInput("boundaries") set boundariesInput(v: number) {
    this._boundaries.set(v);
  }
  @NgInput("size") set sizeInput(v: "sm" | "md" | "lg") {
    this._size.set(v);
  }

  @Output() readonly pageChange = new EventEmitter<number>();

  readonly items = computed(() =>
    getPageItems(this._page(), this._pageCount(), this._siblings(), this._boundaries())
  );

  readonly rootClasses = computed(() => `sisyphos-pagination ${this._size()}`);

  goTo(p: number): void {
    if (p < 1 || p > this._pageCount() || p === this._page()) return;
    this.pageChange.emit(p);
  }
}
